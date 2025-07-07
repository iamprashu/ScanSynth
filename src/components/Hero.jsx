import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white flex flex-col items-center justify-center px-4 text-center">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="#00ffe0"
                strokeWidth="0.3"
                opacity="0.3"
              />
            </pattern>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00ffe0" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#00ffe0" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)">
            <animate
              attributeName="opacity"
              values="0.1;0.4;0.1"
              dur="8s"
              repeatCount="indefinite"
            />
          </rect>
          <circle
            cx={mousePosition.x}
            cy={mousePosition.y}
            r="200"
            fill="url(#glow)"
            opacity="0.6"
          />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
      </div>

      <div className="absolute inset-0 z-5 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div className="relative z-10" style={{ y, opacity }}>
        <div className="relative">
          <motion.h1
            className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-600"
            initial={{ opacity: 0, y: -100, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 1.2,
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
            whileHover={{
              scale: 1.05,
              textShadow: "0 0 20px #00ffe0, 0 0 40px #00ffe0",
            }}
          >
            ScanSynth
          </motion.h1>

          <motion.h1
            className="absolute inset-0 text-6xl md:text-8xl font-black text-cyan-400 opacity-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
            style={{
              textShadow: "2px 0 #ff0000, -2px 0 #00ff00",
              transform: "translateX(2px)",
            }}
          >
            ScanSynth
          </motion.h1>
        </div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-mono"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <span className="text-cyan-400">$</span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              {" "}
              ethical_hacking_tool
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              {" "}
              --scan --vulnerabilities --generate-reports
            </motion.span>
          </motion.p>

          <motion.p
            className="mt-4 text-lg md:text-xl text-gray-400 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            Advanced network scanning with AI-powered vulnerability detection
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          {[
            "🔍 Network Scanning",
            "🛡️ Vulnerability Detection",
            "🤖 AI Analysis",
            "📊 Smart Reports",
            "⚡ Real-time Monitoring",
          ].map((feature, index) => (
            <motion.div
              key={feature}
              className="px-4 py-2 bg-cyan-900/30 border border-cyan-500/50 rounded-full text-cyan-300 text-sm font-mono"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 2.2 + index * 0.1,
                duration: 0.5,
                type: "spring",
                stiffness: 200,
              }}
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(0, 255, 224, 0.2)",
                borderColor: "#00ffe0",
              }}
            >
              {feature}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.8, duration: 0.5 }}
        >
          <Link to="/dashboard">
            <motion.button
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold rounded-xl shadow-2xl overflow-hidden"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(0, 255, 224, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  ⚡
                </motion.span>
                Start Ethical Hacking
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>

              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0"
                whileHover={{ opacity: 0.3 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>
        </motion.div>

        <div className="absolute inset-0 z-1 pointer-events-none opacity-20">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-cyan-400 font-mono text-xs"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, window.innerHeight],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {String.fromCharCode(0x30a0 + Math.random() * 96)}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
