import type { ApiResponse, Floor } from '@/types'
import { defineStore } from 'pinia'
import axios from '@/plugins/axios'

export const useFloorStore = defineStore('floor', {
  state: () => ({
    listFloors: [] as Floor[],
    floorDetail: {} as Floor,
  }),
  actions: {
    async getListFloors(): Promise<Floor[]> {
      return new Promise((resolve, reject) => {
        axios.get<ApiResponse<Floor[]>>("/api/v1/floor")
          .then((response: any) => {
            if(response.status !== 'success'){
              throw new Error("Failed to fetch floors");
            }
            this.listFloors = response.data || []            
            resolve(this.listFloors)
          })
          .catch((error) => {
            reject(error)
          })
      });
    }
  },
})