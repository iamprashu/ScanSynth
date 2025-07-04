import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white flex flex-col items-center justify-center px-4 text-center">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#00ffe0"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)">
            <animate
              attributeName="opacity"
              values="0.1;0.3;0.1"
              dur="6s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
      </div>

      <div className="relative z-10">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          ScanSynth
        </motion.h1>

        <motion.p
          className="mt-6 text-lg md:text-xl text-gray-400 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Scan networks. Detect vulnerabilities. Generate reports —
          intelligently & ethically.
        </motion.p>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link to="/dashboard">
            <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-xl shadow-lg transition">
              Start Now!
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
