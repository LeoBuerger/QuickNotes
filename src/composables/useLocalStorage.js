import { ref, watch } from 'vue'

/**
 * Speicherzugriffe bleiben in diesem Composable.
 * @template T
 * @param {string} key
 * @param {T} initialValue
 * @param {(value: unknown) => value is T} isValid
 */
export function useLocalStorage(key, initialValue, isValid) {
  const value = ref(initialValue)
  const storageError = ref('')
  try {
    const stored = localStorage.getItem(key)
    if (stored !== null) {
      const parsed = JSON.parse(stored)
      if (!isValid(parsed)) throw new Error('Ungültige gespeicherte Daten')
      value.value = parsed
    }
  } catch {
    storageError.value = 'Gespeicherte Notizen konnten nicht geladen werden. Neue Notizen sind weiterhin möglich.'
  }

  watch(value, (newValue) => {
    try {
      localStorage.setItem(key, JSON.stringify(newValue))
      storageError.value = ''
    } catch {
      storageError.value = 'Speichern im Browser nicht möglich. Neue Änderungen gehen beim Neuladen verloren.'
    }
  }, { deep: true, flush: 'sync' })

  return { value, storageError }
}
