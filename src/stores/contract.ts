import type { ApiResponse, Contract } from '@/types'
import { defineStore } from 'pinia'
import axios from '@/plugins/axios' 

export const useContractStore = defineStore('contract', {
  state: () => ({
    listContracts: [] as Contract[],
    contractDetail: {} as Contract,
  }),
  actions: {
    async getListContracts(): Promise<Contract[]> {
      return new Promise((resolve, reject) => {
        axios.get<ApiResponse<Contract[]>>("/api/v1/contract")
          .then((response: any) => {
            if(response.status !== 'success'){
              throw new Error("Failed to fetch contracts");
            }
            const data = response.data
            this.listContracts = Array.isArray(data) ? data : (data?.items || data?.contracts || data?.list || [])
            resolve(this.listContracts)
          })
          .catch((error) => {
            reject(error)
          })
      });
    },
    async getDetailContract(id: string): Promise<Contract> {
      return new Promise((resolve, reject) => {
        axios.get<ApiResponse<Contract>>(`/api/v1/contract/${id}`)
          .then((response: any) => {
            if(response.status !== 'success'){
              throw new Error("Failed to fetch contracts");
            }
            const data = response.data || {}
            this.contractDetail = data
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      });
    },
    async createContract(payload: Partial<Contract>): Promise<Contract> {
      return new Promise((resolve, reject) => {
        axios.post<ApiResponse<Contract>>("/api/v1/contract", payload)
          .then((response: any) => {
            if(response.status !== 'success'){
              throw new Error("Failed to create contract");
            }
            const data = response.data || {}
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      });
    },
    async updateContract(id: string, payload: Partial<Contract>): Promise<Contract> {
      return new Promise((resolve, reject) => {
        axios.put<ApiResponse<Contract>>(`/api/v1/contract/${id}`, payload)
          .then((response: any) => {
            if(response.status !== 'success'){
              throw new Error("Failed to update contract");
            }
            const data = response.data || {}
            this.contractDetail = data
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      });
    },
    async deleteContract(id: string): Promise<void> {
      return new Promise((resolve, reject) => {
        axios.delete(`/api/v1/contract/${id}`)
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