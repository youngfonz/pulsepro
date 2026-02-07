'use client'

import { useState, useEffect } from 'react'
import { createBookmarkTask, getAllTags } from '@/actions/tasks'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { TagInput } from '@/components/ui/TagInput'
import { Loader2, ExternalLink, Youtube, Twitter } from 'lucide-react'

interface Project {
  id: string
  name: string
  client: { name: string }
}

interface BookmarkMetadata {
  title: string
  description?: string
  thumbnailUrl?: string
  type: 'youtube' | 'twitter'
}

export function AddBookmarkButton({ projects }: { projects: Project[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [projectId, setProjectId] = useState('')
  const [url, setUrl] = useState('')
  const [metadata, setMetadata] = useState<BookmarkMetadata | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [manualTitle, setManualTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      getAllTags().then(setAllTags)
    }
  }, [isOpen])

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname.toLowerCase()
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return true
      if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
        return urlObj.pathname.includes('/status/')
      }
      return false
    } catch {
      return false
    }
  }

  const fetchMetadata = async () => {
    if (!url.trim()) return
    if (!validateUrl(url)) {
      setError('Please enter a valid YouTube or X (Twitter) URL')
      return
    }

    setLoading(true)
    setError(null)
    setMetadata(null)

    try {
      const response = await fetch('/api/bookmark-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await response.json()

      if (response.ok) {
        if (data.error) {
          setError(data.error)
          if (data.fallback) setMetadata(data.fallback)
        } else {
          setMetadata(data)
          setManualTitle(data.title)
        }
      } else {
        setError(data.error || 'Failed to fetch metadata')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url || !metadata || !projectId) {
      setError('Please select a project and enter a valid URL')
      return
    }
    if (!manualTitle.trim()) {
      setError('Please provide a title for the bookmark')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await createBookmarkTask(projectId, {
        url,
        title: manualTitle,
        description: metadata.description,
        thumbnailUrl: metadata.thumbnailUrl,
        bookmarkType: metadata.type,
        tags,
        notes: notes || undefined,
      })
      handleClose()
    } catch {
      setError('Failed to create bookmark. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setProjectId('')
    setUrl('')
    setMetadata(null)
    setManualTitle('')
    setTags([])
    setNotes('')
    setError(null)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Bookmark
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} title="Add Bookmark" className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            id="projectId"
            label="Project *"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            options={[
              { value: '', label: 'Select a project...' },
              ...projects.map((p) => ({ value: p.id, label: `${p.name} (${p.client.name})` })),
            ]}
          />

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-foreground mb-1">
              YouTube or X URL *
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(null) }}
                onBlur={() => url && !metadata && fetchMetadata()}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 p-2 border border-input rounded-md text-sm bg-background text-foreground placeholder:text-muted-foreground"
                disabled={loading || submitting}
              />
              <button
                type="button"
                onClick={fetchMetadata}
                disabled={!url || loading || submitting}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Fetch'}
              </button>
            </div>
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>

          {metadata && (
            <>
              <div className="p-3 border border-border rounded-md bg-secondary/30">
                <div className="flex items-start gap-3">
                  {metadata.thumbnailUrl && (
                    <img src={metadata.thumbnailUrl} alt="" className="w-20 h-20 object-cover rounded" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {metadata.type === 'youtube' ? (
                        <Youtube className="w-4 h-4 text-red-500" />
                      ) : (
                        <Twitter className="w-4 h-4 text-foreground" />
                      )}
                      <span className="text-xs font-medium text-muted-foreground uppercase">{metadata.type}</span>
                    </div>
                    <input
                      type="text"
                      value={manualTitle}
                      onChange={(e) => setManualTitle(e.target.value)}
                      placeholder="Edit title..."
                      className="w-full p-2 border border-input rounded text-sm font-medium bg-background text-foreground"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Tags</label>
                <TagInput value={tags} onChange={setTags} suggestions={allTags} placeholder="Add tags..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes..."
                  rows={2}
                  className="w-full p-2 border border-input rounded-md text-sm bg-background text-foreground placeholder:text-muted-foreground"
                  disabled={submitting}
                />
              </div>
            </>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={submitting || !manualTitle.trim() || !projectId}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : 'Add Bookmark'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2 border border-border rounded-md hover:bg-secondary text-foreground disabled:opacity-50 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
