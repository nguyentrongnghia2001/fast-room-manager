import type { ApiResponse, Payment } from '@/types'
import { defineStore } from 'pinia'
import axios from '@/plugins/axios' 

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    listPayments: [] as Payment[],
    paymentDetail: {} as Payment,
  }),
  actions: {
    async getListPayments(params?: { contractId?: string; status?: string; month?: string }): Promise<Payment[]> {
      return new Promise((resolve, reject) => {
        const queryParams = new URLSearchParams()
        if (params?.contractId) queryParams.append('contractId', params.contractId)
        if (params?.status) queryParams.append('status', params.status)
        if (params?.month) queryParams.append('month', params.month)
        
        const url = `/api/v1/payments${queryParams.toString() ? '?' + queryParams.toString() : ''}`
        
        axios.get<ApiResponse<Payment[]>>(url)
          .then((response: any) => {
            if(response.status !== 'success'){
              throw new Error("Failed to fetch payments");
            }
            const data = response.data
            this.listPayments = Array.isArray(data) ? data : (data?.items || data?.payments || data?.list || [])
            resolve(this.listPayments)
          })
          .catch((error) => {
            reject(error)
          })
      });
    },
    async getDetailPayment(id: string): Promise<Payment> {
      return new Promise((resolve, reject) => {
        axios.get<ApiResponse<Payment>>(`/api/v1/payments/${id}`)
          .then((response: any) => {
            if(response.status !== 'success'){
              throw new Error("Failed to fetch payment");
            }
            const data = response.data || {}
            this.paymentDetail = data
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      });
    },
    async createPayment(payload: Partial<Payment>): Promise<Payment> {
      return new Promise((resolve, reject) => {
        axios.post<ApiResponse<Payment>>("/api/v1/payments", payload)
          .then((response: any) => {
            if(response.status !== 'success'){
              throw new Error("Failed to create payment");
            }
            const data = response.data || {}
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      });
    },
    async updatePayment(id: string, payload: Partial<Payment>): Promise<Payment> {
      return new Promise((resolve, reject) => {
        axios.put<ApiResponse<Payment>>(`/api/v1/payments/${id}`, payload)
          .then((response: any) => {
            if(response.status !== 'success'){
              throw new Error("Failed to update payment");
            }
            const data = response.data || {}
            this.paymentDetail = data
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      });
    },
    async deletePayment(id: string): Promise<void> {
      return new Promise((resolve, reject) => {
        axios.delete(`/api/v1/payments/${id}`)
          .then(() => {
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      });
    }
  },
})
