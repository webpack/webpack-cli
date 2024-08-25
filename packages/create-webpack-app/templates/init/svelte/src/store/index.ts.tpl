import { writable, derived, type Writable } from 'svelte/store';

type nameType = string | null;

interface MainState {
  // define your state interface
  count: number;
  user: nameType;
}

const initialState: MainState = {
  count: 0,
  user: null,
};

// Create writable stores with the initial state
const count: Writable<number> = writable(initialState.count);
const user: Writable<nameType> = writable(initialState.user);

// Define actions to modify the state
function increment(): void {
  count.update(n => n + 1);
}

function decrement(): void {
  count.update(n => n - 1);
}

function setUser(newUser: nameType): void {
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
