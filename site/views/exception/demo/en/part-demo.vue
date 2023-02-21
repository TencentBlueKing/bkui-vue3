<template>
  <div>
    <bk-button
      theme="primary"
      @click="isGray = !isGray"
    >
      switch {{ !isGray ? 'grey' : 'white' }} background
    </bk-button>
  </div>
  <div class="exception-wrap">
    <bk-exception
      class="exception-wrap-item exception-part"
      type="403"
      scene="part"
      :title="'No permission'"
      :description="description"
      :class="{'exception-gray': isGray}"
    >
      <bk-button
        text
        theme="primary"
      >
        Apply
      </bk-button>
    </bk-exception>
    <bk-exception
      class="exception-wrap-item exception-part"
      type="empty"
      scene="part"
      :description="'No data'"
      :class="{'exception-gray': isGray}"
    />
  </div>
  <div class="exception-wrap">
    <bk-exception
      class="exception-wrap-item exception-part"
      type="500"
      scene="part"
      :description="'Service maintenance'"
      :class="{'exception-gray': isGray}"
    />
    <bk-exception
      class="exception-wrap-item exception-part"
      type="search-empty"
      scene="part"
      :description="'Search is empty'"
      :class="{'exception-gray': isGray}"
    />
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
