export type Command =
  | { type: 'tasks' }
  | { type: 'today' }
  | { type: 'overdue' }
  | { type: 'bookmarks' }
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

  if (trimmed === 'bookmarks' || trimmed === '/bookmarks') {
    return { type: 'bookmarks' }
  }

  if (trimmed === 'help' || trimmed === '/help') {
    return { type: 'help' }
  }

  // "done 3" or "/done 3"
  const doneMatch = trimmed.match(/^\/?(done)\s+(\d+)$/)
  if (doneMatch) {
    return { type: 'done', index: parseInt(doneMatch[2], 10) }
  }

  // "add Project: Title" or "/add Project: Title" — with project
  const addWithProjectMatch = text.trim().match(/^\/?(add)\s+(.+?):\s+(.+)$/i)
  if (addWithProjectMatch) {
    return { type: 'add', projectName: addWithProjectMatch[2].trim(), taskTitle: addWithProjectMatch[3].trim() }
  }

  // "add Title" or "/add Title" — standalone task (no project)
  const addStandaloneMatch = text.trim().match(/^\/?(add)\s+(.+)$/i)
  if (addStandaloneMatch) {
    return { type: 'add', projectName: '', taskTitle: addStandaloneMatch[2].trim() }
  }

  return { type: 'unknown' }
}
