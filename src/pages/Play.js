import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { TIME_PER_QUESTION } from '../data';
import { calcPoints, calcTotal } from '../utils';
import Countdown from '../components/Countdown';
import QuestionCard from '../components/QuestionCard';
import TimeBar from '../components/TimeBar';
import ScorePanel from '../components/ScorePanel';

const Play = ({ questions, playerName }) => {
  const navigate = useNavigate();

  const gameQuestions = questions
    .filter((q) => !q.reserve)
    .sort((a, b) => a.id - b.id);

  const [status, setStatus] = useState('countdown');
  const [countdownNum, setCountdownNum] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [lastEarned, setLastEarned] = useState(0);

  useEffect(() => {
    if (status !== 'countdown') return;

    const timer = setTimeout(() => {
      if (countdownNum > 1) {
        setCountdownNum((prev) => prev - 1);
      } else {
        setStatus('answering');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [status, countdownNum]);

  useEffect(() => {
    if (status !== 'answering') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          const currentQ = gameQuestions[currentIndex];
          setSelectedOption(null);
          setLastEarned(0);
          setAnswers((prevAns) => [
            ...prevAns,
            {
              id: currentQ.id,
              chosen: null,
              correct: currentQ.answer,
              timeLeft: 0,
              points: 0,
            },
          ]);
          setStatus('revealed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, currentIndex, gameQuestions]);

  useEffect(() => {
    if (status !== 'revealed') return;

    const timer = setTimeout(() => {
      if (currentIndex + 1 < gameQuestions.length) {
        setCurrentIndex((prev) => prev + 1);
        setTimeLeft(TIME_PER_QUESTION);
        setSelectedOption(null);
        setLastEarned(0);
        setStatus('answering');
      } else {
        const finalScore = calcTotal(answers);
        const correctCount = answers.filter(
          (a) => a.chosen !== null && a.chosen === a.correct
        ).length;

        navigate('/result', {
          replace: true,
          state: {
            playerName,
            answers,
            score: finalScore,
            correctCount,
          },
        });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [status, currentIndex, gameQuestions.length, answers, navigate, playerName]);

  if (!playerName || !playerName.trim()) {
    return <Navigate to="/" replace />;
  }

  if (gameQuestions.length === 0) {
    return <p>Đang chuẩn bị bộ câu hỏi...</p>;
  }

  const currentQuestion = gameQuestions[currentIndex];
  const score = calcTotal(answers);
  const correctCount = answers.filter(
    (a) => a.chosen !== null && a.chosen === a.correct
  ).length;

  const handleSelectOption = (optionIndex) => {
    if (status !== 'answering') return;

    const isCorrect = optionIndex === currentQuestion.answer;
    const earned = isCorrect ? calcPoints(currentQuestion, timeLeft) : 0;

    setSelectedOption(optionIndex);
    setLastEarned(earned);
    setAnswers((prev) => [
      ...prev,
      {
        id: currentQuestion.id,
        chosen: optionIndex,
        correct: currentQuestion.answer,
        timeLeft,
        points: earned,
      },
    ]);
    setStatus('revealed');
  };

  if (status === 'countdown') {
    return <Countdown count={countdownNum} />;
  }

  return (
    <div className="play-container">
      <div className="play-header">
        <TimeBar timeLeft={timeLeft} />
        <ScorePanel
          score={score}
          correctCount={correctCount}
          lastEarned={status === 'revealed' ? lastEarned : 0}
        />
      </div>

      <QuestionCard
        question={currentQuestion}
        index={currentIndex}
        total={gameQuestions.length}
        selectedOption={selectedOption}
        isRevealed={status === 'revealed'}
        onSelectOption={handleSelectOption}
      />
    </div>
  );
};

export default Play;