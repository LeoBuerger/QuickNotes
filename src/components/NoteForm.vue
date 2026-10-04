<script setup lang="ts">
import { ref } from 'vue'
import type { Note } from '../types/note'
const emit = defineEmits<{ add: [note: Omit<Note, 'id'>] }>()
const title = ref('')
const content = ref('')
const tags = ref('')
const error = ref('')

function submitNote() {
  if (!title.value.trim() || !content.value.trim()) {
    error.value = 'Bitte Titel und Text ausfüllen.'
    return
  }
  emit('add', {
    title: title.value.trim(), content: content.value.trim(),
    tags: tags.value.split(',').map(tag => tag.trim()).filter(Boolean),
  })
  title.value = ''
  content.value = ''
  tags.value = ''
  error.value = ''
}
</script>

<template>
  <form class="note-form" @submit.prevent="submitNote">
    <h2>Neue Notiz</h2>
    <label for="title">Titel</label>
    <input id="title" v-model="title" required placeholder="Woran möchtest du dich erinnern?">
    <label for="content">Text</label>
    <textarea id="content" v-model="content" required rows="5" placeholder="Deine Gedanken …"></textarea>
    <label for="tags">Tags <span class="muted">(optional)</span></label>
    <input id="tags" v-model="tags" placeholder="Uni, Arbeit, Party" aria-describedby="tags-help">
    <p id="tags-help" class="help">Mehrere Tags mit Komma trennen.</p>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <button class="primary" type="submit">Notiz anlegen</button>
  </form>
</template>
