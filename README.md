# ReadToVoiceroid

ウェブページの選択したテキストを VoiceroidBridge を介して VOICEROID で読み上げる Firefox 拡張機能です。

## インストール
Firefox Add-ons 公式ページからインストールできます：
[ReadToVoiceroid](https://addons.mozilla.org/ja/firefox/addon/readtovoiceroid/)

## 使い方
1. 拡張機能をインストールします。
2. ローカルでVoiceroidBridge等の互換サーバーを起動しておきます（デフォルトポート: 5000）。
3. 読み上げさせたいテキストを選択し、右クリックメニューから「選択中のテキストを読み上げる」を選択します。
4. アイコンをクリックすると、接続先ホストとポートの設定が可能です。

## 開発者向け情報

### ビルド（パッケージ作成）
以下のスクリプトを実行すると、Firefox への提出用 ZIP ファイル `ReadToVoiceroid.zip` が生成されます。

```bash
./package.sh
```
