import {
  Loading as BkLoading,
} from 'bkui-vue';
import * as vue from 'vue';

export default vue.defineComponent({
  name: 'RenderLoading',
  render() {
    return vue.h(BkLoading, {
      loading: true,
    });
  },
});
