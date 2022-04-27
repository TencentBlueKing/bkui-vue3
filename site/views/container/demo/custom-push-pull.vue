<template>
  <div class="wrapper">
    <bk-container :col="12">
      <bk-row>
        <bk-col
          :span="7"
          :push="5"
        >
          <div class="content">
            7/12 (push: 5)
          </div>
        </bk-col>
        <bk-col
          :span="5"
          :pull="7"
        >
          <div class="content">
            5/12 (pull: 7)
          </div>
        </bk-col>
      </bk-row>
      <bk-row>
        <bk-col
          :span="3"
          :push="9"
        >
          <div class="content">
            3/12 (push: 9)
          </div>
        </bk-col>
        <bk-col
          :span="9"
          :pull="3"
        >
          <div class="content">
            9/12 (pull: 3)
          </div>
        </bk-col>
      </bk-row>
      <bk-row>
        <bk-col
          :span="4"
          :offset="3"
        >
          <div class="content">
            4/12 (offset: 3)
          </div>
        </bk-col>
        <bk-col :span="5">
          <div class="content">
            5/12
          </div>
        </bk-col>
      </bk-row>
      <bk-row>
        <bk-col
          :span="4"
          :push="8"
        >
          <div class="content">
            4/12 (push: 8)
          </div>
        </bk-col>
        <bk-col
          :span="3"
          :offset="-4"
        >
          <div class="content">
            3/12 (offset: -4)
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
