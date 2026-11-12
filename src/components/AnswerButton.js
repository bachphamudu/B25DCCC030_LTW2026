import React from 'react';
import { LETTERS } from '../data';

const AnswerButton = ({
  index,
  text,
  isFocused,
  isSelected,
  isCorrect,
  isRevealed,
  disabled,
  onClick,
}) => {
  let className = 'answer-btn';
  if (isFocused && !isRevealed) className += ' focused';
  if (isRevealed) {
    if (isCorrect) className += ' correct';
    else if (isSelected) className += ' wrong';
  }

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      onClick={() => onClick(index)}
    >
      {LETTERS[index]}. {text}
    </button>
  );
};

export default AnswerButton;