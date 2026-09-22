export function formatDueDate(value: string): string {
  const date = new Date(value);

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  const dueDate = new Date(year, month, day);

  const today = new Date();
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const differenceInDays = Math.round(
    (dueDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (differenceInDays < 0) {
    return `Overdue · ${dueDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })}`;
  }

  if (differenceInDays === 0) {
    return "Due today";
  }

  if (differenceInDays === 1) {
    return "Due tomorrow";
  }

  return `Due ${dueDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })}`;
}