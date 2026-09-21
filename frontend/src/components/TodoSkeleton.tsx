function TodoSkeleton() {
  return (
    <div className="todo-skeleton" aria-hidden="true">
      <div className="todo-skeleton__main">
        <div className="skeleton skeleton--circle" />

        <div className="todo-skeleton__content">
          <div className="skeleton skeleton--title" />
          <div className="skeleton skeleton--description" />
          <div className="skeleton skeleton--meta" />
        </div>

        <div className="skeleton skeleton--badge" />
      </div>

      <div className="todo-skeleton__footer">
        <div className="skeleton skeleton--action" />
        <div className="skeleton skeleton--action skeleton--short" />
      </div>
    </div>
  );
}

export default TodoSkeleton;