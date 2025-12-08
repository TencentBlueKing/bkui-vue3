<template>
  <section class="edit-component-presets">
    <div class="preset-title">
      <i class="bkui-vue-wiki-icon icon-preset"></i>
      <h3>预设场景</h3>
    </div>
    <div class="preset-list g-scrollbar">
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
          <div class="preset-description">
            <bk-overflow-title :line-clamp="2" :content="preset.description" />
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
import {
  OverflowTitle as BkOverflowTitle,
} from 'bkui-vue';

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

  .preset-title {
    display: flex;
    align-items: center;
    color: #4D4F56;
    padding: 16px;
    padding-bottom: 0px;

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
    padding: 16px;
    padding-top: 0px;
    overflow: auto;
    height: calc(100% - 32px);

    ul {
      list-style: none;
      font-size: 12px;

      li {
        padding: 5px 16px;
        color: #313238;
        background-color: #F5F7FA;
        margin-bottom: 12px;
        /* text-align: center; */
        line-height: 20px;
        cursor: pointer;
      }

      .preset-name {
        font-weight: bold;
        font-size: 14px;
        line-height: 20px;
      }

      .preset-description {
        margin-top: 4px;
        line-height: 20px;
        color: #63656E;
      }

      .active-preset {
        background-color: #E1ECFF;
        color: #3A84FF;
      }
    }
  }
}
</style>
