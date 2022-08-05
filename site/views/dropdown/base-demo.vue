<template>
  <div class="demo-box">
    <div class="tool-box">
      <bk-dropdown :popover-options="popoverOptions">
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
  </div>
</template>
<script setup>
  import { ref } from 'vue';

  import BkDropdown from '@bkui-vue/dropdown';
  import BkMessage from '@bkui-vue/message';
  const dropdownList = ref(['生产环境', '预发布环境', '测试环境', '正式环境', '开发环境', '调试环境']);
  const popoverOptions =   { boundary: 'body' };
  const handleClick = (item) => {
    BkMessage(item);
  };
</script>
<style>
.tool-box {
  background: #fff;
}

.demo-box {
  width: 100px;
  height: 50px;
  border: 1px solid #ccc;
}

.demo-box:hover .tool-box {
  background: transparent;
}
</style>
