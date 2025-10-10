import * as vue from 'vue';

import {
  compile,
} from '@vue/compiler-dom';

export default vue.defineComponent({
  name: 'RenderComponent',
  props: {
    component: {
      type: Object,
      required: true,
    },
    renderProps: {
      type: Object,
      default: () => ({}),
    },
    renderSlots: {
      type: Object,
      default: () => ({}),
    },
  },
  render() {
    return vue.h(
      this.component,
      this.renderProps,
      Object.keys(this.renderSlots).reduce(
        (acc, slotName) => {
          const Fn = Function;
          acc[slotName] = () => Fn('Vue', compile(this.renderSlots[slotName]).code)(vue)(vue);
          return acc;
        },
        {} as Record<string, () => object>,
      ),
    );
  },
});
