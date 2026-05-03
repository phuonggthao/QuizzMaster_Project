import { useState, useEffect } from 'react';

export const useQuiz = (initialTime = 30) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Gọi logic kết thúc lượt chơi ở đây
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const startTimer = () => setIsActive(true);
  const resetTimer = () => setTimeLeft(initialTime);

  return { timeLeft, startTimer, resetTimer, isActive };
};