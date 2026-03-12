# ==============================================
# Sentry エラー監視設定
# ==============================================
# Sentry のプロジェクト・クライアントキー（DSN）・アラートルールを
# Terraform で管理する。
#
# 使い方（アラート追加・設定変更など）:
#   1. 下記のリソースを変更
#   2. cd infra/sentry
#   3. terraform init                       # 初回のみ: provider をダウンロード
#   4. dotenvx run -- terraform plan        # 変更内容をプレビュー（実際には適用しない）
#   5. dotenvx run -- terraform apply       # Sentry に変更を適用
#
# 環境変数:
#   SENTRY_AUTH_TOKEN — .env（暗号化済み）から dotenvx が自動注入
#   復号キー（.env.keys）の取得方法は .env を参照
#
# Auth Token の作成手順（初回のみ・手動）:
#   1. https://suguru-takahashi.sentry.io/settings/auth-tokens/ > Create New Token
#   2. 権限: project:read, project:write, alerts:read, alerts:write, org:read
#   3. トークンを .env に設定（dotenvx encrypt で暗号化）
# ==============================================

terraform {
  required_version = ">= 1.14.6"

  cloud {
    organization = "sugurutakahashi-org"
    workspaces {
      name = "sentry"
    }
    # State は HCP Terraform に保存するが、plan/apply はローカルで実行する
    # dotenvx が注入する SENTRY_AUTH_TOKEN をそのまま使うため
  }

  required_providers {
    sentry = {
      source  = "jianyuan/sentry"
      version = "~> 0.14"
    }
  }
}

provider "sentry" {
  # SENTRY_AUTH_TOKEN 環境変数から自動取得
}

# ──────────────────────────────────────────────
# ローカル変数
# ──────────────────────────────────────────────

locals {
  organization = "suguru-takahashi"
  team         = "suguru-takahashi"
}

# ──────────────────────────────────────────────
# プロジェクト
# ──────────────────────────────────────────────

# Next.js Web アプリケーションのエラー監視プロジェクト
# import: terraform import sentry_project.web suguru-takahashi/storybook-vrt-sample
resource "sentry_project" "web" {
  organization = local.organization
  teams        = [local.team]
  name         = "storybook-vrt-sample"
  platform     = "javascript-nextjs"

  # 72 時間（3日間）再発しなかったエラーを自動で Resolved にする
  resolve_age = 72
}

# ──────────────────────────────────────────────
# クライアントキー（DSN）
# ──────────────────────────────────────────────

# SDK が Sentry にイベントを送信するためのキー
# DSN は apps/web/.env に dotenvx 暗号化して保存する
# import: terraform import sentry_key.web suguru-takahashi/storybook-vrt-sample/KEY_ID
resource "sentry_key" "web" {
  organization = local.organization
  project      = sentry_project.web.slug
  name         = "Default"

  # レート制限: 1 時間あたり 1000 イベントまで
  # 無料枠（5,000 イベント/月）を保護し、異常なエラー急増による枠消費を防ぐ
  rate_limit_count  = 1000
  rate_limit_window = 3600
}

# ──────────────────────────────────────────────
# アラートルール
# ──────────────────────────────────────────────

# 新しいエラーが発生したらメールで通知する
# 既知のエラーの再発は通知しない（ノイズ防止）
resource "sentry_issue_alert" "new_issue" {
  organization = local.organization
  project      = sentry_project.web.slug
  name         = "新しいエラーを検知"

  # 条件: 初めて見るエラーが発生したとき
  conditions_v2 = [
    {
      first_seen_event = {}
    }
  ]

  # アクション: プロジェクトメンバー全員にメール通知
  actions_v2 = [
    {
      notify_email = {
        target_type      = "IssueOwners"
        fallthrough_type = "ActiveMembers"
      }
    }
  ]

  action_match = "all"
  filter_match = "all"
  frequency    = 1440 # 同じアラートの再通知間隔（分）: 24 時間
}

# ──────────────────────────────────────────────
# 出力
# ──────────────────────────────────────────────

output "project_slug" {
  description = "Sentry プロジェクトスラッグ"
  value       = sentry_project.web.slug
}

output "dsn_public" {
  description = "Sentry 公開 DSN（SDK の dsn パラメータに使用する）"
  value       = sentry_key.web.dsn["public"]
  sensitive   = true
}
