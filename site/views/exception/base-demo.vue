<template>
  <div class="exception-base-demo-wrap">
    <bk-exception
      class="exception-wrap-item"
      type="404"
      title="页面不存在"
    >
      <bk-button theme="primary">
        刷新页面
      </bk-button>
      <bk-button theme="primary">
        返回首页
      </bk-button>
    </bk-exception>
    <bk-exception
      class="exception-wrap-item"
      type="building"
      title="功能建设中"
    >
      <bk-button theme="primary">
        返回首页
      </bk-button>
    </bk-exception>
    <bk-exception
      class="exception-wrap-item"
      type="403"
      title="无业务权限"
      description="你没有相应业务的访问权限，请前往申请相关业务权限"
    >
      <bk-button theme="primary">
        去申请
      </bk-button>
    </bk-exception>
    <bk-exception
      class="exception-wrap-item"
      type="500"
      title="拉取用户配置数据失败"
    >
      <bk-button theme="primary">
        重新获取
      </bk-button>
    </bk-exception>
    <bk-exception
      class="exception-wrap-item"
      type="login"
      title="请登入蓝鲸"
    >
      <bk-button theme="primary">
        登入
      </bk-button>
    </bk-exception>
  </div>
</template>

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
