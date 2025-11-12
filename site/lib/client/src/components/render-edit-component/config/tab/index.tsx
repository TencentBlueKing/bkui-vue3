import { defineComponent, type PropType } from 'vue';

import './index.postcss';

export interface ITab {
    label: string,
    value: string
}

export default defineComponent({
  name: 'RenderTab',
  props: {
    activeTab: {
      type: String
    },
    tabs: {
      type: Array as PropType<ITab[]>
    },
    size: {
      type: String as PropType<'medium'>,
    }
  },
  emits: {
    'update:activeTab': (__: string) => true,
  },
  setup(_props, { emit }) {
    const changeTab = (val: string) => {
      emit('update:activeTab', val)
    };
    return {
        changeTab
    };
  },
  render() {
    return (
        <div class="config-tabs">
            {this.tabs.map(item => (
                <div
                    key={item.value}
                    onClick={() => this.changeTab(item.value)}
                    class={{
                      'active': this.activeTab === item.value,
                      'label-overflow': true,
                      'medium': this.size === 'medium',
                    }}
                    title={item.label}
                >
                    {item.label}
                </div>
            ))}
        </div>
    );
  },
});
