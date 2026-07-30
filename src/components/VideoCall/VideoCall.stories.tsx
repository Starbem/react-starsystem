import type { Meta, StoryObj } from '../../docs-types'
import { VideoCall } from './VideoCall'

const meta: Meta<typeof VideoCall> = {
  title: 'Components/VideoCall',
  component: VideoCall,
}
export default meta
type Story = StoryObj<typeof VideoCall>

export const Live: Story = {
  render: () => (
    <div className="max-w-[480px]">
      <VideoCall
        status="live"
        name="Dra. Luciana Martins"
        specialty="Dermatologia"
        timer="05:21"
        onEnd={() => {}}
        onChat={() => {}}
        onMore={() => {}}
      />
    </div>
  ),
}

export const Grid: Story = {
  render: () => (
    <div className="max-w-[480px]">
      <VideoCall status="live" layout="grid" onEnd={() => {}} />
    </div>
  ),
}

export const Connecting: Story = {
  render: () => (
    <div className="max-w-[480px]">
      <VideoCall
        status="connecting"
        name="Dra. Luciana Martins"
        specialty="Dermatologia"
        onEnd={() => {}}
      />
    </div>
  ),
}

export const Ended: Story = {
  render: () => (
    <div className="max-w-[480px]">
      <VideoCall status="ended" name="Dra. Luciana Martins" />
    </div>
  ),
}
