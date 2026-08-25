import { defineStore } from 'pinia'
import axios from '@/plugins/axios'
import type { ApiResponse, KnowledgeDoc, RagSyncResult, RagTestQueryData, RagTestQueryResult } from '@/types'

export const useRagStore = defineStore('rag', {
  state: () => ({
    documents: [] as KnowledgeDoc[],
    syncStats: null as RagSyncResult | null,
    testResults: [] as RagTestQueryResult[],
    lastTestedQuery: '' as string,
    isSyncing: false,
    isLoadingDocs: false,
    isSubmittingDoc: false,
    isTestingQuery: false,
    error: null as string | null,
    successMessage: null as string | null,
  }),

  actions: {
    clearMessages() {
      this.error = null
      this.successMessage = null
    },

    async syncKnowledgeBase(): Promise<RagSyncResult | null> {
      this.isSyncing = true
      this.error = null
      this.successMessage = null

      try {
        const response: any = await axios.post<ApiResponse<RagSyncResult>>('/api/v1/rag/sync')
        const data: RagSyncResult = response.data || response
        this.syncStats = data
        this.successMessage = response.message || 'RAG Knowledge base synchronized successfully!'
        return data
      } catch (err: any) {
        this.error = err?.error || err?.message || 'Error synchronizing RAG vector database'
        return null
      } finally {
        this.isSyncing = false
      }
    },

    async fetchDocuments(): Promise<KnowledgeDoc[]> {
      this.isLoadingDocs = true
      this.error = null

      try {
        const response: any = await axios.get<ApiResponse<KnowledgeDoc[]>>('/api/v1/rag/documents')
        const data: KnowledgeDoc[] = response.data || response || []
        this.documents = Array.isArray(data) ? data : []
        return this.documents
      } catch (err: any) {
        this.error = err?.error || err?.message || 'Error fetching knowledge documents list'
        return []
      } finally {
        this.isLoadingDocs = false
      }
    },

    async createDocument(payload: { title: string; content: string; fileType?: string } | FormData): Promise<KnowledgeDoc | null> {
      this.isSubmittingDoc = true
      this.error = null
      this.successMessage = null

      try {
        const isFormData = payload instanceof FormData
        const response: any = await axios.post<ApiResponse<KnowledgeDoc>>('/api/v1/rag/documents', payload, {
          headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
        })
        const created: KnowledgeDoc = response.data || response
        this.successMessage = response.message || 'Knowledge document created successfully!'
        await this.fetchDocuments()
        return created
      } catch (err: any) {
        this.error = err?.error || err?.message || 'Failed to create knowledge document'
        return null
      } finally {
        this.isSubmittingDoc = false
      }
    },

    async deleteDocument(id: string): Promise<boolean> {
      this.error = null
      this.successMessage = null

      try {
        await axios.delete(`/api/v1/rag/documents/${id}`)
        this.documents = this.documents.filter((d) => (d._id || d.id) !== id)
        this.successMessage = 'Knowledge document and associated vectors deleted successfully'
        return true
      } catch (err: any) {
        this.error = err?.error || err?.message || 'Failed to delete knowledge document'
        return false
      }
    },

    async testQuery(query: string, topK: number = 4): Promise<RagTestQueryResult[]> {
      const trimmed = query.trim()
      if (!trimmed) return []

      this.isTestingQuery = true
      this.error = null
      this.lastTestedQuery = trimmed

      try {
        const response: any = await axios.post<ApiResponse<RagTestQueryData>>('/api/v1/rag/test-query', {
          query: trimmed,
          topK,
        })

        const resData: any = response.data || response
        const results: RagTestQueryResult[] = resData?.results || (Array.isArray(resData) ? resData : [])
        this.testResults = results
        return results
      } catch (err: any) {
        this.error = err?.error || err?.message || 'Error testing semantic search query'
        this.testResults = []
        return []
      } finally {
        this.isTestingQuery = false
      }
    },
  },
})
