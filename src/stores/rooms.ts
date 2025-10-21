import type { ApiResponse, Room } from '@/types'
import { defineStore } from 'pinia'
import axios from '@/plugins/axios'

export const useRoomStore = defineStore('room', {
  state: () => ({
    listRooms: [] as Room[],
    roomDetail: {} as Room,
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
            resolve(this.listRooms)
          })
          .catch((error) => {
            reject(error)
          })
      });
    },
    async getDetailRoom(id: string): Promise<Room> {
      return new Promise((resolve, reject) => {
        axios.get<ApiResponse<Room>>(`/api/v1/rooms/${id}`)
          .then((response: any) => {
            if(response.status !== 'success'){
              throw new Error("Failed to fetch rooms");
            }
            const data = response.data || {}
            this.roomDetail = data
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      });
    },
    async createRoom(payload: any): Promise<Room> {
      return new Promise((resolve, reject) => {
        axios.post<ApiResponse<Room>>(`/api/v1/rooms`, payload)
          .then((response: any) => {
            if(response.status !== 'success'){
              throw new Error("Failed to create room");
            }
            const data = response.data || {}
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      });
    }
  },
})