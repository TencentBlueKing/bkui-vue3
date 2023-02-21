<template>
  <div class="card-demo">
    <div class="card-demo-item">
      <bk-card
        :title="'Card title'"
        is-collapse
      >
        <p>Card content 1</p>
        <p>Card content 2</p>
        <p>Card content 3</p>
      </bk-card>
    </div>
    <div class="card-demo-item">
      <bk-card
        :title="'Card title'"
        class="mr40"
        show-footer
        show-header
      >
        <p>Card content 1</p>
        <p>Card content 2</p>
        <p>Card content 3</p>
        <template #footer>
          <div class="card-demo-foot">
            <span class="card-demo-foot-item"> <help-document-fill /></span>
            <span class="card-demo-foot-item"> <help /></span>
            <span class="card-demo-foot-item"> <help-fill /></span>
          </div>
        </template>
      </bk-card>
    </div>
  </div>
</template>

<script>
  import { Help, HelpDocumentFill, HelpFill } from 'bkui-vue/lib/icon';
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: {
      Help,
      HelpDocumentFill,
      HelpFill,
    },
    setup() {
      return {};
    },
  });
</script>

<style lang="less" scoped>
.card-demo {
  display: flex;
  width: 100%;
  padding: 30px;
  margin: 0 auto;

  .card-demo-item {
    display: inline-block;
    width: 400px;
    margin-left: 30px;
  }

  .card-demo-foot {
    height: 48px;
    text-align: center;
    background: #fafbfd;
  }

  .card-demo-foot-item {
    display: inline-block;
    width: 33.15%;
    color: #979ba5;
    border-right: 1px solid #f0f2f5;

    &:last-child {
      border: none;
    }
  }
}
</style>
