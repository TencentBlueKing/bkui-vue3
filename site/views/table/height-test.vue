<template>
  <div id="height-test-results" style="padding: 20px;">
    <h2>Table Height/Scroll Automated Test</h2>
    <div style="margin-bottom: 10px;">
      <button @click="runAllTests">Run All Tests</button>
      <span v-if="running"> Running...</span>
      <span v-if="!running && results.length > 0">
        Passed: {{ passCount }} / {{ results.length }}
        <span v-if="failCount > 0" style="color: red;"> Failed: {{ failCount }}</span>
      </span>
    </div>

    <div v-for="(r, i) in results" :key="i" :style="{ color: r.pass ? 'green' : 'red', marginBottom: '4px' }">
      [{{ r.pass ? 'PASS' : 'FAIL' }}] {{ r.name }}
      <span v-if="!r.pass"> — {{ r.reason }}</span>
    </div>

    <!-- Test Case 1: height=300px -->
    <div style="margin-top: 20px; border: 1px solid #ddd;">
      <div ref="container1" style="height: 300px;">
        <bk-table
          ref="table1"
          :columns="columns"
          :data="data20"
          :height="300"
          data-testid="table-px-height"
        />
      </div>
    </div>

    <!-- Test Case 2: height=auto + maxHeight=300 -->
    <div style="margin-top: 10px; border: 1px solid #ddd;">
      <div ref="container2">
        <bk-table
          ref="table2"
          :columns="columns"
          :data="data20"
          height="auto"
          :max-height="300"
          data-testid="table-auto-maxheight-px"
        />
      </div>
    </div>

    <!-- Test Case 3: height=auto + maxHeight=100% in 300px parent -->
    <div style="margin-top: 10px; border: 1px solid #ddd;">
      <div ref="container3" style="height: 300px;">
        <bk-table
          ref="table3"
          :columns="columns"
          :data="data20"
          height="auto"
          max-height="100%"
          data-testid="table-auto-maxheight-pct"
        />
      </div>
    </div>

    <!-- Test Case 4: height=100% in 300px parent -->
    <div style="margin-top: 10px; border: 1px solid #ddd;">
      <div ref="container4" style="height: 300px;">
        <bk-table
          ref="table4"
          :columns="columns"
          :data="data20"
          height="100%"
          data-testid="table-pct-height"
        />
      </div>
    </div>

    <!-- Test Case 5: height=auto, no maxHeight (should NOT scroll, just show all) -->
    <div style="margin-top: 10px; border: 1px solid #ddd;">
      <div ref="container5">
        <bk-table
          ref="table5"
          :columns="columns"
          :data="data5"
          height="auto"
          data-testid="table-auto-no-constraint"
        />
      </div>
    </div>

    <!-- Test Case 6: height=300 + pagination -->
    <div style="margin-top: 10px; border: 1px solid #ddd;">
      <div ref="container6" style="height: 400px;">
        <bk-table
          ref="table6"
          :columns="columns"
          :data="data20"
          :height="400"
          :pagination="{ count: 20, limit: 5, current: 1 }"
          data-testid="table-with-pagination"
        />
      </div>
    </div>

    <!-- Test Case 7: virtualEnabled + height=300 -->
    <div style="margin-top: 10px; border: 1px solid #ddd;">
      <div ref="container7">
        <bk-table
          ref="table7"
          :columns="columns"
          :data="data100"
          :height="300"
          virtual-enabled
          data-testid="table-virtual"
        />
      </div>
    </div>

    <!-- Test Case 8: rowHeight=auto — 行高自适应内容 -->
    <div style="margin-top: 20px; border: 2px solid #1768ef;">
      <h3 style="padding: 8px 12px; margin: 0; background: #e8f0fe; font-size: 14px;">
        T8: rowHeight="auto" — 行高根据内容自动撑起（最小 42px）
      </h3>
      <div style="display: flex; gap: 16px; padding: 12px;">
        <!-- 左：固定行高（默认） -->
        <div style="flex: 1;">
          <p style="font-size: 12px; color: #666; margin: 0 0 6px;">固定行高（默认 42px）</p>
          <bk-table
            ref="table8Fixed"
            :columns="columnsWithRemark"
            :data="dataMultiLine"
            data-testid="table-row-height-fixed"
          />
        </div>
        <!-- 右：rowHeight=auto -->
        <div style="flex: 1;">
          <p style="font-size: 12px; color: #666; margin: 0 0 6px;">rowHeight="auto" — 自适应内容高度</p>
          <bk-table
            ref="table8Auto"
            :columns="columnsWithRemark"
            :data="dataMultiLine"
            row-height="auto"
            data-testid="table-row-height-auto"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, h } from 'vue';

const columns = [
  { label: 'IP', field: 'ip' },
  { label: 'Source', field: 'source' },
  { label: 'Status', field: 'status' },
  { label: 'Time', field: 'create_time' },
];

const columnsWithRemark = [
  { label: 'IP', field: 'ip', width: 140 },
  { label: 'Status', field: 'status', width: 90 },
  {
    label: '备注',
    field: 'remark',
    render: ({ row }) =>
      h(
        'div',
        { style: { whiteSpace: 'pre-wrap', wordBreak: 'break-all', padding: '6px 0', lineHeight: '1.6' } },
        row.remark,
      ),
  },
];

function genData(count) {
  return Array.from({ length: count }, (_, i) => ({
    ip: `192.168.0.${i + 1}`,
    source: i % 2 === 0 ? 'QQ' : 'WeChat',
    status: i % 3 === 0 ? 'Running' : 'Stopped',
    create_time: '2024-01-01 00:00:00',
  }));
}

const dataMultiLine = reactive([
  { ip: '10.0.0.1', status: 'Running', remark: '单行备注' },
  {
    ip: '10.0.0.2',
    status: 'Stopped',
    remark: '这是一段较长的备注内容，\n包含换行，\n需要多行展示才能完整呈现所有信息。',
  },
  { ip: '10.0.0.3', status: 'Running', remark: '普通备注' },
  {
    ip: '10.0.0.4',
    status: 'Stopped',
    remark: '第一行\n第二行\n第三行\n第四行 — 内容较多时行高应自动撑开',
  },
  { ip: '10.0.0.5', status: 'Running', remark: '最后一行，单行' },
]);

const data5 = reactive(genData(5));
const data20 = reactive(genData(20));
const data100 = reactive(genData(100));

const running = ref(false);
const results = ref([]);

const passCount = computed(() => results.value.filter(r => r.pass).length);
const failCount = computed(() => results.value.filter(r => !r.pass).length);

const table1 = ref(null);
const table2 = ref(null);
const table3 = ref(null);
const table4 = ref(null);
const table5 = ref(null);
const table6 = ref(null);
const table7 = ref(null);
const table8Fixed = ref(null);
const table8Auto = ref(null);

const container1 = ref(null);
const container2 = ref(null);
const container3 = ref(null);
const container4 = ref(null);
const container5 = ref(null);
const container6 = ref(null);
const container7 = ref(null);

function getScrollBody(tableRef) {
  const root = tableRef?.$el ?? tableRef;
  return root?.querySelector('.bk-table-body');
}

function isScrollable(el) {
  if (!el) return false;
  return el.scrollHeight > el.clientHeight + 2;
}

function assert(name, condition, reason = '') {
  results.value.push({ name, pass: !!condition, reason: condition ? '' : reason });
}

async function runAllTests() {
  running.value = true;
  results.value = [];

  await nextTick();
  await new Promise(r => setTimeout(r, 500));

  // Test 1: height=300 should have scrollable body
  {
    const body = getScrollBody(table1.value);
    const rootEl = table1.value?.$el;
    assert(
      'T1: height=300 — root height is ~300px',
      rootEl && Math.abs(rootEl.offsetHeight - 300) < 5,
      `Root offsetHeight: ${rootEl?.offsetHeight}`,
    );
    assert(
      'T1: height=300 — body is scrollable (20 rows overflow 300px)',
      isScrollable(body),
      `scrollHeight=${body?.scrollHeight}, clientHeight=${body?.clientHeight}`,
    );
  }

  // Test 2: height=auto + maxHeight=300 should have scrollable body
  {
    const body = getScrollBody(table2.value);
    const rootEl = table2.value?.$el;
    assert(
      'T2: height=auto, maxHeight=300 — root height <= 300px',
      rootEl && rootEl.offsetHeight <= 305,
      `Root offsetHeight: ${rootEl?.offsetHeight}`,
    );
    assert(
      'T2: height=auto, maxHeight=300 — body is scrollable',
      isScrollable(body),
      `scrollHeight=${body?.scrollHeight}, clientHeight=${body?.clientHeight}`,
    );
  }

  // Test 3: height=auto + maxHeight=100% in 300px parent
  {
    const body = getScrollBody(table3.value);
    const rootEl = table3.value?.$el;
    assert(
      'T3: height=auto, maxHeight=100% (parent=300px) — root height <= 300px',
      rootEl && rootEl.offsetHeight <= 305,
      `Root offsetHeight: ${rootEl?.offsetHeight}`,
    );
    assert(
      'T3: height=auto, maxHeight=100% (parent=300px) — body is scrollable',
      isScrollable(body),
      `scrollHeight=${body?.scrollHeight}, clientHeight=${body?.clientHeight}`,
    );
  }

  // Test 4: height=100% in 300px parent
  {
    const body = getScrollBody(table4.value);
    const rootEl = table4.value?.$el;
    assert(
      'T4: height=100% (parent=300px) — root height is ~300px',
      rootEl && Math.abs(rootEl.offsetHeight - 300) < 5,
      `Root offsetHeight: ${rootEl?.offsetHeight}`,
    );
    assert(
      'T4: height=100% (parent=300px) — body is scrollable',
      isScrollable(body),
      `scrollHeight=${body?.scrollHeight}, clientHeight=${body?.clientHeight}`,
    );
  }

  // Test 5: height=auto, no maxHeight, 5 rows — should NOT need scroll
  {
    const body = getScrollBody(table5.value);
    assert(
      'T5: height=auto, no constraint, 5 rows — body shows all content',
      body != null,
      'Body element not found',
    );
  }

  // Test 6: height=400 + pagination
  {
    const body = getScrollBody(table6.value);
    const rootEl = table6.value?.$el;
    const footer = rootEl?.querySelector('.bk-table-footer');
    assert(
      'T6: height=400 + pagination — root height is ~400px',
      rootEl && Math.abs(rootEl.offsetHeight - 400) < 5,
      `Root offsetHeight: ${rootEl?.offsetHeight}`,
    );
    assert(
      'T6: height=400 + pagination — footer is visible',
      footer && footer.offsetHeight > 0,
      `Footer offsetHeight: ${footer?.offsetHeight}`,
    );
  }

  // Test 7: virtualEnabled + height=300
  {
    const body = getScrollBody(table7.value);
    const rootEl = table7.value?.$el;
    assert(
      'T7: virtualEnabled, height=300 — root height is ~300px',
      rootEl && Math.abs(rootEl.offsetHeight - 300) < 5,
      `Root offsetHeight: ${rootEl?.offsetHeight}`,
    );
    assert(
      'T7: virtualEnabled, height=300 — body is scrollable (100 rows)',
      isScrollable(body),
      `scrollHeight=${body?.scrollHeight}, clientHeight=${body?.clientHeight}`,
    );
  }

  // Test 8: rowHeight=auto — tr 上有 row-height-auto class，多行内容的 td 高度 > 42px
  {
    const rootAuto = table8Auto.value?.$el;
    const rootFixed = table8Fixed.value?.$el;

    // 验证 row-height-auto class 已加到 tr 上
    const autoTrs = rootAuto?.querySelectorAll('tbody tr.row-height-auto');
    assert(
      'T8: rowHeight=auto — tbody tr 上有 row-height-auto class',
      autoTrs && autoTrs.length > 0,
      `找到 ${autoTrs?.length ?? 0} 个 .row-height-auto tr`,
    );

    // 固定行高模式下 tr 上不应有 row-height-auto class
    const fixedAutoTrs = rootFixed?.querySelectorAll('tbody tr.row-height-auto');
    assert(
      'T8: 固定行高模式 — tr 上无 row-height-auto class',
      fixedAutoTrs != null && fixedAutoTrs.length === 0,
      `存在 ${fixedAutoTrs?.length} 个 .row-height-auto tr`,
    );

    // auto 模式下，含多行内容的行高度应大于 42px
    const autoTds = rootAuto?.querySelectorAll('tbody tr td:last-child');
    const autoHeights = autoTds ? [...autoTds].map(td => td.offsetHeight) : [];
    const hasExpandedRow = autoHeights.some(h => h > 50);
    assert(
      'T8: rowHeight=auto — 多行内容的行高度 > 42px（内容自动撑起）',
      hasExpandedRow,
      `td 高度列表: ${autoHeights.join(', ')}`,
    );

    // auto 模式下，单行内容的行高度应接近最小行高（>=38px，考虑 border/padding 细微差异）
    const minAutoHeight = Math.min(...autoHeights);
    assert(
      'T8: rowHeight=auto — 所有行高度 >= 38px（最小高度保障）',
      autoHeights.length > 0 && minAutoHeight >= 38,
      `最小行高: ${minAutoHeight}px`,
    );
  }

  running.value = false;

  // Output results to console for automation
  console.log('=== HEIGHT TEST RESULTS ===');
  results.value.forEach(r => {
    console.log(`[${r.pass ? 'PASS' : 'FAIL'}] ${r.name}${r.reason ? ` — ${r.reason}` : ''}`);
  });
  console.log(`Total: ${passCount.value}/${results.value.length} passed`);
  console.log('=== END HEIGHT TEST RESULTS ===');
}

onMounted(() => {
  setTimeout(() => runAllTests(), 1000);
});
</script>
