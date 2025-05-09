import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Slider } from './ui/slider';
import { cn } from '@/lib/utils';

type TimerMode = 'work' | 'break';

const PomodoroTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Play notification sound
      const audio = new Audio('/notification.mp3');
      audio.play();

      // Switch modes
      if (mode === 'work') {
        setMode('break');
        setTimeLeft(breakDuration * 60);
      } else {
        setMode('work');
        setTimeLeft(workDuration * 60);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, mode, workDuration, breakDuration]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(workDuration * 60);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work'
    ? ((workDuration * 60 - timeLeft) / (workDuration * 60)) * 100
    : ((breakDuration * 60 - timeLeft) / (breakDuration * 60)) * 100;

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Timer Display */}
          <div className="relative aspect-square flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(
                  var(--primary) ${progress}%,
                  var(--muted) ${progress}%
                )`,
              }}
            />
            <div className="absolute inset-2 bg-background rounded-full flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold">{formatTime(timeLeft)}</div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground capitalize">
                  {mode === 'work' ? (
                    <>
                      <Brain className="h-4 w-4" />
                      Work Time
                    </>
                  ) : (
                    <>
                      <Coffee className="h-4 w-4" />
                      Break Time
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTimer}
              className={cn(
                'h-10 w-10',
                isRunning && 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              {isRunning ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={resetTimer}
              className="h-10 w-10"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Work Duration: {workDuration} minutes
              </label>
              <Slider
                value={[workDuration]}
                onValueChange={(value) => {
                  setWorkDuration(value[0]);
                  if (mode === 'work' && !isRunning) {
                    setTimeLeft(value[0] * 60);
                  }
                }}
                min={1}
                max={60}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Break Duration: {breakDuration} minutes
              </label>
              <Slider
                value={[breakDuration]}
                onValueChange={(value) => {
                  setBreakDuration(value[0]);
                  if (mode === 'break' && !isRunning) {
                    setTimeLeft(value[0] * 60);
                  }
                }}
                min={1}
                max={30}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PomodoroTimer; 