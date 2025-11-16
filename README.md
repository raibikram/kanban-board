# Kanban Board

A clean, modern **Kanban Board** built with **React + TypeScript**, **Zustand**, **dnd-kit**, and **TailwindCSS**.
Supports creating, editing, dragging tasks & columns — all persisted locally.

---

**Live Demo: [click](https://kanban-board-six-tau.vercel.app)**

---
## Features

### Core Functionality

- Add / Edit / Delete **Tasks**
- Add / Edit / Delete **Columns**
- **Drag & Drop** (powered by **dnd-kit**)

  - Move tasks within a column
  - Move tasks between columns
  - Reorder columns

- Clean UI with **TailwindCSS**
- Board state **persists in localStorage** (Zustand Persist)
- Fully responsive

### Extra UI Features

- Popup modal for entering text
- Dedicated layout components (Header, Footer, ControlBar)
- Smooth interactions

---

## Project Structure

```
src/
 ├─ components/
 │   ├─ layout/
 │   │   ├─ Footer.tsx
 │   │   ├─ Header.tsx
 │   │   └─ ControlBar.tsx
 │   ├─ ColumnContainer.tsx
 │   ├─ KanbanBoard.tsx
 │   ├─ TaskCard.tsx
 │   └─ TextInputPopup.tsx
 ├─ store/
 │   └─ kanbanStore.ts
 ├─ utils/
 │   ├─ constants.ts
 │   ├─ types.ts
 ├─ App.tsx
 ├─ main.tsx

```

---

## Tech Stack

| Tool                   | Purpose                  |
| ---------------------- | ------------------------ |
| **React + TypeScript** | UI + Types               |
| **Zustand**            | Global state management  |
| **Zustand Persist**    | LocalStorage persistence |
| **dnd-kit**            | Drag and drop            |
| **Tailwind CSS**       | Styling                  |
| **Vite**               | Development & build tool |

---

## Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/raibikram/kanban-board.git
cd kanban-board
```

### 2️⃣ Install Dependencies

```bash


pnpm install

```

### 3️⃣ Run the Dev Server

```bash
npm dev
```

Now open:
-> [http://localhost:5173](http://localhost:5173)

---

## How It Works

### Zustand Store (`kanbanStore.ts`)

- Keeps all **columns** and **tasks**
- Handles:

  - Adding / editing / removing tasks
  - Adding / editing / removing columns
  - Dragging logic

- State is persisted automatically using: persist

### dnd-kit Integration

Used in:

- `KanbanBoard.tsx`
- `ColumnContainer.tsx`
- `TaskCard.tsx`

Supports:

- Sorting tasks
- Moving tasks between columns
- Sorting columns

---

## Screenshots

![Kanban Board UI](./public/screenshot.png)

---

## Possible Future Improvements

- Dark mode
- Cloud sync (Supabase / Firebase)
- Tags, priorities, deadlines
- Search & filters
- Framer Motion animations

---

## Contact

- **Name:** Bikram Rai
- **Portfolio:** [www.bikram-rai.com.np](https://bikram-rai.com.np)
- **Email:** raibikraminfo@gmail.com
- **LinkedIn:** [raibikraminfo](https://www.linkedin.com/in/raibikraminfo)
