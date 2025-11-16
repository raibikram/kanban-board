import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="flex justify-center py-4 "
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="inline-block w-max flex-col items-center gap-1
                   rounded-xl px-6 py-4"
                  
      >
        <h1 className="text-2xl md:text-3xl font-bold text-rose-600 dark:text-yellow-300 tracking-wide text-center">
          Kanban Board
        </h1>
        <p className="text-sm md:text-base text-gray-700 dark:text-red-300 italic text-center">
          Minimal, Calm & Cozy
        </p>
      </motion.div>
    </motion.header>
  );
}
