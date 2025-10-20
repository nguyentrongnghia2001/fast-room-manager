<script setup lang="ts">
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
  rows: {
    type: Number,
    required: false,
    default: 3,
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
  <label :for="props.name" class="block text-sm font-medium text-gray-700">{{ props.label }}</label>
  <textarea
    :id="props.name"
    v-model="vModel"
    :rows="props.rows"
    :placeholder="props.placeholder"
    :class="[
      'mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm',
      props.errors ? 'border-red-300' : ''
    ]"
  ></textarea>
  <p v-if="props.errors" class="mt-2 text-sm text-red-600">{{ props.errors }}</p>
</template>
