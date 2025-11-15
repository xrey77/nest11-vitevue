<script lang="ts">  
  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'bootstrap/dist/js/bootstrap.bundle.min.js';
  import Header from '../components/Header.vue';  

  import { defineComponent} from 'vue';

  export default defineComponent({
    name: 'AppLayout-Page',
    components: {
      Header,
    }
});

</script>

<template>
      <Header />
        <main>
        <slot></slot>
      </main>
</template>
  
<style lang="css">
body {
  background-color: black;
}

</style>