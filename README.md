# 🎮 Epic Games Store Auto-Claimer Manager

A modern, highly-polished configuration dashboard and live manager to automatically claim free games from the Epic Games Store (EGS), GOG, and Prime Gaming using GitHub Workflows.

This tool is designed to run periodically on a cron schedule inside GitHub Actions using the powerful and open-source `vogler/free-games-claimer` engine, requiring zero active servers or hosting fees on your end!

---

## ✨ Features

- **📡 Live Epic Games Store Feed:** Real-time visual tracking of currently active and upcoming free game giveaways directly from the EGS API.
- **⚙️ Visual Workflow Generator:** Interactive form-builder to instantly customize your platforms (Epic Games, GOG, Prime Gaming), notification channels (Discord, Telegram), and run intervals (custom cron schedule).
- **💾 Local Repo Synchronization:** Automatically save the custom generated workflow `.yml` file directly to your local project directory from the UI.
- **🔑 Secrets Assistant:** Interactive guide with quick-copy tags for setting up GitHub Secrets in your repository configuration.

---

## 🚀 Quick Start Guide

### 1. Save and Commit the Workflow
1. Run this application locally or open the web dashboard.
2. Configure your options in the **Workflow Generator** on the right panel.
3. Click **"Save to Local Project"** to update the workflow at `.github/workflows/claim-free-games.yml`.
4. Commit and push the `.github` directory to your GitHub repository:
   ```bash
   git add .github/workflows/claim-free-games.yml
   git commit -m "add epic games auto-claimer workflow"
   git push origin main
   ```

### 2. Configure GitHub Secrets
To protect your accounts and passwords, the workflow uses secure **GitHub Secrets**.
Go to your repository page on GitHub, click **Settings ➜ Secrets and variables ➜ Actions ➜ New repository secret**, and add the following keys based on your selections:

| Secret Name | Description |
|---|---|
| `EPIC_EMAIL` | **(Required)** Your Epic Games account email address. |
| `EPIC_PASSWORD` | **(Required)** Your Epic Games login password. |
| `EPIC_MFA_CODE` | *(Optional)* The 16-character authenticator base32 secret if 2FA (TOTP) is enabled. |
| `GOG_EMAIL` | *(Optional)* GOG login email. |
| `GOG_PASSWORD` | *(Optional)* GOG login password. |
| `AMAZON_EMAIL` | *(Optional)* Amazon Prime login email. |
| `AMAZON_PASSWORD` | *(Optional)* Amazon Prime login password. |
| `NOTIFY_DISCORD_WEBHOOK` | *(Optional)* Discord webhook URL for execution logs and claims notifications. |
| `NOTIFY_TELEGRAM_BOT_TOKEN` | *(Optional)* Telegram bot token from `@BotFather`. |
| `NOTIFY_TELEGRAM_CHAT_ID` | *(Optional)* Your Telegram chat ID. |

---

## 🛠️ Local Development & Dashboard

This manager is built with **Node.js** and **Express.js**.

### Run Dashboard Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local dashboard:
   ```bash
   npm run dev
   ```
3. Open your browser at [http://localhost:3000](http://localhost:3000) to view active free games and customize your workflow.

---

## 🛡️ Security & Privacy

This application **never** stores or transmits your Epic, GOG, or Amazon passwords. All credential details are managed securely in **GitHub Secrets** and evaluated only within GitHub's official runtime environment. The dashboard runs strictly locally or within your development space to generate non-sensitive configuration files.

---

*Dashboard designed and styled using Space Grotesk, Inter, and JetBrains Mono with warm off-white and dark slate visual elements.*
