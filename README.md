# PublicOS 2.0

空間オペレーティングシステム - 物理AIシミュレーターから自律型空間プラットフォームへ

## 概要

PublicOS 2.0は、以下の技術を統合した次世代の空間コンピューティングプラットフォームです：

- **Mapbox GL JS v3** + **deck.gl** によるインターリーブレンダリング
- **Yjs/CRDT** によるリアルタイムコラボレーション
- **Tippecanoe + PMTiles** によるデータパイプライン
- **QuickJS + WASM** によるプラグインシステム
- **LERP/SLERP** による滑らかなアニメーション
- **Claude AI** による自然言語オーケストレーション

## 技術スタック

| レイヤー | テクノロジー |
|---------|-------------|
| フレームワーク | Next.js 14+ (App Router) |
| 言語 | TypeScript |
| 地図エンジン | Mapbox GL JS v3 |
| 3Dレイヤー | deck.gl (Interleaved Mode) |
| 状態管理 | Zustand / Jotai |
| コラボレーション | Yjs + WebSocket |
| スタイリング | Tailwind CSS |

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local` を編集し、Mapboxトークンを設定してください：
- Mapboxアカウント: https://account.mapbox.com/access-tokens/

### 3. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # メインページ
│   ├── layout.tsx         # ルートレイアウト
│   └── globals.css        # グローバルスタイル
├── components/
│   └── Map/
│       ├── MapContainer.tsx   # 地図コンポーネント
│       ├── ControlPanel.tsx   # コントロールパネル
│       └── index.ts
├── store/
│   └── mapStore.ts        # Zustand状態管理
├── types/
│   └── map.ts             # TypeScript型定義
├── hooks/                  # カスタムフック
└── lib/                    # ユーティリティ
```

## 実装フェーズ

### Phase 1: 基盤構築 ✅
- [x] Next.js + TypeScript プロジェクト作成
- [x] Mapbox GL JS v3 導入
- [x] deck.gl インターリーブ統合
- [x] 3D地形・建物表示

### Phase 2: コラボレーション基盤 (予定)
- [ ] Yjs CRDT導入
- [ ] WebSocketサーバー構築
- [ ] カーソル同期機能

### Phase 3: データパイプライン (予定)
- [ ] Tippecanoe統合
- [ ] PMTiles配信
- [ ] ドラッグ&ドロップアップロード

### Phase 4: プラグインシステム (予定)
- [ ] QuickJS WASM サンドボックス
- [ ] プラグインAPI設計
- [ ] サンプルプラグイン作成

### Phase 5: アニメーションループ (予定)
- [ ] LERP/SLERP補間
- [ ] フレームレート非依存ループ
- [ ] 時系列データ再生

### Phase 6: AI統合 (予定)
- [ ] Claude API統合
- [ ] Function Calling実装
- [ ] 自然言語コマンド

## 機能

### 現在実装済み

- 3D地図表示（Mapbox GL JS v3）
- 3D地形（DEM）
- 3D建物表示
- deck.glレイヤー統合
- シミュレーションパラメータUI
- プリセット位置へのフライト
- レイヤー管理

### コントロール

- **ドラッグ**: パン（移動）
- **スクロール**: ズーム
- **右ドラッグ**: 回転
- **Ctrl + ドラッグ**: ピッチ（傾き）

## ライセンス

MIT License

## 参考資料

- [Felt.com](https://felt.com) - コラボレーションとデータパイプライン
- [Re:Earth](https://reearth.io) - プラグインアーキテクチャ
- [Mini Tokyo 3D](https://minitokyo3d.com) - リアルタイム補間
- [deck.gl](https://deck.gl) - 3Dレンダリング
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) - 地図エンジン
