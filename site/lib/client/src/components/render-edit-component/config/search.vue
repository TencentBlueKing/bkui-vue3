<template>
  <div ref="searchRef" class="search">
    <bk-input v-model="searchValue" placeholder="搜索" behavior="simplicity" @focus="displayResult">
      <template #prefix>
        <Search />
      </template>
    </bk-input>
    <div ref="searchResultRef" :style="{ display: 'none' }" class="search-result-container">
      <div class="search-result g-scrollbar">
        <ul>
          <li v-for="item in filteredProps" class="item" @click="selectedAttr(item)">
            <i class="bkui-vue-wiki-icon icon-peizhi"></i>
            <div class="item-right">
              <div class="item-name" v-html="highlightKeyword(item.name)"></div>
              <div class="item-description" v-html="highlightKeyword(item.description)"></div>
            </div>
          </li>
        </ul>
        <div v-if="!filteredProps?.length" class="no-data" >无搜索结果</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Input as BkInput } from 'bkui-vue'
import { Search } from 'bkui-vue/lib/icon';
import type {
  IComponentWiki,
} from '@/types/component';

interface IProps {
  props: IComponentWiki['props'];
}
const props = defineProps<IProps>();

interface IEmits {
  (e: 'selectedAttr', item: IComponentWiki['props'][0]): void;
}
const emits = defineEmits<IEmits>()

const searchRef = ref<HTMLDivElement>()
const searchValue = ref('')
const searchResultRef = ref<HTMLDivElement>()

const MAX_HEIGHT = 20*2
const createEl = () => {
  const el = document.createElement('div')
  el.style.cssText = `
    position: absolute;
    visibility: hidden;
    font-size: 12px;
    color: #979BA5;
    line-height: 20px;
    word-break: break-word;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    max-width: ${(searchRef.value?.clientWidth ?? 255) - 48}px;
  `
  document.body.appendChild(el)
  return el
}
const removeEL = (el: HTMLElement) => {
  document.body.removeChild(el)
}
// 使用实际DOM测量来精确计算两行文本
const measureTwoLineText = (text: string, keyword: string): string => {
  if (!text) return text
  
  const kw = keyword.trim()
  const lowerText = text.toLowerCase()
  const lowerKeyword = kw ? kw.toLowerCase() : ''
  
  // 找到所有关键字的位置
  const keywordIndices: number[] = []
  if(lowerKeyword) {
    let index = lowerText.indexOf(lowerKeyword)
    while (index !== -1) {
      keywordIndices.push(index)
      index = lowerText.indexOf(lowerKeyword, index + 1)
    }
  }

  // 创建临时测量元素
  const tempElement = createEl()
  
  // 如果原始文本已经符合两行要求，直接返回
  tempElement.textContent = text
  const originalHeight = tempElement.offsetHeight
  if (originalHeight <= MAX_HEIGHT) { // 2行 * 16px
    removeEL(tempElement)
    return text
  }
  
  // 二分查找找到最长的符合两行要求的文本
  let left = 0
  let right = text.length
  let bestResult = text
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    
    const candidates = []
    
    // 以第一个关键字为中心截断
    if (keywordIndices.length > 0) {
      const firstKeywordIndex = keywordIndices[0]
      const start = Math.max(0, firstKeywordIndex - Math.floor(mid / 2))
      const end = Math.min(text.length, start + mid)
      candidates.push((start > 0 ? '...' : '') + text.substring(start, end) + (end < text.length ? '...' : ''))
    }
    
    // 以最后一个关键字为中心截断
    if (keywordIndices.length > 0) {
      const lastKeywordIndex = keywordIndices[keywordIndices.length - 1]
      const keywordLength = kw.length
      const start = Math.max(0, lastKeywordIndex + keywordLength - mid)
      const end = Math.min(text.length, start + mid)
      candidates.push((start > 0 ? '...' : '') + text.substring(start, end) + (end < text.length ? '...' : ''))
    }

    // 从开头截断
    candidates.push(text.substring(0, mid) + '...')

    let foundValid = false
    
    for (const candidate of candidates) {
      tempElement.textContent = candidate
      const height = tempElement.offsetHeight
      // 检查是否在两行内
      if (height <= MAX_HEIGHT && candidate.toLowerCase().includes(lowerKeyword)) {
        bestResult = candidate
        foundValid = true
        break
      }
    }
    
    if (foundValid) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  removeEL(tempElement)
  return bestResult
}

// 过滤后的props列表
const filteredProps = computed(() => {
  if (!searchValue.value.trim()) {
    return props.props
  }
  
  const keyword = searchValue.value.toLowerCase()
  return props.props.filter(item => 
    item.name.toLowerCase().includes(keyword) || 
    item.description.toLowerCase().includes(keyword)
  )
})

// 关键字高亮函数
const highlightKeyword = (text: string): string => {
  if (!text) {
    return text
  }
  
  const keyword = searchValue.value.trim()
  
  // 先进行智能省略
  const truncatedText = measureTwoLineText(text, keyword)
  
  // 调试信息：检查关键字是否在截断后的文本中
  const lowerTruncated = truncatedText.toLowerCase()
  const lowerKeyword = keyword.toLowerCase()
  const keywordVisible = lowerTruncated.includes(lowerKeyword)
  
  if (!keywordVisible) {
    console.warn(`关键字 "${keyword}" 在截断后的文本中不可见:`, {
      原始文本: text,
      截断文本: truncatedText,
      关键字: keyword
    })
  }
  
  const escapedKeyword = searchValue.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedKeyword})`, 'gi')
  return keyword ? truncatedText.replace(regex, '<span class="highlight-text">$1</span>') : truncatedText
}

const displayResult = () => {
  searchResultRef.value?.style.removeProperty('display')
}
const hiddenResult = () => {
  searchResultRef.value?.style.setProperty('display', 'none')
}

const selectedAttr = (item: IComponentWiki['props'][0]) => {
  emits('selectedAttr', item)
  hiddenResult()
}

const clickoutHidden = (e: MouseEvent) => {
  if (!searchRef.value?.contains(e.target as Node)) {
    hiddenResult()
  }
}
onMounted(() => {
  document.addEventListener('click', clickoutHidden)
})
onUnmounted(() => {
  document.removeEventListener('click', clickoutHidden)
})
</script>

<style lang="postcss" scoped>
.search {
  position: relative;
  .search-result-container {
    width: 100%;
    position: absolute;
    z-index: 9999;
  }
  &-result {
    max-height: 452px;
    overflow-y: scroll;
    margin-top: 4px;
    padding: 4px 0;
    background: #FFFFFF;
    border: 1px solid #DCDEE5;
    box-shadow: 0 2px 6px 0 #0000001a;
    border-radius: 2px;
    li.item {
      padding: 5px 12px;
      cursor: pointer;
      display: flex;
      align-items: flex-start;
      .icon-peizhi {
        margin-top: 4px;
        font-size: 14px;
        color: #979BA5;
      }
      &:hover {
        background-color: #F5F7FA;
      }
    }
    .item-right {
      font-size: 12px;
      line-height: 20px;
      margin-left: 8px;
      flex: 1;
      min-width: 0; /* 允许flex子项收缩 */

      .item-name {
        margin-bottom: 2px;
        color: #4D4F56;
        max-width: 100%;
        word-break: break-word;
      }
      
      .item-description {
        color: #979BA5;
        max-width: 100%;
        word-break: break-word;
      }
      
      /* 关键字高亮样式 */
      :deep(.highlight-text) {
        color: #E38B02;
      }
    }
  }
  .no-data {
    padding: 10px 12px;
    color: #979BA5;
    font-size: 12px;
  }
}
.bk-input {
  &>span {
    font-size: 15px;
    color: #979BA5;
    margin: 0 2.5px;
  }
}

.bk-input.is-simplicity:hover:not(.is-disabled) {
  background-color: #FFFFFF;
}

.bk-input.is-simplicity {
  border-bottom-color: #EAEBF0;
}
</style>
<style lang="postcss">
.search {
  .bk-input.is-focused:not(.is-readonly).is-simplicity .bk-input--text {
    background-color: #FFFFFF;
  }
  .bk-input.is-simplicity:hover:not(.is-disabled) .bk-input--text {
    background-color: #FFFFFF;
  }
}
</style>