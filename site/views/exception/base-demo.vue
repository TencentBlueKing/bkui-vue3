<template>
  <div class="exception-base-demo-wrap">
    <bk-exception
      class="exception-wrap-item"
      type="404"
    >
      <span>页面不存在</span>
      <div class="text-wrap">
        <span class="text-btn">刷新页面</span>
        <span class="text-btn">返回首页</span>
      </div>
    </bk-exception>
    <bk-exception
      class="exception-wrap-item"
      type="building"
    >
      <span>功能建设中</span>
      <div class="text-wrap">
        <span class="text-btn">返回首页</span>
      </div>
    </bk-exception>
    <bk-exception
      class="exception-wrap-item"
      type="403"
    >
      <span>无业务权限</span>
      <div class="text-subtitle">
        你没有相应业务的访问权限，请前往申请相关业务权限
      </div>
      <div class="text-wrap">
        <span class="text-btn">去申请</span>
      </div>
    </bk-exception>
    <bk-exception
      class="exception-wrap-item"
      type="500"
    >
      <span>拉取用户配置数据失败</span>
      <div class="text-wrap">
        <span class="text-btn">重新获取</span>
      </div>
    </bk-exception>
    <bk-exception
      class="exception-wrap-item"
      type="login"
    >
      <span>请登入蓝鲸</span>
      <div class="text-wrap">
        <bk-button
          theme="primary"
          class="login-btn"
        >
          登入
        </bk-button>
      </div>
    </bk-exception>
  </div>
</template>

<style lang="postcss">
.exception-base-demo-wrap .exception-wrap-item {
  height: 420px;
  padding-top: 22px;
  margin-bottom: 10px;
  border: 1px solid #dcdee5;
}

.exception-base-demo-wrap .exception-wrap-item .text-wrap {
  display: flex;
  margin-top: 12px;
  font-size: 14px;
  color: #3a84ff;
  align-items: center;
  justify-content: center;
}

.exception-base-demo-wrap .exception-wrap-item .text-subtitle {
  margin-top: 14px;
  font-size: 14px;
  color: #979ba5;
  text-align: center;
}

.text-wrap .text-btn {
  margin: 0 5px;
}

.text-wrap .login-btn {
  min-width: 88px;
}

.text-wrap .text-btn:hover {
  color: #1768ef;
  cursor: pointer;
}
</style>
