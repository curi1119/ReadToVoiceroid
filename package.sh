#!/bin/bash

# 既存のZIPファイルを削除
rm -f ReadToVoiceroid.zip

# 拡張機能のファイルをパッケージング
echo "Packaging ReadToVoiceroid..."
zip -r ReadToVoiceroid.zip background.js content.js manifest.json icons/ popup/

echo "Done! Created ReadToVoiceroid.zip"
