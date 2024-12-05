import dotenv from 'dotenv'; // in esmodule mode
// require('dotenv').config();  // in CommonJS mode
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
// import createFakeData from './createFakeData.js';

// api 라우트 불러오기
import api from './api/index.js';
// 미들웨어 불러오기
import jwtMiddleware from './lib/jwtMiddleware.js';
import serve from 'koa-static';
import path from 'path';
import { fileURLToPath } from 'url';
import send from 'koa-send';

// .env파일 내용을 환경변수에 저장
dotenv.config();
// console.log('PORT :', process.env.PORT);
// console.log('MONGO_URI :', process.env.MONGO_URI);
// Node 환경변수에서 추출
const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // createFakeData();  // 샘플 데이터 생성용으로 한번만 실행
  })
  .catch((e) => {
    console.log(e);
  });

// 라우터 생성
const app = new Koa();
const router = new Router();

// 라우터 설정
router.use('/api', api.routes()); // api 라우트 적용

// 라우터 적용 전에 bodyParser적용
app.use(bodyParser());
app.use(jwtMiddleware);

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

// koa-static으로 정적 파일 제공
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const buildDirectory = path.resolve(__dirname, '../../blog-frontend/build');
app.use(serve(buildDirectory));
app.use(async (ctx) => {
  // Not Found이고 주소가 /api로 시작하지 않는 경우
  if (ctx.status === 404 && ctx.path.indexOf('/api') !== 0) {
    // index.html의 내용을 반환
    await send(ctx, 'index.html', { root: buildDirectory });
  }
});

// 포트가 지정되어 있지 않다면 400을 사용
const port = PORT || 4000;
app.listen(port, () => {
  console.log('Listening to port %d', port);
});
