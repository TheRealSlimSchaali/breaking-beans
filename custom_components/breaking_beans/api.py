import logging
import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from datetime import datetime

from .const import DOMAIN, DATA_STORE

_LOGGER = logging.getLogger(__name__)

@callback
def async_setup_api(hass: HomeAssistant) -> None:
    """Register WebSocket API commands."""
    websocket_api.async_register_command(hass, websocket_get_prediction)

@websocket_api.websocket_command(
    {
        vol.Required("type"): "breaking_beans/get_prediction",
        vol.Required("batch_id"): str,
        vol.Required("person"): str,
    }
)
@callback
def websocket_get_prediction(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Handle get prediction websocket command."""
    store = hass.data[DOMAIN][DATA_STORE]
    batch_id = msg["batch_id"]
    person = msg["person"]
    
    journal = store.data.get("journal", [])
    batches = store.data.get("batches", {})
    
    # Filter shots for this batch and person
    relevant_shots = [
        shot for shot in journal 
        if shot.get("batch_id") == batch_id and shot.get("person") == person
    ]
    
    if not relevant_shots:
        connection.send_result(msg["id"], {"status": "insufficient_data"})
        return
        
    # Get last 7 shots
    recent_shots = relevant_shots[-7:]
    
    # Calculate averages
    avg_setting = sum(float(s.get("grinder_setting", 0)) for s in recent_shots) / len(recent_shots)
    avg_dose = sum(float(s.get("dose", 0)) for s in recent_shots) / len(recent_shots)
    avg_yield = sum(float(s.get("yield", 0)) for s in recent_shots) / len(recent_shots)
    avg_rating = sum(float(s.get("rating", 3)) for s in recent_shots) / len(recent_shots)
    
    # Apply aging factor based on roast date
    batch_info = batches.get(batch_id, {})
    roast_date_str = batch_info.get("roast_date")
    
    age_adjustment = 0.0
    if roast_date_str:
        try:
            roast_date = datetime.strptime(roast_date_str, "%Y-%m-%d")
            delta = datetime.now() - roast_date
            days_old = delta.days
            
            # -0.05 per 7 days
            age_adjustment = -0.05 * (days_old / 7.0)
        except Exception as e:
            _LOGGER.warning("Could not parse roast date %s: %s", roast_date_str, e)
            
    suggested_setting = round(avg_setting + age_adjustment, 1)
    
    # Factor subjective adjustments (simple heuristic)
    avg_acidity = sum(float(s.get("acidity", 3)) for s in recent_shots) / len(recent_shots)
    avg_bitterness = sum(float(s.get("bitterness", 3)) for s in recent_shots) / len(recent_shots)
    
    if avg_acidity > 3.5:
        # Too acidic -> extract more -> grind finer
        suggested_setting -= 0.1
    if avg_bitterness > 3.5:
        # Too bitter -> extract less -> grind coarser
        suggested_setting += 0.1
        
    suggested_setting = round(suggested_setting, 1)

    connection.send_result(
        msg["id"],
        {
            "status": "ok",
            "suggested_setting": suggested_setting,
            "suggested_dose": round(avg_dose, 1),
            "suggested_yield": round(avg_yield, 1),
            "avg_rating": round(avg_rating, 1),
            "shots_analyzed": len(recent_shots),
            "age_adjustment": round(age_adjustment, 2)
        }
    )
