# ドラフトデータ追加スキル

新しい年度のドラフトデータを追加する手順。

## データソース

NPB公式ドラフト会議ページ（球団別）。対象球団のサフィックスは `src/config/team.config.json` の
`npb.draftUrlTemplate` に定義されている（福岡ソフトバンクホークスは `draftlist_h.html`）:

```
https://draft.npb.jp/draft/${year}/draftlist_h.html
```

各球団の選択選手一覧が掲載されている。`draftUrlTemplate` のページにはホークスの指名選手のみが載る。

**注意**: ハズレ1位（抽選外れ）の情報はNPBページには掲載されていない。スポーツニュースサイト等で別途調査が必要。

## 手順

### 1. データ取得（取得スクリプトを使う）

`team.config.json` の `npb.draftUrlTemplate` を読んで自動取得する:

```bash
node scripts/fetch-draft.mjs --year ${year}
# 複数年: node scripts/fetch-draft.mjs --from 2001 --to 2025
```

`src/data/draft/${year}.jsonl.json` が生成される。取得・パースは `scripts/lib/draft-fetch.mjs` が担当し、
以下を抽出する:

- 新人選手選択会議 / 育成選手選択会議 の区分（`category`: `regular` / `development`）
- 順位（`round`: 1, 2, ...）
- 巡目が付かない特別枠（自由獲得枠・希望入団枠・逆指名）は `round: 0` + `note` ラベル
- 選手名（`name`）・ポジション（`position`）・出身校/チーム名（`team`）

### 2. ふりがな（name_kana）の補完

`fetch-draft.mjs` は `name_kana` を空で出力する。読みは以下で補完する:
- 同一選手が選手名簿（`src/data/*-players.jsonl.json`、NPB公式由来）に居れば氏名一致で流用。
- 居なければ日本語Wikipedia等で調査（同名異人は指名年・守備位置・所属で本人確認）。

### 3. ハズレ1位の調査

WebSearchで「${year}年ドラフト ソフトバンク 外れ1位」等を検索し、1位指名が抽選外れだったか確認する。
該当する場合は当該選手の `isLotteryLoss` を `true`、`lotteryTarget` に外した選手名を設定する。

### 4. 定数に year 追加

`src/constants/draft.ts` の `draftYears` 配列に新しい年を追加:

```typescript
export const draftYears = [
  2001, 2002, ..., 2025, 2026,  // ← 追加
] as const;
```

### 5. データローダーに追加

`src/lib/draft.ts` に:
1. import を追加: `import Draft2026 from "@/data/draft/2026.jsonl.json";`
2. map に追加: `2026: Draft2026 as DraftPick[],`

### 6. ビルド確認

```bash
npm run lint
npm run build
```

## データフォーマット（参考）

```json
[
  {
    "year": 2026,
    "category": "regular",
    "round": 1,
    "name": "選手名",
    "name_kana": "せんしゅめい",
    "position": "投手",
    "team": "出身校",
    "team_kana": "",
    "isLotteryLoss": false
  }
]
```

- `category`: `"regular"`（新人選手）または `"development"`（育成選手）
- `round`: 巡目。自由獲得枠・希望入団枠・逆指名など巡目が付かない指名は `0` とし、`note` に
  `"自由獲得枠"` / `"希望入団枠"` / `"逆指名"` を設定する（`DraftTable` は `round===0` のとき `note` を表示）。
- `isLotteryLoss`: ハズレ1位の場合のみ `true`（`lotteryTarget` に外した選手名）。
