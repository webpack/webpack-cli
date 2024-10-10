import { writable, derived } from 'svelte/store';


const initialState= {
  count: 0,
  user: null,
};

// Create writable stores with the initial state
const count = writable(initialState.count);
const user = writable(initialState.user);

// Define actions to modify the state
function increment(){
  count.update(n => n + 1);
}

function decrement(){
  count.update(n => n - 1);
}

function setUser(newUser) {
  user.set(newUser);
}

// Define a derived store for the `isLoggedIn` computed property
const isLoggedIn = derived(user, $user => $user !== null);

export const useMainStore = () => ({
  // State
  count,
  user,

  // Actions
  increment,
  decrement,
  setUser,

  // Getters
  isLoggedIn,
});
