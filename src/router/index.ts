import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/documents',
      name: 'documents',
      component: () => import('@/views/DocumentsView.vue'),
    },
    {
      path: '/rooms',
      name: 'rooms',
      component: () => import('@/views/rooms/RoomListView.vue'),
    },
    {
      path: '/rooms/new',
      name: 'room-create',
      component: () => import('@/views/rooms/RoomCreateView.vue'),
    },
    {
      path: '/rooms/detail/:id',
      name: 'room-detail',
      component: () => import('@/views/rooms/RoomDetailView.vue'),
    },
    {
      path: '/rooms/:id/edit',
      name: 'room-edit',
      component: () => import('@/views/rooms/RoomEditView.vue'),
    },
    {
      path: '/tenants',
      name: 'tenants',
      component: () => import('@/views/tenants/TenantListView.vue'),
    },
    {
      path: '/tenants/new',
      name: 'tenant-create',
      component: () => import('@/views/tenants/TenantCreateView.vue'),
    },
    {
      path: '/tenants/detail/:id',
      name: 'tenant-detail',
      component: () => import('@/views/tenants/TenantDetailView.vue'),
    },
    {
      path: '/contracts',
      name: 'contracts',
      component: () => import('@/views/contracts/ContractListView.vue'),
    },
    {
      path: '/contracts/create',
      name: 'contract-create',
      component: () => import('@/views/contracts/ContractCreateView.vue'),
    },
    {
      path: '/contracts/detail/:id',
      name: 'contract-detail',
      component: () => import('@/views/contracts/ContractDetailView.vue'),
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/ReportsView.vue'),
    },
  ],
})

export default router
