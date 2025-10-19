import axios from 'axios'
import { Task, TaskExecution } from './models'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

export async function listTasks(): Promise<Task[]> {
  const resp = await axios.get(`${API_BASE}/tasks`)
  return resp.data
}

export async function getTask(id: string): Promise<Task> {
  const resp = await axios.get(`${API_BASE}/tasks/${id}`)
  return resp.data
}

export async function upsertTask(t: Task): Promise<Task> {
  const resp = await axios.put(`${API_BASE}/tasks`, t)
  return resp.data
}

export async function deleteTask(id: string): Promise<void> {
  await axios.delete(`${API_BASE}/tasks/${id}`)
}

export async function searchTasksByName(q: string): Promise<Task[]> {
  const resp = await axios.get(`${API_BASE}/tasks/search`, { params: { name: q } })
  return resp.data
}

export async function executeTask(id: string, commandOverride?: string): Promise<TaskExecution> {
  const body = commandOverride ? { command: commandOverride } : {}
  const resp = await axios.put(`${API_BASE}/tasks/${id}/execute`, body)
  return resp.data
}
