<template>
  <div>
    <div class='row'>
      <div style='flex: 40%;'>
        <logo />
      </div>
      <div style='flex: 60%;'>
        <h1>Electron Nuxt TypeScript</h1>
        <input
          v-model='n'
          type='number'
        >
        <button @click='advance'>
          Go to slide {{ n }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron';
import Logo from '../components/Logo.vue';

const SlideShow = remote.require('slideshow');

export default {
  components: { Logo },
  data() {
    return {
      n: 2,
      slideshow: new SlideShow('powerpoint'),
    };
  },
  mounted() {
    this.slideshow.boot();
  },
  methods: {
    async advance() {
      await this.slideshow.goto(this.n);
    },
  },
};
</script>

<style>
body {
  font-family: "Roboto";
}
.row {
  display: flex;
}

.logo-container {
  position: relative;
}

.centered {
  text-align: center;
}
</style>
