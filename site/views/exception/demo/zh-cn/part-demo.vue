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
      :title="'没有权限'"
      :description="description"
      :class="{'exception-gray': isGray}"
    >
      <bk-button
        text
        theme="primary"
      >
        去申请
      </bk-button>
    </bk-exception>
    <bk-exception
      class="exception-wrap-item exception-part"
      type="empty"
      scene="part"
      :description="'没有数据'"
      :class="{'exception-gray': isGray}"
    />
  </div>
  <div class="exception-wrap">
    <bk-exception
      class="exception-wrap-item exception-part"
      type="500"
      scene="part"
      :description="'服务维护中'"
      :class="{'exception-gray': isGray}"
    />
    <bk-exception
      class="exception-wrap-item exception-part"
      type="search-empty"
      scene="part"
      :description="'搜索为空'"
      :class="{'exception-gray': isGray}"
    />
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const isGray = ref(false);
      const description = ref('你没有相应业务的访问权限，请前往申请相关业务权限');

      return {
        isGray,
        description,
      };
    },
  });
</script>

<style>
.exception-wrap {
  display: flex;
  flex-wrap: wrap;
  margin-left: -10px;
}

.exception-wrap .exception-wrap-item {
  height: 420px;
  padding-top: 22px;
  margin: 10px;
  border: 1px solid #dcdee5;
}

.exception-wrap-item.exception-part {
  height: 260px;
  padding-top: 48px;
  flex: 1;
}

.exception-wrap-item.exception-gray {
  background-color: #f5f6fa;
}
</style>
