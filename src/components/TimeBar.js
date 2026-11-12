import React from 'react';
import { TIME_PER_QUESTION } from '../data';

const TimeBar = ({ timeLeft, isFrozen }) => {
  const percent = (timeLeft / TIME_PER_QUESTION) * 100;
  const barColor = timeLeft <= 5 ? 'red' : 'green';

  return (
    <div style={{ marginBottom: '16px' }}>
      <p>
        {`Còn ${timeLeft} giây`}
        {isFrozen ? ' (đã dừng)' : ''}
      </p>
      <div style={{ width: '100%', backgroundColor: '#eee', height: '14px' }}>
        <div
          style={{
            width: `${percent}%`,
            backgroundColor: barColor,
            height: '100%',
            transition: 'width 0.2s linear',
          }}
        />
      </div>
    </div>
  );
};

export default TimeBar;