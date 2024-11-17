<template>
  <nav>
    <ul>
      <li>
        <router-link
          to="/"
          class="btn-secondary"
          :style="{ backgroundColor: isActive('/') ? 'var(--color-primary)' : 'var(--color-secondary)' }"
        >
          Home
        </router-link>
      </li>
      <li>
        <router-link
          to="/about"
          class="btn-secondary"
          :style="{ backgroundColor: isActive('/about') ? 'var(--color-primary)' : 'var(--color-secondary)' }"
        >
          About
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  methods: {
    isActive(route) {
      return this.$route.path === route;
    },
  },
};
</script>
