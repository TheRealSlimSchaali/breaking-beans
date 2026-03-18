"""The Breaking Beans integration."""
import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN, DATA_STORE, PLATFORMS
from .store import BreakingBeansStore
from .services import async_setup_services
from .api import async_setup_api

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Breaking Beans from a config entry."""
    hass.data.setdefault(DOMAIN, {})

    _LOGGER.info("Setting up Breaking Beans integration")

    # Initialize the local JSON storage 
    store = BreakingBeansStore(hass)
    # Register the frontend card as a static path
    import os
    www_path = os.path.join(os.path.dirname(__file__), "www")
    if os.path.exists(www_path):
        hass.http.app.router.add_static("/breaking_beans/www", www_path)

    await store.async_load()
    hass.data[DOMAIN][DATA_STORE] = store

    # Register all our services
    await async_setup_services(hass, store)
    
    # Register API
    async_setup_api(hass)

    # Forward the setup to the sensor and binary_sensor platforms
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    _LOGGER.info("Unloading Breaking Beans integration")
    
    # 1. Unload frontend sensor platforms safely
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    
    if unload_ok:
        # 2. De-register services
        for service in hass.services.async_services().get(DOMAIN, {}):
            hass.services.async_remove(DOMAIN, service)
            
        # 3. Drop from memory
        if DOMAIN in hass.data:
            hass.data.pop(DOMAIN)
        
    return unload_ok

async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle removal of an entry. Destroys the local JSON Database to ensure clean slate."""
    _LOGGER.info("Removing Breaking Beans integration and cleaning up local storage database")
    store_file = hass.config.path(".storage", f"{DOMAIN}_database.json")
    import os
    if os.path.exists(store_file):
        try:
            os.remove(store_file)
            _LOGGER.info("Successfully deleted %s", store_file)
        except Exception as e:
            _LOGGER.error("Failed to delete %s: %s", store_file, e)

from typing import Any

async def async_remove_config_entry_device(
    hass: HomeAssistant, config_entry: ConfigEntry, device_entry: Any
) -> bool:
    """Remove a device and its backend config file bindings natively from the UI."""
    store = hass.data[DOMAIN][DATA_STORE]
    
    deleted = False
    for domain, item_id in device_entry.identifiers:
        if domain == DOMAIN:
            if item_id in store.data.get("grinders", {}):
                store.data["grinders"].pop(item_id)
                deleted = True
            elif item_id in store.data.get("machines", {}):
                store.data["machines"].pop(item_id)
                deleted = True
            elif item_id in store.data.get("batches", {}):
                store.data["batches"].pop(item_id)
                deleted = True
            elif item_id in store.data.get("beans", {}):
                store.data["beans"].pop(item_id)
                deleted = True
                
    if deleted:
        await store.async_save()
        return True
        
    return False
