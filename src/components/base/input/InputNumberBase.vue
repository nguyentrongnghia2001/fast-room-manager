<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  label: String,
  name: { type: String, required: true },
  modelValue: { type: [String, Number], required: true },
  errors: String,
  placeholder: { type: String, default: 'Enter' },
  suffix: { type: String, default: 'VND' },
})

const emit = defineEmits(['update:modelValue', 'change'])

const vModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const handleInput = (event: Event) => {
  emit('update:modelValue', event)
  emit('change', event)
}

const handleKeyDown = (event: KeyboardEvent) => {
  const allowedKeys = [
    'Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete',
  ]

  if (allowedKeys.includes(event.key)) return

  if (!/^[0-9]$/.test(event.key)) {
    event.preventDefault()
  }
}
</script>

<template>
  <label :for="props.name" class="block text-sm font-medium text-gray-700">{{ props.label }}</label>

  <div class="mt-1 relative rounded-md shadow-sm">
    <input
      :id="props.name"
      :value="vModel"
      @input="handleInput"
      @keydown="handleKeyDown"
      type="text"
      inputmode="numeric"
      :placeholder="props.placeholder"
      :class="[
        'block w-full pr-12 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm',
        props.errors ? 'border-red-300' : ''
      ]"
    >
    <div v-if="props.suffix" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
      <span class="text-gray-500 sm:text-sm">{{ props.suffix }}</span>
    </div>
  </div>

  <p v-if="props.errors" class="mt-2 text-sm text-red-600">{{ props.errors }}</p>
</template>
