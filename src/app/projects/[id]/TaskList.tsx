'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { toggleTask, deleteTask, updateTask, addTaskImage, removeTaskImage, addTaskFile, removeTaskFile } from '@/actions/tasks'
import { priorityColors, priorityLabels, formatDate, isOverdue, formatFileSize, getFileIcon } from '@/lib/utils'

interface TaskImage {
  id: string
  path: string
  name: string
}

interface TaskFile {
  id: string
  path: string
  name: string
  type: string
  size: number
}

interface Task {
  id: string
  title: string
  description: string | null
  notes: string | null
  completed: boolean
  priority: string
  startDate: Date | null
  dueDate: Date | null
  images: TaskImage[]
  files: TaskFile[]
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No tasks yet. Add your first task above.
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  )
}

function TaskItem({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition()
  const [isEditing, setIsEditing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const overdue = isOverdue(task.dueDate) && !task.completed

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTask(task.id)
    })
  }

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this task?')) return
    startTransition(async () => {
      await deleteTask(task.id)
    })
  }

  const formatDateForInput = (date: Date | null) => {
    if (!date) return ''
    return new Date(date).toISOString().split('T')[0]
  }

  return (
    <>
      <div className={`py-3 ${isPending ? 'opacity-50' : ''}`}>
        <div className="flex items-start gap-3">
          <button
            onClick={handleToggle}
            className={`mt-0.5 h-5 w-5 flex-shrink-0 rounded border-2 transition-colors ${
              task.completed
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : 'border-border hover:border-primary'
            }`}
          >
            {task.completed && (
              <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`font-medium text-left ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'} hover:text-link`}
              >
                {task.title}
              </button>
              <Badge className={`${priorityColors[task.priority]} text-xs`}>
                {priorityLabels[task.priority]}
              </Badge>
              {task.images.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {task.images.length} image{task.images.length > 1 ? 's' : ''}
                </span>
              )}
              {task.files.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {task.files.length} file{task.files.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            {task.dueDate && (
              <p className={`text-xs sm:text-sm ${overdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                {task.startDate && `${formatDate(task.startDate)} - `}Due: {formatDate(task.dueDate)}
                {overdue && ' (Overdue)'}
              </p>
            )}
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="flex-shrink-0 p-1 text-muted-foreground hover:text-link transition-colors"
            title="Edit task"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="flex-shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors"
            title="Delete task"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Expanded view with description, notes, images, and files */}
        {isExpanded && (
          <div className="mt-3 ml-8 space-y-3">
            {task.description && (
              <p className="text-sm text-muted-foreground">{task.description}</p>
            )}
            {task.notes && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Notes</p>
                <p className="text-sm text-foreground whitespace-pre-wrap bg-muted/50  p-2">{task.notes}</p>
              </div>
            )}
            {task.images.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Images</p>
                <div className="flex flex-wrap gap-2">
                  {task.images.map((image) => (
                    <div key={image.id} className="relative h-20 w-20 overflow-hidden  border border-border">
                      <Image src={image.path} alt={image.name} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {task.files.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Files</p>
                <div className="space-y-1">
                  {task.files.map((file) => (
                    <a
                      key={file.id}
                      href={file.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2  border border-border bg-muted/50 px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <span className="text-lg">{getFileIcon(file.type)}</span>
                      <span className="flex-1 truncate text-foreground">{file.name}</span>
                      <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Task"
        className="max-w-lg"
      >
        <TaskEditForm
          task={task}
          onClose={() => setIsEditing(false)}
        />
      </Modal>
    </>
  )
}

function TaskEditForm({ task, onClose }: { task: Task; onClose: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [images, setImages] = useState<TaskImage[]>(task.images)
  const [files, setFiles] = useState<TaskFile[]>(task.files)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isUploadingFile, setIsUploadingFile] = useState(false)

  const formatDateForInput = (date: Date | null) => {
    if (!date) return ''
    return new Date(date).toISOString().split('T')[0]
  }

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      await updateTask(task.id, formData)
      onClose()
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    setIsUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'tasks')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      await addTaskImage(task.id, data.path, data.name)
      setImages([...images, { id: Date.now().toString(), path: data.path, name: data.name }])
    } catch (err) {
      alert('Failed to upload image')
    } finally {
      setIsUploadingImage(false)
      e.target.value = ''
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingFile(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'task-files')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      await addTaskFile(task.id, data.path, data.name, data.type, data.size)
      setFiles([...files, { id: Date.now().toString(), path: data.path, name: data.name, type: data.type, size: data.size }])
    } catch (err) {
      alert('Failed to upload file')
    } finally {
      setIsUploadingFile(false)
      e.target.value = ''
    }
  }

  const handleRemoveImage = async (imageId: string) => {
    startTransition(async () => {
      await removeTaskImage(imageId)
      setImages(images.filter((img) => img.id !== imageId))
    })
  }

  const handleRemoveFile = async (fileId: string) => {
    startTransition(async () => {
      await removeTaskFile(fileId)
      setFiles(files.filter((f) => f.id !== fileId))
    })
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <Input
        id="title"
        name="title"
        label="Title *"
        required
        defaultValue={task.title}
      />
      <Textarea
        id="description"
        name="description"
        label="Description"
        rows={3}
        defaultValue={task.description || ''}
      />
      <Textarea
        id="notes"
        name="notes"
        label="Notes"
        rows={4}
        defaultValue={task.notes || ''}
        placeholder="Add any additional notes..."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          id="priority"
          name="priority"
          label="Priority"
          defaultValue={task.priority}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
        />
        <Input
          id="startDate"
          name="startDate"
          type="date"
          label="Start Date"
          defaultValue={formatDateForInput(task.startDate)}
        />
      </div>
      <Input
        id="dueDate"
        name="dueDate"
        type="date"
        label="Due Date"
        defaultValue={formatDateForInput(task.dueDate)}
      />

      {/* Task Images */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Images</label>
        <div className="flex flex-wrap gap-2">
          {images.map((image) => (
            <div key={image.id} className="relative h-20 w-20 overflow-hidden  border border-border">
              <Image src={image.path} alt={image.name} fill className="object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(image.id)}
                className="absolute right-1 top-1  bg-destructive p-0.5 text-white hover:bg-destructive/80"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <label className={`flex h-20 w-20 cursor-pointer flex-col items-center justify-center  border-2 border-dashed border-border text-muted-foreground hover:border-muted-foreground ${isUploadingImage ? 'opacity-50' : ''}`}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs">{isUploadingImage ? 'Uploading...' : 'Add'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isUploadingImage}
            />
          </label>
        </div>
      </div>

      {/* Task Files */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Files</label>
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center gap-2  border border-border bg-muted/50 px-3 py-2">
              <span className="text-lg">{getFileIcon(file.type)}</span>
              <span className="flex-1 truncate text-sm text-foreground">{file.name}</span>
              <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
              <button
                type="button"
                onClick={() => handleRemoveFile(file.id)}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <label className={`flex cursor-pointer items-center justify-center gap-2  border-2 border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-muted-foreground ${isUploadingFile ? 'opacity-50' : ''}`}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>{isUploadingFile ? 'Uploading...' : 'Add file (PDF, MD, DOC, etc.)'}</span>
            <input
              type="file"
              accept=".pdf,.md,.doc,.docx,.txt,.rtf,.xls,.xlsx,.csv,.ppt,.pptx,.zip"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploadingFile}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row">
        <Button type="button" variant="secondary" onClick={onClose} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
