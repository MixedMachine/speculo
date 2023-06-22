<template>
  <div class="q-pa-md">
    <div
      class="q-gutter-y-md"
      style="max-width: 100%"
    >
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="bg-grey-2 text-grey-7"
          active-color="primary"
          indicator-color="purple"
          align="justify"
        >
          <q-tab
            name="daily"
            label="Daily"
          />
          <q-tab
            name="weekly"
            label="Weekly"
          />
          <q-tab
            name="monthly"
            label="Monthly"
          />
          <q-tab
            name="yearly"
            label="Yearly"
          />
          <q-tab
            name="general"
            label="General"
          />
        </q-tabs>

        <q-tab-panels
          v-model="tab"
          animated
          class="bg-black text-white"
        >
          <q-tab-panel name="daily">
            <TasksComponent name="Daily" />
          </q-tab-panel>

          <q-tab-panel name="weekly">
            <TasksComponent name="Weekly" />
          </q-tab-panel>

          <q-tab-panel name="monthly">
            <TasksComponent name="Monthly" />
          </q-tab-panel>

          <q-tab-panel name="yearly">
            <TasksComponent name="Yearly" />
          </q-tab-panel>

          <q-tab-panel name="general">
            <TasksComponent name="General" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TasksComponent from 'src/components/TasksComponent.vue'

const tab = ref('daily')
</script>
