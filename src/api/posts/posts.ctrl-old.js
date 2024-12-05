let postId = 1; // 초기값

const posts = [
  {
    id: 1,
    title: '제목',
    body: '내용',
  },
];

/* 포스트 작성 
POST /api/posts
{ title, body }
*/
export const write = (ctx) => {
  // REST API의 Request Body는 ctx.request.body에서 조회
  const { title, body } = ctx.request.body;
  postId += 1;
  const post = { id: postId, title, body };
  posts.push(post);
  ctx.body = post;
};

/* 포스트 목록 조회 
GET /api/posts
*/
export const list = (ctx) => {
  ctx.body = posts;
};

/* 특정 포스트 조회 
GET /api/posts/:id
*/
export const read = (ctx) => {
  const { id } = ctx.params;

  // 파라미터로 받아 온 값은 문자열 형식이므로 파라미터를 숫자로 변환하거나
  // 비교한 p.id값을 문자열로 변경해야 함.
  const post = posts.find((p) => p.id.toString() === id);

  if (!post) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.',
    };
    reurn;
  }

  ctx.body = post;
};

/* 특정 포스트 제거 
DELETE /api/posts/:id
*/
export const remove = (ctx) => {
  const { id } = ctx.params;

  const index = posts.findIndex((p) => p.id.toString() === id);

  if (!post) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.',
    };
    reurn;
  }

  // index번째 아이템을 제거
  posts.splice(index, 1);
  ctx.status = 204; // No Content
};

/* 특정 포스트 수정(교체) 
PUT /api/posts/:id
{ title, body }
*/
export const replace = (ctx) => {
  // PUT 메서드는 전체 포스트 정보를 입력하여 테이터를 통째로 교체할 때 사용
  const { id } = ctx.params;

  const index = posts.findIndex((p) => p.id.toString() === id);

  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.',
    };
    reurn;
  }

  // 전체 객체를 덮어씌움, 따라서 id를 제외한 기존정보를 날리고 객체를 새로 만듦
  posts[index] = {
    id,
    ...ctx.request.body,
  };

  ctx.body = posts[index];
};

/* 특정 포스트 수정(특정 필드 변경) 
PUT /api/posts/:id
{ title, body }
*/
export const update = (ctx) => {
  // PATCH 메서드는 주어진 필드만 교체
  const { id } = ctx.params;

  const index = posts.findIndex((p) => p.id.toString() === id);

  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.',
    };
    reurn;
  }

  // 기존 값에 정보를 덮어 씌움
  posts[index] = {
    ...posts[index],
    ...ctx.request.body,
  };

  ctx.body = posts[index];
};
