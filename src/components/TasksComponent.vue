<template>
  <div class="q-pa-md">
    <q-table
      v-model:selected="selected"
      :selected-rows-label="() => ''"
      flat
      bordered
      :rows="rows"
      :columns="columns"
      selection="multiple"
      row-key="name"
    >
      <template #body-cell-name="props">
        <q-td
          key="name"
          :props="props"
        >
          {{ props.row.name }}
          <q-popup-edit
            v-slot="scope"
            v-model="props.row.name"
          >
            <q-input
              v-model="scope.value"
              dense
              autofocus
              counter
              @keyup.enter="() => {
                scope.set()
                save(props.row.id, scope.value)
              }"
            />
          </q-popup-edit>
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td
          key="actions"
          :props="props"
        >
          <q-btn
            flat
            dense
            round
            icon="delete"
            color="black"
            @click="() => deleteTask(props.row.id)"
          />
        </q-td>
      </template>

      <template #top>
        <q-btn
          color="primary"
          label="Add"
          icon="add"
          @click="add"
        />
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useClient } from '@vueauth/supabase'
import { useUserStore } from 'src/stores/user-store'

const componentProps = defineProps({
  name: {
    type: String,
    required: true
  }
})

const supabase = useClient()
const userStore = useUserStore()
const $q = useQuasar()

const selected = ref([])

const columns = [
  {
    name: 'name',
    required: true,
    label: componentProps.name + ' Task',
    align: 'left',
    field: row => row.name,
    sortable: true
  },
  {
    name: 'actions',
    field: 'actions',
    align: 'right'
  }
]

const rows = ref([])

async function getTasks () {
  const { data, error } = await supabase
    .from(componentProps.name.toLowerCase() + '_tasks')
    .select('*')
    .eq('user_id', userStore.currentUser)

  if (error) {
    console.log(error)
    $q.dialog({
      title: 'Error',
      message: error.message,
      cancel: true,
      persistent: true
    })
  } else {
    rows.value = data
  }
}

function add () {
  $q.dialog({
    title: 'Add Task',
    message: 'What is the task?',
    prompt: {
      model: '',
      isValid: val => val !== ''
    },
    cancel: true,
    persistent: true
  }).onOk((data) => {
    supabase
      .from(componentProps.name.toLowerCase() + '_tasks')
      .insert([
        {
          name: data,
          user_id: userStore.currentUser
        }
      ])
      .then(() => {
        getTasks()
      })
      .catch(error => {
        console.log(error)
        $q.dialog({
          title: 'Error',
          message: error.message,
          cancel: true,
          persistent: true
        })
      })
  })
}
function save (taskId, taskName) {
  supabase
    .from(componentProps.name.toLowerCase() + '_tasks')
    .update({ name: taskName })
    .eq('id', taskId)
    .then(() => {
      getTasks()
    })
    .catch(error => {
      console.log(error)
      $q.dialog({
        title: 'Error',
        message: error.message,
        cancel: true,
        persistent: true
      })
    })
}

function deleteTask (taskId) {
  supabase
    .from(componentProps.name.toLowerCase() + '_tasks')
    .delete()
    .eq('id', taskId)
    .then(() => {
      getTasks()
    })
    .catch(error => {
      console.log(error)
      $q.dialog({
        title: 'Error',
        message: error.message,
        cancel: true,
        persistent: true
      })
    })
}

onMounted(async () => {
  getTasks()
})
</script>
