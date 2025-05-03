
import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  endDate: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  const [isEnding, setIsEnding] = useState<boolean>(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }
      
      // Check if less than an hour is left
      if (difference <= 60 * 60 * 1000) {
        setIsEnding(true);
      } else {
        setIsEnding(false);
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [endDate]);
  
  // Format function to ensure 2 digits
  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, "0");
  };
  
  const timerClass = isEnding ? "countdown-ending" : "countdown-active";
  
  if (timeLeft.days > 0) {
    return (
      <span className={`timer-text ${timerClass}`}>
        {timeLeft.days}d {formatNumber(timeLeft.hours)}h {formatNumber(timeLeft.minutes)}m
      </span>
    );
  }
  
  return (
    <span className={`timer-text ${timerClass}`}>
      {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
    </span>
  );
};

export default CountdownTimer;
