<template>
  <div>
    <p>
      <bk-button
        theme="danger"
        @click="handleSingle({ position: placement.topLeft, theme: 'error' })"
      >
        Upper left corner
      </bk-button>&nbsp;&nbsp;
      <bk-button
        theme="success"
        @click="handleSingle({ position: placement.topRight, theme: 'success' })"
      >
        Upper right corner
      </bk-button>
    </p>
    <p>
      <bk-button
        theme="warning"
        @click="handleSingle({ position: placement.bottomLeft, theme: 'warning' })"
      >
        Lower left quarter
      </bk-button>&nbsp;&nbsp;
      <bk-button
        theme="primary"
        @click="handleSingle({ position: placement.bottomRight, theme: 'primary' })"
      >
        Lower right corner
      </bk-button>
    </p>
  </div>
</template>

<script>
  import { Notify } from 'bkui-vue';
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const title = ref('Hello! Welcome to use Blue Whale Smart Cloud products');
      const message = ref('Hello, the function permission you applied for has been opened. Please log in and check in time. If you have any questions, please contact the Blue Whale Smart Cloud administrator or follow the WeChat public account.');

      const placement = ref({
        topLeft: 'top-left',
        topRight: 'top-right',
        bottomLeft: 'bottom-left',
        bottomRight: 'bottom-right',
      });

      const handleSingle = (config) => {
        config.title = title.value;
        config.message = message.value;
        Notify(config);
      };

      return {
        placement,
        handleSingle,
      };
    },
  });
</script>
