<template>
  <div class="demo">
    <bk-select
      v-model="selectedValue"
      class="bk-select"
      multiple
      filterable
    >
      <bk-option
        v-for="(item, index) in datasource"
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
    >
      <bk-option
        v-for="(item, index) in datasource"
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
    >
      <bk-option
        v-for="(item, index) in datasource"
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
    >
      <bk-option
        v-for="(item, index) in datasource"
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
<script setup>
  import { ref } from 'vue';
  const datasource = ref([
    {
      value: 'string',
      label: '爬山',
    },
    {
      value: false,
      label: '跑步',
    },
    {
      value: undefined,
      label: '未知',
    },
    {
      value: 1,
      label: '健身',
    },
    {
      value: null,
      label: '骑车',
    },
    {
      value: 'dancing',
      label: '跳舞',
    },
  ]);
  const selectedValue = ref(false);
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

