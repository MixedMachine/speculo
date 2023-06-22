<template>
  <q-page
    class="flex flex-center"
    style="min-height: 100vh"
    padding
  >
    <q-card
      class="q-ma-md"
      style="width: 90%"
    >
      <q-card-section>
        <q-form
          class="q-gutter-md"
          @submit="createGoal"
        >
          <q-input
            v-model="formGoal.title"
            label="Title"
            type="text"
            lazy-rules
            :rules="[val => !!val || 'Title is required']"
          />
          <q-select
            v-model="formGoal.priority"
            label="Priority"
            :options="[
              'High',
              'Medium',
              'Low'
            ]"
          />
          <q-btn
            type="submit"
            label="Create"
            color="primary"
            class="q-mt-md"
          />
        </q-form>
      </q-card-section>
    </q-card>
    <q-list
      class="q-ma-md"
      style="width: 90%"
      bordered
      separator
    >
      <q-item-label
        header
        lines="1"
        class="text-h6 text-weight-bold text-center q-pa-md bg-black text-grey-3"
      >
        Goals
      </q-item-label>
      <q-item
        v-for="goal in goals"
        :key="goal.id"
      >
        <q-item-section avatar>
          <q-card
            flat
            style="width: 2rem; height: 2rem"
            :class="{
              'flex flex-center': true,
              'done bg-grey-3': goal.completed,
              'bg-red-3' : goal.priority === 'High',
              'bg-orange-3' : goal.priority === 'Medium',
              'bg-green-3' : goal.priority === 'Low'
            }"
            @click="toggleCompleted(goal.id)"
          >
            <q-icon
              v-if="goal.completed"
              name="check"
              color="green"
            />
          </q-card>
        </q-item-section>
        <q-item-section @click="toggleCompleted(goal.id)">
          <q-item-label>{{ goal.title }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            flat
            dense
            round
            icon="edit"
            color="black"
            @click="editGoalForm(goal.id)"
          />
        </q-item-section>
        <q-item-section side>
          <q-btn
            flat
            dense
            round
            icon="delete"
            color="black"
            @click="confirmDeleteGoal(goal.id)"
          />
        </q-item-section>
      </q-item>
    </q-list>
    <q-dialog
      v-model="editForm"
      persistent
    >
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">
            Goal title
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="editGoalModel.title"
            dense
            autofocus
            @keyup.enter="submitEditGoal"
          />
        </q-card-section>

        <q-card-actions
          align="right"
          class="text-primary"
        >
          <q-btn
            v-close-popup
            flat
            label="Cancel"
          />
          <q-btn
            flat
            label="Update Goal"
            color="primary"
            @click="submitEditGoal"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from 'src/stores/user-store'
import { useClient } from '@vueauth/supabase'

const supabase = useClient()
const userStore = useUserStore()
const $q = useQuasar()
const editForm = ref(false)
const editGoalModel = ref(
  {
    id: -1,
    title: '',
    priority: '',
    user_id: userStore.currentUser

  }
)

const goals = ref([])
const formGoal = ref({
  priority: '',
  title: '',
  user_id: userStore.currentUser
})

function getGoal (id) {
  return goals.value.find((goal) => goal.id === id)
}

function createGoal () {
  supabase
    .from('goals')
    .insert(formGoal.value)
    .then((response) => {
      if (response.error) {
        console.error(response.error)
        throw new Error('Could not create goal')
      }
      getGoals()
      formGoal.value.priority = ''
      formGoal.value.title = ''
    })
    .catch((error) => {
      console.error('Could not create goal', error)
      $q.dialog({
        color: 'negative',
        message: 'Could not create goal'
      })
    })
}

async function getGoals () {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userStore.currentUser)
    .order('id', { ascending: true })

  if (error) {
    console.error(error)
  } else {
    goals.value = data
  }
}

function editGoalForm (id) {
  const goal = getGoal(id)
  editGoalModel.value.id = id
  editGoalModel.value.title = goal.title
  editGoalModel.value.priority = goal.priority
  editForm.value = true
}

function submitEditGoal () {
  updateGoal(editGoalModel.value)
  getGoals()
  editForm.value = false
}

function updateGoal (goal) {
  supabase
    .from('goals')
    .update(goal)
    .eq('user_id', userStore.currentUser)
    .eq('id', goal.id)
    .then((response) => {
      if (response.error) {
        console.error(response.error)
        throw new Error('Could not update goal')
      }
    })
    .catch((error) => {
      console.error('Could not update goal', error)
      $q.dialog({
        color: 'negative',
        message: 'Could not update goal'
      })
    })
}

function toggleCompleted (id) {
  const goal = getGoal(id)
  goal.completed = !goal.completed

  updateGoal(goal)
}

function confirmDeleteGoal (id) {
  const goal = getGoal(id)
  const message = `Are you sure you want to delete "${goal.title}"?`

  $q.dialog({
    title: 'Confirm',
    message,
    cancel: true,
    persistent: true
  }).onOk(() => {
    deleteGoal(id)
  })
}

function deleteGoal (id) {
  supabase
    .from('goals')
    .delete()
    .eq('user_id', userStore.currentUser)
    .eq('id', id)
    .then(() => {
      goals.value = goals.value.filter((goal) => goal.id !== id)
    })
    .catch((error) => {
      console.error('Could not delete goal', error)
      $q.dialog({
        color: 'negative',
        message: 'Could not delete goal'
      })
    })
}

onMounted(async () => {
  getGoals()
})

</script>

<style scoped>
.done {
  /* text-decoration: line-through; */
  opacity: 0.5;
}
</style>
