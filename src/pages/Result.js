import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { LETTERS } from '../data';
import { getStars } from '../utils';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {
    return <Navigate to="/" replace />;
  }

  const { playerName, answers, score, correctCount } = location.state;
  const starInfo = getStars(correctCount);
  const starIcons =
    '★'.repeat(starInfo.stars) + '☆'.repeat(3 - starInfo.stars);

  return (
    <div className="result-container">
      <h2>{starInfo.message}</h2>
      <p>
        <strong>Người chơi:</strong> {playerName}
      </p>
      <p>
        <strong>Số câu trả lời đúng:</strong> {correctCount}/15
      </p>
      <p>
        <strong>Điểm:</strong> {score}
      </p>
      <p>
        <strong>Xếp loại:</strong> {starInfo.stars} sao {starIcons}
      </p>

      <div className="result-actions">
        <button onClick={() => navigate('/play')}>Chơi lại</button>
        <button onClick={() => navigate('/')}>Về trang chủ</button>
      </div>

      <h3>Xem lại lượt chơi</h3>
      <table className="review-table">
        <thead>
          <tr>
            <th>Câu</th>
            <th>Bạn chọn</th>
            <th>Đáp án đúng</th>
            <th>Còn lại</th>
            <th>Điểm</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((item, idx) => {
            const isCorrect =
              item.chosen !== null && item.chosen === item.correct;
            return (
              <tr
                key={idx}
                className={isCorrect ? 'row-correct' : 'row-wrong'}
              >
                <td>Câu {item.id}</td>
                <td>{item.chosen !== null ? LETTERS[item.chosen] : '-'}</td>
                <td>{LETTERS[item.correct]}</td>
                <td>{item.timeLeft} giây</td>
                <td>{item.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Result;