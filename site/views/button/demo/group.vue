<template>
  <div class="button-group-list">
    <div class="mb10">
      <bk-button-group size="small">
        <bk-button
          :selected="selected === '北京'"
          @click="handleSelected('北京')"
        >
          北京
        </bk-button>
        <bk-button
          :selected="selected === '上海'"
          disabled
          @click="handleSelected('上海')"
        >
          上海
        </bk-button>
        <bk-button
          :selected="selected === '广州'"
          @click="handleSelected('广州')"
        >
          广州
        </bk-button>
        <bk-button
          :selected="selected === '深圳'"
          disabled
          @click="handleSelected('深圳')"
        >
          深圳
        </bk-button>
        <bk-button
          :selected="selected === '其他'"
          @click="handleSelected('其他')"
        >
          其他
          <angle-down class="f20" />
        </bk-button>
      </bk-button-group>
    </div>

    <div class="mb10">
      <bk-button-group>
        <bk-button
          :selected="selected === '北京'"
          @click="handleSelected('北京')"
        >
          北京
        </bk-button>
        <bk-button
          :selected="selected === '上海'"
          @click="handleSelected('上海')"
        >
          上海
        </bk-button>
        <bk-button
          :selected="selected === '广州'"
          @click="handleSelected('广州')"
        >
          广州
        </bk-button>
        <bk-button
          :selected="selected === '深圳'"
          @click="handleSelected('深圳')"
        >
          深圳
        </bk-button>
        <bk-button
          :selected="selected === '其他'"
          @click="handleSelected('其他')"
        >
          其他
          <angle-down class="f22" />
        </bk-button>
      </bk-button-group>
    </div>

    <div>
      <bk-button-group size="large">
        <bk-button
          :selected="selected === '北京'"
          @click="handleSelected('北京')"
        >
          北京
        </bk-button>
        <bk-button
          :selected="selected === '上海'"
          @click="handleSelected('上海')"
        >
          上海
        </bk-button>
        <bk-button
          :selected="selected === '广州'"
          @click="handleSelected('广州')"
        >
          广州
        </bk-button>
        <bk-button
          :selected="selected === '深圳'"
          @click="handleSelected('深圳')"
        >
          深圳
        </bk-button>
        <bk-button
          :selected="selected === '其他'"
          @click="handleSelected('其他')"
        >
          其他
          <angle-down class="f24" />
        </bk-button>
      </bk-button-group>
    </div>
  </div>
</template>

<script setup>
  import { AngleDown } from 'bkui-vue/lib/icon';
  import { ref } from 'vue';
  const selected = ref('深圳');
  function handleSelected(v) {
    selected.value = v;
  }
</script>

<style lang="postcss">
  .mb10 {
    margin-bottom: 10px;
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
