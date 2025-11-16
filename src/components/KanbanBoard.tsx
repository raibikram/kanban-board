// import { useEffect, useState } from "react";
// import ColumnContainer from "./ColumnContainer";
// // import TaskCard from "./TaskCard";
// // import { PlusIcon } from "lucide-react";
// import {
//   DndContext,
//   DragOverlay,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   type DragStartEvent,
//   type DragOverEvent,
//   type DragEndEvent,
// } from "@dnd-kit/core";
// import { arrayMove, SortableContext } from "@dnd-kit/sortable";
// import { createPortal } from "react-dom";
// import { useKanbanStore } from "../store/kanbanStore";
// import type { Column, Task, Id } from "../types";
// import AddNewColumn from "./AddNewColumn";
// import TaskCardNew from "./TaskCardNew";

// export default function KanbanBoard() {
//   const columns = useKanbanStore((s) => s.columns);
//   const tasks = useKanbanStore((s) => s.tasks);

//   const addColumn = useKanbanStore((s) => s.addColumn);
//   const moveTaskToColumn = useKanbanStore((s) => s.moveTaskToColumn);
//   const reorderTasks = useKanbanStore((s) => s.reorderTasks);
//   const reorderColumns = useKanbanStore((s) => s.reorderColumns);

//   const [activeColumn, setActiveColumn] = useState<Column | null>(null);
//   const [activeTask, setActiveTask] = useState<Task | null>(null);

//   const [tasksLocal, setTasksLocal] = useState<Task[]>(tasks);

//   // Sync when store tasks change
//   useEffect(() => {
//     setTasksLocal(tasks);
//   }, [tasks]);

//   const sensors = useSensors(
//     useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
//   );

//   function handleDragStart(event: DragStartEvent) {
//     const t = event.active.data.current;

//     if (t?.type === "Column") {
//       setActiveColumn(t.column);
//     }
//     if (t?.type === "Task") {
//       setActiveTask(t.task);
//     }
//   }

//   function handleDragOver(event: DragOverEvent) {
//     const { active, over } = event;
//     if (!over) return;

//     const activeType = active.data.current?.type;
//     const overType = over.data.current?.type;

//     // TASK → TASK preview reorder
//     if (activeType === "Task" && overType === "Task") {
//       setTasksLocal((prev) => {
//         const oldIndex = prev.findIndex((t) => t.id === active.id);
//         const newIndex = prev.findIndex((t) => t.id === over.id);
//         if (oldIndex === -1 || newIndex === -1) return prev;

//         const activeTask = prev[oldIndex];
//         const overTask = prev[newIndex];

//         if (activeTask.columnId !== overTask.columnId) {
//           activeTask.columnId = overTask.columnId;
//         }

//         return arrayMove([...prev], oldIndex, newIndex);
//       });
//       return;
//     }

//     // TASK → COLUMN (preview move to empty space)
//     if (activeType === "Task" && overType === "Column") {
//       const overColumnId = over.id as Id;

//       setTasksLocal((prev) =>
//         prev.map((t) =>
//           t.id === active.id ? { ...t, columnId: overColumnId } : t
//         )
//       );
//       return;
//     }
//   }

//   function handleDragEnd(event: DragEndEvent) {
//     const { active, over } = event;
//     setActiveColumn(null);
//     setActiveTask(null);

//     if (!over) return;

//     const activeType = active.data.current?.type;
//     const overType = over.data.current?.type;

//     // COLUMN reorder
//     if (activeType === "Column" && overType === "Column") {
//       const oldIndex = columns.findIndex((c) => c.id === active.id);
//       const newIndex = columns.findIndex((c) => c.id === over.id);
//       if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
//         reorderColumns(oldIndex, newIndex);
//       }
//       return;
//     }

//     // TASK logic
//     if (activeType === "Task") {
//       const activeId = active.id as Id;

//       const newTaskState = tasksLocal.find((t) => t.id === activeId);
//       if (!newTaskState) return;

//       const colId = newTaskState.columnId;

//       // tasks in original store for that column
//       const originalColumnTasks = tasks.filter((t) => t.columnId === colId);
//       const previewColumnTasks = tasksLocal.filter((t) => t.columnId === colId);

//       const oldIndex = originalColumnTasks.findIndex((t) => t.id === activeId);
//       const newIndex = previewColumnTasks.findIndex((t) => t.id === activeId);

//       // Commit column move (if any)
//       const originalTask = tasks.find((t) => t.id === activeId);
//       if (originalTask && originalTask.columnId !== colId) {
//         moveTaskToColumn(activeId, colId);
//       }

//       // Commit reorder inside column
//       if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
//         reorderTasks(colId, oldIndex, newIndex);
//       }
//     }
//   }

//   const columnIds = columns.map((c) => c.id);

//   return (
//     <DndContext
//       sensors={sensors}
//       onDragStart={handleDragStart}
//       onDragOver={handleDragOver}
//       onDragEnd={handleDragEnd}
//     >
//       <div className="flex min-h-screen gap-4 p-6 flex-wrap overflow-x-auto items-start sm:justify-center opacity-90">
//         <SortableContext items={columnIds}>
//           {columns.map((col) => (
//             <ColumnContainer key={col.id} column={col} />
//           ))}
//         </SortableContext>

//         {/* <button
//           // onClick={() => handleAddNewColumn}
//           className="h-14 w-[320px] bg-gray-600 rounded-md flex items-center justify-center gap-2 sm:justify-center "
//         > */}
//         {/* <PlusIcon /> Add Column */}

//         {/* </button> */}

//         <div className="absolute z-30 right-4 md:right-20 lg:right-60 top-20 md:top-8">
//           <AddNewColumn onAdd={addColumn} />
//         </div>
//       </div>

//       {createPortal(
//         <DragOverlay>
//           {activeTask && <TaskCardNew task={activeTask} />}
//           {activeColumn && <ColumnContainer column={activeColumn} />}
//         </DragOverlay>,
//         document.body
//       )}
//     </DndContext>
//   );
// }
import { useEffect, useMemo, useState } from "react";
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

  const columnIds = useMemo(() => columns.map((c) => c.id), [tasks]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex min-h-screen gap-4 p-6 flex-wrap overflow-x-auto items-start sm:justify-center opacity-90 ">
        <SortableContext items={columnIds}>
          {columns.map((col) => (
            <ColumnContainer key={col.id} column={col} />
          ))}
        </SortableContext>
      </div>

      {/* Drag overlay for smooth dragging */}
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
