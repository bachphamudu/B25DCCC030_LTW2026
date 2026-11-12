import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ playerName, setPlayerName }) => {
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    navigate('/play');
  };

  return (
    <div>
      <h1>Nhanh như chớp</h1>
      <p>
        Luật chơi: Bạn sẽ trả lời liên tiếp 15 câu hỏi trắc nghiệm về HTML, CSS,
        JavaScript và React. Mỗi câu có 15 giây suy nghĩ. Trả lời đúng được cộng
        điểm theo độ khó và điểm thưởng tốc độ. Trả lời sai hoặc hết giờ được 0
        điểm và chuyển sang câu tiếp theo.
      </p>

      <form onSubmit={handleStart}>
        <input
          type="text"
          placeholder="Nhập tên người chơi..."
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          style={{ padding: '8px', marginRight: '8px' }}
        />
        <button type="submit" disabled={!playerName.trim()}>
          Bắt đầu
        </button>
      </form>
    </div>
  );
};

export default Home;