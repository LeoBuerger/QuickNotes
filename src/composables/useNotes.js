import { computed, readonly, unref } from 'vue'
import { useLocalStorage } from './useLocalStorage.js'

/** @typedef {import('../types/note').Note} Note */

/** @param {unknown} value @returns {value is Note[]} */
function isNoteList(value) {
  return Array.isArray(value) && value.every(note =>
    note !== null && typeof note === 'object' &&
    Number.isSafeInteger(note.id) && note.id >= 0 &&
    typeof note.title === 'string' && typeof note.content === 'string' &&
    Array.isArray(note.tags) && note.tags.every((/** @type {unknown} */ tag) => typeof tag === 'string')
  ) && new Set(value.map(note => note.id)).size === value.length
}

export function useNotes() {
  // Innerhalb der Funktion hat jeder Aufruf seine eigene reaktive Liste.
  const { value: notes, storageError } = useLocalStorage('quicknotes', /** @type {Note[]} */ ([]), isNoteList)
  // Der Zähler startet vor allen gespeicherten IDs und wird nie zurückgesetzt.
  let nextId = Math.max(Date.now(), ...notes.value.map(note => note.id)) + 1

  /** @param {Omit<Note, 'id'>} draft */
  function addNote(draft) {
    const title = draft.title.trim()
    const content = draft.content.trim()
    if (!title || !content) return
    notes.value.push({
      id: nextId++, title, content,
      tags: [...new Set(draft.tags.map(tag => tag.trim()).filter(Boolean))],
    })
  }

  /** @param {number} id */
  function deleteNote(id) {
    notes.value = notes.value.filter(note => note.id !== id)
  }

  /** @param {import('vue').Ref<string> | string} term */
  function filteredNotes(term) {
    return computed(() => {
      const query = unref(term).trim().toLocaleLowerCase('de')
      return notes.value.filter(note =>
        [note.title, note.content, ...note.tags].some(text => text.toLocaleLowerCase('de').includes(query))
      )
    })
  }

  return { notes: readonly(notes), storageError: readonly(storageError), addNote, deleteNote, filteredNotes }
}
