<script setup lang="ts">
import { computed } from 'vue';
import IconError from '@/components/icons/IconError.vue'
// import IconWarning from '@/components/icons/IconWarning.vue'
// import IconInformational from '@/components/icons/IconInformational.vue'
// import IconSuccess from '@/components/icons/IconSuccess.vue'

const props = defineProps({
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  title: {
    type: String,
    required: false,
    default: 'Title',
  },
  description: {
    type: String,
    required: false,
  },
  type: {
    type: String as () => 'success' | 'informational' | 'warning' | 'error',
    required: false,
    default: 'success' ,
  }
})

const titleStyle = computed(() => {
  return {
    'text-red-800': props.type === 'error',
    'text-yellow-800': props.type === 'warning',
    'text-green-800': props.type === 'success',
    'text-blue-800': props.type === 'informational',
  }
})
const iconStyle = computed(() => {
  return {
    'text-red-400': props.type === 'error',
    'text-yellow-400': props.type === 'warning',
    'text-green-400': props.type === 'success',
    'text-blue-400': props.type === 'informational',
  }
})
const contentStyle = computed(() => {
  return {
    'bg-red-50 border border-red-200': props.type === 'error',
    'bg-yellow-50 border border-yellow-200': props.type === 'warning',
    'bg-green-50 border border-green-200': props.type === 'success',
    'bg-blue-50 border border-blue-200': props.type === 'informational',
  }
})
const IconComponent = computed(() => {
  switch (props.type) {
    case 'error':
      return IconError
    // case 'warning':
    //   return IconWarning
    // case 'success':
    //   return IconSuccess
    // case 'informational':
    //   return IconInformational
    default:
      return IconError
  }
})
</script>
<template>
  <div :class="['rounded-md p-4',contentStyle]">
    <div class="flex">
      <div class="flex-shrink-0">
        <slot name="icon" v-if="$slots.icon"></slot>
        <IconComponent v-else :class="iconStyle" />
      </div>
      <div class="ml-3">
        <p :class="['text-sm',titleStyle]">{{ props.title }}</p>
        <p v-if="props.description" class="text-sm text-gray-700">{{ props.description }}</p>
      </div>
    </div>
  </div>
</template>