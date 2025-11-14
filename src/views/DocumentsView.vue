<script setup lang="ts">
import AlertBase from '@/components/base/alert/AlertBase.vue'
import ButtonBase from '@/components/base/button/ButtonBase.vue'
import InputTextBase from '@/components/base/input/InputTextBase.vue'
import InputSelectBase from '@/components/base/input/InputSelectBase.vue'
import InputNumberBase from '@/components/base/input/InputNumberBase.vue'
import InputTextareaBase from '@/components/base/input/InputTextareaBase.vue'
import IconBack from '@/components/icons/IconBack.vue'
import IconSpin from '@/components/icons/IconSpin.vue'
</script>
<template>
  <div class="grid grid-cols-1 gap-4">
    <AlertBase
      title="Title"
      description="Description"
      type="success"
    />
    <ButtonBase
      text="Submit"
      type="submit"
      color="primary"
    />
    <p class="text-sm text-primary-500">
      This is a paragraph.
    </p>
  </div>
</template>