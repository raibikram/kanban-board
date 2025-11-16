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
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex justify-between gap-1 p-2 rounded-lg shadow-md cursor-grab bg-gray-400 dark:bg-gray-800 hover:border-2 hover:border-b-cyan-50"
    >
      {/* TASK  */}
      <div className="flex items-center">
        <motion.div
          className="overflow-hidden flex items-center"
          animate={{
            width: task.completed || hover ? "1.5rem" : "0rem", //0->24px
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.label
            className="w-6 h-6 flex items-center justify-center cursor-pointer"
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
              onChange={() => {}}
              className="absolute opacity-0 w-6 h-6 cursor-pointer"
            />
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                task.completed
                  ? "bg-green-500 border-green-500"
                  : "border-gray-200 border bg-gray-600"
              }`}
            >
              {task.completed && (
                <svg
                  className="w-3 h-3 text-black "
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
        </motion.div>

        {/* TASK CONTENT  */}
        <span
          className={`ml-2 text-sm md:text-base wrap-break-word transition-all ${
            task.completed ? "text-green-300" : "text-black dark:text-gray-200"
          }`}
        >
          {task.content}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setIsPopupOpen(true)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition cursor-pointer"
          aria-label="Edit task"
        >
          <Edit2 size={16} />
        </button>
        <button onClick={() => handleTaskDelete(task.id)}>
          <Trash size={16} />
        </button>
      </div>
      {/* EDIT TASK POUP  */}
      <TextInputPopup
        title="Edit Task"
        initialValue={task.content}
        placeholder="Task content..."
        onClose={() => setIsPopupOpen(false)}
        onSave={() => updateTask(task.id, task.content, !task.completed)}
        isOpen={isPopupOpen}
      />
    </div>
  );
}
