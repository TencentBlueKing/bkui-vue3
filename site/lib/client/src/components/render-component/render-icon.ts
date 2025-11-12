import {
  Message,
} from 'bkui-vue';
import * as vue from 'vue';

import {
  useClipboard,
} from '@vueuse/core';

const { copy } = useClipboard({
  legacy: true,
});

export default vue.defineComponent({
  name: 'RenderIcon',
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
      'section',
      Object.keys(this.component).map((key) => {
        return vue.h(
          this.component[key],
          {
            ...this.renderProps,
            style: {
              margin: '10px',
              cursor: 'pointer',
            },
            onclick() {
              copy(key);
              Message({
                message: `复制Icon名【${key}】成功`,
                theme: 'success',
              });
            },
          },
        );
      }),
    );
  },
});
