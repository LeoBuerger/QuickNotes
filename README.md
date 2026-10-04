# QuickNotes – Hausübung 2

Kleine Vue-3-App mit TypeScript: Notizen mit Titel, Text und beliebig vielen kommaseparierten Tags anlegen, löschen und live nach Titel, Text oder Tags durchsuchen. Speicherung in localStorage. Keine zusätzlichen Produktfunktionen.

## Setup

Voraussetzung: Node.js 22.12 oder neuer (alternativ 20.19 oder neuer innerhalb der 20er-Serie) und npm.

```bash
git clone https://github.com/LeoBuerger/QuickNotes.git
cd QuickNotes
npm install
npm run dev
```

Die im Terminal angezeigte lokale Adresse öffnen. Für eine reproduzierbare Installation anhand des enthaltenen Lockfiles ist alternativ `npm ci` möglich.

```bash
npm run build
npm run preview
```

`build` prüft die Typen mit vue-tsc und erstellt danach den Produktions-Build. `preview` zeigt diesen lokal an. Unter Windows bei blockiertem `npm.ps1` die Befehle mit `npm.cmd` ausführen, z. B. `npm.cmd install`.

## Struktur und Verantwortung

Die Notiz-Logik liegt in `useNotes.js`, damit Komponenten nur Eingaben und Darstellung übernehmen und dieselbe Logik wiederverwendbar bleibt. `useLocalStorage.js` kapselt Laden, Validierung und Speichern; die Komponenten greifen nicht auf localStorage zu. `App.vue` verbindet Props und Events, während `BaseCard.vue` über Slots wiederverwendbares Markup bereitstellt.

```text
src/
  App.vue
  main.ts
  style.css
  components/
    BaseCard.vue
    NoteCard.vue
    NoteForm.vue
    SearchBar.vue
  composables/
    useNotes.js
    useLocalStorage.js
  types/
    note.ts
```

Das Gerüst wurde ergänzt; `searchBar.vue` und `notes.ts` heißen gemäß Aufgabenstellung nun `SearchBar.vue` und `note.ts`. Die `.js`-Composables bleiben wie gefordert JavaScript, werden aber mit JSDoc typisiert und durch `checkJs` geprüft. Die Vue-Komponenten verwenden `script setup lang="ts"`; das Note-Interface wird in Form, Card und Notiz-Logik verwendet.

## Drei Reflexionsfragen

## Warum darf NoteCard die Notiz-Prop nicht selbst verändern?

Props transportieren Daten vom Elternteil zum Kind. Eine direkte Änderung würde die Zuständigkeit für den Zustand unklar machen. NoteCard sendet `emit('delete', note.id)`. App.vue empfängt das Ereignis und ruft `deleteNote` aus dem Composable auf.

## Was passiert bei zwei Aufrufen von useNotes()?

In dieser Implementierung entstehen zwei unabhängige reaktive Listen, weil `useLocalStorage` und der Zustand innerhalb von `useNotes()` erzeugt werden. Beide laden zwar dasselbe, teilen aber kein Ref und synchronisieren sich nicht automatisch. Deshalb ruft nur App.vue `useNotes()` auf und gibt Daten und Events weiter.

## Wozu dient das Note-Interface?

Es beschreibt die erwartete Datenstruktur: numerische ID, Titel, Text und ein Array von Tags. TypeScript kann damit fehlerhafte Props und Event-Nutzdaten vor dem Ausführen erkennen. Neue Notizen verwenden `Omit<Note, 'id'>`, denn die ID erzeugt erst das Composable. Das Interface existiert zur Laufzeit nicht; geladene JSON-Daten werden deshalb zusätzlich geprüft.

## Datenfluss zum Erklären

- Anlegen: Formular hält seine Eingaben lokal → `add`-Event mit Titel/Text/Tags → App.vue → `addNote` → Notizliste → Persistenz-Watcher.
- Löschen: NoteCard → `delete`-Event mit ID → App.vue → `deleteNote`.
- Suche: SearchBar empfängt `modelValue` und sendet `update:modelValue` → `searchTerm` in App.vue → berechnete Ansicht in `useNotes`.
- Slots: NoteCard liefert den Titel und Löschen-Button an `#header`, Text und Tags an den Default-Slot von BaseCard.


