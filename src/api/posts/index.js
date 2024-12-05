import Router from 'koa-router';
import * as postCtrl from './posts.ctrl.js';
import checkLoggedIn from '../../lib/checkLoggedIn.js';

const posts = new Router();

posts.get('/', postCtrl.list);
posts.post('/', checkLoggedIn, postCtrl.write);
// posts.get('/:id', postCtrl.checkObjectId, postCtrl.read);
// posts.delete('/:id', postCtrl.checkObjectId, postCtrl.remove);
// posts.patch('/:id', postCtrl.checkObjectId, postCtrl.update);

const postId = new Router(); // /api/posts/:id
postId.get('/', postCtrl.getPostById, postCtrl.read);
postId.delete(
  '/',
  postCtrl.getPostById,
  checkLoggedIn,
  postCtrl.checkOwnPost,
  postCtrl.remove,
);
postId.patch(
  '/',
  postCtrl.getPostById,
  checkLoggedIn,
  postCtrl.checkOwnPost,
  postCtrl.update,
);

posts.use('/:id', postId.routes());

export default posts;
