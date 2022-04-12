<script setup lang="ts">
import { ref, computed,  toRefs, defineProps, withDefaults} from 'vue'
import { useTable } from '../../composables/table'
const props = withDefaults(defineProps<{
    data: Object[],
    fields: string[],
    display_options: boolean,
    per_page: number,
    edit_link: string,
}>(),
{
    data: () => [],
    fields: () => [],
    display_options: false,
    per_page: 13,
    edit_link: '',
})
const {
    data,
    fields,
    display_options,
    per_page,
    edit_link
} = props
let sort_column  = ref('')
let sort_order  = ref(true)
let display_data  = ref(data)
let filtered = ref(data)
let display = ref(data)
let page = ref(1)
let pages = ref(1)
let page_display = ref(15)
let search = ref('')
let last_search = ref('')
let display_search = ref('')

function firstUpper(str : string)
{
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function sortTable(column : string){
if(sort_column.value == column) 
{
    sort_order.value = !sort_order.value;
}
else
{
    sort_order.value = true
    sort_column.value = column;
}
// reduce display data into display
filtered.value.sort((a : any, b : any) => 
{
    if(a[sort_column.value] < b[sort_column.value])
    {
        return sort_order.value ? -1 : 1;
    }
    if(a[sort_column.value] > b[sort_column.value])
    {
        return sort_order.value ? 1 : -1;
    }
    return 0;
})
updatePagination()
}

function nextPage(){
    page.value++;
    updatePagination();
}
function prevPage(){
    page.value--;
    updatePagination();
}
function setPage(pgn: number){
    page.value = pgn;
    updatePagination();
}
function updatePagination(){
    if(page.value == 0)
    {
    page.value = pages.value;
    }
    let comeco =
        per_page * (page.value - 1)
    let final =
        per_page * page.value
    if (comeco >= filtered.value.length) {
        page.value = 1
        comeco =
        per_page * (page.value - 1)
        final = per_page * page.value
    }
    pages.value = Math.ceil(filtered.value.length / per_page)
    display.value = filtered.value.slice(comeco, final)
}
function updateSearch(){
    const filtered_set = display_data.value.filter((item:any) => {
        for(const key in fields)
        {
            if(item[fields[key] as string].toString().toLowerCase().includes(search.value.toLowerCase()))
            {
                return true;
            }
        }
        return false;
    });
    if(filtered_set.length != 0 || display_data.value.length == 0)
    {
        filtered.value = filtered_set;
        last_search.value = search.value;
    }
    const search_set= search.value.search(last_search.value);
    if(search_set == 0)
    {
        display_search.value = `<font color="white">${last_search.value}</font><font color="red">${search.value.replace(last_search.value,'')}</font>`;
    }
    else if(search_set >= 0)
    {
        const mid = search.value.split(last_search.value);
        display_search.value = `<font color="red">${mid[0]}</font><font color="white">${last_search.value}</font><font color="red">${mid[1]}</font>`;

    }
    else
    {
        display_search.value = `<font color="red">${search.value}</font>`;
    }
    updatePagination()
}
function remove(row: any){
    // $emit.value('remove', row);
    display_data.value = display_data.value.filter((item:any) => item != row);
    updateSearch()
}
updatePagination()
let display_pages = computed<object>(()=>{
            const result = []
            let start;
            let end;
            if(page_display.value >= pages.value - 4)
            {
                start = 1;
                end = pages.value;
            }
            else
            {
                let leftpad = Math.ceil(page_display.value/2)
                let rightpad = Math.ceil(page_display.value/2)
                if(page.value - leftpad < 0)
                {
                    rightpad -= page.value - leftpad 
                    leftpad = 1
                }
                else
                {
                    leftpad = page.value - leftpad + 1
                }
                if(page.value + rightpad > pages.value)
                {
                    leftpad -= page.value + rightpad - pages.value
                    rightpad = pages.value
                }
                else
                {
                    rightpad = page.value + rightpad
                }
                start = leftpad
                end = rightpad

                if(start <= 1)
                {
                    end +=1
                }
                if(start <= 2)
                {
                    end +=1
                }
                if(end >= pages.value)
                {
                    start -= 1;
                }
                if(end >= pages.value-1)
                {
                    start -= 1;
                }
            }
            for(let i = start; i <= end; i++){
                result.push(i)
            }
            return result
    })
</script>
<template>
<div>
    {{}}
  <div style="max-width:800px;margin:auto;margin-bottom:50px;margin-top:40px">
  <div style="margin:20px 0 20px 0;">
            <div v-html="display_search" class="phantom-input-overlay"></div>
            <i aria-hidden="true" class="fa fa-search fa-fw search-icon"></i>
            <input type="text" class="form-control input-sm phantom-input" v-model="search" @input="updateSearch()" placeholder="Digite para buscar"/>
            </div>
  </div>
    <table cellspacing="0">
        <tr>
          <th v-for="title in fields" :key="title" @click="sortTable(title)" class="table-header no-select">
            {{ firstUpper(title) }}
            <i
                class="fa fa-fw fa-sort"
                :class="{
                    'fa-sort-amount-asc' : sort_column == title && sort_order == true,
                    'fa-sort-amount-desc': sort_column == title && sort_order == false,
                }"
            ></i>
          </th>
          <th v-if="display_options" >Options</th>
        </tr>
        <tr v-for="row in display" :key="row">
          <td v-for="col in fields" :key="col">
            {{ row[col] }}
          </td>
          <td class="options" v-if="display_options">
            <router-link :to="`/${edit_link}/${row.id}`">
                <i class="fa fa-edit info hover"></i>
            </router-link>
            <i @click="remove(row)" class="fa fa-trash danger hover"></i>
          </td>
        </tr>
        <tr v-for="i in display.length <= per_page ? (per_page - display.length) : 0" :key="i">
          <td v-for="col in fields" :key="col" class="row-placeholder no-select">
            *
          </td>
          <td class="row-placeholder no-select" v-if="display_options">*</td>
        </tr>
      </table>
      <div class="col-12 d-flex justify-content-center" v-if="display_data.length != 0">
          <nav aria-label="Page navigation example">
              <ul class="pagination">
                  <li class="page-item">
                      <a class="page-link" href="#" @click.prevent="prevPage()" :class="{'disabled':page == 1}">
                          <span aria-hidden="true">
                              <i class="fa fa-angle-left" aria-hidden="true"></i>
                          </span>
                      </a>
                  </li>
                  <li class="page-item" :key="index" v-if="display_pages[0] != 1">
                      <a href="#" @click.prevent="setPage(1)" class="page-link" :class="{'btn-blue': page == 1}">
                          1
                      </a>
                  </li>
                  <li class="page-item">
                      <a class="page-link disabled no-select"  v-if="display_pages[0] != 1 && display_pages[0] != 2">
                          <span aria-hidden="true">
                              ...
                          </span>
                      </a>
                  </li>
                  <li class="page-item" v-for="index in display_pages" :key="index">
                      <a href="#" @click.prevent="setPage(index)" class="page-link" :class="{'btn-blue': page == index}">
                          {{ index }}
                      </a>
                  </li>
                  <li class="page-item" v-if="display_pages[display_pages.length-1] != pages && display_pages[display_pages.length-1] != pages-1">
                      <a class="page-link disabled no-select">
                          <span aria-hidden="true">
                              ...
                          </span>
                      </a>
                  </li>
                  <li class="page-item" v-if="display_pages[display_pages.length-1] != pages">
                      <a href="#" @click.prevent="setPage(pages)" class="page-link" :class="{'btn-blue': page == pages}">
                          {{ pages }}
                      </a>
                  </li>
                  <li class="page-item">
                      <a class="page-link" href="#" @click.prevent="nextPage()" :class="{'disabled':page == pages}">
                          <span aria-hidden="true">
                              <i class="fa fa-angle-right" aria-hidden="true"></i>
                          </span>
                      </a>
                  </li>
              </ul>
          </nav>
      </div>
    </div>
</template>

<style scoped>
/* nav */
.row-placeholder{
    color: transparent;
}

.pagination{
  margin-top: 20px;
}

.page-link{
  background-color: var(--medium);
  color:white;
  border-color: var(--bright)
}

.btn-blue{
  background-color: var(--dark);
  color:white;
}
/* search */
.phantom-input-overlay{
    pointer-events: none;
    position:absolute;
    margin-left:36px;
    margin-top:7px
}
.phantom-input{
    color: transparent;
    caret-color: white;
    padding-left: 35px;
}
.phantom-input:focus{
    color: red;
    caret-color: white;
}
.search-icon{
    pointer-events: none;
    position:absolute;
    margin-left:10px;
    margin-top:10px;
    color:rgb(134, 134, 134);
}
/* table */
table{
    --radious: 12px;
    margin-top: 15px;
    width: 100%;
    text-align: center;
    border-collapse:separate;
    overflow: hidden;
     
}
td, th{
    padding: 10px;
    border:1px solid var(--bright);
}

th, td{
    border-bottom-width: 0;
    border-left-width: 0;
}
tr:last-child td, tr:last-child td{
    border-bottom-width: 1px;
}

th:first-child, td:first-child{
    border-left-width: 1px;
}

tr:first-child th:first-child{
    border-radius:var(--radious) 0 0 0;
}

tr:first-child th:last-child{
    border-radius:0 var(--radious) 0 0;
}

tr:last-child td:first-child{
    border-radius:0 0 0 var(--radious);
}

tr:last-child td:last-child{
    border-radius:0 0 var(--radious) 0;
}

th{
    color:white;
    background-color: var(--medium)
}
td{
    color:#aaa;
}
tr{
    background-color: var(--dark);
}
tr:hover{
    background-color: var(--dark-selection);
}
.table-header{
    cursor: pointer;
}
.options i:not(:first-child){
    margin-left: 10px;
}
.options i{
    font-size: 15pt;
    cursor: pointer;
}

</style>