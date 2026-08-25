import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import type { ApiResponse, ChatMessage, ChatResponseData, ChatHistoryData, ChatSource } from '@/types'

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
}

export const useChatStore = defineStore('chat', {
  state: () => {
    let savedSessionId = ''
    try {
      savedSessionId = localStorage.getItem('fast_room_chat_session_id') || ''
    } catch {
      // ignore
    }
    if (!savedSessionId) {
      savedSessionId = generateSessionId()
      try {
        localStorage.setItem('fast_room_chat_session_id', savedSessionId)
      } catch {
        // ignore
      }
    }

    return {
      sessionId: savedSessionId,
      messages: [] as ChatMessage[],
      loading: false,
      currentIntent: '' as string,
      lastSources: [] as ChatSource[],
      error: null as string | null,
    }
  },

  getters: {
    hasMessages: (state) => state.messages.length > 0,
  },

  actions: {
    setSessionId(id: string) {
      this.sessionId = id
      try {
        localStorage.setItem('fast_room_chat_session_id', id)
      } catch {
        // ignore
      }
    },

    createNewSession(): string {
      const newId = generateSessionId()
      this.setSessionId(newId)
      this.messages = []
      this.currentIntent = ''
      this.lastSources = []
      this.error = null
      return newId
    },

    async fetchHistory(targetSessionId?: string): Promise<ChatMessage[]> {
      const sid = targetSessionId || this.sessionId
      if (!sid) return []

      this.loading = true
      this.error = null

      try {
        const response: any = await axios.get<ApiResponse<ChatHistoryData>>(`/api/v1/chat/history/${sid}`)
        const historyData: ChatHistoryData = response.data || response

        if (historyData && Array.isArray(historyData.messages)) {
          this.messages = historyData.messages.map((m) => ({
            id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            sender: m.sender,
            content: m.content,
            sources: m.sources || [],
            timestamp: m.timestamp || new Date().toISOString(),
          }))
        } else {
          this.messages = []
        }

        return this.messages
      } catch (err: any) {
        return this.messages
      } finally {
        this.loading = false
      }
    },

    async sendMessage(userText: string): Promise<ChatResponseData | null> {
      const trimmedText = userText.trim()
      if (!trimmedText || this.loading) return null

      // Optimistically append user message
      const userMsg: ChatMessage = {
        id: `user_${Date.now()}`,
        sender: 'user',
        content: trimmedText,
        timestamp: new Date().toISOString(),
      }
      this.messages.push(userMsg)

      // Placeholder bot message for typing indicator
      const botMsgId = `bot_${Date.now()}`
      const botMsgPlaceholder: ChatMessage = {
        id: botMsgId,
        sender: 'bot',
        content: '',
        loading: true,
        timestamp: new Date().toISOString(),
      }
      this.messages.push(botMsgPlaceholder)

      this.loading = true
      this.error = null

      try {
        const response: any = await axios.post<ApiResponse<ChatResponseData>>('/api/v1/chat', {
          message: trimmedText,
          sessionId: this.sessionId,
          stream: false,
        })

        const resData: ChatResponseData = response.data || response

        if (resData.sessionId && resData.sessionId !== this.sessionId) {
          this.setSessionId(resData.sessionId)
        }

        this.currentIntent = resData.intent || ''
        this.lastSources = resData.sources || []

        // Update placeholder with actual bot reply
        const targetIndex = this.messages.findIndex((m) => m.id === botMsgId)
        if (targetIndex !== -1) {
          this.messages[targetIndex] = {
            id: botMsgId,
            sender: 'bot',
            content: resData.message || 'Sorry, I cannot process the response at this moment.',
            sources: resData.sources || [],
            intent: resData.intent,
            loading: false,
            timestamp: new Date().toISOString(),
          }
        }

        return resData
      } catch (err: any) {
        const errorMessage = err?.error || err?.message || 'An error occurred while connecting to the Chatbot service.'
        this.error = errorMessage

        const targetIndex = this.messages.findIndex((m) => m.id === botMsgId)
        if (targetIndex !== -1) {
          this.messages[targetIndex] = {
            id: botMsgId,
            sender: 'bot',
            content: `⚠️ ${errorMessage}`,
            error: errorMessage,
            loading: false,
            timestamp: new Date().toISOString(),
          }
        }
        return null
      } finally {
        this.loading = false
      }
    },

    async clearHistory(targetSessionId?: string): Promise<boolean> {
      const sid = targetSessionId || this.sessionId
      if (!sid) return false

      this.loading = true
      try {
        await axios.delete(`/api/v1/chat/history/${sid}`)
        this.messages = []
        this.currentIntent = ''
        this.lastSources = []
        return true
      } catch (err: any) {
        this.error = err?.error || err?.message || 'Failed to clear chat history'
        return false
      } finally {
        this.loading = false
      }
    },
  },
})
