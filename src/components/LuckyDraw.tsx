import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trophy, RotateCcw, Play, History, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Person } from '@/src/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LuckyDrawProps {
  people: Person[];
}

export function LuckyDraw({ people }: LuckyDrawProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<Person | null>(null);
  const [history, setHistory] = useState<Person[]>([]);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [availablePeople, setAvailablePeople] = useState<Person[]>([]);
  const [displayIndex, setDisplayIndex] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setAvailablePeople(people);
  }, [people]);

  const startDraw = () => {
    if (availablePeople.length === 0) return;
    
    setIsDrawing(true);
    setWinner(null);

    let count = 0;
    const maxCount = 30;
    const interval = 80;

    const tick = () => {
      setDisplayIndex(Math.floor(Math.random() * availablePeople.length));
      count++;

      if (count < maxCount) {
        timerRef.current = setTimeout(tick, interval);
      } else {
        const finalWinnerIndex = Math.floor(Math.random() * availablePeople.length);
        const finalWinner = availablePeople[finalWinnerIndex];
        
        setWinner(finalWinner);
        setHistory(prev => [finalWinner, ...prev]);
        setIsDrawing(false);
        
        if (!allowDuplicates) {
          setAvailablePeople(prev => prev.filter(p => p.id !== finalWinner.id));
        }

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#ec4899']
        });
      }
    };

    tick();
  };

  const resetDraw = () => {
    setAvailablePeople(people);
    setHistory([]);
    setWinner(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 border-none shadow-sm bg-white/50 backdrop-blur-sm overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                獎品抽籤
              </CardTitle>
              <CardDescription>
                隨機從名單中抽取幸運兒
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="duplicates" 
                  checked={allowDuplicates} 
                  onCheckedChange={setAllowDuplicates}
                  disabled={isDrawing}
                />
                <Label htmlFor="duplicates" className="text-sm cursor-pointer">可重複抽取</Label>
              </div>
              <Button variant="outline" size="sm" onClick={resetDraw} disabled={isDrawing}>
                <RotateCcw className="w-4 h-4 mr-1" /> 重置
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="relative w-full max-w-md aspect-video flex items-center justify-center bg-indigo-50 rounded-2xl border-2 border-dashed border-indigo-200 overflow-hidden">
            <AnimatePresence mode="wait">
              {isDrawing ? (
                <motion.div
                  key="drawing"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="text-4xl md:text-6xl font-black text-indigo-600 tracking-wider"
                >
                  {availablePeople[displayIndex]?.name}
                </motion.div>
              ) : winner ? (
                <motion.div
                  key="winner"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="text-sm font-semibold text-indigo-500 uppercase tracking-widest">恭喜獲獎</div>
                  <div className="text-5xl md:text-7xl font-black text-indigo-900 drop-shadow-sm">
                    {winner.name}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-400 flex flex-col items-center gap-2"
                >
                  <Play className="w-12 h-12 opacity-20" />
                  <p>點擊下方按鈕開始抽籤</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2">
            <Button 
              size="lg" 
              onClick={startDraw} 
              disabled={isDrawing || availablePeople.length === 0}
              className="px-12 py-8 text-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              {isDrawing ? '抽籤中...' : '開始抽籤'}
            </Button>
            <p className="text-sm text-gray-500">
              剩餘人數: {availablePeople.length} / {people.length}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="w-5 h-5 text-indigo-600" />
            中獎紀錄
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
                <p>尚無中獎紀錄</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((person, index) => (
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    key={`${person.id}-${history.length - index}`}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                      {history.length - index}
                    </div>
                    <div className="flex-grow">
                      <div className="font-bold text-gray-800">{person.name}</div>
                      <div className="text-[10px] text-gray-400">抽中時間: {new Date().toLocaleTimeString()}</div>
                    </div>
                    <Trophy className="w-4 h-4 text-yellow-500" />
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
