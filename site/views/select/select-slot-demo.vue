<template>
  <div class="demo">
    <div>
      <div>
        <h4>tag</h4>
        <bk-select
          v-model="selectedValue"
          class="bk-select"
          filterable
          multiple
          show-select-all
          multiple-mode="tag"
          collapse-tags
        >
          <bk-option
            v-for="(item, index) in datasource"
            :id="item.value"
            :key="index"
            :name="item.label"
          />
          <template #tag="{selected}">
            {{ selected.map(item => `${item.label}( ${item.value} )`).join('；') }}
          </template>
        </bk-select>
      </div>
      <div>
        <h4>trigger</h4>
        <bk-select
          v-model="selectedValue"
          class="bk-select"
          filterable
          multiple
          :input-search="false"
        >
          <template #trigger="{ selected }">
            <span>{{ selected }}</span>
          </template>
          <bk-option
            v-for="(item, index) in datasource"
            :id="item.value"
            :key="index"
            :name="item.label"
          />
        </bk-select>
      </div>
      <div>
        <h4>extension</h4>
        <bk-select
          v-model="selectedValue"
          class="bk-select"
          filterable
          auto-focus
          @toggle="handleToggle"
        >
          <bk-option
            v-for="(item, index) in datasource"
            :id="item.value"
            :key="index"
            :name="item.label"
            :disabled="item.disabled"
          />
          <template #extension>
            <bk-input
              v-if="showEdit"
              @enter="handleEnter"
            />
            <span
              v-else
              @click="showEdit = true"
            ><i class="bk-icon icon-plus-circle" />新增</span>
          </template>
        </bk-select>
      </div>
    </div>
    <div>
      <div>
        <h4>prefix</h4>
        <bk-select
          v-model="selectedValue"
          class="bk-select"
          filterable
          multiple
          :input-search="false"
        >
          <template #prefix>
            <span style=" padding: 0 12px;line-height: 32px;background: #ccc;">运动选项</span>
          </template>
          <bk-option
            v-for="(item, index) in datasource"
            :id="item.value"
            :key="index"
            :name="item.label"
          />
        </bk-select>
      </div>
      <div>
        <h4>prefix(属性)</h4>
        <bk-select
          v-model="selectedValue"
          class="bk-select"
          filterable
          multiple
          :input-search="false"
          prefix="运动选项"
        >
          <bk-option
            v-for="(item, index) in datasource"
            :id="item.value"
            :key="index"
            :name="item.label"
          />
        </bk-select>
      </div>
      <div>
        <h4>prefix(属性)</h4>
        <bk-select
          v-model="selectedValue"
          class="bk-select"
          filterable
          multiple
          show-select-all
          multiple-mode="tag"
          collapse-tags
          prefix="运动选项"
          :auto-height="false"
        >
          <bk-option
            v-for="(item, index) in datasource"
            :id="item.value"
            :key="index"
            :name="item.label"
          />
        </bk-select>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref } from 'vue';

  const datasource = ref([
    {
      value: 1,
      label: '爬山',
    },
    {
      value: 2,
      label: '跑步',
    },
    {
      value: 3,
      label: '未知',
    },
    {
      value: 4,
      label: '健身',
    },
    {
      value: 5,
      label: '骑车',
    },
    {
      value: 6,
      label: '跳舞',
    },
  ]);
  const selectedValue = ref([1, 2, 3, 4]);

  const showEdit = ref(false);
  const handleToggle = (value) => {
    console.log(value);
  };
  const handleEnter = (v, e) => {
    e.stopPropagation();
    showEdit.value = false;
  };
</script>
<style scoped>

.demo >div {
  display: flex;
  margin-bottom: 20px;
}

.bk-select {
  width: 300px;
  margin-right: 20px;
}
</style>

