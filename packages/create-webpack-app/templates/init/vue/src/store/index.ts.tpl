import { defineStore } from 'pinia'

type nameType = string | null;

interface State{
  // Define your state interface
  count: number,
  user: nameType
}

// Define your store
export const useMainStore = defineStore('main', {
  state: (): State => {
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
    setUser(user: nameType) {
      this.user = user
    }
  },
  getters: {
    // Define your getters here (optional)
    isLoggedIn: (state: State): boolean => !!state.user,
  }
})
