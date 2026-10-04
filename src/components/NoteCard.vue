<script setup lang="ts">
import BaseCard from './BaseCard.vue'
import type { Note } from '../types/note'
defineProps<{ note: Readonly<Omit<Note, 'tags'>> & { readonly tags: readonly string[] } }>()
const emit = defineEmits<{ delete: [id: number] }>()
</script>

<template>
  <BaseCard>
    <template #header>
      <h3>{{ note.title }}</h3>
      <button class="delete" type="button" :aria-label="`Notiz ${note.title} löschen`" @click="emit('delete', note.id)">Löschen</button>
    </template>
    <p class="note-content">{{ note.content }}</p>
    <ul v-if="note.tags.length" class="tags" aria-label="Tags">
      <li v-for="tag in note.tags" :key="tag">{{ tag }}</li>
    </ul>
  </BaseCard>
</template>
