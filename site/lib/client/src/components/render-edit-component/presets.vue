<template>
  <section class="edit-component-presets">
    <div class="preset-title">
      <i class="bkui-vue-wiki-icon icon-preset"></i>
      <h3>预设场景</h3>
    </div>
    <div class="preset-list">
      <ul>
        <li
          v-for="(preset, key) in presets"
          :key="key"
          :class="index === key ? 'active-preset' : ''"
          class="preset-item"
          @click="emit('choose', preset)"
        >
          <span class="preset-name">
            {{ preset.title }}
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type {
  IComponentWiki,
} from '@/types/component';

interface IProps {
  presets: IComponentWiki['presets'];
  index: number;
}
interface IEmits {
  (e: 'choose', value: IComponentWiki['presets'][number]): void;
}

defineProps<IProps>();
const emit = defineEmits<IEmits>();
</script>

<style lang="postcss" scoped>
.edit-component-presets {
  background: #FFFFFF;
  box-shadow: 1px 0 0 0 #DCDEE5;
  height: 100%;
  padding: 16px;

  .preset-title {
    display: flex;
    align-items: center;
    color: #4D4F56;

    i {
      font-size: 16px;
    }

    h3 {
      margin-left: 8px;
      font-weight: bold;
      font-size: 14px;
      line-height: 14px;
    }
  }

  .preset-list {
    margin-top: 12px;

    ul {
      list-style: none;
      font-size: 12px;

      li {
        padding: 8px;
        color: #313238;
        background-color: #F5F7FA;
        margin-bottom: 12px;
        text-align: center;
        line-height: 20px;
        cursor: pointer;
      }

      .active-preset {
        background-color: #E1ECFF;
        color: #3A84FF;
      }
    }
  }
}
</style>
