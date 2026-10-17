"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";

interface SwipeButtonProps {
  onComplete: () => void;
  text: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export default function SwipeButton({ onComplete, text, icon, disabled = false }: SwipeButtonProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const THRESHOLD = 0.85; // 85% dari lebar container

  useEffect(() => {
    if (isCompleted) {
      setTimeout(() => {
        onComplete();
      }, 300);
    }
  }, [isCompleted, onComplete]);

  const handleStart = (clientX: number) => {
    if (disabled || isCompleted) return;
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !containerRef.current || !buttonRef.current || disabled) return;

    const container = containerRef.current;
    const button = buttonRef.current;
    const containerRect = container.getBoundingClientRect();
    const buttonWidth = button.offsetWidth;
    const maxDistance = containerRect.width - buttonWidth - 8; // 8px padding

    let newPosition = clientX - containerRect.left - buttonWidth / 2;
    newPosition = Math.max(0, Math.min(newPosition, maxDistance));

    setDragPosition(newPosition);

    // Check jika sudah melewati threshold
    if (newPosition >= maxDistance * THRESHOLD && !isCompleted) {
      setIsCompleted(true);
      setDragPosition(maxDistance);
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (!isCompleted) {
      // Snap back dengan animasi
      setDragPosition(0);
    }
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Global mouse/touch listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleEnd();
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleGlobalTouchEnd = () => {
      if (isDragging) {
        handleEnd();
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
      document.addEventListener("touchmove", handleGlobalTouchMove);
      document.addEventListener("touchend", handleGlobalTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("touchmove", handleGlobalTouchMove);
      document.removeEventListener("touchend", handleGlobalTouchEnd);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-blue-500 rounded-full overflow-hidden select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      style={{ height: "56px" }}
    >
      {/* Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className={`font-medium text-white transition-opacity duration-200 ${
            isCompleted ? "opacity-0" : "opacity-100"
          }`}
        >
          {text}
        </span>
      </div>

      {/* Draggable button */}
      <div
        ref={buttonRef}
        className={`absolute top-1 left-1 bottom-1 w-12 bg-white border-2 border-blue-500 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isDragging ? "" : "duration-300"
        } ${isCompleted ? "scale-110 bg-green-500 border-green-500" : ""} ${
          disabled ? "cursor-not-allowed" : isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          transform: `translateX(${dragPosition}px)`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          className={`transition-all duration-300 ${
            isCompleted ? "text-white" : "text-blue-500"
          }`}
        >
          {isCompleted ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : icon ? (
            icon
          ) : (
            <ArrowRight size={20} />
          )}
        </div>
      </div>
    </div>
  );
}