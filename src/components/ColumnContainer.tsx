import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Edit2, PlusCircle, Trash } from "lucide-react";
import type { Column, Id } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useKanbanStore } from "../store/kanbanStore";
import TaskCard from "./TaskCard";
import { useState } from "react";
import TextInputPopup from "./TextInputPopup";

interface Props {
  column: Column;
}
export default function ColumnContainer({ column }: Props) {
  const [isEditeColumnTitlePopupOpen, setIsEditeColumnTitlePopupOpen] =
    useState(false);
  const [isAddTaskPopupOpen, setIsAddTaskPopupOpen] = useState(false);
  const allTasks = useKanbanStore((s) => s.tasks);
  const allTaskIds = allTasks.map((t) => t.id);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.id, data: { type: "Column", column } });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function handleDeleteColumn(id: Id) {
    console.log("Delete column", id);
  }
  function handleSaveTask(value: string) {
    console.log("Save new task", value);
  }
  function handleUpdateColumnTitle(value: string) {
    console.log("Update  task", value);
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-[320px] bg-columnBackground rounded-lg flex flex-col p-3 gap-3"
    >
      {/* header  */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between gap-2 px-4"
      >
        <div className="flex-1 flex items-center gap-2 justify-between">
          {allTasks.length}
          <span className="font-bold text-lg">{column.title}</span>
          <button
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition cursor-pointer"
            onClick={() => setIsEditeColumnTitlePopupOpen(true)}
          >
            <Edit2 size={15} />
          </button>
        </div>
        <button
          className="rounded ml-2 cursor-pointer"
          onClick={() => handleDeleteColumn(column.id)}
        >
          <Trash size={17} />
        </button>
      </div>
      {/* TASK  */}
      <SortableContext items={allTaskIds}>
        <div className="flex flex-col gap-3">
          {allTasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      </SortableContext>

      {/* ADD TASK BUTTON  */}
      <div className="flex items-center justify-center">
        <button
          className="flex items-center gap-2 mt-2 text-md text-white hover:text-blue-800"
          onClick={() => setIsAddTaskPopupOpen(true)}
        >
          <PlusCircle size={16} />
          Add task
        </button>
      </div>
      {/* POPUP : ADD TASK */}
      <TextInputPopup
        initialValue=""
        isOpen={isAddTaskPopupOpen}
        onClose={() => setIsAddTaskPopupOpen(false)}
        onSave={(title) => handleSaveTask(title)}
        title="Add New Task"
        placeholder="Task title..."
      />
      {/* POPUP: edit column title  */}
      <TextInputPopup
        initialValue=""
        isOpen={isEditeColumnTitlePopupOpen}
        onClose={() => setIsEditeColumnTitlePopupOpen(false)}
        onSave={(title) => handleUpdateColumnTitle(title)}
        title="Edit Column Title"
        placeholder="Column title..."
      />
    </div>
  );
}
