<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import ChatMessageItem from './ChatMessageItem.vue'

const props = withDefaults(
  defineProps<{
    compact?: boolean
    title?: string
  }>(),
  {
    compact: false,
    title: 'Trợ lý AI Tìm Phòng & Tra Cứu',
  }
)

const chatStore = useChatStore()
const inputText = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLTextAreaElement | null>(null)

const quickPrompts = [
  'Tìm phòng đơn tầng 2 giá dưới 4 triệu có điều hòa',
  'Quy định giờ giấc ra vào và gửi xe buổi tối',
  'Chính sách đặt cọc và hoàn cọc khi trả phòng',
  'Biểu phí đơn giá điện nước và dịch vụ',
]

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(
  () => chatStore.messages.length,
  () => {
    scrollToBottom()
  }
)

watch(
  () => chatStore.loading,
  () => {
    scrollToBottom()
  }
)

onMounted(async () => {
  if (chatStore.messages.length === 0) {
    await chatStore.fetchHistory()
  }
  scrollToBottom()
})

const handleSend = async () => {
  const text = inputText.value.trim()
  if (!text || chatStore.loading) return

  inputText.value = ''
  await chatStore.sendMessage(text)
  scrollToBottom()
  inputEl.value?.focus()
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

const applyPrompt = (prompt: string) => {
  inputText.value = prompt
  handleSend()
}

const handleNewSession = () => {
  chatStore.createNewSession()
  inputEl.value?.focus()
}

const handleClearHistory = async () => {
  if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử đoạn chat hiện tại?')) {
    await chatStore.clearHistory()
  }
}
</script>

<template>
  <div class="flex flex-col h-full bg-slate-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <div class="flex items-center space-x-2.5">
        <div class="relative">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-gray-900 leading-tight">{{ title }}</h3>
          <div class="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>RAG Engine sẵn sàng</span>
            <span class="text-gray-300">•</span>
            <span class="font-mono text-gray-400 text-[10px]">{{ chatStore.sessionId.substring(0, 16) }}...</span>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex items-center space-x-1">
        <button
          type="button"
          @click="handleNewSession"
          title="Tạo phiên hội thoại mới"
          class="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors text-xs flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span v-if="!compact" class="hidden sm:inline">Đoạn chat mới</span>
        </button>

        <button
          type="button"
          @click="handleClearHistory"
          title="Xóa lịch sử"
          :disabled="chatStore.messages.length === 0"
          class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Messages Container -->
    <div
      ref="messagesContainer"
      class="flex-1 p-4 overflow-y-auto space-y-2 bg-slate-50/50"
    >
      <!-- Empty state with greeting and prompt pills -->
      <div v-if="chatStore.messages.length === 0" class="h-full flex flex-col items-center justify-center text-center px-4 py-8">
        <div class="w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mb-3 shadow-inner">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h4 class="text-base font-semibold text-gray-800 mb-1">Xin chào! Tôi có thể giúp gì cho bạn?</h4>
        <p class="text-xs text-gray-500 max-w-md mb-5">
          Tôi là trợ lý AI tích hợp RAG, có thể tra cứu phòng trống theo yêu cầu, giải đáp nội quy, bảng giá dịch vụ và chính sách thuê trọ.
        </p>

        <!-- Quick prompts -->
        <div class="w-full max-w-md space-y-2 text-left">
          <div class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 text-center">Gợi ý câu hỏi nhanh:</div>
          <button
            v-for="(prompt, idx) in quickPrompts"
            :key="idx"
            type="button"
            @click="applyPrompt(prompt)"
            class="w-full p-2.5 text-xs text-gray-700 bg-white hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300 border border-gray-200 rounded-lg shadow-sm transition-all duration-150 flex items-center justify-between group"
          >
            <span>{{ prompt }}</span>
            <svg class="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Messages list -->
      <template v-else>
        <ChatMessageItem
          v-for="msg in chatStore.messages"
          :key="msg.id || msg.timestamp?.toString()"
          :message="msg"
        />
      </template>
    </div>

    <!-- Quick Prompts bar if messages exist -->
    <div v-if="chatStore.messages.length > 0" class="px-3 py-1.5 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
      <span class="text-[10px] text-gray-400 uppercase tracking-wider flex-shrink-0 font-semibold">Gợi ý:</span>
      <button
        v-for="(p, i) in quickPrompts.slice(0, 3)"
        :key="i"
        @click="applyPrompt(p)"
        class="text-[11px] text-gray-600 hover:text-primary-700 bg-gray-50 hover:bg-primary-50 px-2 py-0.5 rounded border border-gray-200 whitespace-nowrap transition-colors flex-shrink-0"
      >
        {{ p }}
      </button>
    </div>

    <!-- Input Box -->
    <div class="p-3 bg-white border-t border-gray-200">
      <form @submit.prevent="handleSend" class="flex items-end gap-2">
        <div class="relative flex-1">
          <textarea
            ref="inputEl"
            v-model="inputText"
            @keydown="handleKeydown"
            rows="1"
            placeholder="Hỏi về phòng trống, giá cả, nội quy, dịch vụ... (Enter để gửi)"
            class="w-full px-3.5 py-2.5 text-sm text-gray-800 bg-gray-50 hover:bg-white focus:bg-white border border-gray-300 focus:border-primary-500 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all"
            :disabled="chatStore.loading"
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="!inputText.trim() || chatStore.loading"
          class="h-10 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm flex items-center justify-center shadow-sm transition-colors flex-shrink-0"
        >
          <svg v-if="chatStore.loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
