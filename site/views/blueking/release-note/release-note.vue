<template>
  <Dialog
    class="bk-release-note-dialog"
    :is-show="props.show"
    :scrollable="false"
    :width="dialogWidth"
    dialog-type="show"
    @closed="emits('update:show', false)"
  >
    <template #header>
      <div class="bk-release-note-header" />
    </template>
    <div
      :style="{ height: `${dialogHeight}px` }"
      class="bk-release-note"
    >
      <ResizeLayout
        :initial-divide="180"
        :max="props.maxLeftWidth"
        :min="props.minLeftWidth"
      >
        <template #aside>
          <div class="bk-release-note-list-side">
            <slot name="list">
              <div
                v-for="version in props.list"
                :class="['bk-release-note-version-item', activeVersion === version[props.titleKey] ? ' is-active' : '']"
                :key="version[props.titleKey]"
                @click="handleSelect(version)"
              >
                <div
                  v-if="crtVersion === version[props.titleKey]"
                  class="bk-release-note-crt-tag"
                >
                  {{ crtVersionTag }}
                </div>
                <div class="bk-release-note-version-item-title">
                  {{ version[props.titleKey] }}
                </div>
                <div class="bk-release-note-version-item-subtitle">
                  {{ version[props.subTitleKey] }}
                </div>
              </div>
            </slot>
          </div>
        </template>
        <template #main>
          <div
            v-if="props.loading"
            class="bk-release-note-loading"
          >
            <Loading :loading="props.loading" />
          </div>
          <div
            v-else
            class="bk-release-note-detail"
          >
            <slot name="detail">
              <div
                ref="detailRef"
                class="bk-release-note-detail-content"
                v-html="versionDetail"
              />
            </slot>
          </div>
        </template>
      </ResizeLayout>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
  import { computed, ref, watch } from 'vue';

  import { Dialog, Loading, ResizeLayout } from 'bkui-vue';
  import MarkdownIt from 'markdown-it';

  const props = withDefaults(
    defineProps<{
      active?: string; // 当前查看选中版本，默认值为list属性传入值的第一个版本
      current?: string; // 当前最新的版本，默认值为list属性传入值的第一个版本
      detail?: string; // 日志详情内容, 即markdown字符串
      detailKey?: string;
      list?: { [key: string]: any }[]; // 版本列表
      loading?: boolean; // 版本详情区域loading
      maxLeftWidth?: number; // 左侧版本列表区域拖动最大宽度
      minLeftWidth?: number; // 左侧版本列表区域拖动最小宽度
      show: boolean; // 是否显示版本日志弹窗
      subTitleKey?: string;
      titleKey?: string;
      currentVersionText?: string; // 当前版本文本，用于标识当前版本
    }>(),
    {
      detail: '',
      detailKey: 'detail',
      list: () => [],
      loading: false,
      maxLeftWidth: 500,
      minLeftWidth: 180,
      subTitleKey: 'date',
      titleKey: 'title',
    },
  );

  const emits = defineEmits(['update:show', 'selected']);

  const dialogWidth = ref(850);
  const dialogHeight = ref(520);
  const activeVersion = ref('');
  const versionDetail = ref(''); // 日志详情
  const detailRef = ref();

  const crtVersion = computed(() => props.current || (props.list.length ? props.list[0][props.titleKey] : ''));

  const crtVersionTag = computed(() => {
    // 优先取传入的配置
    if (props.currentVersionText) {
      return props.currentVersionText;
    }

    const defaultTagCN = '当前版本';

    // 读国际化cookie
    if (document?.cookie) {
      const match = document.cookie.match(new RegExp('(^| )blueking_language=([^;]+)'));
      if (match) {
        return match[2] === 'en' ? 'current' : defaultTagCN;
      }
    }

    return defaultTagCN;
  });

  watch(
    () => props.show,
    val => {
      if (val) {
        let content = '';
        dialogWidth.value = window.innerWidth >= 1920 ? 1110 : 850;
        dialogHeight.value = window.innerWidth >= 1920 ? 640 : 520;
        if (props.active) {
          const version = props.list.find(item => item[props.titleKey] === props.active);
          content = version?.[props.detailKey] || '';
          activeVersion.value = props.active;
        } else {
          if (props.list.length > 0) {
            content = props.list[0][props.detailKey] || '';
            activeVersion.value = props.list[0][props.titleKey] || '';
            emits('selected', props.list[0]);
          }
        }
        if (props.detail) {
          content = props.detail;
        }
        versionDetail.value = parseMarkdownStr(content);
      }
    },
  );

  watch(
    () => props.active,
    val => {
      if (val) {
        activeVersion.value = val;
      }
    },
  );

  watch(
    () => props.detail,
    val => {
      versionDetail.value = parseMarkdownStr(val);
    },
  );

  const parseMarkdownStr = (content = '') => {
    if (content) {
      const md = new MarkdownIt();
      return md.render(content);
    }
    return '';
  };

  const handleSelect = (version: { [key: string]: any }) => {
    activeVersion.value = version[props.titleKey];
    versionDetail.value = parseMarkdownStr(version[props.detailKey] || '');
    detailRef.value?.scrollTo({ top: 0 });
    emits('selected', version);
  };
</script>
<style lang="scss">
  .bk-release-note-dialog {
    .#{$bk-prefix}-modal-header,
    .#{$bk-prefix}-modal-footer {
      display: none;
    }

    .#{$bk-prefix}-modal-body {
      padding-bottom: 0 !important;

      .#{$bk-prefix}-modal-content {
        max-height: unset;
        padding: 0 !important;
      }

      .#{$bk-prefix}-dialog-content {
        padding: 0;
        margin: 0;
      }
    }
  }

  .bk-release-note {
    .#{$bk-prefix}-resize-layout {
      height: 100%;
      border: none;
    }

    .#{$bk-prefix}-resize-layout-aside {
      height: 100%;
      padding: 20px 0;
      background: #fafbfd;
    }
  }

  .bk-release-note-list-side {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
    border-top: 1px solid #dcdee5;
    border-bottom: 1px solid #dcdee5;

    &::-webkit-scrollbar {
      width: 3px;
      height: 5px;
    }

    &::-webkit-scrollbar-thumb {
      background: #e6e9ea;
      border-radius: 20px;
      box-shadow: inset 0 0 6px rgba(204, 204, 204, 0.3);
    }

    .bk-release-note-version-item {
      position: relative;
      display: flex;
      flex: 0 0 54px;
      flex-direction: column;
      justify-content: center;
      padding-left: 18px;
      border-bottom: 1px solid #dcdee5;

      &:hover {
        cursor: pointer;
        background-color: #ffffff;
      }

      .bk-release-note-version-item-title {
        font-size: 16px;
        color: #313238;
      }

      .bk-release-note-version-item-subtitle {
        font-size: 12px;
        color: #979ba5;
      }

      .bk-release-note-crt-tag {
        position: absolute;
        top: 8px;
        right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 18px;
        padding: 0 3px;
        font-size: 12px;
        color: #ffffff;
        background-color: #699df4;
        border-radius: 2px;
      }

      &.is-active {
        background-color: #ffffff;

        &::before {
          position: absolute;
          top: 0px;
          bottom: 0px;
          left: 0;
          width: 6px;
          content: ' ';
          background-color: #3a84ff;
        }
      }
    }
  }

  .bk-release-note-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .bk-release-note-detail {
    height: 100%;
    padding: 45px 20px 35px 40px;

    .bk-release-note-detail-content {
      height: 100%;
      overflow: auto;
      font-size: 14px;
      color: #313238;

      &::-webkit-scrollbar {
        width: 3px;
        height: 5px;
      }

      &::-webkit-scrollbar-thumb {
        background: #e6e9ea;
        border-radius: 20px;
        box-shadow: inset 0 0 6px rgba(204, 204, 204, 0.3);
      }

      h1,
      h2,
      h3,
      h4,
      h5 {
        height: auto;
        margin: 10px 0;
        font:
          normal 14px/1.5 'Helvetica Neue',
          Helvetica,
          Arial,
          'Lantinghei SC',
          'Hiragino Sans GB',
          'Microsoft Yahei',
          sans-serif;
        font-weight: bold;
        color: #34383e;
      }

      h1 {
        font-size: 30px;
      }

      h2 {
        font-size: 24px;
      }

      h3 {
        font-size: 18px;
      }

      h4 {
        font-size: 16px;
      }

      h5 {
        font-size: 14px;
      }

      em {
        font-style: italic;
      }

      div,
      p,
      font,
      span,
      li {
        line-height: 1.3;
      }

      p {
        margin: 0 0 1em;
      }

      table,
      table p {
        margin: 0;
      }

      ul,
      ol {
        padding-left: 40px;
        margin: 10px 0 10px;
        text-indent: 0;
      }

      ul {
        list-style: disc;

        & > li {
          line-height: 1.8;
          white-space: normal;
          list-style: disc;
        }
      }

      ol {
        list-style: decimal;

        & > li {
          line-height: 1.8;
          white-space: normal;
          list-style: decimal;
        }
      }

      li > ul {
        margin-bottom: 10px;
      }

      li ol {
        padding-left: 20px !important;
      }

      ul ul,
      ul ol,
      ol ol,
      ol ul {
        margin-bottom: 0;
        margin-left: 20px;
      }

      pre,
      code {
        width: 95%;
        padding: 0 3px 2px;
        font-family: Monaco, Menlo, Consolas, 'Courier New', monospace;
        font-size: 14px;
        color: #333;
        border-radius: 3px;
      }

      code {
        padding: 2px 4px;
        font-family: Consolas, monospace, tahoma, Arial;
        color: #d14;
        border: 1px solid #e1e1e8;
      }

      pre {
        display: block;
        padding: 9.5px;
        margin: 0 0 10px;
        font-family: Consolas, monospace, tahoma, Arial;
        font-size: 13px;
        word-break: break-all;
        word-wrap: break-word;
        white-space: pre-wrap;
        background-color: #f6f6f6;
        border: 1px solid #ddd;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 2px;

        code {
          padding: 0;
          white-space: pre-wrap;
          border: 0;
        }
      }

      blockquote {
        padding: 0 0 0 14px;
        margin: 0 0 20px;
        border-left: 5px solid #dfdfdf;

        ::before,
        ::after {
          content: '';
        }

        p {
          margin-bottom: 0;
          font-size: 14px;
          font-weight: 300;
          line-height: 25px;
        }

        small {
          display: block;
          line-height: 20px;
          color: #999;

          ::before {
            content: '\2014 \00A0';
          }
        }
      }
    }
  }
</style>
