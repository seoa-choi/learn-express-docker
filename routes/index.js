// index.js 메인 페이지에 여러데이터를 불러올 때 사용

const express = require('express');
const router = express.Router();

// router.get('/:userId', (req, res) => {
//   // console.log(req.app.get('port'), '포트번호');
//   console.log(req.body, '요청본문'); // post요청으로 보낸 body객체를 받음
//   console.log(req.ip, '요청ip');
//   console.log(req.params.userId, '경로 매개변수');
//   console.log(req.query.cate, '쿼리 매개변수');

//   if (!req.signedCookies.name) {
//     // 일반 쿠키, 세션정보 아님
//     // 크롬 - 어플리케이션 - 쿠키에서 확인
//     // 크롬 maxage는 UTC이므로 +9해야 한국 시간, 다른탭으로 이동후 삭제 확인
//     res.cookie('name', 'express_cookie', {
//       // maxAge: 1000 * 60 * 60 * 24, // 유효기간 1일
//       maxAge: 1000 * 60, // 유효기간 1분
//       httpOnly: true, // js로 접근 못하게 하는 보안속성
//       secure: false, // http에서도 쿠키 전송
//       signed: true, // 쿠키값에 서명 추가하여 변조 방지
//     });
//   } else {
// // 쿠키가 존재할 경우, 브라우저 새로고침하여 두번째 요청에서 확인
//     console.log(req.signedCookies.name, '서명된 쿠키');
//   }

//   // res.send('hello, express');
// });

// 내보내기
module.exports = router;

// CRUD
// POST - Create
// GET - Read
// PATCH - Update(일부수정)
// PUT - Update(전체수정)
// DELETE - 삭제
