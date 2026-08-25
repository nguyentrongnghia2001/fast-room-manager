<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ChatMessage, ChatSource } from '@/types'
import { formatMarkdownToHtml } from '@/utils/markdown'

const props = defineProps<{
  message: ChatMessage
}>()

const router = useRouter()

const isBot = computed(() => props.message.sender === 'bot')
const formattedHtml = computed(() => formatMarkdownToHtml(props.message.content))

const formatTime = (ts?: string | Date) => {
  if (!ts) return ''
  try {
    const d = new Date(ts)
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

const formatPrice = (val?: number) => {
  if (typeof val !== 'number') return ''
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
}

const navigateToRoom = (source: ChatSource) => {
  const roomId = source.metadata?.roomId || source.metadata?.id || source.metadata?._id
  if (roomId) {
    router.push(`/rooms/detail/${roomId}`)
  } else {
    router.push('/rooms')
  }
}
</script>

<template>
  <div
    class="flex w-full mb-4"
    :class="isBot ? 'justify-start' : 'justify-end'"
  >
    <div class="flex items-start max-w-[88%] md:max-w-[80%] gap-2.5" :class="isBot ? 'flex-row' : 'flex-row-reverse'">
      <!-- Avatar -->
      <div
        class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-sm"
        :class="isBot ? 'bg-gradient-to-tr from-primary-600 to-indigo-600 text-white' : 'bg-gray-700 text-white'"
      >
        <template v-if="isBot">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </template>
        <template v-else>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </template>
      </div>

      <!-- Bubble Content -->
      <div class="flex flex-col" :class="isBot ? 'items-start' : 'items-end'">
        <!-- Message Box -->
        <div
          class="rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed"
          :class="[
            isBot
              ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
              : 'bg-primary-600 text-white rounded-tr-none'
          ]"
        >
          <!-- Loading State / Typing Dots -->
          <div v-if="message.loading" class="flex items-center space-x-1.5 py-1 px-2">
            <div class="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
            <div class="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
            <div class="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            <span class="text-xs text-gray-500 ml-2 font-medium">Đang suy nghĩ...</span>
          </div>

          <!-- Message Body -->
          <div v-else>
            <div
              v-if="isBot"
              class="chat-markdown-content break-words text-gray-800"
              v-html="formattedHtml"
            ></div>
            <div v-else class="whitespace-pre-wrap break-words">
              {{ message.content }}
            </div>

            <!-- Bot Sources & Citations -->
            <div v-if="isBot && message.sources && message.sources.length > 0" class="mt-3 pt-2.5 border-t border-gray-100">
              <div class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <svg class="w-3.5 h-3.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Nguồn tham chiếu (RAG Context):
              </div>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="(source, idx) in message.sources"
                  :key="idx"
                  type="button"
                  @click="navigateToRoom(source)"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-300 text-gray-700 hover:text-primary-700 transition-colors cursor-pointer text-left"
                >
                  <span v-if="source.type === 'room'" class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span v-else class="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span class="font-semibold">
                    {{ source.metadata?.name || source.metadata?.title || (source.type === 'room' ? 'Thông tin phòng' : 'Tài liệu') }}
                  </span>
                  <span v-if="source.metadata?.price" class="text-emerald-600 text-[11px]">
                    ({{ formatPrice(source.metadata.price) }})
                  </span>
                  <span v-if="source.score" class="text-[10px] text-gray-400">
                    {{ Math.round(source.score * 100) }}%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Meta info (Timestamp & Intent) -->
        <div class="flex items-center gap-2 mt-1 px-1 text-[11px] text-gray-400">
          <span>{{ formatTime(message.timestamp) }}</span>
          <span v-if="isBot && message.intent" class="px-1.5 py-0.2 bg-gray-100 rounded text-gray-600 font-mono text-[10px]">
            {{ message.intent }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.chat-markdown-content p) {
  margin-bottom: 0.35rem;
}
:deep(.chat-markdown-content p:last-child) {
  margin-bottom: 0;
}
</style>
