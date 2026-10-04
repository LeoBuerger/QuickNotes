<template>
  <article class="card">
    <header v-if="$slots.header" class="card-header"><slot name="header" /></header>
    <div class="card-body"><slot /></div>
  </article>
</template>
