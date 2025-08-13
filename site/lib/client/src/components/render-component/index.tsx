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
    props: {
      type: Object,
      default: () => ({}),
    },
    slots: {
      type: Object,
      default: () => ({}),
    },
  },
  render() {
    return vue.h(
      this.component,
      this.props,
      Object.keys(this.slots).reduce(
        (acc, slotName) => {
          acc[slotName] = () => Function('Vue', compile(this.slots[slotName]).code)(vue)(vue)
          return acc;
        },
       {} as Record<string, () => object>
      )
    )
  }
});