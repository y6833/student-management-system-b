&lt;template>
  <div class="chat-container">
    <div class="chat-messages" ref="messageContainer">
      <div v-for="(message, index) in messages" :key="index" 
           :class="['message', message.role === 'user' ? 'user-message' : 'ai-message']">
        <div class="message-content">
          <div class="avatar">
            <el-avatar :size="40" :src="message.role === 'user' ? userAvatar : aiAvatar"></el-avatar>
          </div>
          <div class="text">
            <div class="name">{{ message.role === 'user' ? '你' : 'AI助手' }}</div>
            <div class="content" v-html="formatMessage(message.content)"></div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chat-input">
      <el-input
        v-model="inputMessage"
        type="textarea"
        :rows="3"
        placeholder="输入消息..."
        @keyup.enter.native="handleEnter"
      ></el-input>
      <el-button 
        type="primary" 
        :loading="loading"
        @click="sendMessage">发送</el-button>
    </div>
  </div>
</template>

<script>
import { sendChatMessage } from '@/api/chat'
import marked from 'marked'
import DOMPurify from 'dompurify'

export default {
  name: 'Chat',
  data() {
    return {
      messages: [],
      inputMessage: '',
      loading: false,
      userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      aiAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    }
  },
  methods: {
    async sendMessage() {
      if (!this.inputMessage.trim()) return
      
      // 添加用户消息
      this.messages.push({
        role: 'user',
        content: this.inputMessage
      })
      
      const userMessage = this.inputMessage
      this.inputMessage = ''
      this.loading = true
      
      try {
        const response = await sendChatMessage(userMessage)
        if (response.code === 200) {
          this.messages.push({
            role: 'assistant',
            content: response.data
          })
        } else {
          this.$message.error('发送消息失败：' + response.msg)
        }
      } catch (error) {
        this.$message.error('发送消息失败：' + error.message)
      } finally {
        this.loading = false
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },
    handleEnter(e) {
      if (e.ctrlKey || e.shiftKey) {
        return
      }
      e.preventDefault()
      this.sendMessage()
    },
    scrollToBottom() {
      const container = this.$refs.messageContainer
      container.scrollTop = container.scrollHeight
    },
    formatMessage(content) {
      // 使用marked转换markdown，并用DOMPurify清理HTML
      return DOMPurify.sanitize(marked(content))
    }
  },
  mounted() {
    // 添加欢迎消息
    this.messages.push({
      role: 'assistant',
      content: '你好！我是你的AI助手，有什么我可以帮你的吗？'
    })
  }
}
</script>

<style scoped>
.chat-container {
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  margin-bottom: 20px;
}

.message {
  margin-bottom: 20px;
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.text {
  flex: 1;
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.name {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.content {
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.content :deep(pre) {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
}

.content :deep(code) {
  background: #f8f9fa;
  padding: 2px 4px;
  border-radius: 4px;
}

.user-message .message-content {
  flex-direction: row-reverse;
}

.user-message .text {
  background: #ecf5ff;
}

.chat-input {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.chat-input .el-textarea {
  flex: 1;
}

.chat-input .el-button {
  height: 82px;
  width: 80px;
}
</style>
