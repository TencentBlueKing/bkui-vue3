import * as Lodash from 'lodash';
import * as UUID from 'uuid';
import {
  onBeforeMount,
  onBeforeUnmount,
} from 'vue';
import * as Vue from 'vue';
import * as VueTypes from 'vue-types';

import * as PopperjsCore from '@popperjs/core';
import * as NormalizeWheel from 'normalize-wheel';
import * as FloatingUiDom from '@floating-ui/dom';
import * as DateFns from 'date-fns';
import * as JsCalendar from 'js-calendar';

export const useExternals = () => {
  const loadExternals = () => {
    window.vue = () => Vue;
    window.lodash = () => Lodash;
    window.uuid = () => UUID;
    window.popperjsCore = () => PopperjsCore;
    window.vueTypes = () => VueTypes;
    window.lodashThrottle = () => Lodash.throttle;
    window.lodashMerge = () => Lodash.merge;
    window.lodashCloneDeep = () => Lodash.cloneDeep;
    window.lodashIsElement = () => Lodash.isElement;
    window.lodashRandom = () => Lodash.random;
    window.lodashDebounce = () => Lodash.debounce;
    window.lodashIsFunction = () => Lodash.isFunction;
    window.normalizeWheel = () => NormalizeWheel;
    window.floatingUiDom = () => FloatingUiDom;
    window.dateFns = () => DateFns;
    window.jsCalendar = () => JsCalendar;
  };

  const unloadExternals = () => {
    delete window.vue;
    delete window.lodash;
    delete window.uuid;
    delete window.popperjsCore;
    delete window.vueTypes;
    delete window.lodashThrottle;
    delete window.lodashMerge;
    delete window.lodashCloneDeep;
    delete window.lodashIsElement;
    delete window.lodashRandom;
    delete window.lodashDebounce;
    delete window.lodashIsFunction;
    delete window.normalizeWheel;
    delete window.floatingUiDom;
    delete window.dateFns;
    delete window.jsCalendar;
  };

  onBeforeMount(loadExternals);
  onBeforeUnmount(unloadExternals);
};
