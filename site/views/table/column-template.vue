<template>
  <section>
    <bk-button @click="handleColumnsIndexChange">
      打乱顺序
    </bk-button>
    <bk-table
      :data="tableData"
      :settings="settings"
    >
      <template
        v-for="column in columns"
        :key="column.label"
      >
        <bk-table-column
          :label="column.label"
          :type="column.type"
          :field="column.field"
          :width="column.width"
          :index="column.index"
        />
      </template>
    </bk-table>
    <h2>如何动态改变列的顺序</h2>
    <h3>1、增加index属性(建议设置index，更新次数少，性能更好)，通过改变index属性触发`bk-table-column`更新</h3>
    <code>
      {
      label: '序号',
      type: 'index',
      width: '120px',
      index: 0
      },
      {
      label: '名称/内网IP',
      field: 'ip',
      width: '320px',
      index: 1
      }, ...
    </code>
    <br>
    <br>
    <code>
      {{
        `<bk-table-column
        :label="column.label"
        :type="column.type"
        :field="column.field"
        :width="column.width"
        :index="column.index"
      />`
      }}
    </code>
    <br>
    <br>
    <code>
      {{
        `const targetIndex = this.columns[2].index;
        this.columns[2].index = this.columns[3].index;
        this.columns[3].index = targetIndex;`
      }}
    </code>
    <h3>2、通过nextTicket 或者 setTimeout更新Column数组，先删除，再追加，保证两次更新间隔，避免只是更新Column数组顺序，绑定组件属性不变</h3>
    <code>
      const target = this.columns.splice(2, 1);
      setTimeout(() => {
      this.columns.push(...target);
      });
    </code>
  </section>
</template>

<script>
  import { DATA_TABLE } from './options';
  export default {
    data() {
      return {
        tableData: [...DATA_TABLE],
        columns: [
          {
            label: '序号',
            type: 'index',
            width: '120px',
            index: 0,
          },
          {
            label: '名称/内网IP',
            field: 'ip',
            width: '320px',
            index: 1,
          },
          {
            label: '来源',
            field: 'source',
            width: '120px',
            index: 2,
          },
          {
            label: '创建时间',
            field: 'create_time',
            width: '220px',
            index: 3,
          },
        ],
        settings: {
          trigger: 'click',
          fields: [
            {
              name: '序号',
              id: 'index',
            },
            {
              name: '名称/内网IP',
              id: 'ip',
            },
            {
              name: '来源',
              id: 'source',
            },
            {
              name: '创建时间',
              id: 'create_time',
            },
          ],
          checked: [],
        },
      };
    },
    methods: {
      handleColumnsIndexChange() {
        const targetIndex = this.columns[2].index;
        this.columns[2].index = this.columns[3].index;
        this.columns[3].index = targetIndex;
        // const target = this.columns.splice(2, 1);
        // setTimeout(() => {
        //   this.columns.push(...target);
        // });
      },
    },
  };
</script>
