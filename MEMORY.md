# Breaking Beans - Project Memory
> **INSTRUCTION FOR AI ASSISTANTS**: This file is the central memory bank for the Breaking Beans project. **It must be kept up to date in all future sessions.** Any architectural changes, new features, or important technical debt must be documented here.

## 1. Project Overview
**Breaking Beans** is a sovereign, 100% local Home Assistant integration designed to master the end-to-end espresso workflow. It handles relational coffee inventory, gear maintenance counters, and a precise brewing journal with a built-in predictive engine for dialling in shots. 

## 2. Architecture & Tech Stack
- **Root Directory**: `/Users/schaali/Breaking Beans/breaking-beans/`
- **Backend**: Standard Home Assistant Custom Component in Python (`custom_components/breaking_beans/`).
- **Frontend**: Custom Lovelace cards built with **TypeScript** and **LitElement**, bundled via Vite (`frontend/src/`). The compiled JS is served from `www/`.
- **Storage**: Uses Home Assistant's native `.storage` system (`breaking_beans.json`) to persist relational data. This allows powerful relational state tracking without mutating HA's core SQL/Recorder database.

## 3. Relational Data Model (`store.py`)
The local JSON data dictionary is split into 5 core collections:
1. **`beans`** (Master Profiles): Generic bean specs (Brand, Name, Roast Level, Process).
2. **`batches`** (Active Inventory): Specific purchases linked to a `bean_id`. Tracks `purchase_date`, `roast_date`, `initial_weight`, `used_weight`, and `remaining_weight`.
3. **`grinders`** (Hardware): Tracks `total_throughput_kg` and current `grinder_setting`.
4. **`machines`** (Hardware): Tracks `total_shot_count` for maintenance alerts (e.g. backflushing).
5. **`journal`** (Brew Log): Array of individual shot extractions linking a `batch_id`, `grinder_id`, and `machine_id`. Captures dose, yield, brew time, taste profile (1-5 rating, acidity/bitterness).

## 4. Core Logic & Mechanics
- **Automatic Decrementing**: Logging a brew automatically subtracts the `dose` from the active Batch's `remaining_weight` and increments `used_weight` and gear throughput.
- **Idempotent Editing**: `async_edit_brew` and `async_delete_brew` in `store.py` are built to correctly refund beans and reverse wear-and-tear metrics if historic shots are altered.
- **Shot Prediction Engine**: A heuristic that looks at up to the last 7 shots of a specific batch (regardless of the user who made them) to suggest dose and grind settings. It incorporates a degassing factor (e.g., -0.05 grind setting per week). If no historical data for the selected batch or bean is found, it provides a robust fallback prediction with default values to prevent "insufficient data" lockouts.

## 5. Home Assistant Integration Surface
- **Service Calls**: Setup and manual overrides are done via `breaking_beans.*` services (e.g., `add_grinder`, `add_machine`, `add_bean_option`, `add_bean_batch`, `add_brew`, `purge_beans`).
- **Sensors**: Dynamically generates binary sensors for low stock and maintenance statuses.
- **Custom UI Cards**: 
  - *Note: Cards must be registered as a `JavaScript Module` resource type in Home Assistant's Dashboard Settings.*
  - `custom:breaking-beans-card`: Main interface for logging. Features automatic entity discovery, drop-down bean selection, automatic deactivation of depleted batches, and displays historical brew graphs.
  - `custom:breaking-beans-predictor-card`: Interface for querying the intelligence engine.
  - `custom:breaking-beans-analytics-card`: Leverages Chart.js to visualize extraction correlations, target zones, and consistency heatmaps natively via the `breaking_beans/get_analytics` backend websocket.

## 6. Localization & Translation
- Supports EN, DE, FR, IT, and ES.
- Backend correctly resolves entity strings via localized `translations/*.json` maps instead of hardcoded strings, leveraging standard HA `_attr_translation_key` properties on all specific sensors.
- Frontend resolves strings via internal JS dictionary arrays mapped directly to HA's `hass.language`.

## 7. Development Workflow
- Frontend changes require building (`npm run build` inside `/frontend/`), which outputs the artifacts into HA's `www/` folder so it can be picked up by the HA lovelace dashboard.
- Any new parameters added to the Journal or Bean data structures must be handled in both the Python backend `store.py` and the corresponding TypeScript files.
- **Docker/Testing**: When testing locally via Docker, ensure that the newly built frontend files are correctly copied into the Home Assistant custom components directory and that the Docker container is restarted to safely apply backend/frontend changes.
