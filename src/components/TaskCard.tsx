import { useSortable } from "@dnd-kit/sortable";
import type { Id, Task } from "../types";
import { motion } from "framer-motion";
import { useState } from "react";
import { Edit2, Trash } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import TextInputPopup from "./TextInputPopup";
import { useKanbanStore } from "../store/kanbanStore";
interface Props {
  task: Task;
}
export default function TaskCard({ task }: Props) {
  const [hover, setHover] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const deleteTask = useKanbanStore((s) => s.deleteTask);
  const updateTask = useKanbanStore((s) => s.updateTask);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  if (isDragging) {
    <div
      ref={setNodeRef}
      style={style}
      className="opacity-30 bg-gray-700 dark:bg-gray-600 h-[88px] rounded-lg p-3"
    />;
  }
  function handleTaskDelete(id: Id) {
    const confirmDelete = window.confirm(
      "Are you sure , you want to delete this task?"
    );
    if (confirmDelete) {
      deleteTask(id);
    }
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="flex justify-between items-center p-2 rounded-lg shadow-md cursor-grab
             bg-gray-400 dark:bg-gray-800 border border-transparent
             transition-transform duration-150 ease-in-out hover:scale-[1.02] hover:shadow-lg"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* LEFT: Checkbox */}
      <div className="flex items-center gap-2 flex-1">
        <div className="relative w-6 h-6 flex items-center justify-center">
          <motion.label
            className="w-6 h-6 flex items-center justify-center cursor-pointer absolute"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: task.completed || hover ? 1 : 0,
              scale: task.completed || hover ? 1 : 0.8,
            }}
            transition={{ duration: 0.2 }}
          >
            <input
              type="checkbox"
              checked={task.completed || false}
              onChange={() =>
                updateTask(task.id, task.content, !task.completed)
              }
              className="absolute opacity-0 w-full h-full cursor-pointer"
            />
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                task.completed
                  ? "bg-green-500 border-green-500"
                  : "border-gray-300 bg-gray-600"
              }`}
            >
              {task.completed && (
                <svg
                  className="w-3 h-3 text-black"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
          </motion.label>
        </div>

        {/* TASK CONTENT */}
        <span
          className={`text-sm md:text-base wrap-break-word ${
            task.completed ? "text-green-300" : "text-black dark:text-gray-200"
          }`}
        >
          {task.content}
        </span>
      </div>

      {/* RIGHT: Edit/Delete Buttons */}
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setIsPopupOpen(true)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition"
          aria-label="Edit task"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => handleTaskDelete(task.id)}
          className="p-1 hover:bg-red-200 dark:hover:bg-red-700 rounded-md transition"
          aria-label="Delete task"
        >
          <Trash size={16} />
        </button>
      </div>

      {/* EDIT TASK POPUP */}
      <TextInputPopup
        title="Edit Task"
        initialValue={task.content}
        placeholder="Task content..."
        onClose={() => setIsPopupOpen(false)}
        onSave={(value) => updateTask(task.id, value)}
        isOpen={isPopupOpen}
      />
    </div>
  );
}
