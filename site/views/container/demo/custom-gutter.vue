<template>
  <div class="wrapper">
    <bk-container
      :col="12"
      :gutter="4"
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
      <bk-row>
        <bk-col :span="7">
          <div class="content">
            7/12
          </div>
        </bk-col>
        <bk-col :span="5">
          <div class="content">
            5/12
          </div>
        </bk-col>
      </bk-row>
    </bk-container>
  </div>
</template>

<style lang="postcss">
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
