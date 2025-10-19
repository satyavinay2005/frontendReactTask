import React, { useEffect, useState } from 'react'
import { Layout, Typography, Divider, message } from 'antd'
import TaskForm from './components/TaskForm'
import TaskTable from './components/TaskTable'
import { listTasks } from './api'
import { Task } from './models'

const { Header, Content } = Layout
const { Title } = Typography

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const t = await listTasks()
      setTasks(t)
    } catch (err: any) {
      message.error(err?.response?.data?.error || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <Layout className="app-container">
      <Header style={{ background: 'transparent', padding: 0 }}>
        <Title level={3}>Task Executor UI</Title>
      </Header>
      <Content>
        <section aria-labelledby="create-task">
          <Title level={5} id="create-task">Create / Update Task</Title>
          <TaskForm onSaved={() => load()} />
        </section>
        <Divider />
        <section aria-labelledby="list-tasks">
          <Title level={5} id="list-tasks">Tasks</Title>
          <TaskTable tasks={tasks} onRefresh={load} />
        </section>
      </Content>
    </Layout>
  )
}
