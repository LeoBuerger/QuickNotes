import assert from 'node:assert/strict'
import { effectScope, ref } from 'vue'
import { useNotes } from './src/composables/useNotes.js'
const store = new Map()
globalThis.localStorage = {getItem: key => store.get(key) ?? null, setItem: (key,value) => store.set(key,value)}
const scope=effectScope()
const n=scope.run(()=>useNotes())
n.addNote({title:'Vue lernen',content:'Composition API',tags:['Uni','Frontend','Uni',' ']})
n.addNote({title:'Einkaufen',content:'Milch',tags:[]})
assert.equal(n.notes.value.length,2)
assert.deepEqual([...n.notes.value[0].tags],['Uni','Frontend'])
const query=ref('VUE'), view=n.filteredNotes(query)
for(const term of ['VUE','composition','frontend']) {query.value=term;assert.equal(view.value.length,1)}
query.value='unbekannt';assert.equal(view.value.length,0)
query.value='';assert.equal(view.value.length,2)
const old=n.notes.value[0].id
n.deleteNote(old)
n.addNote({title:'Neu',content:'Inhalt',tags:[]})
assert.equal(new Set(n.notes.value.map(x=>x.id)).size,2)
assert(n.notes.value.every(x=>x.id!==old))
n.addNote({title:' ',content:' ',tags:[]});assert.equal(n.notes.value.length,2)
const scope2=effectScope(), loaded=scope2.run(()=>useNotes())
assert.equal(loaded.notes.value.length,2)
loaded.addNote({title:'Separat',content:'State',tags:[]});assert.equal(n.notes.value.length,2)
scope.stop();scope2.stop()
store.set('quicknotes','broken-json')
const scope3=effectScope(), recovered=scope3.run(()=>useNotes())
assert.equal(recovered.notes.value.length,0);assert(recovered.storageError.value)
recovered.addNote({title:'Weiter',content:'Geht',tags:[]});assert.equal(recovered.storageError.value,'')
scope3.stop()
console.log('PASS: add, tags, reactive title/text/tag filter, delete, unique IDs, persistence reloading, independent instances, whitespace validation, invalid JSON recovery.')
