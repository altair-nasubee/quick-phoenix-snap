# Welcome to your Dyad app
Dyad ( https://www.dyad.sh/ ) を使ってTypeScriptのWebアプリを開発したサンプル。

## APIキーの登録
設定画面で各モデルのAPIキーを設定する。
チャット画面でモデルを選択できるので、APIキーを登録したモデルを選択して使うこと

## まずは、Plan決定
- 最初にPlanモードにして、以下のプロンプトで仕様の壁打ちを実行
```
時間になったら通知するタイマーアプリを作りたい。

まだ仕様が固まっていません。不明な点や決めていない項目があれば、勝手に決めずに、実装方針を確定する前に私に一つずつ質問してください。 私が答えたら、それを踏まえて次の質問をしてください。

今分かっている要望は以下だけです：

時間を設定してカウントダウンできる
時間になったらブラウザのNotification APIでWindowsに通知を出す
Startボタンを押したタイミングで通知の許可を求める
上記以外の機能は特に希望していません。必要か不要か含めて質問してください。
```

-仕様が確定したら画面右の仕様のPreviewの [Accept plan and start a new chat] を押すとビルド開始


## Usage

### 作成したアプリをDyad以外でローカル実行する方法
- Dyadで作成したアプリのフォルダを丸ごとコピー or GitHubのリポジトリをClone
- PowerShellを開いてアプリのフォルダへ遷移
- Execute commands on PowerShell
```powershell
npm install --legacy-peer-deps

npm run dev
```
- コンソールに `http://localhost:8080/` などの表示が出るので、そのアドレスを開けば実行できる
- 終了時は、[Ctrl]+[C]でサーバーを止める
- 削除するときはアプリのフォルダごと削除すればOK

