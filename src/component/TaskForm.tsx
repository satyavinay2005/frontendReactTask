import React from 'react'
import { Form, Input, Button, Space, message } from 'antd'
import { Task } from '../models'
import { upsertTask } from '../api'

type Props = {
  onSaved?: (t: Task) => void
}

export default function TaskForm({ onSaved }: Props) {
  const [form] = Form.useForm()

  async function onFinish(values: any) {
    const task: Task = {
      id: String(values.id).trim(),
      name: String(values.name).trim(),
      owner: values.owner?.trim(),
      command: values.command?.trim()
    }
    try {
      const saved = await upsertTask(task)
      message.success('Task saved')
      form.resetFields()
      onSaved?.(saved)
    } catch (err: any) {
      message.error(err?.response?.data?.error || err.message || 'Save failed')
    }
  }

  return (
    <div aria-label="Create task form">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Task ID" name="id" rules={[{ required: true, message: 'Provide task id' }]}>
          <Input aria-label="Task ID" />
        </Form.Item>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}> 
          <Input aria-label="Task name" />
        </Form.Item>
        <Form.Item label="Owner" name="owner">
          <Input aria-label="Owner" />
        </Form.Item>
        <Form.Item label="Command" name="command">
          <Input aria-label="Command" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">Create / Update</Button>
            <Button htmlType="button" onClick={() => form.resetFields()}>Reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}
