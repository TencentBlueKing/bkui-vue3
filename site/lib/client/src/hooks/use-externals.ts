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
import * as ForkResizeDetector from '@blueking/fork-resize-detector';
import * as ResizeObserverPolyfill from 'resize-observer-polyfill';
import * as Clipboard from 'clipboard';
import * as JsonFormatter from 'json-formatter-js';
import * as Tinycolor2 from 'tinycolor2';

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
    window.lodashGet = () => Lodash.get;
    window.lodashIsDate = () => Lodash.isDate;
    window.lodashIsEmpty = () => Lodash.isEmpty;
    window.lodashIsEqual = () => Lodash.isEqual;
    window.lodashTrim = () => Lodash.trim;
    window.lodashHas = () => Lodash.has;
    window.normalizeWheel = () => NormalizeWheel;
    window.floatingUiDom = () => FloatingUiDom;
    window.forkResizeDetector = () => ForkResizeDetector;
    window.dateFns = () => DateFns;
    window.jsCalendar = () => JsCalendar;
    window.resizeObserverPolyfill = () => ResizeObserverPolyfill;
    window.clipboard = () => Clipboard;
    window.jsonFormatterJs = () => JsonFormatter;
    window.tinycolor2 = () => Tinycolor2;
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
    delete window.lodashGet;
    delete window.lodashIsDate;
    delete window.lodashIsEmpty;
    delete window.lodashIsEqual;
    delete window.lodashTrim;
    delete window.lodashHas;
    delete window.normalizeWheel;
    delete window.floatingUiDom;
    delete window.forkResizeDetector;
    delete window.dateFns;
    delete window.jsCalendar;
    delete window.resizeObserverPolyfill;
    delete window.clipboard;
    delete window.jsonFormatterJs;
    delete window.tinycolor2;
  };

  onBeforeMount(loadExternals);
  onBeforeUnmount(unloadExternals);
};
