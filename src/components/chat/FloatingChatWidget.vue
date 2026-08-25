<script setup lang="ts">
import { ref } from 'vue'
import ChatBox from './ChatBox.vue'

const isOpen = ref(false)

const toggleChat = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
    <!-- Chat popup window -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95 translate-y-4"
      enter-to-class="transform opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 scale-100 translate-y-0"
      leave-to-class="transform opacity-0 scale-95 translate-y-4"
    >
      <div
        v-if="isOpen"
        class="mb-3 w-[92vw] sm:w-[400px] h-[560px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
      >
        <!-- Header close bar -->
        <div class="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold tracking-wide">Trợ lý AI Smart Manager</span>
          </div>
          <button
            type="button"
            @click="isOpen = false"
            class="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- ChatBox component inside -->
        <div class="flex-1 min-h-0">
          <ChatBox :compact="true" title="Hỏi đáp thông minh" />
        </div>
      </div>
    </transition>

    <!-- Floating action button -->
    <button
      type="button"
      @click="toggleChat"
      class="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 text-white shadow-lg hover:shadow-primary-500/30 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-200"
      aria-label="Mở Trợ lý AI"
    >
      <span v-if="!isOpen" class="absolute -top-1 -right-1 flex h-4 w-4">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
      </span>

      <!-- Icon when closed -->
      <svg
        v-if="!isOpen"
        class="w-7 h-7 transform group-hover:rotate-12 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>

      <!-- Icon when opened -->
      <svg
        v-else
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  </div>
</template>
