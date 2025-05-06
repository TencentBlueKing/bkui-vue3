<template>
  <div class="style-demo">
    <!-- small -->
    <p>
      small
      <bk-select
        class="bk-select"
        v-model="selectedValue"
        size="small"
      >
        <bk-option
          v-for="(item, index) in datasource"
          :id="item.value"
          :key="index"
          :name="item.label"
        />
      </bk-select>
    </p>
    <!-- default -->
    <p>
      default
      <bk-select
        class="bk-select"
        v-model="selectedValue"
      >
        <bk-option
          v-for="(item, index) in datasource"
          :id="item.value"
          :key="index"
          :name="item.label"
        />
      </bk-select>
    </p>
    <!-- large -->
    <p>
      large
      <bk-select
        class="bk-select"
        v-model="selectedValue"
        :inputTooltipsOptions="{ sameWidth: false }"
        size="large"
        filterable
        multiple
      >
        <bk-option
          v-for="(item, index) in datasource"
          :id="item.value"
          :key="index"
          :name="item.label"
        />
      </bk-select>
    </p>
    <!-- simplicity small -->
    <p>
      simplicity tag
      <bk-select
        class="bk-select"
        v-model="selectedValue"
        behavior="simplicity"
        multiple-mode="tag"
        collapse-tags
        filterable
        multiple
      >
        <bk-option
          v-for="(item, index) in datasource"
          :id="item.value"
          :key="index"
          :name="item.label"
        />
      </bk-select>
    </p>
  </div>
</template>
<script setup>
  import { ref } from 'vue';
  const datasource = ref([
    {
      value: 'climbing',
      label: '爬山',
    },
    {
      value: 'running',
      label: '跑步',
    },
    {
      value: 'unknow',
      label: '未知',
    },
    {
      value: 'fitness',
      label: '健身',
    },
    {
      value: 'bike',
      label: '骑车',
    },
    {
      value: 'dancing',
      label: '跳舞',
    },
    {
      value: 'sleep',
      label: '睡觉',
      disabled: true,
    },
  ]);
  const selectedValue = ref('running');
</script>
<style scoped>
  .style-demo {
    display: flex;
  }

  .bk-select {
    width: 200px;
    margin-right: 20px;
  }
</style>
