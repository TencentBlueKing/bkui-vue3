<template>
  <div>
    <bk-dropdown
      @show="handleShow"
      @hide="handleHide"
    >
      <bk-button>hover触发</bk-button>
      <template #content>
        <bk-dropdown-menu>
          <bk-dropdown-item
            v-for="item in dropdownList"
            :key="item"
          >
            {{ item }}
          </bk-dropdown-item>
        </bk-dropdown-menu>
      </template>
    </bk-dropdown>
  </div>
</template>
<script setup>
  import { ref } from 'vue';

  import BkDropdown from '@bkui-vue/dropdown';
  import BkMessage from '@bkui-vue/message';


  const dropdownList = ref(['生产环境', '预发布环境', '测试环境', '正式环境', '开发环境', '调试环境']);

  const handleShow = () => {
    BkMessage('show');
  };
  const handleHide = () => {
    BkMessage('hide');
  };
</script>
