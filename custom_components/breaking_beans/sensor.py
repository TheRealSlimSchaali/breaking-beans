"""Sensor platform for Breaking Beans."""
import logging
from homeassistant.components.sensor import SensorEntity
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import DeviceInfo

from .const import (
    DOMAIN, 
    DATA_STORE, 
    SIGNAL_UPDATE_BREAKING_BEANS, 
    SIGNAL_ADD_GRINDER, 
    SIGNAL_ADD_MACHINE, 
    SIGNAL_ADD_BATCH
)

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(hass, config_entry, async_add_entities):
    """Set up the Breaking Beans sensors."""
    store = hass.data[DOMAIN][DATA_STORE]

    sensors = []

    # 1. Last Brew Meta-Sensor
    sensors.append(BreakingBeansLastBrewSensor(store))

    # 2. Add existing Grinder sensors
    for grinder_id in store.data.get("grinders", {}):
        sensors.append(GrinderMaintenanceSensor(store, grinder_id))

    # 3. Add existing Machine sensors
    for machine_id in store.data.get("machines", {}):
        sensors.append(MachineMaintenanceSensor(store, machine_id))
        
    # 4. Add existing Batch sensors
    for batch_id in store.data.get("batches", {}):
        sensors.append(BatchRemainingWeightSensor(store, batch_id))

    async_add_entities(sensors)

    # Listen for new databases entries to dynamically add UI Sensors without reboot.
    async_dispatcher_connect(
        hass, SIGNAL_ADD_GRINDER, 
        lambda grinder_id: async_add_entities([GrinderMaintenanceSensor(store, grinder_id)])
    )
    async_dispatcher_connect(
        hass, SIGNAL_ADD_MACHINE, 
        lambda machine_id: async_add_entities([MachineMaintenanceSensor(store, machine_id)])
    )
    async_dispatcher_connect(
        hass, SIGNAL_ADD_BATCH, 
        lambda batch_id: async_add_entities([BatchRemainingWeightSensor(store, batch_id)])
    )

class BaseBreakingBeansSensor(SensorEntity):
    """Base class for Breaking Beans sensors allowing UI auto-refresh."""

    def __init__(self, store):
        self.store = store

    async def async_added_to_hass(self):
        """Run when entity is deployed to register the update listener."""
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_UPDATE_BREAKING_BEANS, self.async_write_ha_state
            )
        )

class BreakingBeansLastBrewSensor(BaseBreakingBeansSensor):
    """Displays the most recent shot logged."""

    @property
    def unique_id(self):
        return "breaking_beans_last_brew"

    @property
    def name(self):
        return "Last Brew Log"

    @property
    def icon(self):
        return "mdi:coffee-maker-check"

    @property
    def state(self):
        journal = self.store.data.get("journal", [])
        if not journal:
            return "No shots logged"
        return "Logged"

    @property
    def extra_state_attributes(self):
        journal = self.store.data.get("journal", [])
        if not journal:
            return {}
        return journal[-1]

class GrinderMaintenanceSensor(BaseBreakingBeansSensor):
    """Tracks throughput for a specific Grinder device."""

    def __init__(self, store, grinder_id):
        super().__init__(store)
        self.grinder_id = grinder_id

    @property
    def unique_id(self):
        return f"{self.grinder_id}_maintenance"

    @property
    def _grinder_data(self):
        return self.store.data["grinders"].get(self.grinder_id, {})

    @property
    def name(self):
        return f"{self._grinder_data.get('model_name', 'Unknown Grinder')} Throughput"

    @property
    def native_value(self):
        return round(self._grinder_data.get("total_throughput_kg", 0.0), 3)

    @property
    def native_unit_of_measurement(self):
        return "kg"

    @property
    def icon(self):
        return "mdi:shaker"

    @property
    def device_info(self):
        return DeviceInfo(
            identifiers={(DOMAIN, self.grinder_id)},
            name=self._grinder_data.get("model_name", "Unknown Grinder"),
            manufacturer="Breaking Beans Hardware"
        )
        
    @property
    def extra_state_attributes(self):
        return {
            "current_setting": self._grinder_data.get("current_setting", 0.0),
            "burr_type": self._grinder_data.get("burr_type", "Unknown")
        }

class MachineMaintenanceSensor(BaseBreakingBeansSensor):
    """Tracks total shots for a specific Machine device."""

    def __init__(self, store, machine_id):
        super().__init__(store)
        self.machine_id = machine_id

    @property
    def unique_id(self):
        return f"{self.machine_id}_maintenance"

    @property
    def _machine_data(self):
        return self.store.data["machines"].get(self.machine_id, {})

    @property
    def name(self):
        return f"{self._machine_data.get('model_name', 'Unknown Machine')} Total Shots"

    @property
    def native_value(self):
        return self._machine_data.get("total_shot_count", 0)

    @property
    def native_unit_of_measurement(self):
        return "shots"

    @property
    def icon(self):
        return "mdi:coffee-maker"

    @property
    def device_info(self):
        return DeviceInfo(
            identifiers={(DOMAIN, self.machine_id)},
            name=self._machine_data.get("model_name", "Unknown Machine"),
            manufacturer="Breaking Beans Hardware"
        )

class BatchRemainingWeightSensor(BaseBreakingBeansSensor):
    """Tracks remaining beans in a specific batch."""

    def __init__(self, store, batch_id):
        super().__init__(store)
        self.batch_id = batch_id

    @property
    def unique_id(self):
        return f"{self.batch_id}_remaining"

    @property
    def _batch_data(self):
        return self.store.data["batches"].get(self.batch_id, {})

    @property
    def name(self):
        return f"{self._batch_data.get('batch_name', 'Unknown Batch')} Remaining"

    @property
    def native_value(self):
        # Prevent going strictly negative visually if they run over
        val = self._batch_data.get("remaining_weight", 0.0)
        return max(0.0, round(val, 1))

    @property
    def native_unit_of_measurement(self):
        return "g"

    @property
    def icon(self):
        return "mdi:seed"
