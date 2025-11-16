import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Edit2, Trash } from "lucide-react";
import type { Column } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useKanbanStore } from "../store/kanbanStore";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
}
export default function ColumnContainer({ column }: Props) {
    const allTasks = useKanbanStore((s)=>s.tasks)
    const allTaskIds =allTasks.map((t)=>t.id)
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.id, data: { type: "Column", column } });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
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
          <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition cursor-pointer">
            <Edit2 size={15} />
          </button>
        </div>
        <button className="rounded ml-2 cursor-pointer">
          <Trash size={17} />
        </button>
      </div>
{/* TASK  */}
<SortableContext items={allTaskIds} >
    <div className="flex flex-col gap-3">
        {
            allTasks.map((t)=>(
                <TaskCard key={t.id} task={t} />
            ))
        }
    </div>
</SortableContext>
    </div>
  );
}
