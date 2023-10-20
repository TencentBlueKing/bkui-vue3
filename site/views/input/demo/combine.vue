<template>
  <div>
    <bk-input
      class="mb10"
      type="url"
      prefix="https://"
    />
    <bk-input
      class="mb10"
      suffix=".com"
    >
      <template #prefix>
        <bk-dropdown class="protocol-list-dropdown">
          <span class="protocol-list-trigger">
            {{ protocol }}
            <angle-down
              class="toggle-indicator"
              :class="{
                'opened': opened,
              }"
            />
          </span>
          <template #content>
            <bk-dropdown-menu>
              <bk-dropdown-item
                v-for="item in dropdownList"
                :key="item"
                @click="updateProtocol(item)"
              >
                {{ item }}
              </bk-dropdown-item>
            </bk-dropdown-menu>
          </template>
        </bk-dropdown>
      </template>
    </bk-input>
    <bk-input
      class="mb10"
      type="url"
      suffix="@qq.com"
    />
  </div>
</template>

<script setup>
  import { AngleDown } from 'bkui-vue/icon';
  import { ref } from 'vue';
  const dropdownList = [
    'http://',
    'https://',
  ];
  const protocol = ref(dropdownList[0]);
  const opened = ref(false);
  function updateProtocol(item) {
    protocol.value = item;
  }
</script>

<style lang="postcss" scoped>
  .protocol-list-dropdown {
    border: 1px solid #c4c6cc;
    height: 32px;
    margin: -1px 0 0 -1px;
    border-radius: 2px 0 0 2px;
    &:hover {
      border-color: #3a84ff;
    }
    .protocol-list-trigger {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 10px;
        height: 30px;
        .toggle-indicator {
          margin-left: 5px;
          font-size: 14px;
        }
      }
  }
</style>
