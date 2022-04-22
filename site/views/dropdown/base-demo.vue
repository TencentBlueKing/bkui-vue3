<template>
  <div>
    <bk-dropdown>
      <bk-button>更多操作</bk-button>
      <template #content>
        <bk-dropdown-menu>
          <bk-dropdown-item
            v-for="item in dropdownList"
            :key="item"
            @click="handleClick(item)"
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

  const handleClick = (item) => {
    BkMessage(item);
  };
</script>
