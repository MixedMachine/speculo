<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card bg-white text-black">
      <q-card-section>
        <q-list
          bordered
          separator
        >
          <q-item>
            <q-item-section>
              <q-input
                v-model="newTask"
                dense
                outlined
                label="Task Name"
              />
            </q-item-section>
            <q-item-section side>
              <q-btn
                dense
                flat
                icon="add"
                round
                @click="addTask"
              />
            </q-item-section>
          </q-item>
          <q-item
            v-if="tasked.length === 0"
            class="text-h6 text-weight-bold text-center q-pa-md text-grey-5"
          >
            NO TASKS FOUND
          </q-item>
          <q-item
            v-for="task in tasked"
            :key="task.id"
            dense
          >
            <q-item-section
              v-if="editTaskId === task.id"
            >
              <q-input
                v-model="task.name"
                dense
                outlined
                @keyup.enter="() => {
                  editTask(task.id)
                  editTaskId = null
                }"
              />
            </q-item-section>
            <q-item-section
              v-else
              :class="activeTasks[task.id]?
                'bg-grey-3 text-white q-px-md cursor-pointer' :
                'bg-white text-black q-px-md cursor-pointer'"
              clickable
              style="border-radius: 5px;"
              @click="toggleTask(task.id)"
            >
              <q-item-label>{{ task.name }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn
                  class="gt-xs"
                  dense
                  flat
                  icon="edit"
                  round
                  @click="() => {
                    if (editTaskId === task.id) {
                      editTaskId = null
                    } else {
                      editTaskId = task.id
                    }
                  }"
                />
                <q-btn
                  class="gt-xs"
                  dense
                  flat
                  icon="delete"
                  round
                  @click="deleteTask(task.id)"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-separator dark />

      <q-card-actions>
        <q-btn
          elevated
          @click="editRoutineGroup"
        >
          Edit
        </q-btn>
        <q-btn
          elevated
          @click="deleteRoutineGroup"
        >
          Delete
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, defineEmits } from 'vue'
import { useClient } from '@vueauth/supabase'
import { useUserStore } from 'src/stores/user-store'
import { useQuasar } from 'quasar'

const supabase = useClient()
const $q = useQuasar()
const userStore = useUserStore()
const userId = userStore.currentUser
const editTaskId = ref(null)

const props = defineProps({
  routine: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete-routine-group', 'edit-routine-group'])

const tasked = ref([])
const activeTasks = ref({})
const newTask = ref(null)

function toggleTask (id) {
  if (!activeTasks.value[id]) {
    activeTasks.value[id] = true
  } else {
    activeTasks.value[id] = false
  }
}

async function getTasks () {
  const { data, error } = await supabase
    .from('routine_tasks')
    .select('*')
    .eq('group_id', props.routine.id)

  if (error) {
    console.log(error)
    $q.dialog({
      title: 'Error',
      message: error.message,
      persistent: true
    })
  } else {
    tasked.value = data
  }
}

// eslint-disable-next-line no-unused-vars
function addTask () {
  if (newTask.value === '') {
    $q.dialog({
      title: 'Error',
      message: 'Task name cannot be empty',
      persistent: true
    })
    return
  }
  supabase
    .from('routine_tasks')
    .insert([
      {
        name: newTask.value,
        group_id: props.routine.id,
        user_id: userId
      }
    ])
    .then(() => {
      getTasks()
      newTask.value = ''
    })
    .catch((error) => {
      console.log(error)
      $q.dialog({
        title: 'Error',
        message: error.message,
        persistent: true
      })
    })
}

function deleteTask (id) {
  $q.dialog({
    title: 'Delete Task',
    message: 'Are you sure you want to delete this task?',
    cancel: true
  }).onOk(() => {
    supabase
      .from('routine_tasks')
      .delete()
      .eq('id', id)
      .then(() => {
        getTasks()
      })
      .catch((error) => {
        console.log(error)
        $q.dialog({
          title: 'Error',
          message: error.message,
          persistent: true
        })
      })
  })
}

function editTask (id) {
  console.log('edit task')
}

function deleteRoutineGroup () {
  $q.dialog({
    title: 'Delete Routine Group',
    message: 'Are you sure you want to delete this routine group?',
    cancel: true
  }).onOk(() => {
    emit('delete-routine-group', props.routine.id)
  })
}

function editRoutineGroup (id) {
  emit('edit-routine-group', props.routine.id)
}

onMounted(() => {
  getTasks()
})

</script>

<style lang="sass" scoped>
.my-card
  width: 100%
</style>
