import { useState } from "react";
import { useKanbanStore } from "../store/kanbanStore";
import TextInputPopup from "./TextInputPopup";

export default function ControlBar() {
  const filter = useKanbanStore((s) => s.filter);
  const statusFilter = useKanbanStore((s) => s.statusFilter);
  const [isAddColumnPopupOpen, setIsAddColumnPopupOpen] = useState(false);
  const setFilter = useKanbanStore((s) => s.setFilter);
  const setStatusFilter = useKanbanStore((s) => s.setStatusFilter);
  const addColumn = useKanbanStore((s) => s.addColumn);
  const columnFilter = useKanbanStore((s) => s.columnFilter);
  const setColumnFilter = useKanbanStore((s) => s.setColumnFilter);
  const columns = useKanbanStore((s) => s.columns);

  return (
    <div className="flex justify-center gap-4 mt-4 px-6 flex-wrap">
      {/* search filter  */}
      <input
        type="text"
        value={filter}
        placeholder="Search tasks..."
        onChange={(e) => setFilter(e.target.value)}
        className="border border-gray-300 dark:hover:border-gray-600 bg-white  dark:bg-gray-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-400 outline-none"
      />
      {/* Column Filter */}
      <select
        value={columnFilter}
        onChange={(e) => setColumnFilter(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-400 outline-none"
      >
        <option value="">All Columns</option>

        {columns.map((col) => (
          <option key={col.id} value={col.id}>
            {col.title}
          </option>
        ))}
      </select>

      {/* status filter  */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-400 outline-none"
      >
        <option value="all">All Tasks</option>
        <option value="completed">Completed</option>
        <option value="incomplete">Not Completed</option>
      </select>
      {/* add column  */}
      <button
        onClick={() => setIsAddColumnPopupOpen(true)}
        className="px-4 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 text-sm dark:bg-yellow-400 dark:text-black dark:hover:bg-yellow-500"
      >
        + Add Column
      </button>
      <TextInputPopup
        isOpen={isAddColumnPopupOpen}
        title="Add New Column"
        initialValue=""
        placeholder="Column title..."
        onClose={() => setIsAddColumnPopupOpen(false)}
        onSave={(val) => addColumn(val)}
      />
    </div>
  );
}
