<template>
  <bk-search-select
    v-model="value"
    :data="data"
    unique-select
    @select-key="handleSelectKey"
  >
    <template #menu="{ name, onSubmit }">
      <div class="custom-panel">
        <h3>{{ name }}</h3>
        <bk-form class="example">
          <bk-form-item
            description="中文名"
            label="姓名"
          >
            <bk-input
              v-model="formValue.name"
              placeholder="请输入"
              clearable
            />
          </bk-form-item>
          <bk-form-item label="性别">
            <bk-radio-group v-model="formValue.sex">
              <bk-radio label="男" />
              <bk-radio label="女" />
            </bk-radio-group>
          </bk-form-item>
          <bk-form-item
            description="常用联系方式"
            label="联系方式"
          >
            <bk-checkbox-group v-model="formValue.way">
              <bk-checkbox label="QQ" />
              <bk-checkbox label="微信" />
              <bk-checkbox label="Email" />
            </bk-checkbox-group>
          </bk-form-item>
          <bk-form-item label="介绍">
            <bk-input
              v-model="formValue.desc"
              placeholder="请输入"
              type="textarea"
            />
          </bk-form-item>
          <bk-form-item style="margin-top: 32px">
            <bk-button
              theme="primary"
              @click="() => handleSubmit(onSubmit)"
            >
              提交
            </bk-button>
          </bk-form-item>
        </bk-form>
      </div>
    </template>
  </bk-search-select>
</template>
<script setup>
  import { ref } from 'vue';

  import { Input as BkInput } from 'bkui-vue';
  const data = [
    {
      name: '自定义面板',
      id: '1',
      placeholder: '自定义面板',
      isCustomMenu: true,
    },
    {
      name: '实例业务',
      id: '2',
      placeholder: '输入格式为XXX',
      children: [
        {
          name: '王者荣耀',
          id: '2-1',
          disabled: false,
        },
        {
          name: '刺激战场',
          id: '2-2',
        },
        {
          name: '绝地求生',
          id: '2-3',
        },
      ],
    },
    {
      name: 'IP地址',
      id: '3',
      placeholder: '输入格式为XXX.XXX.XXX',
    },
    {
      name: '实例名',
      id: '4',
    },
    {
      name: '实例地址',
      id: '5',
    },
    {
      name: '测试六',
      id: '6',
    },
  ];
  const value = ref([]);
  const getDefaultValue = () => ({
    name: 'dssdf',
    sex: '男',
    way: 'QQ',
    desc: 'hello world',
  });
  const formValue = ref(getDefaultValue());
  function handleSelectKey(item) {
    const data = item.values[0]?.id ? JSON.parse(item.values[0].id) : getDefaultValue();
    formValue.value = {
      ...data,
    };
  }
  function handleSubmit(onSubmit) {
    onSubmit(JSON.stringify({ ...formValue.value }));
  }
</script>
<style lang="less">
  .custom-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 360px;
    padding: 16px 24px 0 0;
  }
</style>
