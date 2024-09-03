<template>
  <tr>
    <td>
      <RenderTargetCluster
        ref="clusterRef"
        :data="data.cluster"
        @input-finish="handleInputFinish"
      />
    </td>
    <td>
      <TextPlainColumn
        :data="data.nodeType"
        :is-loading="data.isLoading"
        placeholder="输入集群后自动生成"
      />
    </td>
    <td>
      <RenderTargetNumber
        ref="numRef"
        :data="data.targetNum"
        :disabled="!data.cluster"
        :is-loading="data.isLoading"
      />
    </td>
    <td>
      <RenderKeyRelated
        required
        ref="includeKeyRef"
      />
    </td>
    <td>
      <RenderTargetDateTime
        ref="timeRef"
        :data="data.targetDateTime"
        :is-loading="data.isLoading"
      />
    </td>
    <td>
      <RenderSwitchMode
        ref="switchModeRef"
        :data="data.switchMode"
        :is-loading="data.isLoading"
      />
    </td>
    <OperationColumn
      :removeable="removeable"
      show-copy
      @add="handleAppend"
      @remove="handleRemove"
    />
  </tr>
</template>
<script lang="ts">
  import _ from 'lodash';
  import { OperationColumn } from '@blueking/ediatable';
  import { TextPlainColumn } from '@blueking/ediatable';
  import RenderTargetCluster from './cluster-name.vue';
  import RenderSwitchMode from './switch-mode.vue';
  import RenderTargetNumber from './target-number.vue';
  import RenderKeyRelated from './regex-keys.vue';
  import RenderTargetDateTime from './target-datetime.vue';

  export interface IDataRow {
    rowKey?: string;
    isLoading?: boolean;
    cluster: string;
    nodeType?: string;
    switchMode?: string;
    targetNum?: number;
    targetDateTime?: string;
  }

  const random = () => `${_.random(0, 999999)}_${Date.now()}_${_.random(0, 999999)}`;

  // 创建表格行数据
  export const createRowData = (data?: IDataRow): IDataRow => ({
    rowKey: random(),
    isLoading: false,
    cluster: data?.cluster ?? '',
    nodeType: data?.nodeType ?? '',
    switchMode: data?.switchMode ?? '',
  });
</script>
<script setup lang="ts">
  import { ref } from 'vue';
  interface Props {
    data: IDataRow;
    removeable: boolean;
  }

  interface Emits {
    (e: 'add', params: Array<IDataRow>): void;
    (e: 'remove'): void;
    (e: 'clusterInputFinish', value: string): void;
  }

  interface Exposes {
    getValue: () => Promise<{
      cluster: string;
      target_num: number;
      include_keys: string[];
      target_time: string;
      mode: string;
    }>;
  }

  const props = defineProps<Props>();

  const emits = defineEmits<Emits>();

  const clusterRef = ref<InstanceType<typeof RenderTargetCluster>>();
  const numRef = ref<InstanceType<typeof RenderTargetNumber>>();
  const includeKeyRef = ref<InstanceType<typeof RenderKeyRelated>>();
  const timeRef = ref<InstanceType<typeof RenderTargetDateTime>>();
  const switchModeRef = ref<InstanceType<typeof RenderSwitchMode>>();

  const handleInputFinish = (value: string) => {
    emits('clusterInputFinish', value);
  };

  const handleAppend = () => {
    emits('add', [createRowData()]);
  };

  const handleRemove = () => {
    if (props.removeable) {
      return;
    }
    emits('remove');
  };

  defineExpose<Exposes>({
    async getValue() {
      return await Promise.all([
        clusterRef.value!.getValue(),
        numRef.value!.getValue(),
        includeKeyRef.value!.getValue(),
        timeRef.value!.getValue(),
        switchModeRef.value!.getValue(),
      ]).then(data => {
        const [cluster, target_num, include_keys, target_time, mode] = data;
        return {
          cluster,
          target_num,
          include_keys,
          target_time,
          mode,
        };
      });
    },
  });
</script>
