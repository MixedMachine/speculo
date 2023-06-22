import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: ''
  }),
  actions: {
    setCurrentUser (user) {
      this.currentUser = user
    }
  },
  getters: {
    getCurrentUser () {
      return this.currentUser
    }
  }
})
