<template>
  <q-layout view="hHh Lpr fFf">
    <q-header
      :class="$q.dark.isActive ? 'bg-primary' : 'bg-black'"
      elevated
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>Welcome to Speculo</q-toolbar-title>

        <q-btn
          icon="person"
          round
          flat
        >
          <AuthAccountMenu />
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="200"
      :breakpoint="500"
    >
      <q-scroll-area class="fit">
        <q-list
          padding
          class="menu-list"
        >
          <q-item
            v-ripple
            to="/"
            exact
            clickable
            @click="currentPageTitle = 'Core'"
          >
            <q-item-section avatar>
              <q-icon name="favorite" />
            </q-item-section>

            <q-item-section>
              Core
            </q-item-section>
          </q-item>
          <q-item
            v-ripple
            to="/goals"
            exact
            clickable
            @click="currentPageTitle = 'Goals'"
          >
            <q-item-section avatar>
              <q-icon name="follow_the_signs" />
            </q-item-section>

            <q-item-section>
              Goals
            </q-item-section>
          </q-item>
          <q-item
            v-ripple
            to="/tasks"
            exact
            clickable
            @click="currentPageTitle = 'Tasks'"
          >
            <q-item-section avatar>
              <q-icon name="check" />
            </q-item-section>

            <q-item-section>
              Tasks
            </q-item-section>
          </q-item>
          <q-item
            v-ripple
            to="/routines"
            exact
            clickable
            @click="currentPageTitle = 'Routines'"
          >
            <q-item-section avatar>
              <q-icon name="schedule" />
            </q-item-section>

            <q-item-section>
              Routines
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item
            v-ripple
            to="/help"
            exact
            clickable
            @click="currentPageTitle = 'Help'"
          >
            <q-item-section avatar>
              <q-icon name="help" />
            </q-item-section>
            <q-item-section>
              Help
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-footer
      :class=" $q.dark.isActive ? 'bg-primary' : 'bg-black'"
      elevated
    >
      <q-toolbar>
        <q-toolbar-title class="text-font-24">
          Copyright &copy; {{ currentYear }} Mixed Machine
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthState } from '@vueauth/core'
import { useUserStore } from '../stores/user-store'
import AuthAccountMenu from 'src/auth/components/AccountMenu/AccountMenu.vue'

const leftDrawerOpen = ref(false)
const userStore = useUserStore()
const currentYear = ref(new Date().getFullYear())
const currentPageTitle = ref('Core')

const currentUserID = useAuthState().user.value?.id

if (!currentUserID) {
  const router = useRouter()
  router.push({ name: 'auth.login' })
}

userStore.currentUser = currentUserID

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style lang="sass" scoped>
.menu-list .q-item
  border-radius: 0 32px 32px 0
</style>
