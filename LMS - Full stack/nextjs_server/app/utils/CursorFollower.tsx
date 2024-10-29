import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CursorFollower = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      className="dark:bg-white"
      style={{
        position: 'fixed',
        zIndex:100000000000000,
        top: 0,
        left: 0,
        width: '20px',
        height: '20px',
        // backgroundColor: 'dark:#ffffff80 #000000a6',
        borderRadius: '50%',
        pointerEvents: 'none',
      }}
      animate={{
        x: position.x - 10, // Offset to center the circle
        y: position.y - 10, // Offset to center the circle
      }}
      transition={{
        type: 'spring',
        stiffness: 500, // Lower stiffness for smoother motion
        damping: 20, // Higher damping for more natural movement
      }}
    />
  );
};

export default CursorFollower;
