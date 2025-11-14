<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: 'IconTooling',
    required: true
  }
})
const iconComponent = computed(() =>
  defineAsyncComponent(() =>
    import(`/src/components/icons/${props.name}.vue`)
  )
)

</script>

<template>
  <component :is="iconComponent" />
</template>