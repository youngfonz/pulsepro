import Link from 'next/link'
import { getProjectsForGantt } from '@/actions/projects'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { GanttChart } from './GanttChart'

export default async function GanttPage() {
  const projects = await getProjectsForGantt()

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="mt-2 text-xl md:text-2xl font-bold text-foreground">Gantt Chart</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <GanttChart projects={projects} />
        </CardContent>
      </Card>
    </div>
  )
}
