<script setup lang="ts">
const props = defineProps({
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  text: {
    type: String,
    required: false,
    default: 'Submit',
  },
  type: {
    type: String as () => 'button' | 'submit' | 'reset',
    required: false,
    default: 'button',
  },
  color: {
    type: String as () => 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'outline',
    required: false,
    default: 'primary',
  },
})
</script>
<template>
  <button
    :disabled="loading"
    :class="[
      color === 'primary' ? 'bg-primary-600 focus:ring-primary-500 hover:bg-primary-700 ' : '',
      color === 'secondary' ? 'bg-yellow-600 focus:ring-yellow-500 hover:bg-yellow-700 ' : '',
      color === 'danger' ? 'bg-danger-600 focus:ring-danger-500 hover:bg-danger-700 ' : '',
      color === 'warning' ? 'bg-warning-600 focus:ring-warning-500 hover:bg-warning-700 ' : '',
      color === 'success' ? 'bg-success-600 focus:ring-success-500 hover:bg-success-700 ' : '',
      color === 'outline' ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500' : 'text-white focus:outline-none focus:ring-2 focus:ring-offset-2',
      'inline-flex items-center justify-center py-2 px-4 border shadow-sm text-sm font-medium rounded-md transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed',
    ]"
    :type="props.type"
  >
    <slot></slot>
    {{ text }}
  </button>
</template>