// 라우터 만들 때 마다 세줄은 꼭 있어야함
const express = require('express');
const router = express.Router();
const connection = require('../config/mysql');

// 유니크한 경로는 위로 올리고 id같은 경우는 아래에 두기

// POST /user - 사용자 생성
router.post('/user', (req, res) => {
  const { name, age, comment } = req.body;

  // name, age는 디비에서 NOT NULL이므로 필수값
  if (!name || !age) {
    return res.status(400).send('필수 필드 없음: name, age');
  }

  const query = 'INSERT INTO user (name, age, comment) VALUES (?, ?, ?)';
  // comment는 undefined 일 수 있으며 db에 저장불가로 null로 변경
  const values = [name, age, comment || null];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('유저 생성 에러:', err.message);
      return res.status(500).send('Database error');
    }
    res.json(result);
  });
});

router.get('/user', (req, res) => {
  connection.query('SELECT * FROM user', (err, result) => {
    if (err) {
      console.error('사용자 가져오기 에러: ', err.message);
      return res.status(500).send('데이터베이스 에러');
    }
    res.json(result);
  });
});

// /user/:id보다 위에 있어야함
router.get('/user/search', (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).send('검색어를 입력하세요');
  }

  // LIKE = 문자열 검색 연산자 (like는 포함)
  const query = 'SELECT * FROM user WHERE name LIKE ?';
  const searchValue = `%${search}%`;

  connection.query(query, [searchValue], (err, result) => {
    if (err) {
      console.error('사용자 검색 에러:', err.message);
      return res.status(500).send('Database error');
    }

    if (result.length === 0) {
      return res.status(404).send('검색된 사용자 없음');
    }

    res.json(result);
  });
});

// 특정 사용자 조회
router.get('/user/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM user WHERE user_id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('사용자 가져오기 에러:', err.message);

      return res.status(500).send('Database error');
    }

    if (result.legnth === 0) {
      return res.status(404).send('사용자 없음');
    }

    res.json(result[0]);
  });
});

// 특정 사용자 정보 수정 (일부수정 PATCH)
router.patch('/user/:id', (req, res) => {
  const { id } = req.params;
  const { name, age, comment } = req.body;

  // 수정할 내용이 모두 없으면 잘못된 요청
  if (!name && !age && !comment) {
    return res.status(400).send('수정할 내용 없음');
  }

  // 수정할 내용의 값이 정해져있지 않기 때문에 배열로 처리
  const updates = []; // 쿼리 문자열 들어갈 배열
  const values = []; // 값이 들어갈 배열

  if (name) {
    updates.push('name = ?');
    values.push(name);
  }
  if (age) {
    updates.push('age = ?');
    values.push(age);
  }
  if (comment) {
    updates.push('comment = ?');
    values.push(comment);
  }

  values.push(id);

  const query = `UPDATE user SET ${updates.join(', ')} WHERE user_id = ?`;

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('사용자 수정 에러:', err.message);
      return res.status(500).send('Database error');
    }
    res.json(result);
  });
});

// 특정 사용자 삭제
router.delete('/user/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM user WHERE user_id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('사용자 삭제 에러:', err.message);
      return res.status(500).send('Database error');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('사용자가 없습니다.');
    }
  });
});

// 내보내기
module.exports = router;
