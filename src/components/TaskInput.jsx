import { useState } from "react";
import { Plus } from "lucide-react";

const PRIORITIES = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export default function TaskInput({ onAdd }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, priority);
    setText("");
    setPriority("medium");
  };

  return (
    <form className="kb-task-input" onSubmit={submit} data-testid="task-input-form">
      <input
        type="text"
        className="kb-text-field"
        placeholder="What needs doing?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        data-testid="task-input-text"
      />

      <div className={`kb-priority-select priority-${priority}`}>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          data-testid="task-input-priority"
          aria-label="Task priority"
        >
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="kb-add-btn" data-testid="task-add-btn">
        <Plus size={16} strokeWidth={2.4} />
        <span>Add task</span>
      </button>
    </form>
  );
}