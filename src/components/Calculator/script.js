// timeline library from GSAP that you can do some pretty cool animation with just JSON conf
import {TimelineLite} from 'gsap'

// initial config
// value is the display value
// stack is the calc stack
// replace is a bool to tell when the value can be replaced with the next values
// lastClick is used to do the highlighting of each button - I tied to mimic the actual Mac calculator

const conf = {
  value: 0,
  stack: [],
  replace: false,
  lastClick: null
};

// types ENUM + object gen functions (less typing, no annoying typos)
const types = {operand: 1, operator: 2};
const genOperand = (value) => ({type: types.operand, value});
const genOperator = (fn) => ({type: types.operator, fn});

// function for all 0-9 buttons
const handleNumberButton = (conf, btn) => {
  buttons[0].label = 'C';
  // if last button was a function - reset to the value of the button
  if (conf.stack.length > 0 && conf.stack[conf.stack.length - 1].type === types.operator) {
    if (conf.replace) {
      conf.value = parseFloat(btn.label);
      conf.replace = false;
    } else {
      conf.value = parseFloat(`${conf.value}${btn.label}`);
    }
  } else {
    conf.value = parseFloat(`${conf.value}${btn.label}`);
  }
};

// function for all simple operators (+ - / *)
const handleFunctionButton = (conf, btn) => {

  // if the stack is empty or the last item is an operator .. push the value and operator
  if (conf.stack.length === 0 || conf.stack[conf.stack.length - 1].type === types.operator) {
    conf.stack.push(genOperand(conf.value));
    conf.stack.push(genOperator(btn.operatorFn));
  }

  // if the last item on the call stack was a operator replace it with the desired operator
  if (conf.stack.length > 0 && conf.stack[conf.stack.length - 1].type === types.operator) {
    conf.stack[conf.stack.length - 1] = genOperator(btn.operatorFn)
  }

  // replace the screen value with a new value
  conf.replace = true;

};

// functions for common config per button type...can override with spread operator
const getNumDefault = () => ({
  highlightClass: 'num-highlight',
  highlightTimeout: 100,
  class: "is-quarter-btn num-btn",
  func: handleNumberButton,
});

const getFnDefault = () => ({
  highlightClass: 'fun-highlight',
  highlightTimeout: 100,
  class: "is-quarter-btn fun-btn",
});

const getOpDefault = () => ({
  highlightClass: 'opp-highlight',
  class: "is-quarter-btn opp-btn",
  func: handleFunctionButton,
});

// all the buttons are defined in in the list below.
// this approach means minimal html
// all config driven, each button type has it's own function
// some are overridden e.g the % function or the positive / negative button
// common config is spread instead of duplicating the config for each similar button - makes it easier to add more
// common vars (i.e a new class for num button, only have to add it in one place rather than 10)

const buttons = [
  {
    label: 'AC',
    ...getFnDefault(),
    func: (conf, btn) => {

      // cancel the input - this means you can type 5 + 6 .. hit C then hit 4 and get 9 instead of 11 (5 + 4 = 9)
      if (btn.label === "C") {
        conf.value = 0;
        buttons[0].label = "AC";
      } else {
        conf.value = 0;
        conf.stack = [];
      }
    },
  },
  {
    label: '±',
    ...getFnDefault(),
    func: (conf/*, btn*/) => {
      // if position make negative and visa versa
      if (conf.value > 0) {
        conf.value = Math.abs(conf.value) * -1;
      } else {
        conf.value = Math.abs(conf.value);
      }
    }
  },
  {
    label: '%',
    ...getFnDefault(),
    func: (conf) => {
      // simple convert to percentage
      conf.value = conf.value / 100;
    }
  },
  // each operator button has a operatorFn that is called in the generic function above
  {
    ...getOpDefault(),
    label: '÷',
    operatorFn: (x, y) => x / y,
  },
  {
    ...getNumDefault(),
    label: '7',
  },
  {
    ...getNumDefault(),
    label: '8',
  },
  {
    ...getNumDefault(),
    label: '9',
  },
  {
    ...getOpDefault(),
    label: 'x',
    operatorFn: (x, y) => x * y
  },
  {
    ...getNumDefault(),
    label: '4',
  },
  {
    ...getNumDefault(),
    label: '5',
  },
  {
    ...getNumDefault(),
    label: '6',
  },
  {
    ...getOpDefault(),
    label: '-',
    operatorFn: (x, y) => x - y,
  },
  {
    ...getNumDefault(),
    label: '1',
  },
  {
    ...getNumDefault(),
    label: '2',
  },
  {
    ...getNumDefault(),
    label: '3',
  },
  {
    ...getOpDefault(),
    label: '+',
    operatorFn: (x, y) => x + y,
  },
  {
    ...getNumDefault(),
    label: '0',
    class: "is-half-btn num-btn",
    // override func - 0 is weird
    func: (conf, btn) => {
      conf.value = parseFloat(`${conf.value}${btn.label}`);
    }
  },
  {
    ...getNumDefault(),
    label: '.',
    // override func - don't want 123.24.34 (not a valid float)
    func: (conf, btn) => {
      // if the value isn't already a float then add a dot else do nothing
      if (conf.value.toString().indexOf(btn.label) === -1) {
        conf.value = `${conf.value}${btn.label}`;
      }
    }
  },
  {
    ...getOpDefault(),
    label: '=',
    func: (conf) => {

      //todo:
      // in hindsight I think I should have just had a firstOperand and secondOperand instead of a calc stack
      // where the firstOperand just keeps getting updated as you click an operator button
      // but I think it's probably fine this way for this case


      // add the current val to the stack
      conf.stack.push(genOperand(conf.value));

      let tempVal = null;
      let tempFn = null;

      for (const item of conf.stack) {
        if (item.type === types.operand && tempFn == null) {
          tempVal = item.value;
        } else if (item.type === types.operand && tempFn != null) {
          // use the function to get the tempVal for the next function or end result
          tempVal = tempFn(tempVal, item.value);
          // reset the tempFn
          tempFn = null;
        } else if (item.type === types.operator) {
          // assign the temp function
          tempFn = item.fn;
        }
      }
      // reset the stack
      conf.value = tempVal;
      conf.stack = [];
    }
  },
];
const handleClick = (conf, btn) => {
  // always set the last clicked button
  conf.lastClick = btn.label;

  // highlight the button with associated style for a few milliseconds (not the operator buttons though)
  if (btn.highlightTimeout) {
    setTimeout(() => conf.lastClick = null, btn.highlightTimeout);
  }
  btn.func(conf, btn);
};

const getFontSize = () => {

  // there is probably a nicer way to do with with CSS, but I couldn't figure it out so I did it like this
  // the goal is to fit large numbers in the screen with them going off or overflowing
  const valLen = conf.value.toString().length;

  if (valLen > 18) {
    return '0.75rem';
  } else if (valLen > 16) {
    return '1rem';
  } else if (valLen > 14) {
    return '1.25rem'
  } else if (valLen > 12) {
    return '1.5rem'
  } else if (valLen > 10) {
    return '1.75rem'
  } else if (valLen > 8) {
    return '2rem'
  } else if (valLen > 6) {
    return '2.5rem'
  }
  return '3rem'
};

const items = [];
let calculator = null;
const timeline = new TimelineLite();

const close = () => {
  const min = -1000;
  const max = 1000;
  for (const i of items) {
    const x = Math.floor(Math.random() * (+max - +min)) + +min;
    const y = Math.floor(Math.random() * (+max - +min)) + +min;
    timeline.to(i, 0.1, {x, y, rotation: 1080, opacity: 0})
  }
  timeline.to(calculator, 0.5, {opacity: 0})
};

const minimise = () => {
  timeline.to(calculator, 2, {y: 800});
};

export default {
  name: 'Calculator',
  data() {
    return {
      handleClick,
      buttons,
      conf,
      getFontSize,
      close,
      minimise
    }
  },
  mounted() {

    // just added some animation for fun: GSAP https://greensock.com/
    // need mounted because the refs will only be available then
    // storing them in $items so the other functions can get at them
    calculator = this.$refs.calculator;
    for (const x in [...Array(buttons.length).keys()]) {
      items.push(this.$refs[`item${x}`])
    }
    timeline.delay(2);
    const min = -1000;
    const max = 1000;
    // some data science magic (aka Math.random())
    for (const i of items) {
      const x = Math.floor(Math.random() * (max - +min)) + min;
      const y = Math.floor(Math.random() * (max - +min)) + min;
      timeline.from(i, 0.1, {x, y, rotation: 1080, opacity: 0})
    }

  }
}
