## Overview

ChromeとFirefoxの拡張機能です。
選択中のテキストを http://localhost:40060/talk にGETします。

## To Gemini

- gitの操作は許可があるまでしないでください。

## Implementation Ideas

- 主要機能
  - 右クリックメニューから「選択中のテキストを読み上げる」メニューを追加
    - 選択中のテキストを http://localhost:40060/talk にGETします。
  - GET先のホストとポートは設定画面から変更できます。

## GETデータの形式

- text=選択中のテキスト
