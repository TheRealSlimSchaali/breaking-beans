# Analytics & Predictive Engine

## The Shot Predictor

The `custom:breaking-beans-predictor-card` utilizes backend heuristic logic to guide your espresso journey. It prevents you from "starting from scratch" every morning.

### How it Works:
1. **Historical Retrieval**: It analyzes up to the last 7 shots pulled from the exact active batch, regardless of the user who logged them.
2. **Degassing Adjustment**: Coffee beans lose CO₂ and density as they age from the roast date. The predictor automatically applies a *Degassing Factor* (e.g., shifting the grind setting finer by -0.05 per week).
3. **Palate Feedback loop**: By analyzing your taste ratings (identifying shots marked "Sour" or "Bitter"), it calculates directional suggestions to either coarsen or tighten the exact grind setting.
4. **Fallback Mechanism**: If the current batch is brand new, the engine falls back to the cross-batch memory of the *Master Bean Profile* to offer a highly accurate starting point. If absolutely no data is found, it provides safe defaults (e.g., 18g dose, 1:2 ratio).

## Analytics Module

The Frontend uses Chart.js to map your extraction logic visually via the `custom:breaking-beans-analytics-card`.

- **Grinder Setting vs. Roast Date**: A scatter plot representing how your grind has narrowed dynamically as the coffee ages.
- **Sweet Spot Heatmaps**: Bubble charts correlating Dose, Yield, and Time against a 5-star taste matrix, allowing you to instantly visualize the statistical "Target Zone" (Sweet spot) for a specific bean.
- **Choke Overlays**: Visually segregates choked shots on graphs to immediately highlight danger thresholds for specific grinders.
