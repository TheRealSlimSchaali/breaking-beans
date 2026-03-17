"""Config flow for Breaking Beans integration."""
import logging
import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import HomeAssistant

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

class BreakingBeansConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Breaking Beans."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Handle the initial step."""
        # Only allow a single instance of the integration
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            return self.async_create_entry(title="Breaking Beans", data={})

        # Display an empty form explaining setup occurs via service calls
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({}),
        )
