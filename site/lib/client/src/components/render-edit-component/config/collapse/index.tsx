import { defineComponent, ref, computed, type PropType } from 'vue';

import './index.postcss';

export default defineComponent({
  name: 'RenderCollapse',
  props: {
    title: {
      type: String,
      default: '',
    },
    activeKeys: {
      type: Array as PropType<string[]>
    },
    // 表示 展开 key值
    name: {
      type: String
    },
  },
  emits: ['update:activeKeys', 'expand'],
  setup(props, { emit }) {
    const isExpand = computed(() => {
      const { activeKeys, name } = props
      return activeKeys.includes(name)
    })
    const collapseAfterExpandKeys = computed(() => {
      const { activeKeys, name } = props
      return activeKeys.filter(item => item !== name)
    })
    const expandKeys = computed(() => {
      const { activeKeys, name } = props
      return [...new Set([...activeKeys, name])]
    })
    const collapseRef = ref()
    const handleCollapse = () => {
      emit('update:activeKeys', isExpand.value ? collapseAfterExpandKeys.value : expandKeys.value)
      if(!isExpand.value) {
        emit('expand')
      }
    }
    return {
      isExpand,
      handleCollapse,
      collapseRef,
    };
  },
  render() {
    return (
      <div
        ref="collapseRef"
        data-name={this.name}
        class='config-collapse'
      >
        <div class='config-collapse-title-container'>
          <div class='config-collapse-title' onClick={this.handleCollapse}>
            { this.isExpand ? (
              <i class='bkui-vue-wiki-icon icon-angle-up-fill'></i>
            ) : (
              <i class='bkui-vue-wiki-icon icon-angle-right-fill'></i>
            )}
            <span>{this.title}</span>
          </div>
        </div>
        { this.isExpand && <div>{this.$slots?.default()}</div> }
      </div>
    );
  },
});
