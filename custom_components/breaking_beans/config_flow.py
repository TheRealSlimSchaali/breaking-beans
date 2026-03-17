"""Config flow for Breaking Beans integration."""
import logging
from typing import Any
import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import selector

from .const import DOMAIN, DATA_STORE

_LOGGER = logging.getLogger(__name__)

class BreakingBeansConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Breaking Beans."""

    VERSION = 1

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        """Get the options flow for this handler."""
        return BreakingBeansOptionsFlowHandler(config_entry)

    async def async_step_user(self, user_input=None):
        """Handle the initial step."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            return self.async_create_entry(title="Breaking Beans", data={})

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({}),
        )

class BreakingBeansOptionsFlowHandler(config_entries.OptionsFlow):
    """Handle options."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize options flow."""
        pass

    async def async_step_init(self, user_input=None):
        """Manage the options menu."""
        return self.async_show_menu(
            step_id="init",
            menu_options=[
                "add_grinder",
                "add_machine",
                "add_bean_option",
                "add_bean_batch",
            ],
        )

    async def async_step_add_grinder(self, user_input=None):
        """Add a grinder via UI."""
        if user_input is not None:
            store = self.hass.data[DOMAIN][DATA_STORE]
            await store.async_add_grinder(user_input)
            return self.async_create_entry(title="", data={})

        schema = vol.Schema({
            vol.Required("model_name"): str,
            vol.Required("burr_type"): selector.SelectSelector(
                selector.SelectSelectorConfig(options=["Flat", "Conical"])
            ),
            vol.Required("cleaning_threshold_kg", default=5.0): vol.Coerce(float),
        })
        return self.async_show_form(step_id="add_grinder", data_schema=schema)

    async def async_step_add_machine(self, user_input=None):
        """Add an espresso machine via UI."""
        if user_input is not None:
            store = self.hass.data[DOMAIN][DATA_STORE]
            await store.async_add_machine(user_input)
            return self.async_create_entry(title="", data={})

        schema = vol.Schema({
            vol.Required("model_name"): str,
            vol.Required("boiler_type", default="Dual Boiler"): str,
            vol.Required("portafilter_size", default="58mm"): str,
            vol.Required("target_temp", default=93.0): vol.Coerce(float),
            vol.Required("backflush_threshold_shots", default=100): vol.Coerce(int),
        })
        return self.async_show_form(step_id="add_machine", data_schema=schema)

    async def async_step_add_bean_option(self, user_input=None):
        """Add a master bean profile via UI."""
        if user_input is not None:
            store = self.hass.data[DOMAIN][DATA_STORE]
            await store.async_add_bean_option(user_input)
            return self.async_create_entry(title="", data={})

        schema = vol.Schema({
            vol.Required("brand"): str,
            vol.Required("name"): str,
            vol.Required("roast_level", default=3): selector.NumberSelector(
                selector.NumberSelectorConfig(min=1, max=5, step=1)
            ),
            vol.Required("process", default="Washed"): str,
        })
        return self.async_show_form(step_id="add_bean_option", data_schema=schema)

    async def async_step_add_bean_batch(self, user_input=None):
        """Add a batch via UI."""
        store = self.hass.data[DOMAIN][DATA_STORE]
        beans = store.data.get("beans", {})
        
        if not beans:
            return self.async_abort(reason="no_beans")

        if user_input is not None:
            await store.async_add_bean_batch(user_input)
            return self.async_create_entry(title="", data={})

        bean_options = [{"value": k, "label": f"{v.get('brand')} - {v.get('name')}"} for k, v in beans.items()]

        schema = vol.Schema({
            vol.Required("batch_name"): str,
            vol.Required("bean_id"): selector.SelectSelector(
                selector.SelectSelectorConfig(options=bean_options)
            ),
            vol.Required("purchase_date"): str,
            vol.Required("roast_date"): str,
            vol.Required("price", default=15.0): vol.Coerce(float),
            vol.Required("initial_weight", default=250.0): vol.Coerce(float),
        })
        return self.async_show_form(step_id="add_bean_batch", data_schema=schema)
