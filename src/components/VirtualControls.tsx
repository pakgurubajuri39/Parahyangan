import React, { useRef, useState, useEffect, useCallback } from 'react';

interface VirtualControlsProps {
  onMove: (dx: number, dy: number, isSprinting?: boolean) => void;
  onStopMove: () => void;
  onAction: () => void;
  onCycleTool: () => void;
  onQuickEat: () => void;
  isSprinting: boolean;
  onToggleSprint: () => void;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  onMove,
  onStopMove,
  onAction,
  onCycleTool,
  onQuickEat,
  isSprinting,
  onToggleSprint,
}) => {
  const joystickBaseRef = useRef<HTMLDivElement | null>(null);
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const activeTouchIdRef = useRef<number | null>(null);
  const moveVectorRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const animFrameRef = useRef<number | null>(null);

  const MAX_RADIUS = 50; // max knob displacement in pixels

  // Continuous movement loop while dragging
  const updateMovement = useCallback(() => {
    if (isDragging) {
      const { dx, dy } = moveVectorRef.current;
      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        onMove(dx, dy, isSprinting);
      }
      animFrameRef.current = requestAnimationFrame(updateMovement);
    }
  }, [isDragging, isSprinting, onMove]);

  useEffect(() => {
    if (isDragging) {
      animFrameRef.current = requestAnimationFrame(updateMovement);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDragging, updateMovement]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!joystickBaseRef.current) return;
    const touch = e.changedTouches[0];
    activeTouchIdRef.current = touch.identifier;
    setIsDragging(true);

    handleTouchMove(e);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!joystickBaseRef.current) return;

    // Find our tracking touch
    let touch: React.Touch | null = null;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouchIdRef.current) {
        touch = e.changedTouches[i];
        break;
      }
    }
    if (!touch) return;

    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;
    const dist = Math.hypot(deltaX, deltaY);

    if (dist <= MAX_RADIUS) {
      setKnobPos({ x: deltaX, y: deltaY });
      moveVectorRef.current = {
        dx: deltaX / MAX_RADIUS,
        dy: deltaY / MAX_RADIUS,
      };
    } else {
      const angle = Math.atan2(deltaY, deltaX);
      const clampedX = Math.cos(angle) * MAX_RADIUS;
      const clampedY = Math.sin(angle) * MAX_RADIUS;
      setKnobPos({ x: clampedX, y: clampedY });
      moveVectorRef.current = {
        dx: clampedX / MAX_RADIUS,
        dy: clampedY / MAX_RADIUS,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouchIdRef.current) {
        activeTouchIdRef.current = null;
        setIsDragging(false);
        setKnobPos({ x: 0, y: 0 });
        moveVectorRef.current = { dx: 0, dy: 0 };
        onStopMove();
        break;
      }
    }
  };

  // Mouse event handlers for desktop testing of the analog joystick
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const dist = Math.hypot(deltaX, deltaY);

    if (dist <= MAX_RADIUS) {
      setKnobPos({ x: deltaX, y: deltaY });
      moveVectorRef.current = {
        dx: deltaX / MAX_RADIUS,
        dy: deltaY / MAX_RADIUS,
      };
    } else {
      const angle = Math.atan2(deltaY, deltaX);
      const clampedX = Math.cos(angle) * MAX_RADIUS;
      const clampedY = Math.sin(angle) * MAX_RADIUS;
      setKnobPos({ x: clampedX, y: clampedY });
      moveVectorRef.current = {
        dx: clampedX / MAX_RADIUS,
        dy: clampedY / MAX_RADIUS,
      };
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setKnobPos({ x: 0, y: 0 });
      moveVectorRef.current = { dx: 0, dy: 0 };
      onStopMove();
    }
  };

  // Compute direction angle for visual indicator
  const angleDeg = Math.atan2(knobPos.y, knobPos.x) * (180 / Math.PI);
  const dragMagnitude = Math.hypot(knobPos.x, knobPos.y);

  return (
    <div
      className="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden"
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {/* Bottom Left: Smooth Floating Analog Virtual Joystick */}
      <div className="absolute bottom-20 sm:bottom-16 left-4 sm:left-8 pointer-events-auto flex flex-col items-center gap-1">
        {/* Joystick Base Ring */}
        <div
          ref={joystickBaseRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onMouseDown={handleMouseDown}
          className={`relative w-36 h-36 rounded-full flex items-center justify-center touch-none cursor-grab active:cursor-grabbing transition-all ${
            isDragging
              ? 'bg-amber-950/60 border-2 border-amber-400/90 shadow-[0_0_25px_rgba(251,191,36,0.5)]'
              : 'bg-stone-900/60 backdrop-blur-md border border-amber-600/40 shadow-2xl'
          }`}
        >
          {/* Subtle 8-Direction Guides */}
          <div className="absolute inset-2 rounded-full border border-stone-700/40 pointer-events-none" />
          <div className="absolute w-full h-[1px] bg-amber-600/20 pointer-events-none" />
          <div className="absolute h-full w-[1px] bg-amber-600/20 pointer-events-none" />
          <div className="absolute w-full h-[1px] bg-amber-600/10 rotate-45 pointer-events-none" />
          <div className="absolute w-full h-[1px] bg-amber-600/10 -rotate-45 pointer-events-none" />

          {/* Directional Pointer Arrow (when moving) */}
          {dragMagnitude > 12 && (
            <div
              className="absolute w-8 h-8 pointer-events-none flex items-center justify-end"
              style={{
                transform: `rotate(${angleDeg}deg)`,
                transformOrigin: 'center center',
              }}
            >
              <span className="text-amber-300 text-xs font-black animate-pulse">▶</span>
            </div>
          )}

          {/* Central Draggable Joystick Thumb Knob */}
          <div
            className={`absolute w-16 h-16 rounded-full flex flex-col items-center justify-center transition-transform pointer-events-none ${
              isDragging
                ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 text-stone-950 border-2 border-yellow-200 shadow-[0_0_15px_rgba(251,191,36,0.8)] scale-105'
                : 'bg-gradient-to-br from-stone-800 to-stone-950 text-amber-200 border-2 border-amber-500/70 shadow-lg'
            }`}
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
            }}
          >
            <div className="w-8 h-8 rounded-full bg-stone-900/40 border border-white/20 flex items-center justify-center">
              <span className="text-xs font-mono font-black text-amber-100">
                {isDragging ? '⚡' : '❖'}
              </span>
            </div>
          </div>
        </div>

        <span className="text-[10px] text-amber-300/80 font-bold tracking-wider uppercase bg-stone-950/70 px-2 py-0.5 rounded-full border border-amber-800/40 backdrop-blur-sm">
          {isDragging ? 'Geser Bebas 360°' : 'Sentuh & Geser'}
        </span>
      </div>

      {/* Bottom Right: Circular Action Buttons */}
      <div className="absolute bottom-20 sm:bottom-16 right-3 sm:right-6 pointer-events-auto flex items-end gap-2">
        {/* Secondary Column: Sprint, Eat, Tool Switch */}
        <div className="flex flex-col gap-2">
          {/* Tombol Sprint / Lari */}
          <button
            onClick={onToggleSprint}
            className={`w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center shadow-lg active:scale-90 touch-manipulation transition-all cursor-pointer ${
              isSprinting
                ? 'bg-amber-500 border-yellow-200 text-stone-950 font-black shadow-[0_0_15px_rgba(251,191,36,0.8)]'
                : 'bg-stone-800/90 border-stone-600 text-stone-300'
            }`}
            title="Lari Cepat / Jalan Santai"
          >
            <span className="text-base">🏃</span>
            <span className="text-[8px] font-bold uppercase tracking-tighter">
              {isSprinting ? 'LARI' : 'JALAN'}
            </span>
          </button>

          {/* Santap Makanan */}
          <button
            onClick={onQuickEat}
            className="w-12 h-12 rounded-full bg-amber-800/90 border-2 border-amber-500/80 text-amber-100 flex flex-col items-center justify-center shadow-lg active:scale-90 touch-manipulation transition-transform cursor-pointer"
            title="Makan Pulihkan Stamina"
          >
            <span className="text-base">🍲</span>
            <span className="text-[8px] font-bold uppercase tracking-tighter">Makan</span>
          </button>

          {/* Ganti Alat */}
          <button
            onClick={onCycleTool}
            className="w-12 h-12 rounded-full bg-stone-800/90 border-2 border-amber-600/80 text-amber-200 flex flex-col items-center justify-center shadow-lg active:scale-90 touch-manipulation transition-transform cursor-pointer"
            title="Ganti Alat / Slot Selanjutnya"
          >
            <span className="text-base">🔄</span>
            <span className="text-[8px] font-bold uppercase tracking-tighter">Alat</span>
          </button>
        </div>

        {/* Primary Action Button [AKSI] */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onAction();
          }}
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 border-4 border-amber-300 text-white flex flex-col items-center justify-center shadow-[0_0_25px_rgba(34,197,94,0.7)] active:scale-90 touch-manipulation transition-all cursor-pointer"
          title="Tombol Aksi Utama"
        >
          <span className="text-2xl sm:text-3xl leading-none">⚡</span>
          <span className="text-[10px] font-black tracking-wider uppercase mt-0.5">AKSI</span>
        </button>
      </div>
    </div>
  );
};
