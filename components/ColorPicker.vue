<template>
  <div class="relative inline-block">
    <button
      type="button"
      class="w-5 h-5 rounded-full border border-gray-300 hover:scale-110 transition-transform"
      :style="{ backgroundColor: modelValue }"
      @click="open = !open"
    />
    <div
      v-if="open"
      class="absolute z-50 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex flex-wrap gap-1.5 w-40"
    >
      <button
        v-for="c in USER_COLORS"
        :key="c"
        type="button"
        class="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
        :class="modelValue === c ? 'border-gray-800 scale-110' : 'border-transparent'"
        :style="{ backgroundColor: c }"
        @click="select(c)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { USER_COLORS } from '~/types'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [color: string]
}>()

const open = ref(false)

function select(c: string) {
  emit('update:modelValue', c)
  open.value = false
}

// Close on outside click
if (import.meta.client) {
  const handler = (e: Event) => {
    const target = e.target as HTMLElement
    if (open.value && !target.closest('.relative.inline-block')) {
      open.value = false
    }
  }
  onMounted(() => document.addEventListener('click', handler))
  onUnmounted(() => document.removeEventListener('click', handler))
}
</script>
