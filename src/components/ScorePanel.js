import React from 'react';

const ScorePanel = ({ score, correctCount, lastPoints }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <p style={{ margin: '4px 0' }}>{`Điểm: ${score}`}</p>
      <p style={{ margin: '4px 0' }}>{`Số câu đúng: ${correctCount}`}</p>
      {lastPoints > 0 && (
        <p style={{ margin: '4px 0', color: 'green', fontWeight: 'bold' }}>
          {`+${lastPoints} điểm`}
        </p>
      )}
    </div>
  );
};

export default ScorePanel;