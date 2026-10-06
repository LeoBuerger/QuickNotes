# AI-LOG

1. Prompt: „Wie verbinde ich das Ereignis aus NoteForm mit der Funktion zum Anlegen einer Notiz?“
   - KI-Antwort: „NoteForm sendet mit `emit('add', ...)` die Formulardaten. `@add="addNote"` in App.vue empfängt das Ereignis und übergibt diese Daten an `addNote`.“
   - Umsetzung/verstanden: Den Listener an NoteForm ergänzt. Ohne ihn wird das Formular geleert, aber keine Notiz angelegt.

2. Prompt: „Warum übergebe ich searchTerm und nicht searchTerm.value, damit die Suche live funktioniert?“
   - KI-Antwort: „searchTerm ist ein Ref. Wenn du dieses Ref übergibst, kann die computed-Funktion Änderungen verfolgen. Mit searchTerm.value würdest du hier nur den aktuellen String übergeben.“
   - Umsetzung/verstanden: Das Ref an filteredNotes übergeben. Innerhalb der berechneten Ansicht liest unref(term) den aktuellen Suchtext.

3. Prompt: „Warum brauche ich deep: true beim Speichern der Notizen?“
   - KI-Antwort: „Beim Anlegen wird das vorhandene Array mit push verändert. deep: true sorgt dafür, dass der Watcher auch solche Änderungen innerhalb des Arrays erkennt.“
   - Umsetzung/verstanden: Den tiefen Watcher für die Persistenz verwendet. Dadurch löst auch das Hinzufügen einer Notiz das Speichern aus.

4. Prompt: „Wie entferne ich genau eine Notiz anhand ihrer ID?“
   - KI-Antwort: „Mit `notes.value.filter(note => note.id !== id)` erzeugst du ein neues Array, das alle Notizen außer der mit der gesuchten ID enthält.“
   - Umsetzung/verstanden: Das Filterergebnis wieder notes.value zugewiesen. filter verändert das ursprüngliche Array nicht, deshalb ist die Zuweisung nötig.

5. Prompt: „Wie entferne ich Leerzeichen, leere Tags und doppelte Tags?“
   - KI-Antwort: „map mit trim entfernt äußere Leerzeichen. filter(Boolean) entfernt anschließend leere Strings. Set entfernt gleiche Strings; der Spread-Operator wandelt das Ergebnis wieder in ein Array um.“
   - Umsetzung/verstanden: Die Tags vor dem Speichern bereinigt. Beispielsweise wird aus ['Uni', ' Uni ', ''] das Array ['Uni']. Groß- und Kleinschreibung bleiben dabei relevant.