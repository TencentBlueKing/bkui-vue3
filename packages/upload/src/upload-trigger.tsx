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

import { computed, defineComponent, PropType, ref, toRefs } from 'vue';

import BkButton from '@bkui-vue/button';
import { Del, Plus, Upload } from '@bkui-vue/icon';
import BkProgress from '@bkui-vue/progress';
import { classes } from '@bkui-vue/shared';

import uploadProps from './props';
import { CLASS_PREFIX, EThemes, UploadFile } from './upload.type';

export default defineComponent({
  name: 'UploadTrigger',
  props: {
    theme: uploadProps.theme,
    disabled: uploadProps.disabled,
    multiple: uploadProps.multiple,
    accept: uploadProps.accept,
    file: {
      type: Object as PropType<UploadFile>,
      default: null,
    },
  },
  emits: ['change', 'remove'],
  setup(props, { slots, emit }) {
    const { theme, disabled, file, multiple, accept } = toRefs(props);

    const classBlock = `${CLASS_PREFIX}-trigger`;

    const isButton = computed<boolean>(() => theme.value === EThemes.BUTTON);
    const isDrag = computed<boolean>(() => theme.value === EThemes.DRAGGABLE);

    const isPicture = computed<boolean>(() => theme.value === EThemes.PICTURE);
    const isSinglePicture = computed<boolean>(() => isPicture.value && !multiple.value);

    const acceptTypes = computed(() => (isPicture.value && !accept.value ? 'image/png,image/jpeg,image/jpg' : accept.value));

    const inputEl = ref(null);

    const classNames = computed(() => classes({
      [classBlock]: true,
      [`${classBlock}--${theme.value}`]: true,
      [`${classBlock}--single-picture`]: isSinglePicture.value,
      [`${classBlock}--has-file`]: file.value ?? false,
      [`${classBlock}--${file.value?.status}`]: file.value ?? false,
      [`${classBlock}--dragover`]: dragover.value,
      [`${classBlock}--disabled`]: disabled.value,
    }));

    const invoke = () => {
      inputEl.value.value = null;
      inputEl.value.click();
    };

    const handleFileChange = (e: Event) => {
      const { files } = e.target as HTMLInputElement;
      emit('change', Array.from(files));
    };

    const handleClick = () => {
      if (props.disabled) {
        return;
      }

      invoke();
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.target !== e.currentTarget) {
        return;
      }

      if ((e.code === 'Enter' || e.code === 'Space')) {
        invoke();
      }

      e.preventDefault();
    };

    function handleRemove(file: UploadFile, e: MouseEvent) {
      emit('remove', file, e);

      e.stopPropagation();
      e.preventDefault();
    }

    const dragover = ref(false);
    const Dragger = () => {
      const handleDrop = (e: DragEvent) => {
        if (disabled.value) {
          return;
        }

        e.preventDefault();
        dragover.value = false;

        const files = Array.from(e.dataTransfer.files);

        if (!acceptTypes.value) {
          emit('change', files);
          return;
        }

        const filesFiltered = files.filter((file) => {
          const { type, name } = file;
          const extension = name.includes('.') ? `.${name.split('.').pop()}` : '';
          const baseType = type.replace(/\/.*$/, '');
          return acceptTypes.value
            .split(',')
            .map(type => type.trim())
            .filter(type => type)
            .some((acceptedType) => {
              if (acceptedType.startsWith('.')) {
                return extension === acceptedType;
              }
              if (/\/\*$/.test(acceptedType)) {
                return baseType === acceptedType.replace(/\/\*$/, '');
              }
              if (/^[^/]+\/[^/]+$/.test(acceptedType)) {
                return type === acceptedType;
              }
              return false;
            });
        });

        emit('change', filesFiltered);
      };
      const handleDragover = (e: DragEvent) => {
        e.preventDefault();
        dragover.value = true;
      };
      const handleDragleave = () => {
        dragover.value = false;
      };

      const classNames = classes({
        [`${classBlock}__draggable`]: true,
      });

      return (
        <div
          class={classNames}
          onDrop={handleDrop}
          onDragover={handleDragover}
          onDragleave={handleDragleave}
        >
          {
            slots.default
              ? slots.default()
              : (
                <>
                  <Upload class={`${classBlock}__draggable-icon`} />
                  <div class={`${classBlock}__draggable-text`}>
                    将文件拖到此处或<span class={`${classBlock}__draggable-upload-link`}>点击上传</span>
                  </div>
                </>
              )
          }
        </div>
      );
    };

    const Picture = () => (
      <>
      {
        isSinglePicture.value && props.file
          ? SinglePicture(props.file)
          : DefaultPicture()
      }
      </>
    );

    const DefaultPicture = () => (
      <>
      {
      slots.default
        ? slots.default()
        : (
          <div class={`${classBlock}__picture-inner`}>
            <Plus class={`${classBlock}__picture-icon`} />
            <div class={`${classBlock}__picture-text`}>点击上传</div>
          </div>
        )
      }
      </>
    );

    const SinglePicture = (file: UploadFile) => ([
      <img v-show={file.status !== 'uploading'} src={file.url} class={`${classBlock}__picture-thumbnail`} alt="" />,
      <>{
        file.status === 'uploading' && <BkProgress
        class={`${classBlock}__picture-progress`}
        type="circle"
        color="#3a84ff"
        bgColor="#333"
        width={50}
        titleStyle={{ color: '#fff' }}
        percent={file.percentage}
        />
      }</>,
      <>{
        !props.disabled && <div class={`${classBlock}__picture-actions`}>
          {/* { file.status !== 'uploading' && <Upload class="action-icon" /> } */}
          <Del class="action-icon" onClick={e => handleRemove(file, e)} />
        </div>
      }
      </>,
    ]);

    const Button = () => (
      <BkButton disabled={disabled.value}>
        <Upload class={`${classBlock}__button-icon`} /><span class={`${classBlock}__button-text`}>上传文件</span>
      </BkButton>
    );

    const Trigger = () => {
      if (isButton.value) return Button();
      if (isDrag.value) return Dragger();
      if (isPicture.value) return Picture();
    };

    return () => (
      <div
        class={classNames.value}
        tabindex="0"
        onClick={handleClick}
        onKeydown={handleKeydown}
      >
        {
          slots.trigger
            ? [slots.trigger(), slots?.default?.()]
            : Trigger()
        }
        <input
          ref={inputEl}
          class="bk-upload__input-file"
          tabindex="-1"
          onChange={handleFileChange}
          accept={acceptTypes.value}
          multiple={multiple.value}
          disabled={disabled.value}
          type="file"
        />
      </div>
    );
  },
});
