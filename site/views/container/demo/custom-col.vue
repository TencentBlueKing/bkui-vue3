<template>
  <div class="wrapper">
    <bk-container
      :col="12"
      :margin="6"
    >
      <bk-row>
        <bk-col>
          <div class="content">
            1/12
          </div>
        </bk-col>
        <bk-col>
          <div class="content">
            1/12
          </div>
        </bk-col>
        <bk-col>
          <div class="content">
            1/12
          </div>
        </bk-col>
        <bk-col>
          <div class="content">
            1/12
          </div>
        </bk-col>
        <bk-col>
          <div class="content">
            1/12
          </div>
        </bk-col>
        <bk-col>
          <div class="content">
            1/12
          </div>
        </bk-col>
        <bk-col>
          <div class="content">
            1/12
          </div>
        </bk-col>
        <bk-col>
          <div class="content">
            1/12
          </div>
        </bk-col>
        <bk-col>
          <div class="content">
            1/12
          </div>
        </bk-col>
        <bk-col>
          <div class="content">
            1/12
          </div>
        </bk-col>
        <bk-col>
          <div class="content">
            1/12
          </div>
        </bk-col>
        <bk-col>
          <div class="content">
            1/12
          </div>
        </bk-col>
      </bk-row>
    </bk-container>
  </div>
</template>

<style lang="postcss" scoped>
  .wrapper {
    padding: 20px 0;
    overflow: hidden;
    border: 1px solid #ddd;
    border-radius: 2px;
  }

  .content {
    height: 100%;
    font-size: 12px;
    line-height: 60px;
    background-color: #e1ecff;
    border-radius: 2px;
  }

  .bk-grid-row {
    text-align: center;
  }

  .bk-grid-row + .bk-grid-row {
    margin-top: 30px;
  }

  .flex {
    .bk-grid-row + .bk-grid-row {
      margin-top: 10px;
    }
  }
</style>
