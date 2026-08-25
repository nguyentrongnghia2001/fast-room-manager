<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRagStore } from '@/stores/rag'
import type { KnowledgeDoc } from '@/types'
import type { SelectOption } from '@/types/type'

// Base UI components
import AlertBase from '@/components/base/alert/AlertBase.vue'
import ButtonBase from '@/components/base/button/ButtonBase.vue'
import InputTextBase from '@/components/base/input/InputTextBase.vue'
import InputNumberBase from '@/components/base/input/InputNumberBase.vue'
import InputSelectBase from '@/components/base/input/InputSelectBase.vue'
import InputTextareaBase from '@/components/base/input/InputTextareaBase.vue'

const ragStore = useRagStore()

const activeTab = ref<'documents' | 'playground'>('documents')

// File type options for InputSelectBase
const fileTypeOptions: SelectOption[] = [
  { value: 'markdown', label: 'Markdown (.md)' },
  { value: 'text', label: 'Văn bản thuần (.txt)' },
  { value: 'pdf', label: 'Tài liệu (.pdf)' },
]

// Create document modal state
const isModalOpen = ref(false)
const docForm = ref({
  title: '',
  content: '',
  fileType: 'markdown',
})

// View document modal state
const selectedDoc = ref<KnowledgeDoc | null>(null)
const isViewModalOpen = ref(false)

// Playground state
const testQueryInput = ref('Tìm giúp tôi phòng đơn tầng 2 giá dưới 4 triệu')
const testTopK = ref(3)

onMounted(async () => {
  await ragStore.fetchDocuments()
})

const handleSync = async () => {
  await ragStore.syncKnowledgeBase()
}

const openCreateModal = () => {
  docForm.value = {
    title: '',
    content: '',
    fileType: 'markdown',
  }
  isModalOpen.value = true
}

const applyTemplate = (type: 'rules' | 'deposit' | 'fees') => {
  if (type === 'rules') {
    docForm.value.title = 'Nội quy phòng trọ Smart House'
    docForm.value.content = `# NỘI QUY PHÒNG TRỌ SMART HOUSE

## 1. Giờ giấc ra vào
- Cổng chính mở cửa từ 05:00 sáng đến 23:30 đêm.
- Sau 23:30, khách thuê sử dụng vân tay hoặc thẻ từ bảo mật để vào.
- Hạn chế gây ồn ào từ 22:00 đến 06:00 sáng hôm sau.

## 2. Giữ gìn an ninh trật tự & tài sản
- Khách đến thăm phải đăng ký với ban quản lý trước 21:00.
- Không tụ tập bài bạc, sử dụng chất cấm hoặc gây mất an ninh trong khuôn viên.

## 3. Nơi để xe và vệ sinh
- Xe máy phải để đúng vị trí quy định tại tầng hầm/nhà để xe.
- Rác sinh hoạt phải được phân loại và bỏ đúng nơi quy định trước 19:00 hàng ngày.`
  } else if (type === 'deposit') {
    docForm.value.title = 'Chính sách đặt cọc và hợp đồng thuê'
    docForm.value.content = `# CHÍNH SÁCH ĐẶT CỌC VÀ HỢP ĐỒNG THUÊ

## 1. Mức đặt cọc
- Tiền đặt cọc tiêu chuẩn tương đương 01 tháng tiền phòng.
- Tiền cọc được giữ bảo đảm việc thực hiện đúng hợp đồng và bảo vệ trang thiết bị.

## 2. Thời hạn hợp đồng
- Hợp đồng thuê tiêu chuẩn có thời hạn tối thiểu 06 tháng hoặc 12 tháng.

## 3. Quy định hoàn trả tiền cọc
- Khách thuê thông báo trả phòng trước ít nhất 30 ngày trước khi hết hạn hợp đồng.
- Bàn giao phòng và trang thiết bị nguyên vẹn, đã thanh toán đầy đủ các hóa đơn điện, nước, dịch vụ.
- Tiền cọc sẽ được hoàn trả đầy đủ trong vòng 03 ngày làm việc sau khi thanh lý hợp đồng.`
  } else if (type === 'fees') {
    docForm.value.title = 'Biểu phí dịch vụ và định mức điện nước'
    docForm.value.content = `# BIỂU PHÍ DỊCH VỤ VÀ ĐỊNH MỨC ĐIỆN NƯỚC

## 1. Đơn giá điện & nước
- Tiền điện: 3.500 VNĐ / kWh (theo chỉ số công tơ điện riêng từng phòng).
- Tiền nước: 100.000 VNĐ / người / tháng (hoặc 25.000 VNĐ / m3 nếu có đồng hồ nước).

## 2. Các khoản phí dịch vụ cố định
- Phí Internet Wifi tốc độ cao: Miễn phí / Đã bao gồm trong tiền phòng.
- Phí gửi xe máy: 100.000 VNĐ / xe / tháng.
- Phí vệ sinh và thu gom rác: 50.000 VNĐ / phòng / tháng.

## 3. Thời hạn thanh toán hóa đơn
- Hóa đơn tiền phòng và dịch vụ được xuất từ ngày 01 đến ngày 05 hàng tháng.
- Hạn chót thanh toán là ngày 10 hàng tháng.`
  }
}

const handleCreateDoc = async () => {
  if (!docForm.value.title.trim() || !docForm.value.content.trim()) return

  const res = await ragStore.createDocument({
    title: docForm.value.title.trim(),
    content: docForm.value.content.trim(),
    fileType: docForm.value.fileType,
  })

  if (res) {
    isModalOpen.value = false
  }
}

const handleDeleteDoc = async (id?: string) => {
  if (!id) return
  if (confirm('Bạn có chắc chắn muốn xóa tài liệu này? Các vector nhúng liên quan cũng sẽ bị gỡ bỏ.')) {
    await ragStore.deleteDocument(id)
  }
}

const viewDoc = (doc: KnowledgeDoc) => {
  selectedDoc.value = doc
  isViewModalOpen.value = true
}

const handleTestQuery = async () => {
  if (!testQueryInput.value.trim()) return
  await ragStore.testQuery(testQueryInput.value, Number(testTopK.value) || 3)
}

const formatScore = (score?: number) => {
  if (typeof score !== 'number') return '—'
  return `${(score * 100).toFixed(1)}%`
}

const getScoreBadgeClass = (score?: number) => {
  if (!score) return 'bg-gray-100 text-gray-800'
  if (score >= 0.8) return 'bg-emerald-100 text-emerald-800 border-emerald-300'
  if (score >= 0.65) return 'bg-blue-100 text-blue-800 border-blue-300'
  return 'bg-amber-100 text-amber-800 border-amber-300'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header banner -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <svg class="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Quản lý Cơ sở Tri thức RAG & Vector Search
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Lập chỉ mục tài liệu nội quy, chính sách và cơ sở dữ liệu phòng thành vector embeddings cho Chatbot AI.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <ButtonBase
          text="Đồng bộ RAG (Vector Sync)"
          :loading="ragStore.isSyncing"
          @click="handleSync"
          color="primary"
        >
          <svg v-if="!ragStore.isSyncing" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </ButtonBase>

        <ButtonBase
          text="Thêm tài liệu"
          @click="openCreateModal"
          color="outline"
        >
          <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </ButtonBase>
      </div>
    </div>

    <!-- Reusable Base Alert Banners -->
    <div v-if="ragStore.successMessage" class="relative">
      <AlertBase
        title="Thành công"
        :description="ragStore.successMessage"
        type="success"
      />
      <button
        @click="ragStore.clearMessages"
        class="absolute top-4 right-4 text-emerald-600 hover:text-emerald-800"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div v-if="ragStore.error" class="relative">
      <AlertBase
        title="Lỗi"
        :description="ragStore.error"
        type="error"
      />
      <button
        @click="ragStore.clearMessages"
        class="absolute top-4 right-4 text-red-600 hover:text-red-800"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
        <div class="p-3 bg-primary-50 rounded-xl text-primary-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <div class="text-xs text-gray-500 font-medium">Tài liệu đã lưu</div>
          <div class="text-xl font-bold text-gray-900">{{ ragStore.documents.length }} docs</div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
        <div class="p-3 bg-emerald-50 rounded-xl text-emerald-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
          </svg>
        </div>
        <div>
          <div class="text-xs text-gray-500 font-medium">Phòng đã đồng bộ</div>
          <div class="text-xl font-bold text-gray-900">{{ ragStore.syncStats?.roomsSynced ?? '—' }} phòng</div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
        <div class="p-3 bg-indigo-50 rounded-xl text-indigo-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <div class="text-xs text-gray-500 font-medium">Tổng số Vector Chunks</div>
          <div class="text-xl font-bold text-gray-900">{{ ragStore.syncStats?.totalVectors ?? '—' }} vectors</div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
        <div class="p-3 bg-cyan-50 rounded-xl text-cyan-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <div class="text-xs text-gray-500 font-medium">Embedding Engine</div>
          <div class="text-xl font-bold text-emerald-600">Active (768d)</div>
        </div>
      </div>
    </div>

    <!-- Main Tabs -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="flex border-b border-gray-200 bg-gray-50/50 px-4">
        <button
          type="button"
          @click="activeTab = 'documents'"
          class="py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2"
          :class="activeTab === 'documents' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Danh mục Tài liệu Tri thức ({{ ragStore.documents.length }})
        </button>

        <button
          type="button"
          @click="activeTab = 'playground'"
          class="py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2"
          :class="activeTab === 'playground' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Kiểm tra Semantic Search Playground
        </button>
      </div>

      <!-- Tab 1: Documents List -->
      <div v-if="activeTab === 'documents'" class="p-6">
        <div v-if="ragStore.isLoadingDocs" class="py-12 flex justify-center items-center">
          <svg class="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </div>

        <div v-else-if="ragStore.documents.length === 0" class="py-12 text-center">
          <div class="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-sm font-semibold text-gray-800 mb-1">Chưa có tài liệu tri thức nào</h3>
          <p class="text-xs text-gray-500 mb-4">Hãy thêm tài liệu nội quy, chính sách hoặc bấm Đồng bộ RAG để nạp dữ liệu mặc định.</p>
          <ButtonBase
            text="Thêm tài liệu đầu tiên"
            @click="openCreateModal"
            color="primary"
          />
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
              <tr>
                <th class="px-4 py-3">Tiêu đề tài liệu</th>
                <th class="px-4 py-3">Định dạng</th>
                <th class="px-4 py-3">Số đoạn (Chunks)</th>
                <th class="px-4 py-3">Ngày cập nhật</th>
                <th class="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="doc in ragStore.documents" :key="doc._id || doc.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-gray-900">
                  <div class="flex items-center gap-2">
                    <span class="p-1 rounded bg-primary-50 text-primary-600">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <span>{{ doc.title }}</span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase bg-gray-100 text-gray-700">
                    {{ doc.fileType || 'markdown' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-600">
                  {{ doc.totalChunks ?? '—' }} chunks
                </td>
                <td class="px-4 py-3 text-gray-500 text-xs">
                  {{ doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString('vi-VN') : '—' }}
                </td>
                <td class="px-4 py-3 text-right space-x-2">
                  <button
                    type="button"
                    @click="viewDoc(doc)"
                    class="text-xs text-primary-600 hover:text-primary-800 font-medium px-2 py-1 rounded hover:bg-primary-50 transition-colors"
                  >
                    Xem
                  </button>
                  <button
                    type="button"
                    @click="handleDeleteDoc(doc._id || doc.id)"
                    class="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 2: Playground -->
      <div v-if="activeTab === 'playground'" class="p-6 space-y-6">
        <div class="max-w-3xl">
          <h3 class="text-base font-semibold text-gray-900 mb-1">Kiểm tra kết quả Semantic Search (Context Retrieval)</h3>
          <p class="text-xs text-gray-500 mb-4">
            Thử nghiệm tìm kiếm ngữ nghĩa theo câu hỏi tự nhiên để kiểm tra mức độ khớp (Vector Similarity) và các chunk được trích xuất trước khi nạp vào LLM.
          </p>

          <form @submit.prevent="handleTestQuery" class="space-y-4">
            <div class="flex flex-col sm:flex-row gap-3 items-end">
              <div class="flex-1 w-full">
                <InputTextBase
                  label="Câu truy vấn thử nghiệm:"
                  name="query"
                  v-model="testQueryInput"
                  placeholder="Ví dụ: Quy định giờ đóng cửa ban đêm, Phòng đơn giá rẻ..."
                />
              </div>

              <div class="w-full sm:w-28">
                <InputNumberBase
                  label="Top-K:"
                  name="topK"
                  v-model="testTopK"
                  suffix=""
                  placeholder="3"
                />
              </div>

              <div class="w-full sm:w-auto">
                <ButtonBase
                  text="Tìm kiếm Vector"
                  type="submit"
                  :loading="ragStore.isTestingQuery"
                  :disabled="!testQueryInput.trim()"
                  color="primary"
                />
              </div>
            </div>
          </form>
        </div>

        <!-- Playground Results -->
        <div class="mt-6">
          <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Kết quả Semantic Retrieval ({{ ragStore.testResults.length }} kết quả):
          </h4>

          <div v-if="ragStore.testResults.length === 0" class="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p class="text-xs text-gray-500">Chưa có kết quả tìm kiếm nào. Hãy nhập câu hỏi và bấm "Tìm kiếm Vector".</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="(res, idx) in ragStore.testResults"
              :key="idx"
              class="p-4 rounded-xl border border-gray-200 bg-white hover:border-primary-300 shadow-sm transition-all"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span
                    class="px-2 py-0.5 rounded text-xs font-bold uppercase border"
                    :class="getScoreBadgeClass(res.score)"
                  >
                    Độ khớp: {{ formatScore(res.score) }}
                  </span>
                  <span class="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                    Loại: {{ res.type }}
                  </span>
                </div>
                <span class="text-xs text-gray-400 font-mono">Rank #{{ idx + 1 }}</span>
              </div>

              <div class="p-3 bg-gray-50 rounded-lg text-xs text-gray-800 font-mono whitespace-pre-wrap leading-relaxed border border-gray-100">
                {{ res.text }}
              </div>

              <!-- Metadata view -->
              <div v-if="res.metadata && Object.keys(res.metadata).length > 0" class="mt-2.5 pt-2 border-t border-gray-100 flex flex-wrap gap-2 text-[11px] text-gray-500">
                <span class="font-semibold text-gray-600">Metadata:</span>
                <span v-for="(val, key) in res.metadata" :key="key" class="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-700">
                  {{ key }}: {{ typeof val === 'object' ? JSON.stringify(val) : val }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Create Document (Reusing Base Inputs & Buttons) -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 class="text-base font-bold text-gray-900">Thêm Tài Liệu Tri Thức Mới</h3>
          <button @click="isModalOpen = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleCreateDoc" class="flex-1 flex flex-col min-h-0 overflow-y-auto p-6 space-y-4">
          <!-- Quick templates bar -->
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Mẫu văn bản có sẵn:</label>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                @click="applyTemplate('rules')"
                class="text-xs px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 transition-colors"
              >
                + Mẫu Nội quy nhà trọ
              </button>
              <button
                type="button"
                @click="applyTemplate('deposit')"
                class="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              >
                + Mẫu Chính sách đặt cọc & hợp đồng
              </button>
              <button
                type="button"
                @click="applyTemplate('fees')"
                class="text-xs px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors"
              >
                + Mẫu Biểu phí dịch vụ & điện nước
              </button>
            </div>
          </div>

          <!-- Reusable InputTextBase -->
          <div>
            <InputTextBase
              label="Tiêu đề tài liệu (*)"
              name="title"
              v-model="docForm.title"
              placeholder="Ví dụ: Nội quy phòng trọ Smart House 2026"
            />
          </div>

          <!-- Reusable InputSelectBase -->
          <div>
            <InputSelectBase
              label="Định dạng file"
              name="fileType"
              v-model="docForm.fileType"
              :options="fileTypeOptions"
            />
          </div>

          <!-- Reusable InputTextareaBase -->
          <div class="flex-1 flex flex-col min-h-[200px]">
            <InputTextareaBase
              label="Nội dung chi tiết (*)"
              name="content"
              v-model="docForm.content"
              :rows="8"
              placeholder="Nhập nội dung quy định, điều khoản hoặc chính sách..."
            />
          </div>

          <div class="pt-4 border-t border-gray-200 flex justify-end gap-2">
            <ButtonBase
              text="Hủy bỏ"
              type="button"
              @click="isModalOpen = false"
              color="outline"
            />
            <ButtonBase
              text="Lưu & Tạo Vector"
              type="submit"
              :loading="ragStore.isSubmittingDoc"
              :disabled="!docForm.title.trim() || !docForm.content.trim()"
              color="primary"
            />
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: View Document -->
    <div
      v-if="isViewModalOpen && selectedDoc"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 class="text-base font-bold text-gray-900">{{ selectedDoc.title }}</h3>
            <span class="text-xs text-gray-500 uppercase">{{ selectedDoc.fileType }}</span>
          </div>
          <button @click="isViewModalOpen = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 bg-slate-50">
          <pre class="whitespace-pre-wrap font-mono text-xs text-gray-800 bg-white p-4 rounded-xl border border-gray-200">{{ selectedDoc.content }}</pre>
        </div>

        <div class="px-6 py-3 border-t border-gray-200 bg-white flex justify-end">
          <ButtonBase
            text="Đóng"
            type="button"
            @click="isViewModalOpen = false"
            color="outline"
          />
        </div>
      </div>
    </div>
  </div>
</template>