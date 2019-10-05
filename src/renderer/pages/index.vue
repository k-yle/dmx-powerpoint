<template>
  <div>
    <div class='row'>
      <div style='flex: 40%;'>
        <logo />
      </div>
      <div style='flex: 60%;'>
        <h1>Electron Nuxt TypeScript</h1>
        <br>
        DMX Value: {{ dmxCh1 }}% / {{ dmxCh2 }}%<br>
        DMX Sender: {{ tmpSender[0] }} at {{ tmpSender[1] }} <br>
        PPT Receiver: {{ pptxState }} ({{ pptxSlides }} slides) <br>
      </div>
    </div>
    <p>
      <strong>Settings:</strong> <br>
      DMX Universe: 1 <br>
      DMX Channel: 50 (-51) <br>
      Network interface: auto / dropdown list <br>
      Presentation software: powerpoint <br>
    </p>
    <p>
      <strong>Channel1:</strong> <br>
      0% = nothing <br>
      1-99% = go to slides 1 - 99 <br>
      100% = nothing <br>
      <strong>Channel 2:</strong> <br>
      0-19% = nothing <br>
      20-39% = previous slide <br>
      40-59% = nothing <br>
      60-79% = next slide <br>
      80-99% = nothing <br>
      100% = next slide <br>
    </p>
  </div>
</template>

<style>
body { font-family: "Roboto"; }
.row { display: flex; }
.logo-container { position: relative; }
.centered { text-align: center; }
</style>

<script>
import Logo from '../components/Logo.vue';
import slideshow from '../js/slideshow';
import dmx from '../js/dmx';

export default {
  components: { Logo },
  data() {
    return {
      dmx,
      slideshow,
      dmxChStart: 50, // TODO: allow user to select
      dmxCh1: 0,
      dmxCh2: 0,
      tmpSender: [],
      thottle: false,
      pptxState: 'unknown',
      pptxSlides: 0,
    };
  },
  watch: {
    async dmxCh1(newV, oldV) {
      console.log('DMX Ch1 changed from', oldV, 'to', newV);
      await this.advanceTo(newV);
    },
    async dmxCh2(newV, oldV) {
      console.log('DMX Ch2 changed from', oldV, 'to', newV);
      if (newV >= 20 && newV <= 39) {
        if (oldV >= 20 && oldV <= 39) {
          console.log('fader already in this range; ignoring');
        } else {
          console.warn('prev slide!');
          await this.slideshow.prev();
        }
      }
      if (newV >= 60 && newV <= 79) {
        if (oldV >= 60 && oldV <= 79) {
          console.log('fader already in this range; ignoring');
        } else {
          console.warn('next slide!');
          await this.slideshow.next();
        }
      }
    },
  },
  async mounted() {
    dmx.on('packet', (packet) => {
      this.tmpSender = [packet.sourceName, packet.sourceAddress];
      this.dmxCh1 = Math.round(packet.slotsData[this.dmxChStart - 1] / 2.55);
      this.dmxCh2 = Math.round(packet.slotsData[this.dmxChStart + 1 - 1] / 2.55);
    });
    const { slides, state } = await slideshow.stat();
    this.pptxState = state;
    this.pptxSlides = slides;
  },
  methods: {
    async advanceTo(n) {
      if (this.thottle) { console.warn('Throttling PPTX command'); return; }
      if (n > this.pptxSlides) { console.warn('There aren\'t this many slides'); return; }
      if (n === 0 || n === 100) { console.warn('Ignoring min/max ch values'); return; }
      this.thottle = true;
      await this.slideshow.goto(n);
      this.thottle = false;
    },
  },
};
</script>
