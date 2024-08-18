# merger - JCompaths トレース比較コンポーネント

## ビルド

（npmレジストリに登録していないため，実行用のファイルをビルドして使用してください）


```sh
npm run build
```

## 実行

入力のファイル `fileinfo1.json`, `fileinfo2.json`, `varinfo1.json`, `varinfo2.json`, `methodinfo1.json`, `methodinfo2.json` は NOD4J post processor 改造版 (nod4jc-0.5.jar) の出力結果です.
各1に変更前の、2に変更後の出力を指定します．


```sh
node ./out/main.js fileinfo1.json fileinfo2.json varinfo1.json varinfo2.json methodinfo1.json methodinfo2.json output.json
```

比較結果の出力先が `output.json` です.
