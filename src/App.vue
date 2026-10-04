<script setup lang="ts">
import { ref } from 'vue'
import NoteForm from './components/NoteForm.vue'
import NoteCard from './components/NoteCard.vue'
import SearchBar from './components/SearchBar.vue'
import { useNotes } from './composables/useNotes.js'

const searchTerm = ref('')
const { notes, storageError, addNote, deleteNote, filteredNotes } = useNotes()
const visibleNotes = filteredNotes(searchTerm)
</script>

<template>
  <main class="app">
    <header class="page-header">
      <p class="eyebrow">GEDANKEN FESTHALTEN</p>
      <h1>QuickNotes<span>.</span></h1>
      <p>Ein Platz für deine Ideen, Lernnotizen und kleinen Erinnerungen.</p>
    </header>
    <p v-if="storageError" role="alert" class="error">{{ storageError }}</p>
    <div class="layout">
      <aside><NoteForm @add="addNote" /></aside>
      <section aria-labelledby="notes-heading">
        <div class="list-heading"><h2 id="notes-heading">Deine Notizen</h2><span class="count" aria-live="polite">{{ visibleNotes.length }} / {{ notes.length }}</span></div>
        <SearchBar v-model="searchTerm" />
        <div v-if="visibleNotes.length" class="note-list">
          <NoteCard v-for="note in visibleNotes" :key="note.id" :note="note" @delete="deleteNote" />
        </div>
        <p v-else class="empty" role="status">{{ notes.length ? 'Keine passenden Notizen gefunden.' : 'Noch keine Notizen. Lege deine erste Notiz an.' }}</p>
      </section>
    </div>
  </main>
</template>
