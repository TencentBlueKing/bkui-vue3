import {
  Exception as BkException,
} from 'bkui-vue';
import * as vue from 'vue';

export default vue.defineComponent({
  name: 'RenderError',
  props: {
    errorMessage: {
      type: String,
      required: true,
    },
  },
  render() {
    return vue.h(BkException, {
      type: '500',
      scene: 'page',
      title: this.errorMessage,
    });
  },
});
