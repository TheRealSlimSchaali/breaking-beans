"""Service handlers for Breaking Beans."""
import logging

from homeassistant.core import HomeAssistant, ServiceCall

from .const import (
    DOMAIN,
    SERVICE_ADD_BREW,
    SERVICE_ADD_BEAN_OPTION,
    SERVICE_ADD_BEAN_BATCH,
    SERVICE_ADD_GRINDER,
    SERVICE_ADD_MACHINE,
    SERVICE_PURGE_BEANS,
    SERVICE_RESET_MAINTENANCE,
    SERVICE_DELETE_BREW,
    SERVICE_DEPLETE_BATCH,
)
from .store import BreakingBeansStore

_LOGGER = logging.getLogger(__name__)

async def async_setup_services(hass: HomeAssistant, store: BreakingBeansStore) -> None:
    """Register all Breaking Beans data-entry services."""

    async def handle_add_brew(call: ServiceCall) -> None:
        """Handle adding a new brew to the journal and decrements."""
        await store.async_add_brew(dict(call.data))

    async def handle_add_bean_option(call: ServiceCall) -> None:
        """Handle setting up a master bean profile."""
        await store.async_add_bean_option(dict(call.data))

    async def handle_add_bean_batch(call: ServiceCall) -> None:
        """Handle adding an active bean batch inventory."""
        await store.async_add_bean_batch(dict(call.data))

    async def handle_add_grinder(call: ServiceCall) -> None:
        """Handle registering a hardware grinder component."""
        await store.async_add_grinder(dict(call.data))

    async def handle_add_machine(call: ServiceCall) -> None:
        """Handle registering a hardware espresso machine."""
        await store.async_add_machine(dict(call.data))

    async def handle_purge_beans(call: ServiceCall) -> None:
        """Handle manually throwing away / purging coffee grounds."""
        batch_id = call.data.get("batch_id")
        amount = float(call.data.get("amount", 0.0))
        await store.async_purge_beans(batch_id, amount)

    async def handle_reset_maintenance(call: ServiceCall) -> None:
        """Handle clearing the backflush or cleaning counters on hardware."""
        target = call.data.get("target")  # "machine" or "grinder"
        device_id = call.data.get("device_id")
        await store.async_reset_maintenance_counter(device_id, target)

    async def handle_delete_brew(call: ServiceCall) -> None:
        """Handle deleting a past brew and optionally restoring beans."""
        brew_id = call.data.get("brew_id")
        return_beans = call.data.get("return_beans", False)
        await store.async_delete_brew(brew_id, return_beans)

    async def handle_deplete_batch(call: ServiceCall) -> None:
        """Handle rapidly depleting a batch to 0 remaining."""
        batch_id = call.data.get("batch_id")
        await store.async_deplete_batch(batch_id)

    # Register the service handlers to Home Assistant
    hass.services.async_register(DOMAIN, SERVICE_ADD_BREW, handle_add_brew)
    hass.services.async_register(DOMAIN, SERVICE_ADD_BEAN_OPTION, handle_add_bean_option)
    hass.services.async_register(DOMAIN, SERVICE_ADD_BEAN_BATCH, handle_add_bean_batch)
    hass.services.async_register(DOMAIN, SERVICE_ADD_GRINDER, handle_add_grinder)
    hass.services.async_register(DOMAIN, SERVICE_ADD_MACHINE, handle_add_machine)
    hass.services.async_register(DOMAIN, SERVICE_PURGE_BEANS, handle_purge_beans)
    hass.services.async_register(DOMAIN, SERVICE_RESET_MAINTENANCE, handle_reset_maintenance)
    hass.services.async_register(DOMAIN, SERVICE_DELETE_BREW, handle_delete_brew)
    hass.services.async_register(DOMAIN, SERVICE_DEPLETE_BATCH, handle_deplete_batch)
