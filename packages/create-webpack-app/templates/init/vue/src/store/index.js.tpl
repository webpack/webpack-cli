import { defineStore } from 'pinia'

// Define your store
export const useMainStore = defineStore('main', {
  state: () => {
    return {
      // Define your state here
      count: 0,
      user: null
    }
  },
  actions: {
    // Define your actions here
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    setUser(user) {
      this.user = user
    }
  },
  getters: {
    // Define your getters here (optional)
    isLoggedIn: (state) => !!state.user,
  }
})
