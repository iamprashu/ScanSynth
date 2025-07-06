import React from "react";
import { motion } from "framer-motion";

const GlobalLoader = ({ message = "Loading..." }) => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const dotVariants = {
    initial: {
      y: "0%",
    },
    animate: {
      y: ["0%", "-100%", "0%"],
      backgroundColor: ["#06b6d4", "#8b5cf6", "#06b6d4"], // Cyan to purple gradient
    },
  };

  const dotTransition = {
    duration: 1.2,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "loop",
    delay: 0,
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="flex flex-col items-center space-y-6">
        <div className="flex space-x-2">
          <motion.span
            className="block w-4 h-4 rounded-full bg-cyan-400"
            variants={dotVariants}
            transition={{ ...dotTransition, delay: 0 }}
          />
          <motion.span
            className="block w-4 h-4 rounded-full bg-purple-400"
            variants={dotVariants}
            transition={{ ...dotTransition, delay: 0.2 }}
          />
          <motion.span
            className="block w-4 h-4 rounded-full bg-cyan-400"
            variants={dotVariants}
            transition={{ ...dotTransition, delay: 0.4 }}
          />
        </div>
        <motion.p
          className="text-lg font-semibold text-white text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {message}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default GlobalLoader;
