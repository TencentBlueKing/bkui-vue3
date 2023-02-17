<template>
  <div class="demo">
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      multiple
      filterable
      :placeholder="t('请选择')"
      :search-placeholder="t('请输入关键字')"
      :no-data-text="t('无数据')"
      :no-match-text="t('无匹配数据')"
      :loading-text="t('加载中...')"
      :select-all-text="t('全部')"
    >
      <bk-option
        v-for="(item, index) in dataSource"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
    </bk-select>
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      :input-search="false"
      multiple
      filterable
      :placeholder="t('请选择')"
      :search-placeholder="t('请输入关键字')"
      :no-data-text="t('无数据')"
      :no-match-text="t('无匹配数据')"
      :loading-text="t('加载中...')"
      :select-all-text="t('全部')"
    >
      <bk-option
        v-for="(item, index) in dataSource"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
    </bk-select>
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      :input-search="false"
      multiple
      filterable
      multiple-mode="tag"
      :placeholder="t('请选择')"
      :search-placeholder="t('请输入关键字')"
      :no-data-text="t('无数据')"
      :no-match-text="t('无匹配数据')"
      :loading-text="t('加载中...')"
      :select-all-text="t('全部')"
    >
      <bk-option
        v-for="(item, index) in dataSource"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
    </bk-select>
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      multiple
      filterable
      multiple-mode="tag"
      :placeholder="t('请选择')"
      :search-placeholder="t('请输入关键字')"
      :no-data-text="t('无数据')"
      :no-match-text="t('无匹配数据')"
      :loading-text="t('加载中...')"
      :select-all-text="t('全部')"
    >
      <bk-option
        v-for="(item, index) in dataSource"
        :key="index"
        :value="item.value"
        :label="item.label"
      />
    </bk-select>
    <bk-select
      class="bk-select"
      multiple
      filterable
      :remote-method="remoteMethod"
      :placeholder="t('请选择')"
      :search-placeholder="t('请输入关键字')"
      :no-data-text="t('无数据')"
      :no-match-text="t('无匹配数据')"
      :loading-text="t('加载中...')"
      :select-all-text="t('全部')"
    >
      <bk-option
        v-for="(item) in list"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      />
    </bk-select>
  </div>
</template>
<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const dataSource = ref([
        {
          value: 'climbing',
          label: t('爬山'),
        },
        {
          value: 'running',
          label: t('跑步'),
        },
        {
          value: 'unknow',
          label: t('未知'),
        },
        {
          value: 'fitness',
          label: t('健身'),
        },
        {
          value: 'bike',
          label: t('骑车'),
        },
        {
          value: 'dancing',
          label: t('跳舞'),
        },
        {
          value: 'sleep',
          label: t('睡觉'),
        },
      ]);
      const selectedValue = ref('dancing');
      const list = ref([]);
      const remoteMethod = async value => new Promise((resolve) => {
        if (!value)  {
          list.value = [];
          resolve('ok');
        } else {
          setTimeout(() => {
            list.value = new Array(10).fill('')
              .map((_, i) => ({
                value: `${i}-${value}`,
                label: `label-${value}-${i}`,
              }));
            resolve('ok');
          }, 1000);
        };
      });

      return {
        dataSource,
        selectedValue,
        remoteMethod,
        list,
        t,
      };
    },
  });
</script>
<style scoped>
.demo {
  display: flex;
}

.bk-select {
  width: 300px;
  margin-right: 20px;
}
</style>

