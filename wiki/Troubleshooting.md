# Troubleshooting

## Data Desync or Negative Inventory
**Issue**: My bean inventory shows negative values or grinder metrics seem wrong.
**Solution**: Due to the idempotent nature of the `store.py` logic, editing a shot will automatically refund the values. If a batch is entirely skewed, you can run the `breaking_beans.purge_beans` service with a negative value to "add" beans manually, or use a JSON editor to softly modify the `.storage/breaking_beans.json` file. *Make sure to restart HA if you edit the JSON!*

## Frontend Cards Not Loading
**Issue**: "Custom element doesn't exist" in Lovelace.
**Solution**: 
1. Verify you added the Resource URL `/breaking_beans/www/breaking-beans-card.js` as a `JavaScript Module` in your Dashboards settings.
2. Clear your browser cache and refresh.
3. If using Docker, ensure that the built files in the `frontend` folder were properly copied to the `custom_components` directory before rebuilding the container image.

## Prediction Card Shows "Insufficient Data"
**Issue**: The predictor isn't giving granular recommendations.
**Solution**: The predictor needs at least 1-2 shots logged natively on that batch to start projecting degassing algorithms. If there are no shots on the entire master bean profile, it will default to factory baseline recommendations (18g). Once you log more data, the predictions will automatically tune themselves.

## Logs
If you experience integration crashes, enable Debug logging by adding the following to your `configuration.yaml`:
```yaml
logger:
  default: warning
  logs:
    custom_components.breaking_beans: debug
```
