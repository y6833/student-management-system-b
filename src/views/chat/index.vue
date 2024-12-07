<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>AI 助手</h2>
    </div>
    <div class="chat-messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
        <div class="message-avatar">
          <el-avatar :size="40" :icon="message.role === 'user' ? 'el-icon-user' : 'el-icon-service'" 
            :class="message.role === 'assistant' ? 'assistant-avatar' : 'user-avatar'" />
        </div>
        <div class="message-content">
          <div class="message-text">{{ message.content }}</div>
        </div>
      </div>
    </div>
    <div class="chat-input-container">
      <el-input
        v-model="inputMessage"
        type="textarea"
        :rows="3"
        placeholder="请输入您的问题..."
        :disabled="loading"
        @keyup.enter.native="sendMessage"
        class="chat-textarea"
      />
      <el-button 
        type="primary" 
        :loading="loading" 
        @click="sendMessage"
        class="send-button"
        :disabled="!inputMessage.trim()"
      >
        {{ loading ? '发送中...' : '发送' }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import SparkApi from '@/utils/sparkApi'

// 配置信息
const APPID = '4ffb291a'
const API_KEY = '886f91b757ff2acf53ec9a8f0fa5692f'
const API_SECRET = 'ZjJiYTJjOTQwY2M1ZWNiN2Q2MzZiMzBi'

const sparkApi = new SparkApi(APPID, API_KEY, API_SECRET)
const messages = ref([])
const inputMessage = ref('')
const loading = ref(false)
const ws = ref(null)
const messagesContainer = ref(null)

// 处理接收到的消息
const handleMessage = (data) => {
  if (data.header.code !== 0) {
    console.error('Error:', data.header.message)
    loading.value = false
    return
  }

  // 从返回的数据中提取文本内容
  const text = data.payload.choices.text[0].content
  if (text) {
    const lastMessage = messages.value[messages.value.length - 1]
    if (lastMessage && lastMessage.role === 'assistant') {
      lastMessage.content += text
    } else {
      messages.value.push({
        role: 'assistant',
        content: text
      })
    }
    
    // 滚动到底部
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  }

  // 如果是最后一条消息
  if (data.header.status === 2) {
    loading.value = false
  }
}

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || loading.value) return

  loading.value = true
  messages.value.push({
    role: 'user',
    content: inputMessage.value
  })

  // 如果没有连接或连接已关闭，创建新连接
  if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
    ws.value = sparkApi.createConnection(
      handleMessage,
      (error) => {
        console.error('WebSocket error:', error)
        loading.value = false
      },
      () => {
        console.log('WebSocket connection closed')
        loading.value = false
      }
    )

    // 等待连接建立
    await new Promise((resolve) => {
      const checkConnection = () => {
        if (ws.value.readyState === WebSocket.OPEN) {
          resolve()
        } else {
          setTimeout(checkConnection, 100)
        }
      }
      checkConnection()
    })
  }

  // 发送消息
  sparkApi.sendMessage(ws.value, inputMessage.value)

  // 清空输入
  inputMessage.value = ''

  // 滚动到底部
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 组件卸载时关闭连接
onUnmounted(() => {
  if (ws.value) {
    ws.value.close()
  }
})
</script>

<style lang="scss" scoped>
.chat-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-header {
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  
  h2 {
    margin: 0;
    font-size: 18px;
    color: #303133;
    font-weight: 500;
  }
}

.chat-messages {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: #f5f7fa;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c0c4cc;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f7fa;
  }
}

.message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
  
  &.user {
    flex-direction: row-reverse;
    
    .message-content {
      margin-right: 12px;
      margin-left: 0;
    }

    .message-text {
      background: #409eff;
      color: #fff;
      border-radius: 12px 2px 12px 12px;
    }
  }

  &.assistant {
    .message-text {
      background: #fff;
      color: #303133;
      border-radius: 2px 12px 12px 12px;
    }
  }
}

.message-avatar {
  flex-shrink: 0;
  
  .assistant-avatar {
    background: #409eff;
    color: #fff;
  }
  
  .user-avatar {
    background: #67c23a;
    color: #fff;
  }
}

.message-content {
  margin-left: 12px;
  max-width: 70%;
}

.message-text {
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  word-break: break-word;
  white-space: pre-wrap;
}

.chat-input-container {
  padding: 20px;
  background: #fff;
  border-top: 1px solid #e4e7ed;
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.chat-textarea {
  flex: 1;

  :deep(.el-textarea__inner) {
    border-radius: 8px;
    resize: none;
    font-size: 14px;
    padding: 12px;
    line-height: 1.6;
    
    &:focus {
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
  }
}

.send-button {
  height: 40px;
  padding: 0 24px;
  font-size: 14px;
  border-radius: 8px;
}

// 响应式设计
@media screen and (max-width: 768px) {
  .chat-container {
    border-radius: 0;
  }

  .message-content {
    max-width: 85%;
  }

  .chat-input-container {
    padding: 12px;
  }
}
</style>
