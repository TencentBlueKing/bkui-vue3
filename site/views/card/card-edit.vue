<template>
  <div class="card-demo">
    <div class="card-demo-item">
      <bk-card
        title="Card卡片标题"
        position="right"
        is-edit
        is-collapse
      >
        <div class="card-content-wrapper">
          <p>卡片内容 1</p>
          <p>卡片内容 2</p>
          <p>卡片内容 3</p>
        </div>
      </bk-card>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  export default defineComponent({
    components: {},
  });
</script>
<style lang="less" scoped>
  .card-demo {
    display: flex;
    width: 100%;
    padding: 30px;
    margin: 0 auto;

    .card-content-wrapper {
      padding: 20px 0;

      p {
        margin: 0;

        &:not(:last-of-type) {
          margin-bottom: 15px;
        }
      }
    }

    .card-demo-item {
      display: inline-block;
      width: 400px;
      margin-left: 30px
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
