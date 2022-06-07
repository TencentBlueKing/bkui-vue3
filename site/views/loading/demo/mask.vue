<template>
  <div>
    <bk-loading
      loading
      opacity="0.6"
      :z-index="100"
      color="#62ba62"
    >
      <div class="loading-container">
        Content
      </div>
    </bk-loading>
  </div>
</template>

<script setup>

</script>

<style lang="postcss">
  .loading-container {
    position: relative;
    z-index: 99;
    display: flex;
    width: 100%;
    height: 360px;
    align-items: center;
    justify-content: center;
  }
</style>
