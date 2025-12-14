import { apiClient } from './axios'
import type { ApiResponse } from '@/types'

export interface JobInfo {
  name: string
  description: string
  cronExpression: string
  isRunning: boolean
  lastRun?: string
  nextRun?: string
  enabled: boolean
}

export interface UpdateJobScheduleRequest {
  cronExpression: string
}

export interface TriggerJobResponse {
  message: string
  jobInfo: JobInfo
}

export const jobsApi = {
  getAllJobs: async (): Promise<JobInfo[]> => {
    const response = await apiClient.get<ApiResponse<JobInfo[]>>('/admin/jobs')
    return response.data.data || response.data
  },

  getJob: async (name: string): Promise<JobInfo> => {
    const response = await apiClient.get<ApiResponse<JobInfo>>(
      `/admin/jobs/${name}`
    )
    return response.data.data || response.data
  },

  updateJobSchedule: async (
    name: string,
    updateDto: UpdateJobScheduleRequest
  ): Promise<JobInfo> => {
    const response = await apiClient.put<ApiResponse<JobInfo>>(
      `/admin/jobs/${name}/schedule`,
      updateDto
    )
    return response.data.data || response.data
  },

  triggerJob: async (name: string): Promise<TriggerJobResponse> => {
    const response = await apiClient.post<ApiResponse<TriggerJobResponse>>(
      `/admin/jobs/${name}/trigger`
    )
    return response.data.data || response.data
  },
}
