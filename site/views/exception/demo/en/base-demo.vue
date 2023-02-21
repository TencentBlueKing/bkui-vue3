<template>
  <div class="exception-base-demo-wrap">
    <bk-exception
      class="exception-wrap-item"
      type="404"
      :title="'Page does not exist'"
    >
      <bk-button theme="primary">
        Refresh page
      </bk-button>
      <bk-button theme="primary">
        Return to home page
      </bk-button>
    </bk-exception>
    <bk-exception
      class="exception-wrap-item"
      type="building"
      :title="'Function construction in progress'"
    >
      <bk-button theme="primary">
        Return to home page
      </bk-button>
    </bk-exception>
    <bk-exception
      class="exception-wrap-item"
      type="403"
      :title="'No business permission'"
      :description="description"
    >
      <bk-button theme="primary">
        Apply
      </bk-button>
    </bk-exception>
    <bk-exception
      class="exception-wrap-item"
      type="500"
      :title="'Failed to pull user configuration data'"
    >
      <bk-button theme="primary">
        Reacquire
      </bk-button>
    </bk-exception>
    <bk-exception
      class="exception-wrap-item"
      type="login"
      :title="'Please log in to BlueKing'"
    >
      <bk-button theme="primary">
        Login
      </bk-button>
    </bk-exception>
    <bk-exception
      class="exception-wrap-item"
      :title="'Custom icon'"
    >
      <template #type>
        <img
          src="https://bk.tencent.com/static/images/index/index/%E9%AB%98%E6%95%88%E8%BF%90%E8%90%A5@2x.png"
        >
      </template>
      <bk-button theme="primary">
        Login
      </bk-button>
    </bk-exception>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const isGray = ref(false);
      const description = ref('You do not have access rights to the corresponding business, please go to apply for relevant business rights');

      return {
        isGray,
        description,
      };
    },
  });
</script>

<style lang="postcss">
.exception-base-demo-wrap .exception-wrap-item {
  height: 440px;
  padding-top: 22px;
  margin-bottom: 10px;
  border: 1px solid #dcdee5;
}

.exception-base-demo-wrap .bk-button ~ .bk-button {
  margin-left: 8px;
}
</style>
