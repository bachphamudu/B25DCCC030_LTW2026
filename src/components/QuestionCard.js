import React from 'react';
import { LEVELS } from '../data';
import AnswerButton from './AnswerButton';

const QuestionCard = ({
  question,
  index,
  total,
  focusedIndex,
  selectedOption,
  isRevealed,
  onSelectOption,
}) => {
  return (
    <div className="question-card">
      <h3>
        Câu {index + 1}/{total} – {LEVELS[question.level]}
      </h3>
      <p className="question-text">{question.question}</p>

      <div className="options-grid">
        {question.options.map((opt, idx) => (
          <AnswerButton
            key={idx}
            index={idx}
            text={opt}
            isFocused={focusedIndex === idx}
            isSelected={selectedOption === idx}
            isCorrect={idx === question.answer}
            isRevealed={isRevealed}
            disabled={isRevealed}
            onClick={onSelectOption}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;