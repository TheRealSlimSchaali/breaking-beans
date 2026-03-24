import logging
import voluptuous as vol
import random
import math

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from datetime import datetime

from .const import DOMAIN, DATA_STORE

_LOGGER = logging.getLogger(__name__)

@callback
def async_setup_api(hass: HomeAssistant) -> None:
    """Register WebSocket API commands."""
    websocket_api.async_register_command(hass, websocket_get_prediction)
    websocket_api.async_register_command(hass, websocket_get_analytics)

@websocket_api.websocket_command(
    {
        vol.Required("type"): "breaking_beans/get_prediction",
        vol.Required("batch_id"): str,
        vol.Required("person"): str,
        vol.Required("basket_type"): str,
    }
)
@callback
def websocket_get_prediction(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Handle get prediction websocket command."""
    store = hass.data[DOMAIN][DATA_STORE]
    batch_id = msg["batch_id"]
    person = msg["person"]
    basket_type = msg["basket_type"]
    
    journal = store.data.get("journal", [])
    batches = store.data.get("batches", {})
    
    batch_info = batches.get(batch_id, {})
    bean_id = batch_info.get("bean_id")
    
    # Filter journal by requested basket_type
    basket_filtered_journal = [
        shot for shot in journal
        if shot.get("basket_type", "DOUBLE") == basket_type
    ]

    # 1. Exact Batch + Exact Person
    relevant_shots = [
        shot for shot in basket_filtered_journal 
        if shot.get("batch_id") == batch_id and shot.get("person") == person
    ]
    
    # 2. Exact Batch + Any Person
    if not relevant_shots:
        relevant_shots = [
            shot for shot in basket_filtered_journal 
            if shot.get("batch_id") == batch_id
        ]
        
    # 3. Same Master Bean + Any Batch/Person (Cross-purchase memory)
    if not relevant_shots and bean_id:
        related_batch_ids = [b_id for b_id, b_info in batches.items() if b_info.get("bean_id") == bean_id]
        relevant_shots = [
            shot for shot in basket_filtered_journal 
            if shot.get("batch_id") in related_batch_ids
        ]
    
    is_offset = False
    
    # 4. Heuristic Fallback for SINGLE if no data exists
    if not relevant_shots and basket_type == "SINGLE":
        is_offset = True
        double_shots = [
            shot for shot in journal
            if shot.get("basket_type", "DOUBLE") == "DOUBLE"
        ]
        if bean_id:
            db_related_batch_ids = [b_id for b_id, b_info in batches.items() if b_info.get("bean_id") == bean_id]
            double_shots = [
                shot for shot in double_shots
                if shot.get("batch_id") in db_related_batch_ids
            ]
        # Filter for success: Yield == Dose * 2 (approx float) AND 25 <= Time <= 30
        successful_doubles = []
        for shot in double_shots:
            try:
                d = float(shot.get("dose", 0))
                y = float(shot.get("yield", 0))
                t = float(shot.get("time", 0))
                if abs(y - (d * 2)) <= 0.5 and 25 <= t <= 30:
                    successful_doubles.append(shot)
            except ValueError:
                pass
                
        if successful_doubles:
            recent_doubles = successful_doubles[-7:]
            avg_setting = sum(float(s.get("grinder_setting", 0)) for s in recent_doubles) / len(recent_doubles)
            avg_rating = sum(float(s.get("rating", 3)) for s in recent_doubles) / len(recent_doubles)
            
            connection.send_result(
                msg["id"],
                {
                    "status": "ok",
                    "suggested_setting": round(avg_setting - 4.0, 1),
                    "suggested_dose": 8.5,
                    "suggested_yield": 17.0,
                    "avg_rating": round(avg_rating, 1),
                    "shots_analyzed": len(recent_doubles),
                    "age_adjustment": 0.0,
                    "is_offset": True
                }
            )
            return

    # 5. Total Fallback for less/no data
    if not relevant_shots:
        connection.send_result(
            msg["id"],
            {
                "status": "ok",
                "suggested_setting": 15.0,
                "suggested_dose": 18.0,
                "suggested_yield": 36.0,
                "avg_rating": 0.0,
                "shots_analyzed": 0,
                "age_adjustment": 0.0
            }
        )
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
            "age_adjustment": round(age_adjustment, 2),
            "is_offset": is_offset
        }
    )

@websocket_api.websocket_command(
    {
        vol.Required("type"): "breaking_beans/get_analytics"
    }
)
@callback
def websocket_get_analytics(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """Handle extraction analytics data fetching for Bubble Charts & Consistency Matrix."""
    store = hass.data[DOMAIN][DATA_STORE]
    journal = store.data.get("journal", [])
    batches = store.data.get("batches", {})
    beans = store.data.get("beans", {})
    
    bubble_data = []
    consistency_data = {}
    
    # Pre-calculate colors for unique beans
    bean_colors = {}
    color_palette = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6", "#e67e22"]
    color_idx = 0
    
    choke_lines = {}
    
    for shot in journal:
        batch_id = shot.get("batch_id")
        batch_info = batches.get(batch_id, {})
        bean_id = batch_info.get("bean_id")
        bean_info = beans.get(bean_id, {})
        bean_label = f"{bean_info.get('brand', 'Unknown')} {bean_info.get('name', '')}".strip()
        
        if bean_label not in bean_colors:
            bean_colors[bean_label] = color_palette[color_idx % len(color_palette)]
            color_idx += 1
            
        basket_type = shot.get("basket_type", "DOUBLE")
        is_choked = shot.get("is_choked", False)
        if isinstance(is_choked, str):
            is_choked = is_choked.lower() == "true"
            
        try:
            grind = float(shot.get("grinder_setting", 0))
            time_val = float(shot.get("time", 0))
            rating = float(shot.get("rating", 3))
        except ValueError:
            continue
            
        if is_choked:
            choke_lines[f"{bean_label}_{basket_type}"] = grind
            
        # Add jitter mechanism for identical grind settings per PRD
        jittered_grind = round(grind + random.uniform(-0.1, 0.1), 3)
        person = shot.get("person", "Guest")
        
        bubble_data.append({
            "id": shot.get("id"),
            "grind_size": grind,
            "jittered_grind": jittered_grind,
            "rating": rating,
            "time": time_val,
            "dose": shot.get("dose"),
            "yield": shot.get("yield"),
            "bean_label": bean_label,
            "color": bean_colors[bean_label],
            "basket_type": basket_type,
            "is_choked": is_choked,
            "timestamp": shot.get("timestamp")
        })
        
        # Consistency grouping per PRD
        combo_key = f"{bean_label} ({basket_type})"
        if person not in consistency_data:
            consistency_data[person] = {}
        if combo_key not in consistency_data[person]:
            consistency_data[person][combo_key] = []
        consistency_data[person][combo_key].append(time_val)

    heatmap_matrix = []
    for p, combos in consistency_data.items():
        for combo, times in combos.items():
            if len(times) > 1:
                mean = sum(times) / len(times)
                variance = sum((x - mean) ** 2 for x in times) / (len(times) - 1)
                std_dev = math.sqrt(variance)
            else:
                std_dev = 0.0
                
            heatmap_matrix.append({
                "person": p,
                "combo": combo,
                "std_dev": round(std_dev, 2),
                "count": len(times)
            })

    connection.send_result(
        msg["id"],
        {
            "status": "ok",
            "bubble_data": bubble_data,
            "heatmap": heatmap_matrix,
            "choke_lines": choke_lines
        }
    )

