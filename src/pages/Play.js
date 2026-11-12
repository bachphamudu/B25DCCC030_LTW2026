import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { TIME_PER_QUESTION } from '../data';
import { calcPoints, calcTotal, getStars } from '../utils';
import Countdown from '../components/Countdown';
import QuestionCard from '../components/QuestionCard';
import TimeBar from '../components/TimeBar';
import ScorePanel from '../components/ScorePanel';
import PowerUps from '../components/PowerUps';

const Play = ({ questions, playerName, onSaveHistory }) => {
  const navigate = useNavigate();

  const [gameQuestions, setGameQuestions] = useState([]);
  const [status, setStatus] = useState('countdown'); 
  const [countdownNum, setCountdownNum] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [lastEarned, setLastEarned] = useState(0);

  const [usedSwap, setUsedSwap] = useState(false);
  const [usedDouble, setUsedDouble] = useState(false);
  const [usedFreeze, setUsedFreeze] = useState(false);
  const [isDoubleActive, setIsDoubleActive] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    if (questions.length > 0 && gameQuestions.length === 0) {
      const mainList = questions
        .filter((q) => !q.reserve)
        .sort((a, b) => a.id - b.id);
      setGameQuestions(mainList);
    }
  }, [questions, gameQuestions.length]);

  const currentQuestion = gameQuestions[currentIndex];
  const score = calcTotal(answers);
  const correctCount = answers.filter(
    (a) => a.chosen !== null && a.chosen === a.correct
  ).length;

  useEffect(() => {
    if (gameQuestions.length > 0) {
      document.title = `Câu ${currentIndex + 1}/${gameQuestions.length} – đúng ${correctCount} câu`;
    }
    return () => {
      document.title = 'Nhanh như chớp';
    };
  }, [currentIndex, gameQuestions.length, correctCount]);

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
    if (status !== 'answering' || isFrozen || !currentQuestion) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setSelectedOption(null);
          setLastEarned(0);
          setAnswers((prevAns) => [
            ...prevAns,
            {
              id: currentQuestion.originalId || currentQuestion.id,
              swappedToId: currentQuestion.originalId ? currentQuestion.id : null,
              chosen: null,
              correct: currentQuestion.answer,
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
  }, [status, isFrozen, currentQuestion]);

  useEffect(() => {
    if (status !== 'revealed') return;

    const timer = setTimeout(() => {
      if (currentIndex + 1 < gameQuestions.length) {
        setCurrentIndex((prev) => prev + 1);
        setTimeLeft(TIME_PER_QUESTION);
        setSelectedOption(null);
        setLastEarned(0);
        setIsDoubleActive(false);
        setIsFrozen(false);
        setFocusedIndex(0);
        setStatus('answering');
      } else {
        const finalScore = calcTotal(answers);
        const finalCorrect = answers.filter(
          (a) => a.chosen !== null && a.chosen === a.correct
        ).length;
        const starInfo = getStars(finalCorrect);

        onSaveHistory({
          id: Date.now(),
          name: playerName.trim(),
          score: finalScore,
          correctCount: finalCorrect,
          stars: starInfo.stars,
          playedAt: new Date().toLocaleString('vi-VN'),
        });

        navigate('/result', {
          replace: true,
          state: {
            playerName: playerName.trim(),
            answers,
            score: finalScore,
            correctCount: finalCorrect,
          },
        });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    status,
    currentIndex,
    gameQuestions.length,
    answers,
    navigate,
    playerName,
    onSaveHistory,
  ]);

  const handleSelectOption = useCallback(
    (optionIndex) => {
      if (status !== 'answering' || !currentQuestion) return;

      const isCorrect = optionIndex === currentQuestion.answer;
      let earned = isCorrect ? calcPoints(currentQuestion, timeLeft) : 0;
      if (isCorrect && isDoubleActive) {
        earned *= 2;
      }

      setSelectedOption(optionIndex);
      setLastEarned(earned);
      setAnswers((prev) => [
        ...prev,
        {
          id: currentQuestion.originalId || currentQuestion.id,
          swappedToId: currentQuestion.originalId ? currentQuestion.id : null,
          chosen: optionIndex,
          correct: currentQuestion.answer,
          timeLeft,
          points: earned,
        },
      ]);
      setStatus('revealed');
    },
    [status, currentQuestion, timeLeft, isDoubleActive]
  );

  useEffect(() => {
    if (status !== 'answering') return;

    const handleKey = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev % 2 === 0 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev % 2 === 1 ? prev - 1 : prev));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev < 2 ? prev + 2 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev >= 2 ? prev - 2 : prev));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSelectOption(focusedIndex);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [status, focusedIndex, handleSelectOption]);

  const handleSwapQuestion = () => {
    if (usedSwap || status !== 'answering') return;
    const reserveQ = questions.find(
      (q) => q.reserve && q.level === currentQuestion.level
    );
    if (!reserveQ) return;

    const updated = [...gameQuestions];
    updated[currentIndex] = {
      ...reserveQ,
      originalId: currentQuestion.id,
    };

    setGameQuestions(updated);
    setUsedSwap(true);
    setTimeLeft(TIME_PER_QUESTION);
    setIsFrozen(false);
    setFocusedIndex(0);
  };

  const handleDoublePoints = () => {
    if (usedDouble || status !== 'answering') return;
    setUsedDouble(true);
    setIsDoubleActive(true);
  };

  const handleFreezeTime = () => {
    if (usedFreeze || status !== 'answering') return;
    setUsedFreeze(true);
    setIsFrozen(true);
  };

  if (!playerName || !playerName.trim()) {
    return <Navigate to="/" replace />;
  }

  if (gameQuestions.length === 0) {
    return <p>Đang chuẩn bị bộ câu hỏi...</p>;
  }

  if (status === 'countdown') {
    return <Countdown count={countdownNum} />;
  }

  return (
    <div className="play-container">
      <div className="play-header">
        <TimeBar timeLeft={timeLeft} isFrozen={isFrozen} />
        <ScorePanel
          score={score}
          correctCount={correctCount}
          lastEarned={status === 'revealed' ? lastEarned : 0}
        />
      </div>

      <PowerUps
        usedSwap={usedSwap}
        usedDouble={usedDouble}
        usedFreeze={usedFreeze}
        isDoubleActive={isDoubleActive}
        disabled={status !== 'answering'}
        onSwap={handleSwapQuestion}
        onDouble={handleDoublePoints}
        onFreeze={handleFreezeTime}
      />

      <QuestionCard
        question={currentQuestion}
        index={currentIndex}
        total={gameQuestions.length}
        focusedIndex={focusedIndex}
        selectedOption={selectedOption}
        isRevealed={status === 'revealed'}
        onSelectOption={handleSelectOption}
      />
    </div>
  );
};

export default Play;