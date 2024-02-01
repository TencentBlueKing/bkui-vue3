/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition):
 *
 * ---------------------------------------------------
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import { computed, defineComponent, h, toRefs, TransitionGroup } from 'vue';

import { useLocale } from '@bkui-vue/config-provider';
import { ArchiveFill, AudioFill, Del, Done, ImageFill, RightTurnLine, TextFill, VideoFill } from '@bkui-vue/icon';
import Progress from '@bkui-vue/progress';
import { classes } from '@bkui-vue/shared';

import uploadProps from './props';
import { CLASS_PREFIX, EThemes, UploadFile } from './upload.type';

export default defineComponent({
  name: 'UploadList',
  props: {
    theme: uploadProps.theme,
    disabled: uploadProps.disabled,
    files: uploadProps.files,
    multiple: uploadProps.multiple,
  },
  emits: ['remove', 'retry'],
  setup(props, { slots, emit }) {
    const t = useLocale('upload');
    const { theme, disabled, multiple } = toRefs(props);

    const classBlock = `${CLASS_PREFIX}-list`;

    const isPhotowall = computed<boolean>(() => theme.value === EThemes.PICTURE);
    const isSinglePhoto = computed<boolean>(() => isPhotowall.value && !multiple.value);

    const classNames = computed(() =>
      classes({
        [classBlock]: true,
        [`${classBlock}--${theme.value}`]: true,
        [`${classBlock}--disabled`]: disabled.value,
      }),
    );

    function formatSize(value: number) {
      const uints = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const index = Math.floor(Math.log(value) / Math.log(1024));
      const size = value / 1024 ** index;
      return `${size.toFixed(2)}${uints[index]}`;
    }

    function handleRemove(file: UploadFile, e: MouseEvent) {
      emit('remove', file, e);
    }

    function handleRetry(file: UploadFile, e: MouseEvent) {
      emit('retry', file, e);
    }

    const Photowall = () => (
      <TransitionGroup name={`${classBlock}__item`}>
        {props.files.map(file => {
          const classNames = classes({
            [`${classBlock}__item`]: true,
            [`${classBlock}__item-picture`]: true,
            [`${classBlock}__item--${file.status}`]: true,
          });
          return (
            <li
              key={file.uid}
              class={classNames}
            >
              {slots?.file ? slots.file({ file }) : PhotoItem(file)}
            </li>
          );
        })}
      </TransitionGroup>
    );

    const PhotoItem = (file: UploadFile) => [
      <img
        v-show={file.status !== 'uploading'}
        src={file.url}
        class={`${classBlock}__picture-item-thumbnail`}
        alt=''
      />,
      <>
        {file.status === 'uploading' && (
          <Progress
            class={`${classBlock}__picture-item-progress`}
            type='circle'
            color='#3a84ff'
            bgColor='#333'
            width={50}
            titleStyle={{ color: '#fff' }}
            percent={file.percentage}
          />
        )}
      </>,
      <>
        {!disabled.value && (
          <div class={`${classBlock}__picture-item-actions`}>
            {/* <Eye class="action-icon" /> */}
            <Del
              class='action-icon'
              onClick={e => handleRemove(file, e)}
            />
          </div>
        )}
      </>,
    ];

    const Normal = () => (
      <TransitionGroup name={`${classBlock}__item`}>
        {props.files.map(file => {
          const classNames = classes({
            [`${classBlock}__item`]: true,
            [`${classBlock}__item--${file.status}`]: true,
          });
          return (
            <li
              key={file.uid}
              class={classNames}
            >
              {slots?.file ? slots.file({ file }) : NormalItem(file)}
            </li>
          );
        })}
      </TransitionGroup>
    );

    const FileIcon = (file: UploadFile) => {
      const rawType = file?.raw?.type;

      const [type] = rawType?.split('/') || '';
      const iconMap = {
        text: TextFill,
        image: ImageFill,
        application: TextFill,
        video: VideoFill,
        audio: AudioFill,
      };
      let icon = iconMap[type] || TextFill;

      const zipType = ['application/zip', 'application/rar', 'application/tar', 'application/gz', 'application/x-gzip'];
      if (zipType.includes(rawType)) {
        icon = ArchiveFill;
      }

      return h(icon, { class: `${classBlock}__item-file-icon` });
    };

    const NormalItem = (file: UploadFile) => [
      <div class={`${classBlock}__item-icon`}>
        {file.isPic ? (
          <img
            src={file.url}
            class={`${classBlock}__item-thumbnail`}
            alt=''
          />
        ) : (
          FileIcon(file)
        )}
      </div>,
      <div class={`${classBlock}__item-summary`}>
        <div
          class={`${classBlock}__item-name`}
          title={file.name}
        >
          {file.name}
        </div>
        {file.status !== 'uploading' && (
          <div
            class={`${classBlock}__item-message`}
            title={file.statusText}
          >
            {file.status === 'success' && (
              <>
                <Done class={`${classBlock}__item-message-success-icon`} />
                {file.statusText || t.value.uploadSuccess}
              </>
            )}
            {file.status === 'fail' && <>{file.statusText || t.value.uploadFailed}</>}
          </div>
        )}
        {file.status === 'uploading' && (
          <Progress
            class={`${classBlock}__item-progress`}
            showText={false}
            percent={file.percentage}
            size='small'
          />
        )}
        {file.status !== 'fail' && (
          <div class={`${classBlock}__item-speed`}>
            <span
              v-show={file.size}
              class={`${classBlock}__item-speed-size`}
            >
              {formatSize(file.size)}
            </span>
            {/* <span v-show={file.status === 'uploading'} class={`${classBlock}__item-speed-rate`}></span> */}
            <span
              v-show={file.status === 'uploading'}
              class={`${classBlock}__item-speed-percentage`}
            >
              {file.percentage}%
            </span>
          </div>
        )}
        {!disabled.value && (
          <div class={`${classBlock}__item-actions`}>
            {file.status === 'fail' && (
              <RightTurnLine
                class={`${classBlock}__item-retry-icon`}
                onClick={e => handleRetry(file, e)}
              />
            )}
            <Del
              class={`${classBlock}__item-del-icon`}
              onClick={e => handleRemove(file, e)}
            />
          </div>
        )}
      </div>,
    ];

    return () => (
      <>
        {isSinglePhoto.value ? (
          slots?.innerTrigger && slots?.innerTrigger(props.files?.[0])
        ) : (
          <ul class={classNames.value}>
            {isPhotowall.value ? Photowall() : Normal()}
            {slots?.innerTrigger && slots?.innerTrigger()}
          </ul>
        )}
      </>
    );
  },
});
