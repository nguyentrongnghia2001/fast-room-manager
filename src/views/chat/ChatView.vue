<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import ChatBox from '@/components/chat/ChatBox.vue'
import ButtonBase from '@/components/base/button/ButtonBase.vue'

const router = useRouter()
const chatStore = useChatStore()
const copied = ref(false)

const copySessionId = async () => {
  try {
    await navigator.clipboard.writeText(chatStore.sessionId)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // fallback
  }
}

const sampleCategories = [
  {
    title: '🔍 Tìm kiếm phòng',
    items: [
      'Tìm phòng đơn tầng 2 giá dưới 4 triệu',
      'Có phòng nào có ban công và máy nước nóng không?',
      'Phòng gia đình cho 3 người ở diện tích từ 35m2',
    ],
  },
  {
    title: '📋 Nội quy & Thủ tục',
    items: [
      'Quy định giờ đóng cửa buổi tối là mấy giờ?',
      'Chính sách trả cọc khi kết thúc hợp đồng',
      'Quy định về việc bạn bè ở lại qua đêm',
    ],
  },
  {
    title: '⚡ Biểu phí & Dịch vụ',
    items: [
      'Đơn giá điện và nước tính như thế nào?',
      'Phí gửi xe máy và phí dịch vụ rác hàng tháng',
      'Cách thức thanh toán tiền phòng định kỳ',
    ],
  },
]

const selectPrompt = (text: string) => {
  chatStore.sendMessage(text)
}
</script>

<template>
  <div class="h-[calc(100vh-8.5rem)] flex flex-col">
    <!-- Top banner / Breadcrumb -->
    <div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
          <div class="p-1.5 rounded-lg bg-gradient-to-tr from-primary-600 to-indigo-600 text-white shadow-sm">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          Trợ lý AI Tìm Phòng & Tư Vấn
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Hệ thống AI RAG tư vấn tự động kết hợp cơ sở dữ liệu phòng và tài liệu chính sách thời gian thực.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <ButtonBase
          text="Quản lý Tri thức RAG"
          @click="router.push('/documents')"
          color="outline"
        >
          <svg class="w-4 h-4 mr-1.5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </ButtonBase>
      </div>
    </div>

    <!-- Main 2-column Layout -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
      <!-- Chat Area (8 cols) -->
      <div class="lg:col-span-8 h-full flex flex-col min-h-0">
        <ChatBox title="Hội thoại Trợ lý ảo RAG" />
      </div>

      <!-- Side Info & Prompt Explorer (4 cols) -->
      <div class="hidden lg:flex lg:col-span-4 flex-col gap-4 overflow-y-auto pr-1">
        <!-- Session Info Card -->
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Thông tin phiên (Session)</span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
              Đang hoạt động
            </span>
          </h4>
          <div class="p-2.5 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between gap-2">
            <span class="font-mono text-xs text-gray-600 truncate">{{ chatStore.sessionId }}</span>
            <ButtonBase
              :text="copied ? 'Đã sao chép!' : 'Sao chép'"
              @click="copySessionId"
              color="outline"
            />
          </div>
          <div class="mt-2 text-[11px] text-gray-400">
            Phiên làm việc lưu trữ ngữ cảnh đa lượt để bot ghi nhớ câu hỏi trước đó.
          </div>
        </div>

        <!-- RAG Architecture Info Card -->
        <div class="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-4 rounded-xl shadow-sm">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            </div>
            <h4 class="text-sm font-semibold">Cơ chế RAG thông minh</h4>
          </div>
          <p class="text-xs text-indigo-200/90 leading-relaxed mb-3">
            Tự động phân loại ý định, trích xuất bộ lọc (giá, loại phòng, tầng) và đối soát tài liệu nội quy trước khi sinh phản hồi qua LLM.
          </p>
          <div class="grid grid-cols-2 gap-2 text-center text-xs">
            <div class="bg-white/10 rounded-lg p-2">
              <div class="font-bold text-emerald-400 text-sm">Vector Search</div>
              <div class="text-[10px] text-gray-300">Semantic Matching</div>
            </div>
            <div class="bg-white/10 rounded-lg p-2">
              <div class="font-bold text-cyan-400 text-sm">Real-time DB</div>
              <div class="text-[10px] text-gray-300">Dữ liệu phòng sống</div>
            </div>
          </div>
        </div>

        <!-- Sample Categories & Questions -->
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex-1">
          <h4 class="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Chủ đề mẫu có thể hỏi:</h4>
          <div class="space-y-4">
            <div v-for="(cat, idx) in sampleCategories" :key="idx">
              <div class="text-xs font-semibold text-gray-700 mb-1.5">{{ cat.title }}</div>
              <div class="space-y-1">
                <button
                  v-for="(item, i) in cat.items"
                  :key="i"
                  type="button"
                  @click="selectPrompt(item)"
                  class="w-full text-left text-xs p-2 rounded-lg bg-gray-50 hover:bg-primary-50 text-gray-600 hover:text-primary-700 border border-gray-100 hover:border-primary-200 transition-colors block"
                >
                  {{ item }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
