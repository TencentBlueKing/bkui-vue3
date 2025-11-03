<template>
    <div class="empty">{{ content }}</div>
</template>

<script lang="ts" setup>
interface IProps {
    content?: string
}
withDefaults(defineProps<IProps>(), {
    content: '暂无配置'
})
</script>

<style lang="postcss" scoped>
.empty {
    padding: 12px;
    text-align: center;
    font-size: 16px;
    color: #4D4F56;
}
</style>