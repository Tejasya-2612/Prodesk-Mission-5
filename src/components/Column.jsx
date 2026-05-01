import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import { Inbox } from "lucide-react";

export default function Column({
  id,
  title,
  accent,
  tasks,
  count,
  visibleCount,
  isFiltered,
  onDelete,
  onUpdate,
  onMoveNext,
  isLast,
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <section
      ref={setNodeRef}
      className={`kb-column ${isOver ? "is-over" : ""}`}
      data-testid={`column-${id}`}
    >
      <header className={`kb-column-head ${accent}`}>
        <div className="kb-column-head-left">
          <span className="kb-column-dot" aria-hidden="true" />
          <h2 className="kb-column-title">{title}</h2>
        </div>
        <span className="kb-column-count" data-testid={`column-count-${id}`}>
          {isFiltered ? `${visibleCount}/${count}` : count}
        </span>
      </header>

      <div className="kb-column-body">
        {tasks.length === 0 ? (
          <div className="kb-empty" data-testid={`column-empty-${id}`}>
            <Inbox size={18} strokeWidth={1.6} />
            <p>{isFiltered ? "No matches in this column" : "No tasks here"}</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onMoveNext={onMoveNext}
              canMoveNext={!isLast}
            />
          ))
        )}
      </div>
    </section>
  );
}