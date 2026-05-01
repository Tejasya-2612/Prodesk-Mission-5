import { useState, useRef, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { X, ArrowRight, GripVertical } from "lucide-react";

export default function TaskCard({
  task,
  onDelete,
  onUpdate,
  onMoveNext,
  canMoveNext,
  overlay = false,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);
  const inputRef = useRef(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    disabled: overlay || editing,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.35 : 1,
  };

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    setDraft(task.text);
  }, [task.text]);

  const commit = () => {
    setEditing(false);
    if (draft !== task.text) onUpdate?.(task.id, draft);
  };

  const cancel = () => {
    setDraft(task.text);
    setEditing(false);
  };

  const priorityClass = `kb-card priority-${task.priority}${
    overlay ? " is-overlay" : ""
  }`;

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={priorityClass}
      data-testid={`task-card-${task.id}`}
      data-priority={task.priority}
    >
      {!overlay && (
        <button
          type="button"
          className="kb-drag-handle"
          aria-label="Drag task"
          {...listeners}
          {...attributes}
          data-testid={`task-drag-${task.id}`}
        >
          <GripVertical size={14} />
        </button>
      )}

      <div className="kb-card-body">
        {editing ? (
          <input
            ref={inputRef}
            className="kb-card-edit"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") cancel();
            }}
            data-testid={`task-edit-input-${task.id}`}
          />
        ) : (
          <button
            type="button"
            className="kb-card-text"
            onClick={() => !overlay && setEditing(true)}
            data-testid={`task-text-${task.id}`}
          >
            {task.text}
          </button>
        )}

        <div className="kb-card-meta">
          <span className={`kb-pill pill-${task.priority}`}>{task.priority}</span>
        </div>
      </div>

      {!overlay && (
        <div className="kb-card-actions">
          {canMoveNext && (
            <button
              type="button"
              className="kb-icon-btn"
              onClick={() => onMoveNext?.(task.id)}
              aria-label="Move to next column"
              title="Move to next column"
              data-testid={`task-move-${task.id}`}
            >
              <ArrowRight size={14} />
            </button>
          )}
          <button
            type="button"
            className="kb-icon-btn kb-icon-danger"
            onClick={() => onDelete?.(task.id)}
            aria-label="Delete task"
            title="Delete task"
            data-testid={`task-delete-${task.id}`}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </article>
  );
}