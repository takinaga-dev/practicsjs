# Dropbox APIサンプル

## 詰まったポイント
App onlyではなくFull Accessをアプリ作成時に設定する必要がある。

## Todo

- ファイルを再帰的に取得して全ファイルを取得する。 
  - continueを確認してみる
  - 更新時に差分だけ取得する(option)
    - long_poolを試してみる
    - webhookか
- サムネイルがチェックできるか確認 done
- dropboxのダウンロードAPIだけ叩くようにしないとだめかもなー

### for App

- タイトルごとにまとめる
- フォーマットに合っていないタイトルのファイルをまとめる。
- 簡単な検索
- raspberrypiのuiを立てれるようにする
- dbに漫画のデータを保持する

## Authについて

[これみる](https://developers.dropbox.com/ja-jp/oauth-guide)

結局spaではなく,dropbox apiはCLIから叩いてDBに突っ込む感じになる気がする。
cliの機能としては
- すべてのデータを取得してタイトル・巻数をDB、ダウンロードurl/サムネイルURLに突っ込む