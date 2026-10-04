<script setup lang="ts">
// Das explizite modelValue/update:modelValue-Muster aus der Aufgabenstellung.
defineProps(['modelValue'])
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
function updateSearch(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="search">
    <label for="search">Notizen suchen</label>
    <input id="search" type="search" :value="modelValue" @input="updateSearch" placeholder="Titel, Text oder Tag …">
  </div>
</template>
