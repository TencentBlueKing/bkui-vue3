<template>
  <div class="button-group-list">
    <div class="mb10">
      <bk-button-group size="small">
        <bk-button>北京</bk-button>
        <bk-button>上海</bk-button>
        <bk-button>广州</bk-button>
        <bk-button>深圳</bk-button>
        <bk-button>
          其他
          <angle-down />
        </bk-button>
      </bk-button-group>
    </div>

    <div class="mb10">
      <bk-button-group>
        <bk-button>北京</bk-button>
        <bk-button>上海</bk-button>
        <bk-button>广州</bk-button>
        <bk-button>深圳</bk-button>
        <bk-button>
          其他
          <angle-down />
        </bk-button>
      </bk-button-group>
    </div>

    <div>
      <bk-button-group size="large">
        <bk-button>北京</bk-button>
        <bk-button>上海</bk-button>
        <bk-button>广州</bk-button>
        <bk-button>深圳</bk-button>
        <bk-button>
          其他
          <angle-down />
        </bk-button>
      </bk-button-group>
    </div>
  </div>
</template>

<script setup>
  import { AngleDown } from '@bkui-vue/icon';
</script>

<style lang="postcss">
  .mb10 {
    margin-bottom: 10px;
  }
</style>
