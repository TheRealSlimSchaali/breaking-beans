"""The Breaking Beans integration."""
import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN, DATA_STORE, PLATFORMS
from .store import BreakingBeansStore
from .services import async_setup_services

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Breaking Beans from a config entry."""
    hass.data.setdefault(DOMAIN, {})

    _LOGGER.info("Setting up Breaking Beans integration")

    # Initialize the local JSON storage 
    store = BreakingBeansStore(hass)
    await store.async_load()
    hass.data[DOMAIN][DATA_STORE] = store

    # Register all our services
    await async_setup_services(hass, store)

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
