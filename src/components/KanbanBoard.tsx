import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import ColumnContainer from "./ColumnContainer";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { useKanbanStore } from "../store/kanbanStore";
import { useEffect, useMemo, useState } from "react";
import type { Column, Id, Task } from "../types";
import TaskCard from "./TaskCard";

export default function KanbanBoard() {
  const moveTaskToColumn = useKanbanStore((s) => s.moveTaskToColumn);
  const reorderTasks = useKanbanStore((s) => s.reorderTasks);
  const reorderColumns = useKanbanStore((s) => s.reorderColumns);
  //   const filterText = useKanbanStore((s) => s.filter);
  //   const filterColumn = useKanbanStore((s) => s.columnFilter);
  //   const filterStatus = useKanbanStore((s) => s.statusFilter);
  const tasks = useKanbanStore((s) => s.tasks);
  const columns = useKanbanStore((s) => s.columns);
  const columnIds = useMemo(() => columns.map((c) => c.id), [columns]);

  const [tasksLocal, setTasksLocal] = useState<Task[]>(tasks);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    setTasksLocal(tasks);
  }, [tasks]);

  function handleDragStart(event: DragStartEvent) {
    const t = event.active.data.current;
    if (t?.type === "Column") setActiveColumn(t.column);
    if (t?.type === "Task") setActiveTask(t.task);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeType = active.data.current?.type;
    const overType = active.data.current?.type;
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
  }

  function handleGradEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveColumn(null);
    setActiveTask(null);
    if (!over) return;
    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;
    // COLUMN reorder
    if (activeType === "Column" && overType === "Column") {
      const olderIndex = columns.findIndex((c) => c.id === active.id);
      const newIndex = columns.findIndex((c) => c.id === over.id);
      if (olderIndex !== -1 && newIndex !== -1 && olderIndex !== newIndex) {
        reorderColumns(olderIndex, newIndex);
      }
      return;
    }
    //TASK logic
    if (activeType === "Task") {
      const activeId = active.id as Id;

      const newTaskState = tasksLocal.find((t) => t.id === activeId);
      if (!newTaskState) return;

      const colId = newTaskState.columnId;
      const originalColumnTasks = tasks.filter((t) => t.columnId === colId);
      const previewColumnTasks = tasksLocal.filter((t) => t.columnId == colId);

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
  }
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleGradEnd}
    >
      <div className="flex min-h-screen gap-4 p-6 flex-wrap overflow-x-auto items-start sm:justify-center opacity-90">
        <SortableContext items={columnIds}>
          {columns?.map((col) => (
            <ColumnContainer key={col.id} column={col} />
          ))}
        </SortableContext>
      </div>

      {createPortal(
        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} />}
          {activeColumn && <ColumnContainer column={activeColumn} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
