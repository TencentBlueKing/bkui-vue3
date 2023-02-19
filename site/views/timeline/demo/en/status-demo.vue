<template>
  <div class="wrapper">
    <bk-container :col="12">
      <bk-row>
        <bk-col :span="4">
          <div class="content">
            <bk-timeline
              :list="state.list"
            />
          </div>
        </bk-col>
        <bk-col :span="4">
          <div class="content">
            <bk-timeline
              :list="state.list1"
            />
          </div>
        </bk-col>
        <bk-col :span="4">
          <div class="content">
            <bk-timeline
              :list="state.list2"
            />
          </div>
        </bk-col>
      </bk-row>
    </bk-container>
  </div>
</template>
<script>
  import { defineComponent, reactive } from 'vue';

  export default defineComponent({
    setup() {
      const state = reactive({
        list: [
          {
            tag: 'Pony approved and attached with "agree"',
            content: 'Go online from pony to blue whale market',
            color: 'green',
            filled: true,
          },
          {
            tag: 'Tony approved and attached with "agree"',
            content: '<span style="font-size: 12px;">2019-12-15 11:00</span>',
            color: 'green',
            filled: true,
          },
          {
            tag: 'Allen is approving',
            content: '<span style="font-size: 12px;">2020-12-15 11:00</span>',
            color: 'blue',
            size: 'large',
          },
          {
            tag: 'Step 3',
            content: '<span style="font-size: 12px;">2021-12-15 11:00</span>',
          },
          {
            tag: 'Step 4',
            content: '<span style="font-size: 12px;">2022-12-15 11:00</span>',
          },
        ],

        list1: [
          {
            tag: 'Pony approved and attached with "agree"',
            content: 'Go online from pony to blue whale market',
            color: 'green',
            filled: true,
          },
          {
            tag: 'Tony approved and attached with "agree"',
            content: '<span style="font-size: 12px;">2019-12-15 11:00</span>',
            color: 'green',
            filled: true,
          },
          {
            tag: 'Allen failed to pass the examination and approval with "Disagree" attached',
            content: '<span style="font-size: 12px;">2020-12-15 11:00</span>',
            color: 'red',
            size: 'large',
          },
          {
            tag: 'Step 3',
            content: '<span style="font-size: 12px;">2021-12-15 11:00</span>',
          },
          {
            tag: 'Step 4',
            content: '<span style="font-size: 12px;">2022-12-15 11:00</span>',
          },
        ],

        list2: [
          {
            tag: 'Pony approved and attached with "agree"',
            content: 'Go online from pony to blue whale market',
            color: 'green',
            filled: true,
          },
          {
            tag: 'Tony approved and attached with "agree"',
            content: '<span style="font-size: 12px;">2019-12-15 11:00</span>',
            color: 'blue',
            filled: true,
          },
          {
            tag: 'Allen suspended approval',
            content: '<span style="font-size: 12px;">2020-12-15 11:00</span>',
            color: 'yellow',
            size: 'large',
          },
          {
            tag: 'Step 3',
            content: '<span style="font-size: 12px;">2021-12-15 11:00</span>',
          },
          {
            tag: 'Step 4',
            content: '<span style="font-size: 12px;">2022-12-15 11:00</span>',
          },
        ],
      });

      return {
        state,
      };
    },
  });

</script>
<style lang="postcss">
  .wrapper {
    padding: 20px 0;
    overflow: hidden;
    border: 1px solid #ddd;
    border-radius: 2px;
  }
</style>
