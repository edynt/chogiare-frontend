import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { jobsApi, type JobInfo } from '@/api/jobs'
import { Clock, Play, Save, RefreshCw, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminJobsPage() {
  const queryClient = useQueryClient()
  const [editingJob, setEditingJob] = useState<string | null>(null)
  const [cronExpressions, setCronExpressions] = useState<Record<string, string>>({})

  const { data: jobs = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: () => jobsApi.getAllJobs(),
  })

  const updateScheduleMutation = useMutation({
    mutationFn: ({ name, cronExpression }: { name: string; cronExpression: string }) =>
      jobsApi.updateJobSchedule(name, { cronExpression }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })
      setEditingJob(null)
      toast.success('Job schedule updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update job schedule')
    },
  })

  const triggerJobMutation = useMutation({
    mutationFn: (name: string) => jobsApi.triggerJob(name),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })
      toast.success(data.message)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to trigger job')
    },
  })

  useEffect(() => {
    if (jobs.length > 0) {
      const initialCronExpressions: Record<string, string> = {}
      jobs.forEach((job) => {
        initialCronExpressions[job.name] = job.cronExpression
      })
      setCronExpressions(initialCronExpressions)
    }
  }, [jobs])

  const handleEdit = (job: JobInfo) => {
    setEditingJob(job.name)
    setCronExpressions((prev) => ({
      ...prev,
      [job.name]: job.cronExpression,
    }))
  }

  const handleCancel = () => {
    setEditingJob(null)
  }

  const handleSave = (name: string) => {
    const cronExpression = cronExpressions[name]
    if (!cronExpression || cronExpression.trim() === '') {
      toast.error('Cron expression cannot be empty')
      return
    }
    updateScheduleMutation.mutate({ name, cronExpression })
  }

  const handleTrigger = (name: string) => {
    if (confirm(`Are you sure you want to trigger job "${name}"?`)) {
      triggerJobMutation.mutate(name)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const getCronDescription = (cronExpression: string): string => {
    if (cronExpression === '0 2 * * *') return 'Every day at 2:00 AM'
    if (cronExpression === '0 3 * * *') return 'Every day at 3:00 AM'
    if (cronExpression === '0 4 * * *') return 'Every day at 4:00 AM'

    return cronExpression
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
          <p className="text-gray-600 mt-1">Manage scheduled jobs and their execution times</p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {jobs.map((job) => (
          <Card key={job.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{job.description}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">Job: {job.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {job.isRunning ? (
                    <Badge className="bg-blue-100 text-blue-800">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Running
                    </Badge>
                  ) : (
                    <Badge variant="outline">Idle</Badge>
                  )}
                  {job.enabled ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="outline">Disabled</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Cron Expression</Label>
                  {editingJob === job.name ? (
                    <div className="mt-1 space-y-2">
                      <Input
                        value={cronExpressions[job.name] || ''}
                        onChange={(e) =>
                          setCronExpressions((prev) => ({
                            ...prev,
                            [job.name]: e.target.value,
                          }))
                        }
                        placeholder="0 2 * * *"
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500">
                        Format: minute hour day month weekday (e.g., 0 2 * * *)
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave(job.name)}
                          disabled={updateScheduleMutation.isPending}
                        >
                          {updateScheduleMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </>
                          )}
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1">
                      <p className="font-mono text-sm bg-gray-50 p-2 rounded border">
                        {job.cronExpression}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {getCronDescription(job.cronExpression)}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => handleEdit(job)}
                      >
                        Edit Schedule
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Last Run</Label>
                    <p className="text-sm text-gray-900 mt-1">
                      {job.lastRun ? formatDate(job.lastRun) : 'Never'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Next Run</Label>
                    <p className="text-sm text-gray-900 mt-1">
                      {job.nextRun ? formatDate(job.nextRun) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t">
                <Button
                  variant="default"
                  onClick={() => handleTrigger(job.name)}
                  disabled={job.isRunning || (triggerJobMutation.isPending && triggerJobMutation.variables === job.name)}
                >
                  {triggerJobMutation.isPending && triggerJobMutation.variables === job.name ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Trigger Now
                    </>
                  )}
                </Button>
                {job.isRunning && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Job is currently running...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No jobs found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

