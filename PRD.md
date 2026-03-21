This is the final, comprehensive Product Requirement Definition (PRD) for Breaking Beans. I have incorporated your relational database structure (Bean Options vs. Batches), the full hardware schemas, and the advanced barista workflow logic (Dial-in, Targets, and Maintenance).

This document is ready to be handed over to Antigravity or any Home Assistant developer.

PRD: Breaking Beans
Home Assistant Standalone Coffee Management & Journal
1. Executive Summary
Breaking Beans is a sovereign, standalone Home Assistant integration designed to manage the end-to-end espresso workflow. It handles relational coffee bean inventory, detailed hardware profiles for grinders and machines, and a precise brewing journal. It replaces external mobile apps with a native, local-first, data-driven experience integrated into the Home Assistant ecosystem.

2. Core Functional Pillars
A. Bean Management (Relational Inventory)
The system separates the "Product" (General Info) from the "Batch" (Specific Purchase) to maintain long-term statistics even when using the same bean variety repeatedly.

A.1 Bean Options (Master Data)

Database Fields: bean_id (PK), Brand, Name, Roast Level (Scale 1-5), Process (Washed, Natural, etc.), Shop URL, General User Rating.

A.2 Bean Management (Active Inventory)

Database Fields: batch_id (PK), bean_id (FK), Purchase Date, Roast Date, Price, Initial Weight (g), Used Weight (g), Remaining Weight (g).

Logic: Automatic decrement of remaining_weight based strictly on the Dose (In) logged in the Brew Journal.

Alerts: Low-stock binary sensor triggered at a user-defined threshold (e.g., < 100g).

B. Hardware Profiles (Gear Database)
Hardware is treated as stateful entities with independent maintenance counters and performance attributes.

B.1 Grinder Profile (e.g., MiiCoffee DF54)

Schema: grinder_id (PK), Model Name, Burr Type (Flat/Conical), Setting Scale (Float), Current Setting (State).

Maintenance: total_throughput_kg (sum of all doses), last_clean_date, cleaning_threshold_kg.

B.2 Machine Profile (e.g., Gaggia Classic)

Schema: machine_id (PK), Model Name, Boiler Type, Portafilter Size (58mm), Target Temp.

Maintenance: total_shot_count, last_backflush_date, last_descaling_date, backflush_threshold_shots.

C. The Brew Journal (The "Log")
The primary event-logging entity that links beans, hardware, and results.

Input Parameters: Linked batch_id, grinder_id, machine_id.

Quantitative Data:

Drink Type (e.g., Espresso, Flat White): Dropdown classification string log.

Dose (In) / Yield (Out): Precision to 0.1g.

Brew Time: Extraction duration in seconds.

Grinder Setting: Float value (e.g., 14.5).

Temperature: Celsius (Manual or sensor-fetched).

Qualitative Data: 1-5 Star Rating, Taste Profile (Sour, Bitter, Balanced, Fruity, Sweet).

Advanced Flags: is_dial_in (Boolean: if true, exclude from average statistics but decrement inventory).

3. Technical Requirements
3.1 Architecture & Storage
Integration Type: Home Assistant Custom Component. Must be structured as a standard GitHub repository that can be easily added to HACS (Home Assistant Community Store) as a "Custom Repository", allowing any user to easily install it.

Setup Flow: The initial integration setup (Config Flow) via the Home Assistant UI will be simple and empty. All data population (adding machines, grinders, beans) is done *after* installation using the various `breaking_beans` Service Calls.

Data Identifiers: All internal IDs (bean_id, batch_id, grinder_id, machine_id) will be generated as human-readable, slugified strings (e.g., `batch_halo_beriti_2026_03` or `grinder_df54`) to make service calls intuitive to write in scripts.

Storage: Native Home Assistant local JSON storage (`.storage/breaking_beans.json`) for full portability and relational capabilities without altering the core HA SQLite database.

Entities & Devices:

Each Grinder and Coffee Machine will be registered as a unique Device in the Home Assistant Device Registry, with their respective sensors attached.

sensor.breaking_beans_last_brew (State = Time, Attributes = All log data).

binary_sensor.[batch_name]_low_stock (State = ON if stock < threshold).

sensor.[device_name]_maintenance_status (Attribute = Shots until backflush/clean).

3.2 UI / Frontend Requirements
Brew Entry Card: A custom Lovelace card for rapid data entry (optimized for mobile).

Recipe Target Logic: Define a "Target Ratio" per batch (e.g., 1:2.0). The UI should display the "Deviation" (e.g., Target 36g, Actual 38g -> +2g).

Analytics: Visual tracking of "Grind Setting" relative to "Days Since Roast" to visualize bean aging (CO2 loss).

3.3 Automations & Service Calls
Service Actions: 
* breaking_beans.add_brew (Log a new extraction)
* breaking_beans.edit_brew (Edit an existing extraction, recalculating stock automatically)
* breaking_beans.add_bean_option (Add a new master bean profile)
* breaking_beans.add_bean_batch (Add a new active batch to inventory)
* breaking_beans.add_grinder (Add a new grinder profile)
* breaking_beans.add_machine (Add a new machine profile)
* breaking_beans.purge_beans (Manually decrement inventory for wasted/purged beans)
* breaking_beans.reset_maintenance_counter (Reset specific maintenance flags)

Energy Integration: Use Smart Plug energy data to calculate "Warm-up Time" (Transition from "Cold" to "Thermal Stability" based on wattage cycles).

6. Project Phasing & Roadmap
Phase 1: Backend Data Engine (Integration & Services)
* Core Python integration for HA.
* Creation of `.storage/breaking_beans.json` handlers for all relational data.
* Implementation of all tracking logic, states, binary sensors (low_stock, maintenance_status), and service calls.
* Basic Lovelace entities card configuration using default Home Assistant cards.

Phase 2: Custom Frontend UI (Lovelace Card)
* Bespoke Lovelace Card built with TypeScript/LitElement.
* Mobile-optimized Entry UI for rapid shot logging.
* Interactive visual reporting (Deviation from Target Ratio, Grind Setting vs. Roast Date graph).

4. User Stories
Consistency: "As a user, I want to see a graph of my DF54 settings over the last 30 days to see how much I had to adjust for the Halo Beriti aging."

Smart Maintenance: "As a user, I want my kitchen dashboard to pulse red when the Gaggia has reached 50 shots since the last backflush."

Economic Tracking: "As a user, I want to see the average 'Cost per Espresso' based on the price and initial weight of the batch."

5. Licensing & Success Metrics
License: MIT License (Open Source).

Monetization: Supported via "Buy Me a Coffee" / GitHub Sponsors link in the HACS manifest.

Privacy: 100% Local execution. No cloud dependencies.