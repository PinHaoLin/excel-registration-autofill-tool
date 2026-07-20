# Excel 報名資料自動填寫工具

這是一個 Electron + React 桌面工具，用來把報名或付款文字整理後，自動新增到指定的 Excel `.xlsx` 檔案。

## 使用者文件

一般使用者請先閱讀：

- [圖文使用說明](docs/使用說明.md)
- [Word 版使用說明](docs/Excel報名資料自動填寫工具_使用說明.docx)

## 使用者執行需求

使用者只需要執行打包後的 `Excel自動填寫工具-0.1.1.exe`，不需要另外安裝 Node.js、Vite 或 Electron。

Node.js、Vite 和 Electron 套件只會在開發、測試或重新打包時使用。

## 開發啟動

```bash
npm install
npm run dev
```

## 建置

```bash
npm run build
npm run dist
```

產出的可攜版程式會放在 `release/` 目錄。

## Excel 寫入欄位

| Excel 欄位 | 寫入內容 |
| --- | --- |
| A | 月份公式，依付款日期產生 `yyyy-mm` |
| B | 付款日期 |
| C | 付款方式 |
| D | 匯款末五碼或刷卡末四碼 |
| E | 已付金額 |
| F | 姓名 |
| G | 課程/場次名稱 |
| H | 課程總金額 |
| K | 課程月份 |
| L | 退款註記，工具保持空白 |
| N | 備註 |

## 金額與公式規則

- 非分期資料：每一筆資料的「收款金額」會等於該筆「課程金額」。
- 分期資料：第一筆會帶入本次收款金額，其餘拆出的項目收款金額會保持空白。
- 寫入後，工具會要求 Excel 在開啟檔案時重新計算公式欄位，例如分期差額。

## 專案結構

```text
electron/
  main.js
  preload.js
  services/dataProcessor.js
src/
  App.jsx
  main.jsx
  styles.css
docs/
  使用說明.md
  Excel報名資料自動填寫工具_使用說明.docx
index.html
package.json
vite.config.js
```
