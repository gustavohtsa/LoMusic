import { ref } from 'vue'
// import { useTable } from '../../composables/table'

export let sort_column  = ref('')
export let sort_order  = ref(true)
export let display_data  = ref([] as object[])
export let filtered = ref([] as object[])
export let display = ref([] as object[])
export let page = ref(1)
export let pages = ref(1)
export let page_display = ref(15)
export let search = ref('')
export let last_search = ref('')
export let display_search = ref('')
export let _per_page = ref(0)
export let _fields = ref([])
