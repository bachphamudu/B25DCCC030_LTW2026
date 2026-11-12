import React from 'react';

const History = ({ history, onDeleteRecord, onClearHistory }) => {
  if (history.length === 0) {
    return (
      <div className="history-container">
        <h2>Lịch sử các lượt chơi</h2>
        <p>Chưa có lượt chơi nào</p>
      </div>
    );
  }

  const totalGames = history.length;

  const totalScore = history.reduce((sum, item) => sum + item.score, 0);
  const avgScore = Math.round(totalScore / totalGames);

  const totalCorrect = history.reduce(
    (sum, item) => sum + item.correctCount,
    0
  );
  const correctRate = Math.round((totalCorrect / (15 * totalGames)) * 100);

  const sortedHistory = [...history].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.correctCount - a.correctCount;
  });

  return (
    <div className="history-container">
      <h2>Lịch sử các lượt chơi</h2>

      <div className="history-stats">
        <p>Số lượt chơi: {totalGames}</p>
        <p>Điểm trung bình: {avgScore}</p>
        <p>Tỉ lệ trả lời đúng: {correctRate}%</p>
      </div>

      <button type="button" onClick={onClearHistory} className="clear-btn">
        Xóa lịch sử
      </button>

      <table className="review-table">
        <thead>
          <tr>
            <th>Người chơi</th>
            <th>Số câu đúng</th>
            <th>Xếp loại</th>
            <th>Điểm</th>
            <th>Thời gian</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {sortedHistory.map((item) => {
            const starIcons =
              '★'.repeat(item.stars) + '☆'.repeat(3 - item.stars);
            return (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.correctCount}/15</td>
                <td>{starIcons}</td>
                <td>{item.score}</td>
                <td>{item.playedAt}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => onDeleteRecord(item.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default History;