import {
  Button as BkButton,
} from 'bkui-vue';
import * as vue from 'vue';

export default vue.defineComponent({
  name: 'RenderFunction',
  props: {
    component: {
      type: Object,
      required: true,
    },
    renderProps: {
      type: Object,
      default: () => ({}),
    },
  },
  render() {
    return vue.h(
      BkButton,
      {
        theme: 'primary',
        onClick: () => this.component.default(this.renderProps),
      },
      ['点击展示组件'],
    );
  },
});
