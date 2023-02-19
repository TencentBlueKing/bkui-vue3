<template>
  <div class="button-group-list">
    <div class="mb10 basic-button-list">
      <span>小尺寸</span>
      <bk-button
        class="ml10"
        size="small"
      >
        基础按钮
      </bk-button>
      <bk-button
        class="ml10"
        size="small"
      >
        <plus class="f20" />
        新增
      </bk-button>
      <bk-button
        class="ml10"
        size="small"
      >
        下拉
        <angle-down class="f20" />
      </bk-button>
      <bk-button
        class="ml10"
        size="small"
        loading
      />
      <bk-button
        class="ml10"
        theme="primary"
        size="small"
        loading
      />
      <bk-button
        class="ml10"
        size="small"
      >
        <bk class="f20 mr6" />
        成功
      </bk-button>
    </div>

    <div class="mb10 basic-button-list">
      <span>默认按钮</span>
      <bk-button class="ml10">
        基础按钮
      </bk-button>
      <bk-button class="ml10">
        <plus class="f22" />
        新增
      </bk-button>
      <bk-button class="ml10">
        下拉
        <angle-down class="f22" />
      </bk-button>
      <bk-button
        class="ml10"
        loading
      />
      <bk-button
        class="ml10"
        theme="primary"
        loading
      />
      <bk-button class="ml10">
        <bk class="f22 mr6" />
        成功
      </bk-button>
    </div>

    <div class="basic-button-list">
      <span>大尺寸</span>
      <bk-button
        class="ml10"
        size="large"
      >
        基础按钮
      </bk-button>
      <bk-button
        class="ml10"
        size="large"
      >
        <plus class="f24" />
        新增
      </bk-button>
      <bk-button
        class="ml10"
        size="large"
      >
        下拉
        <angle-down class="f24" />
      </bk-button>
      <bk-button
        class="ml10"
        size="large"
        loading
      />
      <bk-button
        class="ml10"
        theme="primary"
        size="large"
        loading
      />
      <bk-button
        class="ml10"
        size="large"
      >
        <bk class="f24 mr6" />
        成功
      </bk-button>
    </div>
  </div>
</template>

<script>
  import { AngleDown, Bk, Plus } from 'bkui-vue/lib/icon';
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'Sizes',
    components: {
      AngleDown,
      Bk,
      Plus,
    },
  });
</script>

<style lang="postcss">
.mb10 {
  margin-bottom: 10px;
}

.mr6 {
  margin-right: 6px;
}

.f20 {
  font-size: 20px;
}

.f22 {
  font-size: 22px;
}

.f24 {
  font-size: 24px;
}
</style>
