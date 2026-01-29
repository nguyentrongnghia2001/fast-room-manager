import type { ApiResponse, DashboardStats } from '@/types'
import { defineStore } from 'pinia'
import axios from '@/plugins/axios' 

interface RevenueStats {
  thisMonth: number
  growth: number
  pending: number
}

export const useReportStore = defineStore('report', {
  state: () => ({
    dashboardStats: {} as DashboardStats,
    revenueStats: {} as RevenueStats,
  }),
  actions: {
    async getDashboardStats(): Promise<DashboardStats> {
      return new Promise((resolve, reject) => {
        axios.get<ApiResponse<DashboardStats>>("/api/v1/reports/dashboard")
          .then((response: any) => {
            if(response.status !== 'success'){
              throw new Error("Failed to fetch dashboard stats");
            }
            this.dashboardStats = response.data || {}            
            resolve(this.dashboardStats)
          })
          .catch((error) => {
            reject(error)
          })
      });
    },
    async getRevenueStats(): Promise<RevenueStats> {
      return new Promise((resolve, reject) => {
        axios.get<ApiResponse<RevenueStats>>("/api/v1/reports/revenue")
          .then((response: any) => {
            if(response.status !== 'success'){
              throw new Error("Failed to fetch revenue stats");
            }
            this.revenueStats = response.data || {}            
            resolve(this.revenueStats)
          })
          .catch((error) => {
            reject(error)
          })
      });
    }
  },
})
