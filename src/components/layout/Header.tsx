import { motion } from "framer-motion";
export default function Header() {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      whileHover={{ scale: 1.03 }}
      className="top-8 transform px-8 py-4"
    >
      <div className="flex flex-col items-center gap-1  rounded-xl px-6 py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-rose-600 dark:text-yellow-300 tracking-wide">
          Kanban Board
        </h1>
        <p className="text-sm md:text-base text-gray-700 dark:text-red-300 italic">
          Minimal, Calm & Cozy
        </p>
      </div>
    </motion.header>
  );
}
