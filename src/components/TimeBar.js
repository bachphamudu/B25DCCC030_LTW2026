import React from 'react';
import { TIME_PER_QUESTION } from '../data';

const TimeBar = ({ timeLeft, isFrozen }) => {
  const percent = (timeLeft / TIME_PER_QUESTION) * 100;
  const barColor = timeLeft <= 5 ? '#ef4444' : '#22c55e';

  return (
    <div className="timebar-wrapper">
      <div>
        Còn {timeLeft} giây {isFrozen && '(đã dừng)'}
      </div>
      <div className="timebar-track">
        <div
          className="timebar-fill"
          style={{
            width: `${percent}%`,
            backgroundColor: barColor,
          }}
        />
      </div>
    </div>
  );
};

export default TimeBar;