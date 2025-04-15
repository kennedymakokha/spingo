// CardLoader.tsx
import { motion } from "framer-motion";

const cards = [0, 1];

const CardLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
     <div className="relative w-60 h-60" style={{ perspective: "800px" }}>

     {cards.map((_, index) => {
  const baseRotate = -10 + index * 10;
  const zIndex = 10 - index;
  const delay = index * 0.2;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      key={index}
      className="absolute size-32 bg-white rounded-full shadow-xl"
      style={{
        left: `${index * 80}px`,
        top: `${(index % 2) * 30}px`,
        zIndex,
        transformStyle: "preserve-3d",
      }}
      initial={{
        y: 0,
        rotate: baseRotate,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
      }}
      animate={{
        y: isEven ? [0, -10, 0] : [0, 10, 0], // alternate bounce
        rotateY: [0, 360],
        rotateX: [0, 5, -5, 0],
        rotateZ: [0, 3, -3, 0],
      }}
      transition={{
        y: {
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
          delay,
        },
        rotateY: {
          duration: 2 + index * 0.3,
          ease: "linear",
          repeat: Infinity,
          delay,
        },
        rotateX: {
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
          delay,
        },
        rotateZ: {
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
          delay,
        },
      }}
    />
  );
})}

      </div>
    </div>
  );
};

export default CardLoader;
