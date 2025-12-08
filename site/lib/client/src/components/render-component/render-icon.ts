import { copyToClipboard } from '@/common/util';
import * as vue from 'vue';

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
              copyToClipboard(key, `复制Icon名【${key}】成功`);
            },
          },
        );
      }),
    );
  },
});
