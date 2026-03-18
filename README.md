# Breaking Beans ☕️

<table align="center">
  <tr>
    <td align="center">
      <img src="https://raw.githubusercontent.com/TheRealSlimSchaali/breaking-beans/main/custom_components/breaking_beans/www/hero.png" width="800" alt="Breaking Beans UI">
      <br>
      <i>The sovereign Home Assistant espresso journal & management engine.</i>
    </td>
  </tr>
</table>

### 🚀 [Breaking Beans Documentation](https://github.com/TheRealSlimSchaali/breaking-beans)

[![HACS Badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![HA Version](https://img.shields.io/badge/Verified-HA%202024.1+-blueviolet.svg)](https://github.com/TheRealSlimSchaali/breaking-beans)

---

## 🌟 Vision

**Breaking Beans** is a standalone Home Assistant integration designed to master the end-to-end espresso workflow. It handles relational coffee inventory, gear maintenance, and a precise brewing journal with predictive intelligence.

### Core Pillars
1.  **Sovereignty**: 100% local, no cloud dependencies.
2.  **Precision**: Relational data model prevents statistical skew between bean purchases.
3.  **Intelligence**: Heuristic shot predictor that learns from your personal taste profile and bean aging.

---

## 🏗 Data Model & Flow

Breaking Beans uses a relational structure to ensure that your statistics remain accurate even when you brew the same bean variety across multiple purchases.

```mermaid
graph TD
    A[Master Bean Profile] -- "template for" --> B[Active Batch]
    B -- "decrements stock" --> C[Brew Journal Entry]
    D[Grinder Profile] -- "tracks wear" --> C
    E[Machine Profile] -- "tracks shots" --> C
    C -- "feedback loops" --> F[Shot Predictor]
    F -- "suggests settings" --> B
```

---

## ⚡️ Key Features

- **Relational Bean Management**: Define "Bean Origins" once. Track every unique "Batch" purchase separately ($/kg, weight, roast date).
- **Auto-Inventory Management**: Automatically decrements your bean stock in grams based on logged shots.
- **Hardware Maintenance Entities**:
  - **Grinder**: Tracks total throughput (kg) with "Clean Me" thresholds.
  - **Machine**: Tracks total shots with "Backflush" alerts.
- **Shot Prediction Engine**: Suggests grind setting, dose, and yield based on:
  - Last 7 shots analysis.
  - **Degassing Factor**: Adjusts finer as beans age (-0.05 setting per week).
  - **Palate Feedback**: Analyzes your Acidity/Bitterness ratings to fine-tune extraction.
- **Mobile-First Card**: A bespoke Lovelace UI (compiled LitElement) optimized for kitchen use.

---

## 🛠 Installation

### via HACS (Recommended)

1. Open **HACS** -> **Integrations**.
2. **Custom Repositories** (top right) -> Path: `TheRealSlimSchaali/breaking-beans` -> Category: **Integration**.
3. Download and **Restart Home Assistant**.
4. **Settings** -> **Devices & Services** -> **Add Integration** -> **Breaking Beans**.

---

## 🚀 Step-by-Step Setup

Since it is a local storage integration, it starts empty. Set it up using **Service Calls**:

### 1. Equipment Registry
- `breaking_beans.add_grinder`: Specify model and cleaning threshold.
- `breaking_beans.add_machine`: Specify model and backflush threshold.

### 2. Coffee Registry
- `breaking_beans.add_bean_option`: Create a master profile (e.g., "Halo Beriti").
- `breaking_beans.add_bean_batch`: Register the specific bag you just opened. Provide the `bean_id` from step 1.

---

## 🌍 Localization
Supported languages: 🇬🇧 English, 🇩🇪 Deutsch, 🇮🇹 Italiano.

---

## 📜 License
Apache License 2.0. Developed by [@TheRealSlimSchaali](https://github.com/TheRealSlimSchaali).

---

<p align="center">
  Developed with ❤️ for the coffee community.
</p>
