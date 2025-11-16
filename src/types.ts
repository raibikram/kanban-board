export type Id = string;

export interface Column {
  id: Id;
  title: string;
}

export interface Task {
  id: Id;
  columnId: Id;
  content: string;
  completed?: boolean;
}
