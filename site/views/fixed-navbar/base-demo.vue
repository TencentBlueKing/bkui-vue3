<template>
  <bk-switcher v-model="show" />
  <bk-fixed-navbar
    v-model="show"
    :nav-items="navItems"
  />
</template>
<script>
  import { defineComponent, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    setup() {
      const { t } = useI18n();
      const navItems = [
        {
          icon: '',
          text: t('联系'),
          tooltip: t('可以通过腾讯蓝鲸QQ联系我们'),
          action: () => {
            window.open('http://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDgwMjAwMV80NDMwOTZfODAwODAyMDAxXzJf');
          },
        },
        {
          icon: '',
          text: t('反馈'),
          action: () => {
            window.open('https://bk.tencent.com/s-mart/community?page=1&keyword=%255BMagicBox%255D&sort=latest');
          },
        },
      ];
      const show = ref(true);
      return {
        t,
        show,
        navItems,
      };
    },
  });

</script>
