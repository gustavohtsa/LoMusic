<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import tableControl from './components/table/tableControl.vue'

const table_fields : string[] = [
    "name",
    "email",
    "phone"
]

import tableData from './user-data.json'


</script>

<template>
<div class="container">
  <tableControl :data="tableData" :fields="table_fields" :display_options="true" edit_link="form"></tableControl>
</div>
</template>

<style>
</style>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
