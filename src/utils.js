import { POINTS, BONUS_PER_SECOND, STARS } from './data';

export const calcPoints = (question, timeLeft) => {
  return POINTS[question.level] + timeLeft * BONUS_PER_SECOND;
};

export const calcTotal = (answers) => {
  return answers.reduce((sum, item) => sum + item.points, 0);
};

export const getStars = (correctCount) => {
  return STARS.find((item) => correctCount >= item.min);
};