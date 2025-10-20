import type { ApiResponse, Tenant } from '@/types'
import { defineStore } from 'pinia'
import axios from '@/plugins/axios' 

export const useTenantStore = defineStore('tenant', {
  state: () => ({
    listTenants: [] as Tenant[],
    tenantDetail: {} as Tenant,
  }),
  actions: {
    async getListTenants(): Promise<Tenant[]> {
      return new Promise((resolve, reject) => {
        axios.get<ApiResponse<Tenant[]>>("/api/v1/tenant")
          .then((response: any) => {
            if(response.status !== 'success'){
              throw new Error("Failed to fetch tenants");
            }
            this.listTenants = response.data || []            
            resolve(this.listTenants)
          })
          .catch((error) => {
            reject(error)
          })
      });
    },
    async getDetailTenant(id: string): Promise<Tenant> {
      return new Promise((resolve, reject) => {
        axios.get<ApiResponse<Tenant>>(`/api/v1/tenant/${id}`)
          .then((response: any) => {
            if(response.status !== 'success'){
              throw new Error("Failed to fetch tenants");
            }
            const data = response.data || {}
            this.tenantDetail = data
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      });
    }
  },
})