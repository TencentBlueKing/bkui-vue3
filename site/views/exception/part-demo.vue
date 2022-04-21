<template>
  <div>
    <bk-button
      theme="primary"
      @click="isGray = !isGray"
    >
      切换{{ !isGray ? '灰色' : '白色' }}背景
    </bk-button>
  </div>
  <div class="exception-wrap">
    <bk-exception
      class="exception-wrap-item exception-part"
      type="403"
      scene="part"
      :class="{'exception-gray': isGray}"
    >
      <span>没有权限</span>
      <div class="text-wrap text-part">
        <span class="text-btn">去申请</span>
      </div>
    </bk-exception>
    <bk-exception
      class="exception-wrap-item exception-part"
      type="empty"
      scene="part"
      :class="{'exception-gray': isGray}"
    />
  </div>
  <div class="exception-wrap">
    <bk-exception
      class="exception-wrap-item exception-part"
      type="500"
      scene="part"
      :class="{'exception-gray': isGray}"
    />
    <bk-exception
      class="exception-wrap-item exception-part"
      type="search-empty"
      scene="part"
      :class="{'exception-gray': isGray}"
    />
  </div>
</template>
<script setup>
  import { ref } from 'vue';

  import BkException from '@bkui-vue/exception';
  const isGray = ref(false);

</script>
<style>
.exception-wrap {
    display: flex;
    flex-wrap: wrap;
}
.exception-wrap .exception-wrap-item {
    border: 1px solid #DCDEE5;
    margin: 10px;
    height: 420px;
    padding-top: 22px;
}
.exception-wrap-item.exception-part   {
    height: 260px;
    padding-top: 48px;
    flex: 1;
}
.exception-wrap-item.exception-gray {
    background-color: #F5F6FA;
}
.exception-wrap .exception-wrap-item .text-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #3A84FF;
    font-size: 14px;
    margin-top: 12px;
}
.exception-wrap .exception-wrap-item .text-wrap.text-part {
    font-size: 12px;
    margin-top: 10px;
}
.exception-wrap .exception-wrap-item .text-subtitle {
    color: #979BA5;
    font-size: 14px;
    text-align: center;
    margin-top: 14px;
}
.text-wrap .text-btn {
    margin: 0 10px;
}
.text-wrap .text-btn:hover {
    cursor: pointer;
}
</style>
