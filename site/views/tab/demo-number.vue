<template>
  <div>
    <h3 class="demo-number-title">文字数字</h3>
    <bk-tab v-model:active="active" type="unborder-card" @change="handleChange">
      <bk-tab-panel
        v-for="(item, index) in panels"
        :key="item.name"
        :label="item.label"
        :name="item.name"
        :num="item.count"
        :num-display-type="bracketDisplayType"
        :closable="true"
      >
        {{ item.label }}-{{ index }}
      </bk-tab-panel>
    </bk-tab>
    <h3  class="demo-number-title">标签数字</h3>
    <div style="padding: 10px 20px; background: #f5f7fa">
      <bk-tab
        v-model:active="active"
        type="card-tab"
      >
        <bk-tab-panel
          v-for="(item, index) in panels"
          :key="item.name"
          :label="item.label"
          :name="item.name"
          :num="item.count"
        >
          {{ item.label }}-{{ index }}
        </bk-tab-panel>
      </bk-tab>
    </div>
    <bk-tab
      v-model:active="active"
      tab-position="left"
      type="card"
    >
      <bk-tab-panel
        v-for="(item, index) in panels"
        :key="item.name"
        :label="item.label"
        :name="item.name"
        :num="item.count"
        :num-display-type="ellipticDisplayType"
      >
        {{ item.label }}-{{ index }}
      </bk-tab-panel>
    </bk-tab>
    <bk-tab
      v-model:active="active"
      tab-position="right"
      type="card"
    >
      <bk-tab-panel
        v-for="(item, index) in panels"
        :key="item.name"
        :label="item.label"
        :name="item.name"
        :num="item.count"
        :num-display-type="squareDisplayType"
      >
        {{ item.label }}-{{ index }}
      </bk-tab-panel>
    </bk-tab>
  </div>
</template>

<script setup>
import { ref } from "vue";
const active = ref("mission");
// 数字显示默认提供三种格式bracket(文字数字)、square(方形tag)、elliptic(椭圆tag), 传空就是普通文字数字
const bracketDisplayType = ref("bracket");
const squareDisplayType = ref('square');
const ellipticDisplayType = ref('elliptic');
let panels = ref([
  { name: "mission", label: "任务报表", count: 10 },
  { name: "config", label: "加速配置加速配置加速配置加速配置加速配置", count: 20 },
  { name: "history", label: "历史版本", count: 30 },
  { name: "deleted", label: "已归档加速任务", count: 40 },
]);
const handleChange= (payload) => {
  console.log(payload);
}
</script>

<style>
.demo-number-title {
  font-size: 14px;
}
</style>
