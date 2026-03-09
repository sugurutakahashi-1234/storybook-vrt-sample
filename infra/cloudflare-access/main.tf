# ==============================================
# Cloudflare Access 設定
# ==============================================
# Cloudflare Pages にホスティングした Storybook へのアクセスを
# Cloudflare Access (Zero Trust) で制限する。
#
# 認証の仕組み:
#   - 認証方法: GitHub OAuth / Google OAuth / メール OTP（One-time PIN）
#   - アクセス制御: allowed_emails に登録されたメールアドレスのみ許可
#     GitHub / Google 認証の場合も、アカウントのメールアドレスが
#     allowed_emails に含まれていなければアクセスは拒否される
#   - 保護対象: プロダクション（pages.dev）とプレビュー（*.pages.dev）の両方
#   - セッション: 30日間有効（期限切れ後に再認証）
#
# 使い方（メールアドレスの追加・削除など）:
#   1. 下記の allowed_emails にメールアドレスを追加・削除
#   2. cd infra/cloudflare-access
#   3. terraform init                       # 初回のみ: provider をダウンロード
#   4. dotenvx run -- terraform plan        # 変更内容をプレビュー（実際には適用しない）
#   5. dotenvx run -- terraform apply       # Cloudflare に変更を適用
#
# 環境変数:
#   CLOUDFLARE_API_TOKEN  — .env（暗号化済み）から dotenvx が自動注入
#   復号キー（.env.keys）の取得方法は .env を参照
#
# ──────────────────────────────────────────────
# GitHub OAuth App の作成手順（初回のみ・手動）:
#   ※ GitHub OAuth App の作成は Terraform 未対応のため手動で行う
#   1. https://github.com/settings/developers > OAuth Apps > New OAuth App
#   2. 設定値:
#      - Application name: Cloudflare Access - Storybook（任意）
#      - Homepage URL: https://storybook-vrt-sample.pages.dev（= pages_domain）
#      - Authorization callback URL: https://suguru-takahashi.cloudflareaccess.com/cdn-cgi/access/callback
#        ※ suguru-takahashi = Cloudflare Zero Trust のチーム名（Zero Trust > Settings で確認）
#   3. Client ID と Client Secret を .env に設定（dotenvx encrypt で暗号化）
#
# Google OAuth クライアントの作成手順（初回のみ・手動）:
#   ※ Google OAuth クライアントの作成は Terraform 未対応のため手動で行う
#   1. https://console.cloud.google.com/ でプロジェクトを作成（例: storybook-vrt-sample）
#   2. Google Auth Platform > 概要 > 「開始」でセットアップ
#      - ブランディング > アプリ名: Cloudflare Access - Storybook（任意）
#      - 対象 > ユーザーの種類: 外部
#      - デベロッパー連絡先: 自分のメールアドレス
#   3. Google Auth Platform > クライアント > OAuth クライアント ID を作成
#      - アプリケーションの種類: ウェブ アプリケーション
#      - 名前: Cloudflare Access（任意）
#      - 承認済みの JavaScript 生成元: https://suguru-takahashi.cloudflareaccess.com
#        ※ suguru-takahashi = Cloudflare Zero Trust のチーム名（GitHub OAuth と同じ値）
#      - 承認済みのリダイレクト URI: https://suguru-takahashi.cloudflareaccess.com/cdn-cgi/access/callback
#        ※ Cloudflare Access が OAuth コールバックに使う固定パス
#   4. Client ID と Client Secret を .env に設定（dotenvx encrypt で暗号化）
# ==============================================

terraform {
  required_version = ">= 1.0"

  cloud {
    organization = "sugurutakahashi-org"
    workspaces {
      name = "cloudflare-access"
    }
  }

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.18"
    }
  }
}

provider "cloudflare" {
  # CLOUDFLARE_API_TOKEN 環境変数から自動取得
}

# ──────────────────────────────────────────────
# 変数
# ──────────────────────────────────────────────

variable "account_id" {
  description = "Cloudflare Account ID"
  type        = string
  default     = "95d6c4c8536abbe739beadf65c380ae4"
}

variable "pages_domain" {
  description = "Cloudflare Pages のドメイン"
  type        = string
  default     = "storybook-vrt-sample.pages.dev"
}

variable "github_oauth_client_id" {
  description = "GitHub OAuth App の Client ID"
  type        = string
  default     = null
}

variable "github_oauth_client_secret" {
  description = "GitHub OAuth App の Client Secret"
  type        = string
  default     = null
  sensitive   = true
}

variable "google_oauth_client_id" {
  description = "Google OAuth クライアント ID"
  type        = string
  default     = null
}

variable "google_oauth_client_secret" {
  description = "Google OAuth クライアント Secret"
  type        = string
  default     = null
  sensitive   = true
}

variable "allowed_emails" {
  description = "アクセスを許可するメールアドレスのリスト"
  type        = list(string)
  default     = ["samonikura100@gmail.com"]
}

# ──────────────────────────────────────────────
# GitHub Identity Provider
# ──────────────────────────────────────────────

resource "cloudflare_zero_trust_access_identity_provider" "github" {
  account_id = var.account_id
  name       = "GitHub"
  type       = "github"

  config = {
    client_id     = var.github_oauth_client_id
    client_secret = var.github_oauth_client_secret
  }
}

# ──────────────────────────────────────────────
# Google Identity Provider
# ──────────────────────────────────────────────

resource "cloudflare_zero_trust_access_identity_provider" "google" {
  account_id = var.account_id
  name       = "Google"
  type       = "google"

  config = {
    client_id     = var.google_oauth_client_id
    client_secret = var.google_oauth_client_secret
  }
}

# ──────────────────────────────────────────────
# Access Application + Policy
# ──────────────────────────────────────────────

resource "cloudflare_zero_trust_access_application" "storybook" {
  account_id = var.account_id
  name       = "Storybook (Cloudflare Pages)"
  domain     = var.pages_domain
  type       = "self_hosted"

  # プレビューデプロイ（*.storybook-vrt-sample.pages.dev）も保護対象に含める
  destinations = [
    { type = "public", uri = var.pages_domain },
    { type = "public", uri = "*.${var.pages_domain}" },
  ]

  # セッション有効期限（30日）
  session_duration = "720h"

  # Access Policy（許可するユーザー）
  policies = [
    {
      name     = "Allow specific emails"
      decision = "allow"
      include = [
        for email in var.allowed_emails : {
          email = {
            email = email
          }
        }
      ]
    }
  ]
}
