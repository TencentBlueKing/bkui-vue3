<!-- 侧边导航栏公共组件 -->
<template>
  <section>
    <aside
      v-if="navItems.length > 0"
      class="sidebar"
    >
      <nav
        ref="navListContainer"
        :style="{ height }"
        class="nav-list-container g-scrollbar"
      >
        <ul class="nav-list">
          <li
            v-for="item in navItems"
            :key="item.id"
            @click="handleItemClick?.()"
          >
            <a
              :href="`#${item.id}`"
              :ref="(el: unknown) => setNavLinkRef(el, item.id)"
              class="nav-link"
              :class="{ active: activeAnchor === item.id }"
              @click="handleNavClick(item.id)"
            >
              <bk-overflow-title :content="item.title" />
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  </section>
</template>

<script setup lang="ts">
import {
  OverflowTitle as BkOverflowTitle,
} from 'bkui-vue';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

interface IProps {
  navItems: {
    id: string;
    title: string;
  }[];
  containerClassName?: string;
  handleItemClick?: () => void;
}

const props = defineProps<IProps>();

// 路由相关
const route = useRoute();
// 当前激活的锚点
const activeAnchor = ref('');
// 是否正在点击导航滚动（用于暂停滚动监听）
const isClickScrolling = ref(false);
// 滚动容器
const scrollContainer = ref<HTMLElement | null>(null);
// 导航列表容器
const navListContainer = ref<HTMLElement | null>(null);
// 导航链接元素引用
const navLinkRefs = ref<Record<string, HTMLElement>>({});
// 点击滚动的定时器
let scrollTimer: ReturnType<typeof setTimeout> | null = null;
// 是否正在滚动导航列表（防止循环触发）
const isScrollingNavList = ref(false);

const height = computed(() => {
  return route.path.includes('markdown') ? 'calc(100vh - 252px)' : 'calc(100vh - 290px)';
});

/**
 * @description 设置导航链接引用
 * @param el 元素引用
 * @param id 锚点ID
 */
const setNavLinkRef = (el: unknown, id: string) => {
  if (el && el instanceof HTMLElement) {
    navLinkRefs.value[id] = el;
  }
};

/**
 * @description 将激活的导航项滚动到容器中央
 * @param id 锚点ID
 */
const scrollActiveNavToCenter = (id: string) => {
  if (!navListContainer.value) return;

  const activeLink = navLinkRefs.value[id];
  if (!activeLink) return;

  const container = navListContainer.value;
  const containerRect = container.getBoundingClientRect();
  const linkRect = activeLink.getBoundingClientRect();

  // 检查链接是否在可视区域内
  const isVisible = (
    linkRect.top >= containerRect.top
    && linkRect.bottom <= containerRect.bottom
  );

  // 如果不在可视区域内，滚动到中央
  if (!isVisible) {
    isScrollingNavList.value = true;
    const containerHeight = containerRect.height;
    const linkTop = activeLink.offsetTop;
    const linkHeight = activeLink.offsetHeight;

    // 计算滚动位置：将链接滚动到容器中央
    const scrollTop = linkTop - (containerHeight / 2) + (linkHeight / 2);

    container.scrollTo({
      top: Math.max(0, scrollTop),
      behavior: 'smooth',
    });

    // 滚动完成后重置标志
    setTimeout(() => {
      isScrollingNavList.value = false;
    }, 500);
  }
};

/**
 * @description 处理导航点击
 * @param id 锚点ID
 */
const handleNavClick = (id: string) => {
  // 立即更新激活状态
  activeAnchor.value = id;

  // 标记为点击滚动，暂停滚动监听
  isClickScrolling.value = true;

  // 清除之前的定时器
  if (scrollTimer) {
    clearTimeout(scrollTimer);
  }

  // 等待滚动动画完成后，恢复滚动监听
  scrollTimer = setTimeout(() => {
    isClickScrolling.value = false;
    scrollTimer = null;
  }, 1500);
};

/**
 * @description 监听滚动，更新激活的锚点
 */
const handleScroll = () => {
  // 如果正在点击导航滚动，不处理滚动事件
  if (isClickScrolling.value) return;

  const container = scrollContainer.value;
  if (!container) return;

  const { scrollTop } = container;
  const offset = 200; // 偏移量

  // 查找当前滚动位置对应的锚点
  for (let i = props.navItems.length - 1; i >= 0; i--) {
    const item =  props.navItems[i];
    const element = document.getElementById(item.id);
    if (element) {
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const elementTop = rect.top - containerRect.top + scrollTop;

      if (scrollTop >= elementTop - offset) {
        activeAnchor.value = item.id;
        return;
      }
    }
  }

  // 如果没有找到，默认激活第一个
  if (props.navItems.length > 0) {
    activeAnchor.value = props.navItems[0].id;
  }
};

/**
 * @description 更新激活的锚点
 */
const updateActiveAnchor = () => {
  // 避免滚动动画过程中再次触发滚动事件影响定位精度
  isClickScrolling.value = true;
  const hash = route.hash?.replace('#', '');
  if (hash && props.navItems.some(item => item.id === hash)) {
    activeAnchor.value = hash;
    // 等待内容渲染完成再滚动
    setTimeout(() => {
      const el = document.getElementById(hash);
      // 滚动到锚点
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // 等待滚动动画完成后，恢复滚动监听
      scrollTimer = setTimeout(() => {
        isClickScrolling.value = false;
        scrollTimer = null;
      }, 1500);
    });
  } else {
    activeAnchor.value = props.navItems[0].id;
    // 不需要等待， 立刻恢复滚动监听
    isClickScrolling.value = false;
  }
};

// 监听 activeAnchor 变化，自动滚动到中央
watch(activeAnchor, (newId) => {
  if (newId && !isScrollingNavList.value) {
    nextTick(() => {
      scrollActiveNavToCenter(newId);
    });
  }
});

onMounted(() => {
  nextTick(() => {
    // 初始化激活的锚点
    updateActiveAnchor();
    // 查找滚动容器
    scrollContainer.value = document.querySelector(props.containerClassName || 'body');
    if (scrollContainer.value) {
      scrollContainer.value.addEventListener('scroll', handleScroll);
    }
  });
});

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll);
  }
  // 清除定时器
  if (scrollTimer) {
    clearTimeout(scrollTimer);
  }
});
</script>

<style scoped lang="postcss">
/* 侧边栏样式 */
.sidebar {
  width: 146px;
  position: sticky;
  max-height: 100%;
  top: 20px;
  align-self: flex-start; /* 确保侧边栏从顶部开始 */
}

.nav-list-container {
  overflow-y: auto;
}

.nav-list {
  list-style: none;
  padding: 8px 0 4px 0;
  margin: 0;
  border-left: 1px solid #dcdee5;
}

.nav-link {
  display: block;
  color: #313238;
  font-size: 12px;
  height: 16px;
  line-height: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  padding-left: 16px;
  margin-bottom: 8px;
}

.nav-link:hover {
  color: #1976d2;
  background-color: #f5f7fa;
}

.nav-link.active {
  color: #1976d2;
  font-weight: 500;
}

.nav-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 16px;
  width: 2px;
  background-color: #3a84ff;
}
</style>
