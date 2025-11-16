import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import ColumnContainer from "./ColumnContainer";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { useKanbanStore } from "../store/kanbanStore";

export default function KanbanBoard() {
  const columns = useKanbanStore((s) => s.columns);
  const columnIds = columns.map((c) => c.id);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );
  function handleDragStart() {
    console.log("Dgrag");
  }
  function handleDragOver() {}
  function handleGradEnd() {}
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
          <ColumnContainer  column={columns}/>
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
