import type { Column, Task } from "../types";

export const DEFAULT_COLUMNS: Column[] = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "done", title: "Done" },
];


export const DEFAULT_TASKS:Task[]=[
    {id:crypto.randomUUID(), columnId:"todo", content:"learn Java Script"},
    {id:crypto.randomUUID(), columnId:"inprogress", content:"learn React"},
    {id:crypto.randomUUID(), columnId:"done", content:"learn HTML and CSS"},
]