<template>
  <div class="button-group-list">
    <div class="mb10">
      <bk-button-group size="small">
        <bk-button
          :selected="selected === 'Beijing'"
          @click="handleSelected('Beijing')"
        >
          Beijing
        </bk-button>
        <bk-button
          :selected="selected === 'Shanghai'"
          disabled
          @click="handleSelected('Shanghai')"
        >
          Shanghai
        </bk-button>
        <bk-button
          :selected="selected === 'Guangzhou'"
          @click="handleSelected('Guangzhou')"
        >
          Guangzhou
        </bk-button>
        <bk-button
          :selected="selected === 'Shenzhen'"
          disabled
          @click="handleSelected('Shenzhen')"
        >
          Shenzhen
        </bk-button>
        <bk-button
          :selected="selected === 'Other'"
          @click="handleSelected('Other')"
        >
          Other
          <angle-down class="f20" />
        </bk-button>
      </bk-button-group>
    </div>

    <div class="mb10">
      <bk-button-group>
        <bk-button
          :selected="selected === 'Beijing'"
          @click="handleSelected('Beijing')"
        >
          Beijing
        </bk-button>
        <bk-button
          :selected="selected === 'Shanghai'"
          disabled
          @click="handleSelected('Shanghai')"
        >
          Shanghai
        </bk-button>
        <bk-button
          :selected="selected === 'Guangzhou'"
          @click="handleSelected('Guangzhou')"
        >
          Guangzhou
        </bk-button>
        <bk-button
          :selected="selected === 'Shenzhen'"
          disabled
          @click="handleSelected('Shenzhen')"
        >
          Shenzhen
        </bk-button>
        <bk-button
          :selected="selected === 'Other'"
          @click="handleSelected('Other')"
        >
          Other
          <angle-down class="f20" />
        </bk-button>
      </bk-button-group>
    </div>

    <div>
      <bk-button-group size="large">
        <bk-button
          :selected="selected === 'Beijing'"
          @click="handleSelected('Beijing')"
        >
          Beijing
        </bk-button>
        <bk-button
          :selected="selected === 'Shanghai'"
          disabled
          @click="handleSelected('Shanghai')"
        >
          Shanghai
        </bk-button>
        <bk-button
          :selected="selected === 'Guangzhou'"
          @click="handleSelected('Guangzhou')"
        >
          Guangzhou
        </bk-button>
        <bk-button
          :selected="selected === 'Shenzhen'"
          disabled
          @click="handleSelected('Shenzhen')"
        >
          Shenzhen
        </bk-button>
        <bk-button
          :selected="selected === 'Other'"
          @click="handleSelected('Other')"
        >
          Other
          <angle-down class="f20" />
        </bk-button>
      </bk-button-group>
    </div>
  </div>
</template>

<script>
  import { AngleDown } from 'bkui-vue/lib/icon';
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    components: {
      AngleDown,
    },
    setup() {
      const selected = ref('深圳');
      const  handleSelected = (v)  => {
        selected.value = v;
      };

      return {
        selected,
        handleSelected,
      };
    },
  });
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
