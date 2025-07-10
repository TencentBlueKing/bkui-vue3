/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition):
 *
 * ---------------------------------------------------
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import { Language as EnLanguage } from './en';

const jp: EnLanguage = {
  lang: 'ja',
  steps: {
    step1: 'ステップ1',
    step2: 'ステップ2',
    step3: 'ステップ3',
  },
  datePicker: {
    selectDate: '日付を選択',
    selectTime: '時間を選択',
    clear: 'クリア',
    ok: 'OK',
    weekdays: {
      sun: '日',
      mon: '月',
      tue: '火',
      wed: '水',
      thu: '木',
      fri: '金',
      sat: '土',
    },
    hour: '時',
    min: '分',
    sec: '秒',
    toNow: '現在まで',
  },
  dialog: {
    ok: 'OK',
    cancel: 'キャンセル',
    prev: '前へ',
    next: '次へ',
  },
  popConfirm: {
    ok: 'OK',
    cancel: 'キャンセル',
  },
  form: {
    notBeEmpty: '空にできません',
    incorrectFormat: 'フォーマットが正しくありません',
    max: '最大値',
    min: '最小値',
    maxLen: '最大の長さ',
    verifyError: '検証エラー',
  },
  pagination: {
    eachPage: '各ページ',
    strip: '項目',
    total: '合計',
  },
  process: {
    step1: 'ステップ1',
    step2: 'ステップ2',
    step3: 'ステップ3',
    step4: 'ステップ4',
  },
  searchSelect: {
    pleaseSelect: '選択してください',
    loading: 'ロード中...',
    filterQueryMustHasValue: 'フィルターに一つ以上の値を選択する必要があります',
    ok: 'OK',
    cancel: 'キャンセル',
    or: 'or',
    and: 'and',
    logical: 'ロジック:',
  },
  select: {
    noData: 'データなし',
    noMatchedData: '一致するデータがありません',
    loading: '読み込み中...',
    pleaseSelect: '選択してください',
    enterKeywords: 'キーワードを入力してください',
    all: 'すべて',
    selectAll: 'すべて選択',
  },
  table: {
    emptyText: 'データがありません',
    confirm: 'OK',
    reset: 'リセット',
    sort: 'ソート',
    setting: {
      title: 'テーブル設定',
      fields: {
        title: '表示フィールド設定',
        subtitle: (max: number) => `（最大${max}項目）`,
        selectAll: 'すべて選択',
      },
      lineHeight: {
        title: 'テーブル行の高さ',
        small: '小',
        medium: '中',
        large: '大',
      },
      options: {
        ok: 'OK',
        cancel: 'キャンセル',
      },
    },
  },
  transfer: {
    sourceList: 'ソースリスト',
    targetList: 'ターゲットリスト',
    removeAll: 'すべて削除',
    selectAll: 'すべて選択',
    noData: 'データがありません',
    noSelected: '選択されていません',
    search: '検索',
  },
  upload: {
    uploadSuccess: 'アップロード成功',
    uploadFailed: 'アップロード失敗',
    drapFileOr: 'ここにファイルをドラッグまたは',
    clickUpload: 'クリックしてアップロード',
    uploadLabel: 'ファイルをアップロード',
  },
  input: {
    placeholder: '入力してください',
    maxlengthLimitTips: '文字数制限に達しました',
  },
  tagInput: {
    placeholder: '入力してEnterキーで終了',
  },
  message: {
    assistant: 'アシスタント',
    details: '詳細',
    copySuccess: 'コピー成功',
    copyFailed: 'コピー失敗',
  },
  cascader: {
    pleaseSelect: '選択してください',
    noData: 'データがありません',
    emptyText: '該当する検索結果がありません',
  },
  versionLog: {
    current: '現在のバージョン',
  },
};

export default jp;
