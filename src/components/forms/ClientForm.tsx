'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { UpgradePrompt, isLimitError } from '@/components/ui/UpgradePrompt'
import { createClient, updateClient } from '@/actions/clients'
import { useRouter } from 'next/navigation'

interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  logo: string | null
  status: string
  notes: string | null
}

interface ClientFormProps {
  client?: Client
  onSuccess?: () => void
}

export function ClientForm({ client, onSuccess }: ClientFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [logo, setLogo] = useState<string | null>(client?.logo || null)
  const [limitMessage, setLimitMessage] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    if (logo) {
      formData.set('logo', logo)
    } else {
      formData.delete('logo')
    }

    startTransition(async () => {
      try {
        if (client) {
          await updateClient(client.id, formData)
        } else {
          await createClient(formData)
        }
        setLimitMessage(null)
        if (onSuccess) {
          onSuccess()
        } else {
          router.push('/clients')
        }
      } catch (error) {
        const msg = isLimitError(error)
        if (msg) {
          setLimitMessage(msg)
        }
      }
    })
  }

  if (limitMessage) {
    return <UpgradePrompt message={limitMessage} onDismiss={() => setLimitMessage(null)} />
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <ImageUpload
        value={logo}
        onChange={setLogo}
        type="clients"
        label="Logo"
        aspect="square"
      />
      <Input
        id="name"
        name="name"
        label="Name *"
        required
        defaultValue={client?.name}
        placeholder="Client name"
      />
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        defaultValue={client?.email || ''}
        placeholder="client@example.com"
      />
      <Input
        id="phone"
        name="phone"
        label="Phone"
        defaultValue={client?.phone || ''}
        placeholder="+1 (555) 000-0000"
      />
      <Input
        id="company"
        name="company"
        label="Company"
        defaultValue={client?.company || ''}
        placeholder="Company name"
      />
      <Select
        id="status"
        name="status"
        label="Status"
        defaultValue={client?.status || 'active'}
        options={[
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ]}
      />
      <Textarea
        id="notes"
        name="notes"
        label="Notes"
        rows={3}
        defaultValue={client?.notes || ''}
        placeholder="Additional notes..."
      />
      <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row">
        <Button type="button" variant="secondary" onClick={() => router.back()} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? 'Saving...' : client ? 'Update Client' : 'Create Client'}
        </Button>
      </div>
    </form>
  )
}
