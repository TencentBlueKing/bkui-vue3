<template>
  <bk-cascader
    v-model="area"
    :list="list"
    id-key="uid"
    name-key="title"
    :placeholder="t('根目录')"
  />
</template>
<script>
  import { defineComponent, ref, shallowRef } from 'vue';
  import { useI18n } from 'vue-i18n';
  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const list = shallowRef([
        {
          uid: 'root',
          title: t('根目录'),
        },
        {
          id: 217,
          uid: '3HQMtDfxy5ByTUyBAEDqw7',
          space_uid: 'kRAJ2Tvd4iQBCPSXnDSFjb',
          title: `test-${t('目录')}`,
          folder_uid: 'root',
          is_folder: true,
          is_default: false,
          build_in: true,
          created_by: 'andyljzhou',
          updated_by: 'andyljzhou',
          created_time: '2022-07-07T04:00:35.782031Z',
          updated_time: '2022-07-23T14:49:50.089128Z',
          permissions: {
            manage_dashboard: true,
            create_dashboard: true,
            edit_dashboard: true,
            delete_dashboard: true,
            view_dashboard: true,
            fast_share_dashboard: true,
          },
          collected: false,
          children: [],
        },
        {
          id: 254,
          uid: 'ivvcsJa7VC2FzopGc8b3s5',
          space_uid: 'kRAJ2Tvd4iQBCPSXnDSFjb',
          title: `test-${t('目录')}-copy`,
          folder_uid: 'root',
          is_folder: true,
          is_default: false,
          build_in: true,
          created_by: 'andyljzhou',
          updated_by: 'andyljzhou',
          created_time: '2022-07-28T05:57:02.061112Z',
          updated_time: '2022-07-28T05:57:02.063401Z',
          permissions: {
            manage_dashboard: true,
            create_dashboard: true,
            edit_dashboard: true,
            delete_dashboard: true,
            view_dashboard: true,
            fast_share_dashboard: true,
          },
          collected: false,
          children: [],
        },
        {
          id: 255,
          uid: '373Kysk7wUnETuwXSPxUSc',
          space_uid: 'kRAJ2Tvd4iQBCPSXnDSFjb',
          title: `test-${t('目录')}-copy-copy`,
          folder_uid: 'root',
          is_folder: true,
          is_default: false,
          build_in: true,
          created_by: 'andyljzhou',
          updated_by: 'andyljzhou',
          created_time: '2022-07-28T05:57:07.614987Z',
          updated_time: '2022-07-28T05:57:07.617515Z',
          permissions: {
            manage_dashboard: true,
            create_dashboard: true,
            edit_dashboard: true,
            delete_dashboard: true,
            view_dashboard: true,
            fast_share_dashboard: true,
          },
          collected: false,
          children: [],
        },
        {
          id: 219,
          uid: 'hocjvqc4d35LhgfXetSXms',
          space_uid: 'kRAJ2Tvd4iQBCPSXnDSFjb',
          title: 'sssss',
          folder_uid: 'root',
          is_folder: true,
          is_default: false,
          build_in: true,
          created_by: 'hongsonggao',
          updated_by: 'andyljzhou',
          created_time: '2022-07-11T01:43:48.662197Z',
          updated_time: '2022-07-23T14:49:50.098049Z',
          permissions: {
            manage_dashboard: true,
            create_dashboard: true,
            edit_dashboard: true,
            delete_dashboard: true,
            view_dashboard: true,
            fast_share_dashboard: true,
          },
          collected: false,
          children: [
            {
              id: 220,
              uid: '3nH3PdypvGtaBoaqucCxbr',
              space_uid: 'kRAJ2Tvd4iQBCPSXnDSFjb',
              title: 'bbbb',
              folder_uid: 'hocjvqc4d35LhgfXetSXms',
              is_folder: true,
              is_default: false,
              build_in: true,
              created_by: 'hongsonggao',
              updated_by: 'andyljzhou',
              created_time: '2022-07-11T01:44:06.623412Z',
              updated_time: '2022-07-23T14:49:50.102172Z',
              permissions: {
                manage_dashboard: true,
                create_dashboard: true,
                edit_dashboard: true,
                delete_dashboard: true,
                view_dashboard: true,
                fast_share_dashboard: true,
              },
              collected: false,
              children: [
                {
                  id: 226,
                  uid: 'ijgcJ2Xk6m25CbQGwhuEaP',
                  space_uid: 'kRAJ2Tvd4iQBCPSXnDSFjb',
                  title: '22',
                  folder_uid: '3nH3PdypvGtaBoaqucCxbr',
                  is_folder: true,
                  is_default: false,
                  build_in: true,
                  created_by: 'andyljzhou',
                  updated_by: 'andyljzhou',
                  created_time: '2022-07-23T11:53:57.858872Z',
                  updated_time: '2022-07-23T14:49:50.110393Z',
                  permissions: {
                    manage_dashboard: true,
                    create_dashboard: true,
                    edit_dashboard: true,
                    delete_dashboard: true,
                    view_dashboard: true,
                    fast_share_dashboard: true,
                  },
                  collected: false,
                  children: [],
                },
              ],
            },
          ],
        },
      ]);
      const area = ref(['root']);

      return {
        area,
        list,
        t,
      };
    },
  });

</script>

