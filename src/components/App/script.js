import Calculator from "../Calculator/Calculator";
import {TimelineLite} from 'gsap'

export default {
  name: 'app',
  components: {
    Calculator,
  },
  mounted() {
    // some animation using TimelineLite from GSAP

    const {dodgeImg, title, calc} = this.$refs;
    const timeline = new TimelineLite();
    timeline
      .from(dodgeImg, 1, {y: 100, opacity: 0})
      .from(title, 0.5, {y: 100, opacity: 0})
      .from(calc, 0.5, {y: 100, opacity: 0});

    timeline.to(dodgeImg, 1, {rotation: 1080, delay: 2});
  }
}
