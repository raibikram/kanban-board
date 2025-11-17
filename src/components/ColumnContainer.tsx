import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Edit2, PlusCircle, Trash } from "lucide-react";
import type { Column, Id } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useKanbanStore } from "../store/kanbanStore";
import TaskCard from "./TaskCard";
import { useMemo, useState } from "react";
import TextInputPopup from "./TextInputPopup";

interface Props {
  column: Column;
}
export default function ColumnContainer({ column }: Props) {
  const [isEditeColumnTitlePopupOpen, setIsEditeColumnTitlePopupOpen] =
    useState(false);
  const [isAddTaskPopupOpen, setIsAddTaskPopupOpen] = useState(false);

  const allTasks = useKanbanStore((s) => s.tasks);
  const addTask = useKanbanStore((s) => s.addTask);
  const updateColumn = useKanbanStore((s) => s.updateColumn);
  const deleteColumn = useKanbanStore((s) => s.deleteColumn);

  // FILTER STATES
  const filterText = useKanbanStore((s) => s.filter);
  const filterColumn = useKanbanStore((s) => s.columnFilter);
  const filterStatus = useKanbanStore((s) => s.statusFilter);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id, data: { type: "Column", column } });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // FILTERED TASKS
  const tasks = useMemo(() => {
    return allTasks
      .filter((t) => t.columnId === column.id)
      .filter((t) =>
        filterText
          ? t.content.toLowerCase().includes(filterText.toLowerCase())
          : true
      )
      .filter(() => (filterColumn ? column.id === filterColumn : true))
      .filter((t) =>
        filterStatus === "completed"
          ? t.completed === true
          : filterStatus === "incomplete"
          ? t.completed === false
          : true
      );
  }, [allTasks, column.id, filterText, filterColumn, filterStatus]);
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);
  function handleDeleteColumn(id: Id) {
    if (window.confirm("Are you sure, you want to delete this column?")) {
      deleteColumn(id);
    }
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-[320px] h-[200px] rounded-lg opacity-30 bg-gray-700"
      />
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
    bg-columnBackground rounded-lg flex flex-col 
    p-3 gap-3 cursor-grab shadow-md
    w-full sm:w-[300px] md:w-[320px] lg:w-[340px]
    shrink-0
  "
    >
      {/* HEADER */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between"
      >
        <span className="text-sm opacity-70">({tasks.length})</span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">{column.title}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="p-1 hover:bg-gray-300 dark:hover:bg-gray-700 rounded transition"
            onClick={() => setIsEditeColumnTitlePopupOpen(true)}
          >
            <Edit2 size={14} />
          </button>

          <button
            className="p-1 hover:bg-red-300 dark:hover:bg-red-700 rounded transition"
            onClick={() => handleDeleteColumn(column.id)}
          >
            <Trash size={14} />
          </button>
        </div>
      </div>

      {/* TASKS */}
      <SortableContext items={taskIds}>
        <div className="flex flex-col gap-2">
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      </SortableContext>

      {/* ADD TASK */}

      <button
        onClick={() => setIsAddTaskPopupOpen(true)}
        className="
      inline-flex items-center gap-1
      px-6 py-1.5
      bg-green-500 text-white
      rounded
      hover:bg-green-600
      text-md
      transition-colors
    "
      >
        <PlusCircle size={14} />
        Add
      </button>

      {/* POPUPS */}
      <TextInputPopup
        initialValue=""
        isOpen={isAddTaskPopupOpen}
        onClose={() => setIsAddTaskPopupOpen(false)}
        onSave={(title) => addTask(column.id, title)}
        title="Add New Task"
        placeholder="Task title..."
      />

      <TextInputPopup
        initialValue={column.title}
        isOpen={isEditeColumnTitlePopupOpen}
        onClose={() => setIsEditeColumnTitlePopupOpen(false)}
        onSave={(newTitle) => updateColumn(column.id, newTitle)}
        title="Edit Column Title"
        placeholder="Column title..."
      />
    </div>
  );
}
