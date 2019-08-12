<template>
    <div id="app">
        <img id="dodge" alt="Scientist" src="./assets/dodge.jpg" ref="dodgeImg">
        <h1 ref="title">Doge Calc</h1>
        <div ref="calc" style="display: inline-block ">
            <Calculator/>
        </div>
    </div>
</template>

<script>
  import Calculator from "./components/Calculator/Calculator";
  import {TimelineLite} from 'gsap'

  export default {
    name: 'app',
    components: {
      Calculator,
    },
    mounted() {
      const {dodgeImg, title, calc} = this.$refs;

      const timeline = new TimelineLite();
      timeline
        .from(dodgeImg, 1, {y: 100, opacity: 0})
        .from(title, 0.5, {y: 100, opacity: 0})
        .from(calc, 0.5, {y: 100, opacity: 0});

      timeline.to(dodgeImg, 1, {rotation: 1080, delay: 2});
    }
  }
</script>

<style>

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    #dodge {
        width: 20%;
        height: auto;
    }


</style>
