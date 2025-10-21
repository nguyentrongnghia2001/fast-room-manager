<script setup lang="ts">
import type { SelectOption } from '@/types/type';
import { computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    required: true,
  },
  errors: {
    type: String,
    required: false,
  },
  placeholder: {
    type: String,
    required: false,
    default: '',
  },
  options: {
    type: Array as () => SelectOption[] || [],
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])
const vModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>
<template>
  <label v-if="props.label" :for="props.name" class="block text-sm font-medium text-gray-700">{{ props.label }}</label>
    <select
      :id="props.name"
      v-model="vModel"
      :placeholder="props.placeholder"
      :class="[
        'mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm',
        props.errors ? 'border-red-300' : ''
      ]"
    >
    <option v-if="props.options.length > 0" value="">Chọn</option>
    <option v-else value="">Không có dữ liệu</option>
    <option v-if="props.options.length > 0" v-for="option in props.options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
  <p v-if="props.errors" class="mt-2 text-sm text-red-600">{{ props.errors }}</p>
</template>
