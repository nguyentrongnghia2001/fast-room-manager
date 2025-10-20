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
            this.listContracts = response.data || []            
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
    }
  },
})