<template>
  <div class="dropdown-placement-demo">
    <bk-dropdown v-for="item in dropdownPlacement" class="dropdown-item" :key="item" :placement="item">
      <bk-button>{{ item }}</bk-button>
      <template #content>
        <bk-dropdown-menu>
          <bk-dropdown-item v-for="dropItem in dropdownList" :key="dropItem">
            {{ dropItem }}
          </bk-dropdown-item>
        </bk-dropdown-menu>
      </template>
    </bk-dropdown>
  </div>
</template>
<script setup>
import { ref } from 'vue';

import BkDropdown from '@bkui-vue/dropdown';
const dropdownList = ref(['生产环境', '预发布环境', '测试环境', '正式环境', '开发环境', '调试环境']);
const dropdownPlacement = [
  'top-start',
  'top-end',
  'left-start',
  'left',
  'left-end',
  'right-start',
  'right',
  'right-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'right-start',
];
</script>
