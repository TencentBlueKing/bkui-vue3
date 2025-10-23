import { defineComponent, ref } from 'vue';

import './index.postcss';

export default defineComponent({
  name: 'RenderCollapse',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  setup() {
    const isCollapse = ref(false);
    const handleCollapse = () => {
        isCollapse.value = !isCollapse.value
    }
    return {
      isCollapse,
      handleCollapse
    };
  },
  render() {
    return (
      <div class='config-collapse'>
        <div class='config-collapse-title' onClick={this.handleCollapse}>
          { !this.isCollapse ? (
            <i class='bkui-vue-wiki-icon icon-angle-up-fill'></i>
          ) : (
            <i class='bkui-vue-wiki-icon icon-angle-right-fill'></i>
          )}
          <span>{this.title}</span>
        </div>
        { !this.isCollapse && <div>{this.$slots?.default()}</div> }
      </div>
    );
  },
});
