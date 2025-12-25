import * as vue from 'vue';

import { copyToClipboard } from '@/common/util';

import {
  addStyleToHead,
  removeStyleFromHead,
} from './utils';

export default vue.defineComponent({
  name: 'RenderIcon',
  props: {
    component: {
      type: Object,
      required: true,
    },
    componentStyle: {
      type: String,
    },
    renderProps: {
      type: Object,
      default: () => ({}),
    },
  },
  created() {
    this.initStyle();
  },
  beforeUnmount() {
    removeStyleFromHead('render-component-style');
  },
  methods: {
    initStyle() {
      removeStyleFromHead('render-component-style');

      addStyleToHead(this.componentStyle);
    },
  },
  render() {
    return vue.h(
      'div',
      {},
      [
        vue.h(
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
        ),
      ],
    );
  },
});
