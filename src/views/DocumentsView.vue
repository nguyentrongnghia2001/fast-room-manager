<script setup lang="ts">
import AlertBase from '@/components/base/alert/AlertBase.vue'
import ButtonBase from '@/components/base/button/ButtonBase.vue'
import Icons from '@/components/icons/index.vue'
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
    <div class="bg-primary-500 w-10 h-auto flex-col flex items-center justify-center">
      <Icons name="IconDocumentation" /> 
      <Icons name="IconBack" /> 
      <Icons name="IconDocumentation" /> 
    </div>
  </div>
</template>