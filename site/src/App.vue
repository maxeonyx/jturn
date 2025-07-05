<template>
  <div id="app">
    <h1>Welcome to JJ VCS</h1>
    <p>This project currently showcases various demos:</p>
    <ul>
      <li v-for="link in demoLinks" :key="link.name">
        <a :href="link.path">{{ link.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import demoLinks from 'virtual:demo-links';

export default {
  name: 'App',
  setup() {
    return {
      demoLinks: ref(demoLinks),
    };
  },
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  margin: 2rem;
}
h1 {
  color: #333;
}
a {
  color: #007bff;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>
