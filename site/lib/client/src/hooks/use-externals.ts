import * as Lodash from 'lodash';
import * as UUID from 'uuid';
import {
  onBeforeMount,
  onBeforeUnmount,
} from 'vue';
import * as Vue from 'vue';
import * as VueTypes from 'vue-types';

import * as PopperjsCore from '@popperjs/core';

export const useExternals = () => {
  const loadExternals = () => {
    window.vue = () => Vue;
    window.lodash = () => Lodash;
    window.uuid = () => UUID;
    window.popperjsCore = () => PopperjsCore;
    window.vueTypes = () => VueTypes;
    window.lodashThrottle = () => Lodash.throttle;
    window.lodashMerge = () => Lodash.merge;
  };

  const unloadExternals = () => {
    delete window.vue;
    delete window.lodash;
    delete window.uuid;
    delete window.popperjsCore;
    delete window.vueTypes;
    delete window.lodashThrottle;
    delete window.lodashMerge;
  };

  onBeforeMount(loadExternals);
  onBeforeUnmount(unloadExternals);
};
