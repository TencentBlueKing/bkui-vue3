import { defineComponent, type PropType } from 'vue';

import './index.postcss';

export interface ITab {
    label: string,
    value: string
}

export default defineComponent({
  name: 'RenderSlot',
  props: {
    activeTab: {
        type: String
    },
    tabs: {
        type: Array as PropType<ITab[]>
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
                    class={{'active': this.activeTab === item.value}}
                >
                    {item.label}
                </div>
            ))}
        </div>
    );
  },
});
