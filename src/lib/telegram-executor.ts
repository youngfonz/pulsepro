import { prisma } from '@/lib/prisma'
import type { Command } from './telegram-commands'

// Maps chatId -> array of task IDs from last "tasks" query (for "done N" indexing)
const taskListCache = new Map<string, { ids: string[]; expires: number }>()

const CACHE_TTL = 15 * 60 * 1000 // 15 minutes

function cacheTaskList(chatId: string, ids: string[]) {
  taskListCache.set(chatId, { ids, expires: Date.now() + CACHE_TTL })
}

function getCachedTaskList(chatId: string): string[] | null {
  const entry = taskListCache.get(chatId)
  if (!entry || Date.now() > entry.expires) {
    taskListCache.delete(chatId)
    return null
  }
  return entry.ids
}

export async function executeCommand(
  command: Command,
  userId: string,
  chatId: string
): Promise<string> {
  switch (command.type) {
    case 'tasks':
      return handleTasks(userId, chatId)
    case 'today':
      return handleToday(userId, chatId)
    case 'overdue':
      return handleOverdue(userId, chatId)
    case 'bookmarks':
      return handleBookmarks(userId)
    case 'done':
      return handleDone(userId, chatId, command.index)
    case 'add':
      return handleAdd(userId, command.projectName, command.taskTitle)
    case 'help':
      return handleHelp()
    case 'unknown':
      return `I didn't understand that. Send <b>help</b> to see available commands.`
  }
}

async function handleTasks(userId: string, chatId: string): Promise<string> {
  const tasks = await prisma.task.findMany({
    where: { userId, status: { not: 'done' }, url: null },
    include: { project: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  if (tasks.length === 0) {
    return `No pending tasks. You're all caught up!`
  }

  cacheTaskList(chatId, tasks.map((t) => t.id))

  const lines = tasks.map(
    (t, i) => `${i + 1}. ${t.title}\n   <i>${t.project?.name ?? 'Quick task'}</i>`
  )
  return `<b>Pending Tasks</b>\n\n${lines.join('\n\n')}\n\nReply <b>done N</b> to mark one complete.`
}

async function handleToday(userId: string, chatId: string): Promise<string> {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd = new Date(todayStart)
  todayEnd.setDate(todayEnd.getDate() + 1)

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      status: { not: 'done' },
      url: null,
      dueDate: { gte: todayStart, lt: todayEnd },
    },
    include: { project: { select: { name: true } } },
    orderBy: { priority: 'desc' },
    take: 10,
  })

  if (tasks.length === 0) {
    return `Nothing due today. Nice!`
  }

  cacheTaskList(chatId, tasks.map((t) => t.id))

  const lines = tasks.map(
    (t, i) => `${i + 1}. ${t.title}\n   <i>${t.project?.name ?? 'Quick task'}</i>`
  )
  return `<b>Due Today</b>\n\n${lines.join('\n\n')}\n\nReply <b>done N</b> to mark one complete.`
}

async function handleOverdue(userId: string, chatId: string): Promise<string> {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      status: { not: 'done' },
      url: null,
      dueDate: { lt: todayStart },
    },
    include: { project: { select: { name: true } } },
    orderBy: { dueDate: 'asc' },
    take: 10,
  })

  if (tasks.length === 0) {
    return `No overdue tasks. You're on track!`
  }

  cacheTaskList(chatId, tasks.map((t) => t.id))

  const lines = tasks.map((t, i) => {
    const days = Math.floor(
      (todayStart.getTime() - new Date(t.dueDate!).getTime()) /
        (1000 * 60 * 60 * 24)
    )
    return `${i + 1}. ${t.title} (${days}d overdue)\n   <i>${t.project?.name ?? 'Quick task'}</i>`
  })
  return `<b>Overdue Tasks</b>\n\n${lines.join('\n\n')}\n\nReply <b>done N</b> to mark one complete.`
}

async function handleBookmarks(userId: string): Promise<string> {
  const bookmarks = await prisma.task.findMany({
    where: { userId, url: { not: null } },
    include: { project: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  if (bookmarks.length === 0) {
    return `No bookmarks saved yet.`
  }

  const lines = bookmarks.map(
    (b, i) => `${i + 1}. <a href="${b.url}">${b.title}</a>\n   <i>${b.project?.name ?? 'Quick task'}</i>`
  )
  return `<b>Recent Bookmarks</b>\n\n${lines.join('\n\n')}`
}

async function handleDone(
  userId: string,
  chatId: string,
  index: number
): Promise<string> {
  const cached = getCachedTaskList(chatId)

  if (!cached) {
    return `Send <b>tasks</b> first to get a numbered list, then use <b>done N</b>.`
  }

  if (index < 1 || index > cached.length) {
    return `Invalid number. Pick between 1 and ${cached.length}.`
  }

  const taskId = cached[index - 1]

  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  })

  if (!task) {
    return `Task not found. Try sending <b>tasks</b> again.`
  }

  if (task.status === 'done') {
    return `"${task.title}" is already marked complete.`
  }

  await prisma.task.update({
    where: { id: taskId },
    data: { status: 'done' },
  })

  return `Done! "<b>${task.title}</b>" marked complete.`
}

async function handleAdd(
  userId: string,
  projectName: string,
  taskTitle: string
): Promise<string> {
  // Check plan limits
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })
  const plan = subscription?.plan || 'free'
  if (plan === 'free') {
    const taskCount = await prisma.task.count({ where: { userId } })
    if (taskCount >= 50) {
      return `You've hit the free plan limit (50 tasks). Upgrade to Pro for unlimited tasks.`
    }
  }

  // If no project name provided, create a standalone task
  if (!projectName) {
    const task = await prisma.task.create({
      data: {
        title: taskTitle,
        userId,
      },
    })
    return `Task "<b>${task.title}</b>" added.`
  }

  // Find project by name (case-insensitive)
  const project = await prisma.project.findFirst({
    where: {
      userId,
      name: { equals: projectName, mode: 'insensitive' },
    },
  })

  if (!project) {
    return `Project "${projectName}" not found. Check the name and try again.`
  }

  const task = await prisma.task.create({
    data: {
      title: taskTitle,
      projectId: project.id,
      userId,
    },
  })

  return `Task "<b>${task.title}</b>" added to ${project.name}.`
}

function handleHelp(): string {
  return [
    `<b>Pulse Pro Bot Commands</b>`,
    ``,
    `<b>tasks</b> — List pending tasks`,
    `<b>today</b> — Tasks due today`,
    `<b>overdue</b> — Overdue tasks`,
    `<b>bookmarks</b> — Recent bookmarks`,
    `<b>done N</b> — Mark task #N complete`,
    `<b>add Title</b> — Create a standalone task`,
    `<b>add Project: Title</b> — Create a task in a project`,
    `<b>help</b> — Show this message`,
  ].join('\n')
}
