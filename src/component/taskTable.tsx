import React, { useMemo, useState } from 'react'
import { Table, Button, Input, Space, Popconfirm, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Task, TaskExecution } from '../models'
import { deleteTask, executeTask, searchTasksByName } from '../api'
import ExecutionModal from './ExecutionModal'
import { humanTime } from '../utils'

type Props = {
  tasks: Task[]
  onRefresh: () => void
}

export default function TaskTable({ tasks, onRefresh }: Props) {
  const [query, setQuery] = useState('')
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [execModalOpen, setExecModalOpen] = useState(false)
  const [currentExec, setCurrentExec] = useState<TaskExecution | undefined>(undefined)
  const [executingId, setExecutingId] = useState<string | null>(null)
  const [localData, setLocalData] = useState<Task[] | null>(null)

  const data = useMemo(() => (localData || tasks) || [], [localData, tasks])

  const columns: ColumnsType<Task> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 140 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Owner', dataIndex: 'owner', key: 'owner', width: 140 },
    { title: 'Command', dataIndex: 'command', key: 'command' },
    {
      title: 'Last Exec',
      key: 'lastexec',
      width: 180,
      render: (_v, record) => {
        const last = record.taskExecutions && record.taskExecutions[record.taskExecutions.length - 1]
        return last ? humanTime(last.timestamp) : '-'
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 260,
      render: (_v, record) => (
        <Space>
          <Button onClick={() => onRun(record.id)} loading={executingId === record.id}>Run</Button>
          <Button onClick={() => onShowLast(record)} aria-label={`View output for ${record.id}`}>View</Button>
          <Popconfirm title="Delete task?" onConfirm={() => onDelete(record.id)}>
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  async function onDelete(id: string) {
    try {
      await deleteTask(id)
      message.success('Deleted')
      onRefresh()
    } catch (err: any) {
      message.error(err?.response?.data?.error || err.message || 'Delete failed')
    }
  }

  async function onRun(id: string) {
    try {
      setExecutingId(id)
      const exec = await executeTask(id)
      setCurrentExec(exec)
      setExecModalOpen(true)
      onRefresh()
    } catch (err: any) {
      message.error(err?.response?.data?.error || err.message || 'Execution failed')
    } finally {
      setExecutingId(null)
    }
  }

  function onShowLast(task: Task) {
    const last = task.taskExecutions && task.taskExecutions[task.taskExecutions.length - 1]
    if (!last) {
      message.info('No executions yet')
      return
    }
    setCurrentExec(last)
    setExecModalOpen(true)
  }

  async function runSearch(val: string) {
    if (!val) {
      setLocalData(null)
      return
    }
    try {
      setLoadingSearch(true)
      const found = await searchTasksByName(val)
      setLocalData(found)
    } catch (err: any) {
      message.error(err?.response?.data?.error || 'Search failed')
    } finally {
      setLoadingSearch(false)
    }
  }

  return (
    <div>
      <Space style={{ marginBottom: 12 }}>
        <Input.Search
          placeholder="Search by name"
          enterButton
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSearch={async (val) => {
            setQuery(val)
            await runSearch(val)
          }}
          loading={loadingSearch}
        />
        <Button onClick={() => { setQuery(''); setLocalData(null); onRefresh() }}>Reset</Button>
      </Space>

      <Table columns={columns} dataSource={data as any} rowKey="id" pagination={{ pageSize: 5 }} />

      <ExecutionModal open={execModalOpen} onClose={() => setExecModalOpen(false)} exec={currentExec} />
    </div>
  )
}
