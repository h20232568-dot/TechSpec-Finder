import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, X, Trophy, RefreshCw, SmartphoneIcon } from 'lucide-react';

interface FallingObject {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: 'phone' | 'bomb';
}

export const TechCatchGame = ({ onClose }: { onClose: () => void }) => {
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<FallingObject[]>([]);
  const [basketX, setBasketX] = useState(50); // percentage
  const [gameOver, setGameOver] = useState(false);
  const [lives, setLives] = useState(3);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  // 게임 초기화
  const resetGame = () => {
    setScore(0);
    setItems([]);
    setGameOver(false);
    setLives(3);
  };

  const basketXRef = useRef(50);

  // 장바구니 이동 (마우스/터치)
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameOver || !gameContainerRef.current) return;
    const rect = gameContainerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newX = ((clientX - rect.left) / rect.width) * 100;
    const clampedX = Math.max(0, Math.min(100, newX));
    setBasketX(clampedX);
    basketXRef.current = clampedX;
  };

  // 아이템 생성
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      const isBomb = Math.random() < 0.2;
      const newItem: FallingObject = {
        id: Date.now() + Math.random(),
        x: Math.random() * 90 + 5,
        y: -10,
        speed: Math.random() * 0.5 + 0.6 + score / 1500, // 초기 속도 대폭 인하 및 점진적 증가
        type: isBomb ? 'bomb' : 'phone',
      };
      setItems(prev => [...prev, newItem]);
    }, 1000 - Math.min(600, score));

    return () => clearInterval(interval);
  }, [gameOver, score]);

  // 게임 루프
  useEffect(() => {
    const update = () => {
      if (gameOver) return;

      setItems(prev => {
        const nextItems = prev.map(item => ({ ...item, y: item.y + item.speed }));
        
        let missedCount = 0;
        let caughtScore = 0;
        let hitBomb = false;

        const remainingItems = nextItems.filter(item => {
          // 바닥 도달
          if (item.y > 90) {
            // 바구니 충돌 (Ref 사용으로 루프 안정한 유지)
            if (Math.abs(item.x - basketXRef.current) < 10) {
              if (item.type === 'phone') {
                caughtScore += 10;
              } else {
                hitBomb = true;
              }
              return false;
            }
            
            // 바구니 놓침
            if (item.y > 100) {
              if (item.type === 'phone') {
                missedCount++;
              }
              return false;
            }
          }
          return true;
        });

        // 상태 업데이트를 한 번에 처리하여 버그 방지
        if (caughtScore > 0) setScore(s => s + caughtScore);
        if (hitBomb || missedCount > 0) {
          setLives(l => {
            const newLives = l - (hitBomb ? 1 : 0) - missedCount;
            if (newLives <= 0) {
              setGameOver(true);
              return 0;
            }
            return newLives;
          });
        }

        return remainingItems;
      });

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameOver]); // basketX 제거하여 루프 안정화

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-md h-[600px] rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col"
        ref={gameContainerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
      >
        {/* 헤더 */}
        <div className="p-6 flex justify-between items-center bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">폰 수집 대작전!</h2>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i < lives ? 'bg-red-500' : 'bg-gray-200'}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Score</p>
            <p className="text-2xl font-black text-primary leading-none">{score}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 게임 필드 */}
        <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-blue-50/30 to-purple-50/30 cursor-none">
          <AnimatePresence>
            {items.map(item => (
              <motion.div
                key={item.id}
                className="absolute"
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                {item.type === 'phone' ? (
                  <div className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center border border-gray-100">
                    <SmartphoneIcon className="w-6 h-6 text-blue-500" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gray-900 rounded-full shadow-lg flex items-center justify-center">
                    <span className="text-lg">💣</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* 바구니 (사용자 캐릭터) */}
          <motion.div 
            className="absolute bottom-10 -translate-x-1/2 w-20 h-8 bg-primary rounded-full shadow-lg flex items-center justify-center"
            style={{ left: `${basketX}%` }}
          >
            <div className="w-12 h-1 bg-white/30 rounded-full" />
          </motion.div>

          {/* 안내 메시지 */}
          {score === 0 && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="bg-black/10 px-4 py-2 rounded-full text-xs font-bold text-gray-600 animate-pulse">
                마우스나 터치로 스마트폰을 받으세요!
              </p>
            </div>
          )}
        </div>

        {/* 게임 오버 화면 */}
        <AnimatePresence>
          {gameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-10 text-center"
            >
              <div className="w-20 h-20 bg-yellow-100 rounded-[32px] flex items-center justify-center mb-6">
                <Trophy className="w-10 h-10 text-yellow-600" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">게임 오버!</h2>
              <p className="text-gray-500 mb-8">최신 스마트폰 {score/10}개를 수집했습니다.</p>
              
              <div className="bg-gray-50 p-6 rounded-3xl w-full mb-8">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Final Score</p>
                <p className="text-5xl font-black text-primary">{score}</p>
              </div>

              <div className="flex gap-4 w-full">
                <button 
                  onClick={resetGame}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-primary/25"
                >
                  <RefreshCw className="w-5 h-5" /> 다시하기
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
