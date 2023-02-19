<template>
  <div class="button-group-list">
    <div class="mb10 basic-button-list">
      <span>Small Size</span>
      <bk-button
        class="ml10"
        size="small"
      >
        Basic Button
      </bk-button>
      <bk-button
        class="ml10"
        size="small"
      >
        <plus class="f20" />
        Add
      </bk-button>
      <bk-button
        class="ml10"
        size="small"
      >
        DropDown
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
        Success
      </bk-button>
    </div>

    <div class="mb10 basic-button-list">
      <span>Default Button</span>
      <bk-button class="ml10">
        Basic Button
      </bk-button>
      <bk-button class="ml10">
        <plus class="f22" />
        Add
      </bk-button>
      <bk-button class="ml10">
        DropDown
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
        Success
      </bk-button>
    </div>

    <div class="basic-button-list">
      <span>Large Size</span>
      <bk-button
        class="ml10"
        size="large"
      >
        Basic Button
      </bk-button>
      <bk-button
        class="ml10"
        size="large"
      >
        <plus class="f24" />
        Add
      </bk-button>
      <bk-button
        class="ml10"
        size="large"
      >
        DropDown
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
        Success
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
