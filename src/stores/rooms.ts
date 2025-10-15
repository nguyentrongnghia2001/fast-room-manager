import type { ApiResponse, Room } from '@/types'
import { defineStore } from 'pinia'
import axios from '@/plugins/axios'

export const useRoomStore = defineStore('room', {
  state: () => ({
    listRooms: [] as Room[],
  }),
  actions: {
    async getListRooms(): Promise<Room[]> {
      return new Promise((resolve, reject) => {
        axios.get<ApiResponse<Room[]>>("/api/v1/rooms")
          .then((response: any) => {
            if(response.status !== 'success'){
              throw new Error("Failed to fetch rooms");
            }
            this.listRooms = response.data || []
            console.log(this.listRooms);
            
            resolve(this.listRooms)
          })
          .catch((error) => {
            reject(error)
          })
      });
    }
  },
})