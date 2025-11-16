import { create } from "zustand";
import type { Column, Id, Task } from "../types";
import { persist } from "zustand/middleware";
import { DEFAULT_COLUMNS, DEFAULT_TASKS } from "../utils/constants";

interface KanbanState {
  columns: Column[];
  tasks: Task[];
  addColumn: (title: string) => void;
  updateColumn: (id: Id, title: string) => void;
  deleteColumn: (id: Id) => void;
  addTask: (columnId: Id, content: string) => void;
  updateTask: (id: Id, content: string, completed?: boolean) => void;
  deleteTask: (id: Id) => void;
  reorderColumns: (from: number, to: number) => void;
  reorderTasks: (columnId: Id, from: number, to: number) => void;
  moveTaskToColumn: (taskId: Id, targetColumnId: Id) => void;
  setTasks: (tasks: Task[]) => void;
  filter: string;
  columnFilter: string;
  statusFilter: string;
  setFilter: (v: string) => void;
  setColumnFilter: (v: string) => void;
  setStatusFilter: (v: string) => void;
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set) => ({
      columns: DEFAULT_COLUMNS,
      tasks: DEFAULT_TASKS,

      addColumn: (title) =>
        set((s) => ({
          columns: [...s.columns, { id: crypto.randomUUID(), title }],
        })),

      updateColumn: (id, title) =>
        set((s) => ({
          columns: s.columns.map((c) => (c.id === id ? { ...c, title } : c)),
        })),

      deleteColumn: (id) =>
        set((s) => ({
          columns: s.columns.filter((c) => c.id !== id),
          tasks: s.tasks.filter((t) => t.columnId !== id),
        })),

      addTask: (columnId, content) =>
        set((s) => ({
          tasks: [...s.tasks, { id: crypto.randomUUID(), columnId, content }],
        })),

      updateTask: (id, content, completed) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, content, completed } : t
          ),
        })),

      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      reorderColumns: (from, to) =>
        set((s) => {
          const copy = [...s.columns];
          const [m] = copy.splice(from, 1);
          copy.splice(to, 0, m);
          return { columns: copy };
        }),

      reorderTasks: (columnId, from, to) =>
        set((s) => {
          const columnTasks = s.tasks.filter((t) => t.columnId === columnId);
          const otherTasks = s.tasks.filter((t) => t.columnId !== columnId);
          const copy = [...columnTasks];
          const [m] = copy.splice(from, 1);
          copy.splice(to, 0, m);
          return { tasks: [...otherTasks, ...copy] };
        }),

      moveTaskToColumn: (taskId, targetColumnId) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId ? { ...t, columnId: targetColumnId } : t
          ),
        })),

      setTasks: (tasks) => set({ tasks }),

      filter: "",
      columnFilter: "",
      statusFilter: "",
      setFilter: (v) => set({ filter: v }),
      setColumnFilter: (v) => set({ columnFilter: v }),
      setStatusFilter: (v) => set({ statusFilter: v }),
    }),

    {
      name: "kanban-storage",
      partialize: (state) => ({
        columns: state.columns,
        tasks: state.tasks,
      }),
    }
  )
);
