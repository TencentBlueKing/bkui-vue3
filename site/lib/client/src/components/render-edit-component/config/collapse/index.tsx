import { defineComponent, ref, computed, type PropType, onMounted, nextTick } from 'vue';

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
    index: {
      type: Number
    }
  },
  emits: ['update:activeKeys'],
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
    const findScrollParent = (element: HTMLElement): HTMLElement | null => {
      let parent = element.parentElement
    
      while (parent) {
        const { overflow, overflowY } = getComputedStyle(parent)
        if (/(auto|scroll)/.test(overflow + overflowY)) {
          return parent
        }
        parent = parent.parentElement
      }
    
      return document.documentElement
    }
    const handleCollapse = () => {
      let copyExpandKeys = [...expandKeys.value]
      if(!isExpand.value) {
        copyExpandKeys = [props.name]
        nextTick(() => {
          const scrollParent = findScrollParent(collapseRef.value)
          if(scrollParent) {
            scrollParent.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        })
      }
      emit('update:activeKeys', isExpand.value ? collapseAfterExpandKeys.value : copyExpandKeys)
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
