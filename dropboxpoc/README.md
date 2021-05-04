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
- pdfの表示にはPDF.jsを利用するとよいかも
  - binary to base64さえ出来れば良さそう
  - https://mozilla.github.io/pdf.js/examples/
- reactちょっとやってみるか
  - getting startから


## TODO
思いついたTODOをここに列挙します。

- Mangaはinterfaceじゃなくてclassで文字列からMangaのデータを設定するようにするとよいかも。
  - 文字列から漫画情報を抽出するparserみたいなクラスを一つ用意してあげる。
  - http://tatamo.81.la/blog/2016/12/22/lr-parser-generator-implementation/
- uncategoryが複数のケースに対応
- 末尾の巻数を抜き出す処理を関数化
- というかManga classに諸々の処理を抜き出す

## Authについて

[これみる](https://developers.dropbox.com/ja-jp/oauth-guide)

結局spaではなく,dropbox apiはCLIから叩いてDBに突っ込む感じになる気がする。
cliの機能としては
- すべてのデータを取得してタイトル・巻数をDB、ダウンロードurl/サムネイルURLに突っ込む