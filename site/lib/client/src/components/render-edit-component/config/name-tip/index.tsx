import { defineComponent, ref, computed, type PropType } from 'vue';

import { bkTooltips } from 'bkui-vue';

import type {
  IComponentWiki
} from '@/types/component';
import {
  useClipboard,
} from '@vueuse/core';

import './index.less';

const { copy } = useClipboard({
  legacy: true,
});
const SHOW_KEYS: Record<Exclude<keyof IComponentWiki['props'][number], 'link'>, string> = {
  name: '参数',
  description: '说明',
  type: '类型',
  options: '可选值',
  default: '默认值',
};
export default defineComponent({
  name: 'RenderNameTip',
  props: {
    attr: {
      type: Object as PropType<IComponentWiki['props'][number]>,
      default: () => ({})
    }
  },
  directives: {
    bkTooltips,
  },
  setup(props) {
    const isHasOptionsKey = Object.keys(props.attr).includes('options');
    const toolTipConfig = computed(() => ({
        theme: 'light',
        content: (
            <>
            {Object.keys(SHOW_KEYS).map((key, index) => {
              if(!isHasOptionsKey && key === 'options') {
                return null;
              }
              const value = props.attr?.[key as keyof IComponentWiki['props'][number]] ?? '';
              const isOdd = (!isHasOptionsKey && key === 'default' ? index + 1 : index) % 2 === 0;
              const label = SHOW_KEYS[key as keyof typeof SHOW_KEYS];
              return (
                <div key={key} class={`tip-item${isOdd ? ' even-bg' : ''}`}>
                  <span>{label}:</span>
                  <span>{Array.isArray(value) ? value.join(', ') : String(value).replaceAll(' |', ',')}</span>
                </div>
              )})}
            </>
        ),
        placement: 'bottom-start',
        delay: 500,
        extCls: 'attr-tip-content',
    }));
    const nameVal = computed(() => props.attr?.name || '');
    const content = ref('复制成功')
    const isDisabled = ref(true)
    const copyToolTipConfig = computed(() => ({
      content: content.value,
      placement: 'top',
      trigger: 'click',
      disabled: isDisabled.value,
    }));
    const copyAttrName = async () => {
      try {
        await copy(nameVal.value);
        content.value = '复制成功';
      } catch (error) {
        content.value = '复制失败';
      } finally {
        isDisabled.value = false
      }
    }
    return {
      toolTipConfig,
      nameVal,
      copyAttrName,
      copyToolTipConfig,
    };
  },
  render() {
    return (
      <div class='config-item-name-tip-wrapper' onClick={this.copyAttrName} v-bkTooltips={this.copyToolTipConfig}>
        <div class="config-item-name-tip" v-bkTooltips={this.toolTipConfig}>
          {this.nameVal}
        </div>
      </div>
    );
  }
})