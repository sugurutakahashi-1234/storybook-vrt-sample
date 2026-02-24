// CSS ファイルの import を TypeScript に認識させるための型宣言
// tsgo (TypeScript native) では CSS の side-effect import に明示的な宣言が必要
declare module "*.css" {}
