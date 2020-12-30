# Sequelize-cli-esmでSequelize のモデルをESモジュール対応版にする方法

## 目次
1. 目的
2. 前提
3. 概要
4. 手順

--- 
## 目的
* nodeがESモジュールに対応したので、SequelizeをESモジュールで使用したい。
* フロントエンド、バックエンドともにimportで統一した方が理解しやすい。
  * 初めて開発する人にfrontendはimport、backendはrequire()を使用する理由を説明しづらい。

----
## 前提
サンプルでは下記を使用。sequelizeについて基礎的な知識があること。

* Node.js v14以降  (ESモジュール対応済み)
* sequelize：6.3.5
* sequelize-cli-esm：5.0.6    (ESモジュール版cli)
* sqlite3：5.0.0  (データベース)

* package.jsonに「"type":"module"」を追加しnodeのデフォルトをESモジュールにする。

---
## 概要
1. sequelize-cli-esm (ESモジュール対応版Sequelize CLI)を利用して、ESモジュールでひな形を生成する
2. package.jsonに「"type":"module"」を追加(nodeのデフォルトをESモジュールにする)
3. sequelize-cli-esmでテンプレートファイルの作成と、マイグレーションの実行を行う

* 今回の手順ではUsersテーブルを作成し、サンプルデータを登録する。
* sequelize-cli-esm はnode_module/.binに「sequelize-esm」という名前でインストールされる。(yarnやnpxで実行する際、コマンド名を間違えないこと)
* 生成されるファイルはesモジュール形式となるため「"type":"module"」を追加するか、ファイルの拡張子を「.mjs 」にする。

---
## 手順
### 必要なパッケージをインストール
```Bash
yarn init -y
yarn add sequelize sqlite3
yarn add sequelize-cli-esm -D
```

package.json

```json
{
  "name": "sequelize-cli-esm",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",  
  "type":"module",
  "dependencies": {
    "sequelize": "^6.3.5",
    "sqlite3": "^5.0.0"
  },
  "devDependencies": {
    "sequelize-cli-esm": "^5.0.6"
  }
}

```

### Sequelize CLI による初期設定
```bash
yarn sequelize-esm init
```
config、migrations、models、seedersの各フォルダが作成される。

#### /config/config.jsonを修正する
dialectを"sqlite"、storageにデータベースの保存ファイルを指定する。

```json
{
  "development": {
    "database": "database_development",
    "dialect": "sqlite",
    "storage":"database.sqlite3"
  }
}
```


### モデルの作成
```bash
yarn sequelize-esm model:generate --name User --attributes name:string,email:string,password:string
```
* modelsフォルダに「users.js」ファイルが作成される(モデル定義)
* micrationsフォルダに「yyyymmddhhmmss-create-users.js」というファイルが作成される(マイグレーション用テーブル定義)

### マイグレーションを行いテーブルを作成する
```bash
yarn sequelize-esm db:migrate
```
#### マイグレーションを取り消す場合
ひとつ前に戻す

```bash
yarn sequelize-esm db:migrate:undo
```
マイグレーションを全て取り消す

```bash
yarn sequelize-esm db:migrate:undo:all
```
### データを追加する(seed)

```bash
yarn sequelize-esm seed:generate --name test-users
```

下記ファイルが作成される。(ESモジュールで作成されている)

* 修正前

```javascript
 export default {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
```

* 修正後

```javascript
 export default {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    return await queryInterface.bulkInsert("Users",[
      { name: "name1", username: "username1", email: "email1", password: "password1", createdAt: now, updatedAt: now},
      { name: "name2", username: "username2", email: "email2", password: "password2", createdAt: now, updatedAt: now},
      { name: "name3", username: "username3", email: "email3", password: "password3", createdAt: now, updatedAt: now},
      { name: "name4", username: "username4", email: "email4", password: "password4", createdAt: now, updatedAt: now},
    ], {});
  },

  async down(queryInterface, Sequelize) {
   return await queryInterface.bulkDelete("Users", null, {} );
  }
};
```

#### データ登録用のコマンドを実行する
```bash
yarn sequelize-esm db:seed:all
```

* データが登録されていることを確認する

| id | name | username | mail | password | createdAt | updatedAt |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
|1|name1|username1|email1|password1|2020-12-30 14:36:38.895 +00:00|2020-12-30 14:36:38.895 +00:00|
|2|name2|username2|email2|password2|2020-12-30 14:36:38.895 +00:00|2020-12-30 14:36:38.895 +00:00|
|3|name3|username3|email3|password3|2020-12-30 14:36:38.895 +00:00|2020-12-30 14:36:38.895 +00:00|
|4|name4|username4|email4|password4|2020-12-30 14:36:38.895 +00:00|2020-12-30 14:36:38.895 +00:00|


#### 登録したデータを削除する場合
```bash
yarn sequelize-esm db:seed:undo:all
```

---
## 参考ページ
https://mseeeen.msen.jp/sequelize-for-es6/
