export interface Task {
  id: string
  name: string
  owner?: string
  command?: string
  taskExecutions?: TaskExecution[]
}

export interface TaskExecution {
  timestamp: string
  exitCode?: number
  stdout?: string
  stderr?: string
}
