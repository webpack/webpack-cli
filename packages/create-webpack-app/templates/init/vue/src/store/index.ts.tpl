import { createStore } from 'vuex'

export interface State {
  // Define your state structure here
}

export default createStore<State>({
  state: {
    // Your state properties here
  },
  mutations: {
    // Your mutations here
  },
  actions: {
    // Your actions here
  },
  modules: {
    // Your modules here
  }
})
