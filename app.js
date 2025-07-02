const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

// 리소스가 있는 위치 경로 nextjs 폴더경로랑은 다른거임
const indexRouter = require('./routes');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');

// dotenv 활성화
dotenv.config();
// console.log(process.env.API_KEY);

// 익스프레스 인스턴스 생성
const app = express();
// nextjs가 3000이므로 포트변경(안바꾸면 충돌)
app.set('port', process.env.PORT || 3001);

// 미들웨어 설정
app.use(cors()); // 모든 출처에 대해 요청 허용
app.use(morgan('dev'));

// public 폴더를 정적 폴더로 지정
// 데이터이미지를 /public/images에 넣고 경로를 db에 저장하여 프론트로 보내줌
app.use('/', express.static(path.join(__dirname, 'public')));

// 클라이언트(프론트)에서 전송된 JSON 형식의 요청 본문(Body)을 파싱하여 req.body 객체에 담아줌
app.use(express.json());

// 쿼리파라메터 값으로 한글이 들어올 경우 인코딩해줌, extended: false면 querystring모듈 사용
app.use(express.urlencoded({ extended: false }));

// 쿠키(브라우저에 데이터를 심어줌)를 파싱하여 req.cookies객체에 담아줌,
// 팝업 24시간 동안 열지않음 이것도 쿠키
app.use(cookieParser(process.env.COOKIE_SECRET));

// 세션 설정, 인증관련 세션 쿠키내용
app.use(
  session({
    // 세션 데이터 수정사항 없을 경우 저장하지 않음
    resave: false,
    // 세션에 저장할 내용이 없을 경우 세션을 저장하지 않음
    saveUninitialized: false,
    // 세션쿠키의 비밀키
    secret: process.env.COOKIE_SECRET,
    cookie: {
      // 자바스크립트로 쿠키 접근 방지
      httpOnly: true,
      // https가 아닌 환경에서도 사용할 수 있도록
      secure: false,
    },
    name: 'session-cookie',
  })
);

// 라우터 설정
app.use(indexRouter);
app.use(userRouter);
app.use(authRouter);
app.use(profileRouter);

// 에러처리 미들웨어, 매개변수 사용하지 않아도 4개 다 넣어야함
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

// 서버 실행 get
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
