# 目標

exchange-rate-apiを使って以下の仕様を満たすカスタムフックのコードを書き、ドル(USD)・ユーロ(EUR)から日本円(JPY)に変換する機能を実装してください。
** コードを書く前に、まず計画を立てて下さい。私がOKを出すまで手を加えないでください。**

## エンドポイント

exchange-rate-api の公式エンドポイントは以下の通りです。

pairのあとに変換したい通貨を指定すると、その通貨のみの情報を取り出せます。例えば、USDからJPYに変換したければ、以下のようなエンドポイントになるでしょう

https://v6.exchangerate-api.com/v6/{YOUR_API_KEY}/pair/USD/JPY

### APIキー

コードにべた書きするのではなく、.env.localに追記して参照します。たとえば、
`REACT_APP_EXCHANGE_RATE_API_KEY={あなたのAPIキーを入力}`
今は仮の文字列を入れておいてください。APIキーは後で私が手動で記述します。

### JSONレスポンス

エンドポイントを叩くと返ってくるレスポンスの例を示します：
```json
{
    result: "success",
    documentation: "https://www.exchangerate-api.com/docs",
    terms_of_use: "https://www.exchangerate-api.com/terms",
    time_last_update_unix: 1751932801,
    time_last_update_utc: "Tue, 08 Jul 2025 00:00:01 +0000",
    time_next_update_unix: 1752019201,
    time_next_update_utc: "Wed, 09 Jul 2025 00:00:01 +0000",
    base_code: "USD",
    target_code: "JPY",
    conversion_rate: 145.8438
}
```

base_codeが変換元でtarget_codeが変換先、conversion_rateが為替レートだということが分かります。

### CORS

標準で CORS が有効です

### エラーハンドリング

エラー時はエラーメッセージ文字列を出力させます。サーバーエラー等でAPIの取得できなかった場合は暫定値として1ドル150円、1ユーロ140円と設定します。

## Freeプランで運用

フリープランではレート更新が1日1回のため、毎回リクエストすると無駄になる可能性があります。 `localStorage` を使い、レートをキャッシュに入れてそこから呼び出す形にしましょう。

## 日本人向け表記

日本の通貨に小数点以下は存在しません。なので小数点以下は切り捨てて表記します。

