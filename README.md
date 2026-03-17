# Breaking Beans

A sovereign, standalone Home Assistant integration designed to manage the end-to-end espresso workflow. It handles relational coffee bean inventory, detailed hardware profiles for grinders and machines, and a precise brewing journal. 

## Installation via HACS (Recommended)

1. Open Home Assistant.
2. Navigate to **HACS** -> **Integrations**.
3. Click the three dots in the top right corner and select **Custom repositories**.
4. Paste the URL of this repository: `https://github.com/TheRealSlimSchaali/breaking-beans`
5. Select **Integration** as the category.
6. Click **Add**.
7. "Breaking Beans" will now appear in HACS. Click it and select **Download**.
8. Restart Home Assistant to load the component.
9. Go to **Settings** -> **Devices & Services**, search for "Breaking Beans" and configure the integration. 

*(Post-installation setup of beans and machines is done via Developer Tools -> Services using the `breaking_beans` domain services).*

## Features

* **Dial-in journaling**: Log shots precisely with yields, times, grind settings, and rating.
* **Auto-inventory**: Logs will automatically decrement remaining stash of a specific active coffee batch in grams.
* **Alerts**: Exposes binary sensors that natively warn you when you are running low on beans, need to backflush the machine, or need to deep clean your grinder burrs.
* **100% Local**: Uses native Home Assistant `.storage` dictionaries, skipping SQLite entirely while staying local.al Integration
