<template>
  <div>
    <bk-steps
      class="mb20"
      status="error"
      :cur-step="2"
    />

    <bk-steps
      class="mb20"
      status="loading"
      :cur-step="2"
    />
  </div>
</template>
<style>
.mb20 {
  margin-bottom: 20px
}
</style>
