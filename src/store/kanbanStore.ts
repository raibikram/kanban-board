import { create } from "zustand";
import type { Column, Task } from "../types";
import { persist } from "zustand/middleware";
import { DEFAULT_COLUMNS, DEFAULT_TASKS } from "../utils/constants";
interface KanbanState {
  columns: Column[];
  tasks: Task[];
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    () => ({
      columns: DEFAULT_COLUMNS,
      tasks: DEFAULT_TASKS,
    }),
    {
      name: "kanban-storage",
    }
  )
);
