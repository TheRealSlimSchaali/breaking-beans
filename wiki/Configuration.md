# Configuration & Dashboard Setup

Since Breaking Beans comes with beautifully designed, bespoke LitElement-based frontend cards, they must be manually registered in your dashboard.

## 1. Registering the Lovelace Resources

Home Assistant needs to know where to find the custom JS module.

1. Go to **Settings** -> **Dashboards**.
2. Click the three dots (top right) and select **Resources**.
3. Click **Add Resource**.
4. Enter the URL: `/breaking_beans/www/breaking-beans-card.js`
5. Set Resource Type to **JavaScript Module**.
6. Click **Create**.

*Note: Depending on your cache, you might need to refresh your browser or clear the cache after adding resources.*

## 2. Adding Cards to your Dashboard

Navigate to any dashboard, click **Edit Dashboard**, and add a custom card using the yaml editor.

### The Brewing Card
Standard card for inventory overview and quick shot logging.
```yaml
type: custom:breaking-beans-card
```

### The Predictor Card
Intelligence card for getting grind and dose recommendations.
```yaml
type: custom:breaking-beans-predictor-card
```

### The Analytics Module
Visualize extraction correlations, target zones, and consistency heatmaps.
```yaml
type: custom:breaking-beans-analytics-card
```

## 3. Localization
Breaking Beans automatically detects your Home Assistant language. Supported languages include:
- 🇬🇧 English
- 🇩🇪 Deutsch
- 🇫🇷 Français
- 🇮🇹 Italiano
- 🇪🇸 Español
