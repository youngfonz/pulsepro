export type Command =
  | { type: 'tasks' }
  | { type: 'today' }
  | { type: 'overdue' }
  | { type: 'done'; index: number }
  | { type: 'add'; projectName: string; taskTitle: string }
  | { type: 'help' }
  | { type: 'unknown' }

export function parseCommand(text: string): Command {
  const trimmed = text.trim().toLowerCase()

  if (trimmed === 'tasks' || trimmed === '/tasks') {
    return { type: 'tasks' }
  }

  if (trimmed === 'today' || trimmed === '/today') {
    return { type: 'today' }
  }

  if (trimmed === 'overdue' || trimmed === '/overdue') {
    return { type: 'overdue' }
  }

  if (trimmed === 'help' || trimmed === '/help') {
    return { type: 'help' }
  }

  // "done 3" or "/done 3"
  const doneMatch = trimmed.match(/^\/?(done)\s+(\d+)$/)
  if (doneMatch) {
    return { type: 'done', index: parseInt(doneMatch[2], 10) }
  }

  // "add ProjectName: Task title" or "/add ProjectName: Task title"
  const addMatch = text.trim().match(/^\/?(add)\s+(.+?):\s+(.+)$/i)
  if (addMatch) {
    return { type: 'add', projectName: addMatch[2].trim(), taskTitle: addMatch[3].trim() }
  }

  return { type: 'unknown' }
}
