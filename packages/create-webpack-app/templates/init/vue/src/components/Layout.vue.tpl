<template>
    <NavBar />
    <router-view />
</template>

<script>
import NavBar from './Navbar.vue';

export default {
  components: {
    NavBar
  }
};
</script>
