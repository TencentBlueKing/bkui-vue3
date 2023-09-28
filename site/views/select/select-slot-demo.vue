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
            <div class="custom-extension">
              <div style="display: flex; align-items: center;" v-if="showEdit">
                <bk-input
                  size="small"
                  ref="inputRef"
                  v-model="optionName"
                  @enter="addOption"
                />
                <Done 
                  style="font-size: 22px;color: #2DCB56;cursor: pointer;margin-left: 6px;"
                  @click="addOption"/>
                <Error 
                  style="font-size: 16px;color: #C4C6CC;cursor: pointer;margin-left: 2px;"
                  @click="showEdit = false"/>
              </div>
              <div
                v-else
                style="display: flex; align-items: center;justify-content: center;"
              >
                <span style="display: flex; align-items: center;cursor: pointer;" @click="handleShowEdit">
                  <plus style="font-size: 20px;"/>
                  新增
                </span>
                <span style="display: flex; align-items: center;position: absolute; right: 12px;">
                  <bk-divider direction="vertical" type="solid" />
                  <Spinner style="font-size: 14px;color: #3A84FF;" v-if="isLoading"/>
                  <RightTurnLine style="font-size: 14px;cursor: pointer;" v-else @click="refresh"/>
                </span>
              </div>
            </div>
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
  import { Plus, Done, Error, RightTurnLine, Spinner } from 'bkui-vue/lib/icon';

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
  const inputRef = ref()
  const handleShowEdit = () => {
    showEdit.value = true
    setTimeout(() => {
      inputRef.value.focus()
    })
  }
  const optionName = ref('')
  const addOption = () => {
    if (optionName.value.trim()) {
      datasource.value.push({
        value: Math.random() + optionName.value,
        label: optionName.value
      })
      optionName.value = ''
    }
    showEdit.value = false;
  };

  const isLoading = ref(false)
  const refresh = () => {
    isLoading.value = true
    setTimeout(() => {
      isLoading.value = false
    }, 2000)
  }
</script>
<style lang="postcss" scoped>

.demo >div {
  display: flex;
  margin-bottom: 20px;
}

.bk-select {
  width: 300px;
  margin-right: 20px;
}
.custom-extension {
  width: 100%;
  color: #63656E;
  padding: 0 12px;
}
</style>

