import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ playerName, setPlayerName, history }) => {
  const navigate = useNavigate();

  const topRecord =
    history.length > 0
      ? [...history].sort((a, b) => b.score - a.score)[0]
      : null;

  const handleStart = (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    navigate('/play');
  };

  return (
    <div className="home-container">
      <h1>Nhanh như chớp</h1>
      <p>
        Trả lời 15 câu hỏi về HTML, CSS, JavaScript và React. Mỗi câu có 15
        giây suy nghĩ; trả lời càng nhanh điểm cộng tốc độ càng cao!
      </p>

      {topRecord && (
        <p className="high-score">
          <strong>
            Kỷ lục: {topRecord.score} điểm – {topRecord.name}
          </strong>
        </p>
      )}

      <form onSubmit={handleStart} className="start-form">
        <input
          type="text"
          placeholder="Nhập tên người chơi..."
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button type="submit" disabled={!playerName.trim()}>
          Bắt đầu
        </button>
      </form>
    </div>
  );
};

export default Home;