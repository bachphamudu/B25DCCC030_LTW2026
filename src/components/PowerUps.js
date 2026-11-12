import React from 'react';

const PowerUps = ({
  usedSwap,
  usedDouble,
  usedFreeze,
  isDoubleActive,
  disabled,
  onSwap,
  onDouble,
  onFreeze,
}) => {
  return (
    <div className="powerups-bar">
      <button
        type="button"
        disabled={disabled || usedSwap}
        onClick={onSwap}
      >
        Đổi câu hỏi
      </button>

      <button
        type="button"
        disabled={disabled || usedDouble}
        onClick={onDouble}
      >
        {isDoubleActive ? 'Đang nhân đôi' : 'Nhân đôi'}
      </button>

      <button
        type="button"
        disabled={disabled || usedFreeze}
        onClick={onFreeze}
      >
        Dừng giờ
      </button>
    </div>
  );
};

export default PowerUps;