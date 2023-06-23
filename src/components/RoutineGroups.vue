<template>
  <div
    class="q-pa-md bg-black"
    style="width: 80%; min-height: 100%;"
  >
    <q-list
      class="rounded-borders"
      bordered
      separator
      style="width: 100%;"
    >
      <q-item
        v-if="groups.length === 0"
        class="text-h6 text-weight-bold text-center q-pa-md bg-black text-grey-3"
      >
        NO ROUTINES FOUND
      </q-item>
      <q-item
        v-for="group in groups"
        :key="group.id"
      >
        <q-expansion-item
          class="bg-primary text-white"
          style="width: 100%; border-radius: 30px"
          expand-separator
          icon="timer"
          :label="group.name"
        >
          <RoutineTasks
            :routine="group"
            @edit-routine-group="editRoutineGroup"
            @delete-routine-group="deleteRoutineGroup"
          />
        </q-expansion-item>
      </q-item>
    </q-list>
    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn
        fab
        icon="add"
        color="primary"
        @click="addRoutineGroup"
      />
    </q-page-sticky>
  </div>
</template>

<script setup>
import { useClient } from '@vueauth/supabase'
import RoutineTasks from './RoutineTasks.vue'
import { ref, onMounted } from 'vue'
import { useUserStore } from 'src/stores/user-store'
import { useQuasar } from 'quasar'
const groups = ref([])

const supabase = useClient()
const $q = useQuasar()
const userStore = useUserStore()
const userId = userStore.currentUser
console.log(userId)

async function getRoutineGroups () {
  const { data, error } = await supabase
    .from('routine_groups')
    .select('*')
  if (error) {
    console.log(error)
    $q.dialog({
      title: 'Error',
      message: 'There was an error getting your routine groups.',
      persistent: true
    })
  } else {
    groups.value = data
  }
}

function addRoutineGroup () {
  $q.dialog({
    title: 'Add Routine Group',
    message: 'Enter the name of your new routine group.',
    prompt: {
      model: '',
      isValid: val => val.length > 0
    },
    cancel: true,
    persistent: true
  }).onOk(async data => {
    const { error } = await supabase
      .from('routine_groups')
      .insert([
        {
          name: data,
          user_id: userId
        }
      ])
    if (error) {
      console.log(error)
      $q.dialog({
        title: 'Error',
        message: 'There was an error adding your routine group.',
        persistent: true
      })
    } else {
      getRoutineGroups()
    }
  })
}

function editRoutineGroup (id) {
  const group = groups.value.find(group => group.id === id)
  $q.dialog({
    title: 'Edit Routine Group',
    prompt: {
      model: group.name,
      isValid: val => val.length > 0
    },
    cancel: true,
    persistent: true
  }).onOk(async data => {
    const { error } = await supabase
      .from('routine_groups')
      .update({
        name: data,
        user_id: userId
      })
      .eq('id', id)
    if (error) {
      console.log(error)
      $q.dialog({
        title: 'Error',
        message: 'There was an error editing your routine group.',
        persistent: true
      })
    } else {
      getRoutineGroups()
    }
  })
}

async function deleteRoutineGroup (id) {
  const { error } = await supabase
    .from('routine_groups')
    .delete()
    .eq('id', id)
  if (error) {
    console.log(error)
    $q.dialog({
      title: 'Error',
      message: error.message,
      persistent: true
    })
  } else {
    getRoutineGroups()
  }
}

onMounted(() => {
  getRoutineGroups()
})

</script>
