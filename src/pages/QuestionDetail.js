import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS, LETTERS } from '../data';

const QuestionDetail = ({ questions }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAnswer, setShowAnswer] = useState(false);

  const questionId = Number(id);
  const question = questions.find((q) => q.id === questionId);

  if (!question) {
    return (
      <div>
        <p>Không tìm thấy câu hỏi</p>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  const typeLabel = question.reserve ? 'Dự bị' : 'Chính thức';

  return (
    <div>
      <h2>{`Câu hỏi số ${question.id} – ${LEVELS[question.level]} • ${typeLabel}`}</h2>
      <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{question.question}</p>

      <div style={{ marginBottom: '16px' }}>
        {question.options.map((opt, idx) => {
          const isCorrect = idx === question.answer;
          const highlight = showAnswer && isCorrect;
          return (
            <div
              key={idx}
              style={{
                padding: '8px 12px',
                marginBottom: '6px',
                border: '1px solid #ccc',
                backgroundColor: highlight ? '#90ee90' : 'transparent',
              }}
            >
              {`${LETTERS[idx]}. ${opt}`}
              {highlight && ' (Đáp án đúng)'}
            </div>
          );
        })}
      </div>

      {showAnswer && <p>{`Giải thích: ${question.explain}`}</p>}

      <div style={{ marginTop: '12px' }}>
        <button onClick={() => setShowAnswer((prev) => !prev)}>
          {showAnswer ? 'Ẩn đáp án' : 'Xem đáp án'}
        </button>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    </div>
  );
};

export default QuestionDetail;