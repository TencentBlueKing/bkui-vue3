<template>
  <div>
    <bk-dropdown
      trigger="manual"
      :is-show="isShow"
      @show-change="handleShowChange"
    >
      <bk-button @click="handleShow">
        {{ tips }}
      </bk-button>
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

<script>
  import { defineComponent, ref } from 'vue';

  import BkDropdown from '@bkui-vue/dropdown';
  import BkMessage from '@bkui-vue/message';

  export default defineComponent({
    components: {
      BkDropdown,
    },
    setup() {
      const tips = ref('点击触发');
      const isShow = ref(false);
      const dropdownList = ref([
        '生产环境',
        '预发布环境',
        '测试环境',
        '正式环境',
        '开发环境',
        '调试环境',
      ]);

      const handleShowChange = (val) => {
        BkMessage(`is-show: ${val}`);
      };

      const handleShow = () => {
        isShow.value = !isShow.value;
      };

      return {
        tips,
        isShow,
        dropdownList,
        handleShowChange,
        handleShow,
      };
    },
  });
</script>
