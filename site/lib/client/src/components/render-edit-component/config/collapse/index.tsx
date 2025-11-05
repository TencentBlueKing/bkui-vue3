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
    const isFloatTitle = ref(false)
    const collapseRef = ref()
    const handleCollapse = () => {
      let copyExpandKeys = [...expandKeys.value]
      if(!isExpand.value && isFloatTitle.value) {
        copyExpandKeys = [props.name]
        isFloatTitle.value = false
        nextTick(() => {
          collapseRef.value.scrollIntoView({
            behavior: 'smooth',
          })
        })
      }
      emit('update:activeKeys', isExpand.value ? collapseAfterExpandKeys.value : copyExpandKeys)
    }
    const observerCollapse = () => {
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if(!entry.isIntersecting) {
            emit('update:activeKeys', collapseAfterExpandKeys.value)
            isFloatTitle.value = true
          }
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0
      })
      observer.observe(collapseRef.value)
    }
    onMounted(() => {
      observerCollapse()
    })
    return {
      isExpand,
      handleCollapse,
      collapseRef,
      isFloatTitle,
    };
  },
  render() {
    return (
      <div
        ref="collapseRef"
        data-name={this.name}
        class={`config-collapse${this.isFloatTitle ? ' sticky-title': ''}`}
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
