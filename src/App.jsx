import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import Column from "./components/Column";
import TaskCard from "./components/TaskCard";
import TaskInput from "./components/TaskInput";
import SearchBar from "./components/SearchBar";
import { Moon, Sun, Kanban } from "lucide-react";
import { Toaster, toast } from "sonner";
import "./App.css";

// Column definitions — single source of truth for labels and order
const COLUMNS = [
  { id: "todo", title: "To Do", accent: "accent-todo" },
  { id: "inprogress", title: "In Progress", accent: "accent-progress" },
  { id: "done", title: "Done", accent: "accent-done" },
];

const STORAGE_KEY = "kanban.tasks.v1";
const THEME_KEY = "kanban.theme.v1";

function App() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted tasks + theme on first mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(saved)) setTasks(saved);
    } catch {
      /* corrupted storage — start fresh */
    }
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark") setDark(true);
    setHydrated(true);
  }, []);

  // Persist tasks whenever they change (skip the initial hydration write)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, hydrated]);

  // Toggle dark-mode class on <html> and persist choice
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    if (hydrated) localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark, hydrated]);

  // Sensors: PointerSensor with a small activation distance prevents click/edit conflicts
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  // CRUD handlers
  const addTask = (text, priority) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newTask = {
      id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      text: trimmed,
      status: "todo",
      priority,
    };
    setTasks((prev) => [newTask, ...prev]);
    toast.success("Task added");
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast("Task deleted");
  };

  const updateTaskText = (id, text) => {
    const trimmed = text.trim();
    if (!trimmed) {
      deleteTask(id);
      return;
    }
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t)));
  };

  const moveNext = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const idx = COLUMNS.findIndex((c) => c.id === t.status);
        const next = COLUMNS[Math.min(idx + 1, COLUMNS.length - 1)];
        return { ...t, status: next.id };
      })
    );
  };

  const handleDragStart = (event) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;
    const overId = over.id;
    const destStatus = COLUMNS.find((c) => c.id === overId)
      ? overId
      : tasks.find((t) => t.id === overId)?.status;
    if (!destStatus) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === active.id ? { ...t, status: destStatus } : t))
    );
  };

  const filteredTasks = tasks.filter((t) =>
    t.text.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="kb-shell" data-testid="app-root">
      <Toaster
        position="bottom-right"
        theme={dark ? "dark" : "light"}
        toastOptions={{ className: "kb-toast" }}
      />

      <header className="kb-header">
        <div className="kb-brand">
          <div className="kb-brand-mark" aria-hidden="true">
            <Kanban size={22} strokeWidth={2.4} />
          </div>
          <div className="kb-brand-text">
            <h1 className="kb-title">Flowboard</h1>
            <p className="kb-subtitle">A tiny kanban that keeps up with you.</p>
          </div>
        </div>

        <button
          type="button"
          className="kb-theme-toggle"
          onClick={() => setDark((d) => !d)}
          aria-label="Toggle dark mode"
          data-testid="theme-toggle-btn"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
          <span>{dark ? "Light" : "Dark"}</span>
        </button>
      </header>

      <section className="kb-controls">
        <TaskInput onAdd={addTask} />
        <SearchBar value={search} onChange={setSearch} />
      </section>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveTask(null)}
      >
        <main className="kb-board" data-testid="kanban-board">
          {COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            const totalInColumn = tasks.filter((t) => t.status === col.id).length;
            return (
              <Column
                key={col.id}
                id={col.id}
                title={col.title}
                accent={col.accent}
                tasks={colTasks}
                count={totalInColumn}
                visibleCount={colTasks.length}
                isFiltered={search.trim().length > 0}
                onDelete={deleteTask}
                onUpdate={updateTaskText}
                onMoveNext={moveNext}
                isLast={col.id === COLUMNS[COLUMNS.length - 1].id}
              />
            );
          })}
        </main>

        <DragOverlay dropAnimation={{ duration: 180 }}>
          {activeTask ? (
            <div className="kb-drag-overlay">
              <TaskCard task={activeTask} overlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <footer className="kb-footer">
        <span>
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"} · stored locally in your browser
        </span>
      </footer>
    </div>
  );
}

export default App;