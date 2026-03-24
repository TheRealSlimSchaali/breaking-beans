# Home Assistant Service Calls

Because Breaking Beans maintains a local, isolated state, initial population of your database is done using Home Assistant services directly.

You can run these via **Developer Tools -> Services**.

### 1. Managing Equipment
Add your hardware to the registry.

**Add Grinder**
```yaml
service: breaking_beans.add_grinder
data:
  identifier: df54
  model: "MiiCoffee DF54"
  burr_type: "Flat"
  cleaning_threshold_kg: 5.0
```

**Add Machine**
```yaml
service: breaking_beans.add_machine
data:
  identifier: gaggia
  model: "Gaggia Classic Pro"
  backflush_threshold_shots: 50
```

### 2. Managing Coffee
Create your Master Bean, then open a Batch.

**Add Bean Option**
```yaml
service: breaking_beans.add_bean_option
data:
  identifier: halo_beriti
  brand: "Square Mile"
  name: "Halo Beriti"
  roast_level: 2
  process: "Washed"
```

**Add Bean Batch**
```yaml
service: breaking_beans.add_bean_batch
data:
  identifier: halo_beriti_march_26
  bean_id: halo_beriti
  initial_weight: 250
  roast_date: "2026-03-24"
  price: 21.50
```

### 3. Utility Actions

**Log a Brew (Raw)**
*(Normally handled via the UI card)*
```yaml
service: breaking_beans.add_brew
data:
  batch_id: halo_beriti_march_26
  grinder_id: df54
  machine_id: gaggia
  dose: 18.0
  yield_out: 36.0
  brew_time: 27
  grind_setting: 14.5
  rating: 4
```

**Purge Beans**
Used to manually discard beans (e.g., purging the grinder).
```yaml
service: breaking_beans.purge_beans
data:
  batch_id: halo_beriti_march_26
  amount_g: 5.0
```

**Reset Maintenance**
```yaml
service: breaking_beans.reset_maintenance_counter
data:
  target_id: df54
  maintenance_type: "clean"
```
