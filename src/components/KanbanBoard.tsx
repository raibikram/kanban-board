import { useEffect, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { useKanbanStore } from "../store/kanbanStore";
import type { Column, Task, Id } from "../types";
import TaskCardNew from "./TaskCard";
export default function KanbanBoard() {
  const columns = useKanbanStore((s) => s.columns);
  const tasks = useKanbanStore((s) => s.tasks);
  const moveTaskToColumn = useKanbanStore((s) => s.moveTaskToColumn);
  const reorderTasks = useKanbanStore((s) => s.reorderTasks);
  const reorderColumns = useKanbanStore((s) => s.reorderColumns);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [tasksLocal, setTasksLocal] = useState<Task[]>(tasks);

  // Sync local task state with store
  useEffect(() => {
    setTasksLocal(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const t = event.active.data.current;
    if (t?.type === "Column") setActiveColumn(t.column);
    if (t?.type === "Task") setActiveTask(t.task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    // TASK → TASK preview reorder
    if (activeType === "Task" && overType === "Task") {
      setTasksLocal((prev) => {
        const oldIndex = prev.findIndex((t) => t.id === active.id);
        const newIndex = prev.findIndex((t) => t.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return prev;

        const activeTask = prev[oldIndex];
        const overTask = prev[newIndex];

        if (activeTask.columnId !== overTask.columnId) {
          activeTask.columnId = overTask.columnId;
        }

        return arrayMove([...prev], oldIndex, newIndex);
      });
      return;
    }

    // TASK → COLUMN (move to empty column)
    if (activeType === "Task" && overType === "Column") {
      const overColumnId = over.id as Id;
      setTasksLocal((prev) =>
        prev.map((t) =>
          t.id === active.id ? { ...t, columnId: overColumnId } : t
        )
      );
      return;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveColumn(null);
    setActiveTask(null);

    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    // COLUMN reorder
    if (activeType === "Column" && overType === "Column") {
      const oldIndex = columns.findIndex((c) => c.id === active.id);
      const newIndex = columns.findIndex((c) => c.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        reorderColumns(oldIndex, newIndex);
      }
      return;
    }

    // TASK logic
    if (activeType === "Task") {
      const activeId = active.id as Id;

      const newTaskState = tasksLocal.find((t) => t.id === activeId);
      if (!newTaskState) return;

      const colId = newTaskState.columnId;
      const originalColumnTasks = tasks.filter((t) => t.columnId === colId);
      const previewColumnTasks = tasksLocal.filter((t) => t.columnId === colId);

      const oldIndex = originalColumnTasks.findIndex((t) => t.id === activeId);
      const newIndex = previewColumnTasks.findIndex((t) => t.id === activeId);

      const originalTask = tasks.find((t) => t.id === activeId);
      if (originalTask && originalTask.columnId !== colId) {
        moveTaskToColumn(activeId, colId);
      }

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        reorderTasks(colId, oldIndex, newIndex);
      }
    }
  };

  const columnIds = columns.map((c) => c.id);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Columns container */}
      <div
        className="
      flex flex-wrap gap-4 p-4 sm:p-6
      items-start justify-center md:justify-center
      w-full 
    "
      >
        <SortableContext items={columnIds}>
          {columns.map((col) => (
            <div
              key={col.id}
              className="
            w-full sm:w-[300px] md:w-[320px] lg:w-[340px] 
            shrink-0
          "
            >
              <ColumnContainer column={col} />
            </div>
          ))}
        </SortableContext>
      </div>

      {/* Drag overlay */}
      {createPortal(
        <DragOverlay>
          {activeTask && <TaskCardNew task={activeTask} />}
          {activeColumn && <ColumnContainer column={activeColumn} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
