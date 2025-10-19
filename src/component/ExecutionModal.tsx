import React from 'react'
import { Modal, Typography } from 'antd'
import { TaskExecution } from '../models'
import { humanTime } from '../utils'

const { Paragraph, Text } = Typography

type Props = {
  open: boolean
  onClose: () => void
  exec?: TaskExecution
}

export default function ExecutionModal({ open, onClose, exec }: Props) {
  return (
    <Modal title="Execution Result" open={open} onOk={onClose} onCancel={onClose} width={800}>
      {exec ? (
        <div>
          <Text strong>Timestamp:</Text> {humanTime(exec.timestamp)}
          <br />
          <Text strong>Exit code:</Text> {exec.exitCode ?? 'N/A'}
          <br />
          <Text strong>Stdout:</Text>
          <Paragraph copyable={{ text: exec.stdout }}>{exec.stdout || <i>— no output —</i>}</Paragraph>
          <Text strong>Stderr:</Text>
          <Paragraph copyable={{ text: exec.stderr }}>{exec.stderr || <i>— no stderr —</i>}</Paragraph>
        </div>
      ) : (
        <div>No execution selected</div>
      )}
    </Modal>
  )
}
