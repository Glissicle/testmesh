import React, { useState, useEffect, useRef } from 'react';
import Card from './common/Card';

type Mode = 'work' | 'shortBreak' | 'longBreak';

const TIMES: Record<Mode, number> = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const Pomodoro: React.FC = () => {
  const [mode, setMode] = useState<Mode>('work');
  const [time, setTime] = useState(TIMES[mode]);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.error("Web Audio API is not supported in this browser");
        return;
      }
    }
    const context = audioContextRef.current;
    if (!context) return;
    
    // Resume context on user interaction if needed
    if (context.state === 'suspended') {
        context.resume();
    }
    
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5 note
    oscillator.start(context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.5);
    oscillator.stop(context.currentTime + 0.5);
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (time === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsActive(false);
      playSound();
      
      if (mode === 'work') {
        const newCycles = cycles + 1;
        setCycles(newCycles);
        const nextMode = newCycles % 4 === 0 ? 'longBreak' : 'shortBreak';
        switchMode(nextMode, true);
      } else {
        switchMode('work', true);
      }
    }
     // eslint-disable-next-line react-hooks/ exhaustive-deps
  }, [time, mode, cycles]);

  const switchMode = (newMode: Mode, shouldStart = false) => {
    setMode(newMode);
    setTime(TIMES[newMode]);
    setIsActive(shouldStart);
  };
  
  const toggleTimer = () => {
    // Initialize audio context on first user interaction
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) { console.error("Web Audio API not supported"); }
    }
    setIsActive(!isActive);
  }

  const resetTimer = () => {
    setIsActive(false);
    setTime(TIMES[mode]);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const progress = (TIMES[mode] - time) / TIMES[mode] * 100;
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-full max-w-md text-center">
        <div className="flex justify-center gap-2 mb-6">
            <button onClick={() => switchMode('work')} className={`px-4 py-1 rounded-full text-sm ${mode === 'work' ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-interactive)]'}`}>Work</button>
            <button onClick={() => switchMode('shortBreak')} className={`px-4 py-1 rounded-full text-sm ${mode === 'shortBreak' ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-interactive)]'}`}>Short Break</button>
            <button onClick={() => switchMode('longBreak')} className={`px-4 py-1 rounded-full text-sm ${mode === 'longBreak' ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-interactive)]'}`}>Long Break</button>
        </div>
        <div className="relative w-64 h-64 mx-auto mb-6">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-[var(--bg-interactive)]" strokeWidth="7" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                <circle 
                    className="text-[var(--accent-secondary)] transition-all duration-1000" 
                    strokeWidth="7" 
                    strokeDasharray="283" 
                    strokeDashoffset={283 - (progress / 100 * 283)} 
                    strokeLinecap="round" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="45" 
                    cx="50" 
                    cy="50"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-mono text-[var(--text-primary)]">{formatTime(time)}</span>
            </div>
        </div>
        <div className="flex justify-center gap-4">
            <button onClick={toggleTimer} className="bg-[var(--accent-primary-hover)] hover:bg-[var(--accent-primary)] text-white font-bold text-xl py-3 px-10 rounded-md transition-colors w-40">
                {isActive ? 'Pause' : 'Start'}
            </button>
            <button onClick={resetTimer} className="bg-[var(--bg-interactive)] hover:bg-[var(--border-secondary)] text-white font-bold py-3 px-6 rounded-md transition-colors">
                Reset
            </button>
        </div>
        <p className="mt-6 text-[var(--text-secondary)]">Completed cycles: {cycles}</p>
      </Card>
    </div>
  );
};

export default Pomodoro;
