# Relational Data & Hardware

Breaking Beans uses a sophisticated, relational approach to track your coffee. This ensures that historical metrics are not skewed if you open a new bag of a coffee you've used before.

## Beans vs. Batches
The core concept is separating the *Master Bean Profile* from the *Active Batch*.

### 1. Master Bean Profile (`bean_id`)
This represents the coffee itself.
- **Attributes**: Brand, Name, Roast Level (1-5), Process (Washed, Natural, etc.), Origin.
- **Purpose**: Tracks global preferences and cross-batch prediction fallback.

### 2. Active Batch (`batch_id`)
This represents the specific bag/purchase you just opened.
- **Attributes**: Links back to a `bean_id`. Tracks Purchase Date, Roast Date, Price, Initial Weight (e.g., 250g).
- **Purpose**: Strictly tracks inventory (`remaining_weight` in grams) and precise aging since the roast date. When you log an 18g shot, the `batch` is decremented by 18g.

## Hardware Management

Hardware entities track their own lifetime usage and maintenance cycles. They are created via Home Assistant services.

### Grinders (`grinder_id`)
- **Metadata**: Model Name, Burr Type, Setting Scale.
- **Tracking**: `total_throughput_kg` (accumulates every logged dose).
- **Maintenance**: Configurable `cleaning_threshold_kg`. The system will prompt you to clean the grinder once this threshold is hit.

### Espresso Machines (`machine_id`)
- **Metadata**: Model Name, Boiler Type, Portafilter Size.
- **Tracking**: `total_shot_count`.
- **Maintenance**: Configurable `backflush_threshold_shots`. The system will pulse a warning when you reach the backflush target.
