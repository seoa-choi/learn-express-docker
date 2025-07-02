const express = require('express');
const router = express.Router();

// 사용자별 세션데이터를 생성 해야하므로 post지만 브라우저 입력요청은 get요청임(테스트해야해서)
router.get('/login', (req, res) => {
  // 프론트에서 넘어온 사용자 정보
  const { username, password } = {
    username: 'admin',
    password: '1234',
  };

  // db에서 사용자 정보 확인
  if (username === 'admin' && password === '1234') {
    // 세션에 사용자 정보 저장
    req.session.user = { id: 1, name: '관리자' };
    res.send('로그인 성공! 세션이 설정되었습니다.');
  } else {
    // 401 - 인증 오류
    res
      .status(401)
      .send('로그인 실패! 아이디 또는 비밀번호가 올바르지 않습니다.');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    // 세션쿠키 삭제
    res.clearCookie('session-cookie');
    res.send('로그아웃 완료! 세션이 삭제되었습니다.');
  });
});

module.exports = router;
