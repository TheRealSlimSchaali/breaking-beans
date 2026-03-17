"""Binary Sensor platform for Breaking Beans."""
import logging
from homeassistant.components.binary_sensor import BinarySensorEntity
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
    """Set up the Breaking Beans binary sensors."""
    store = hass.data[DOMAIN][DATA_STORE]

    sensors = []

    # 1. Existing Batches (Low Stock Alerts)
    for batch_id in store.data.get("batches", {}):
        sensors.append(BatchLowStockSensor(store, batch_id))

    # 2. Existing Grinders (Needs Cleaning Alerts)
    for grinder_id in store.data.get("grinders", {}):
        sensors.append(GrinderCleaningRequiredSensor(store, grinder_id))

    # 3. Existing Machines (Needs Backflush Alerts)
    for machine_id in store.data.get("machines", {}):
        sensors.append(MachineBackflushRequiredSensor(store, machine_id))

    async_add_entities(sensors)

    async def async_inject_batch(batch_id):
        async_add_entities([BatchLowStockSensor(store, batch_id)])

    async def async_inject_grinder(grinder_id):
        async_add_entities([GrinderCleaningRequiredSensor(store, grinder_id)])

    async def async_inject_machine(machine_id):
        async_add_entities([MachineBackflushRequiredSensor(store, machine_id)])

    # Watch for manually injected Service Call devices and map them to UI
    async_dispatcher_connect(hass, SIGNAL_ADD_BATCH, async_inject_batch)
    async_dispatcher_connect(hass, SIGNAL_ADD_GRINDER, async_inject_grinder)
    async_dispatcher_connect(hass, SIGNAL_ADD_MACHINE, async_inject_machine)

class BaseBreakingBeansBinarySensor(BinarySensorEntity):
    """Base UI class letting ON/OFF flags hot-reload without lag."""
    
    def __init__(self, store):
        self.store = store

    async def async_added_to_hass(self):
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_UPDATE_BREAKING_BEANS, self.async_write_ha_state
            )
        )

class BatchLowStockSensor(BaseBreakingBeansBinarySensor):
    """Triggers strictly ON when batch remaining weight < 100g."""
    
    def __init__(self, store, batch_id):
        super().__init__(store)
        self.batch_id = batch_id

    @property
    def unique_id(self):
        return f"{self.batch_id}_low_stock"

    @property
    def name(self):
        name_str = self.store.data["batches"].get(self.batch_id, {}).get("batch_name", "Unknown")
        return f"{name_str} Low Stock"

    @property
    def is_on(self):
        remaining = float(self.store.data["batches"].get(self.batch_id, {}).get("remaining_weight", 0.0))
        return remaining < 100.0

    @property
    def icon(self):
        return "mdi:alert-circle" if self.is_on else "mdi:check-circle"
        
    @property
    def device_info(self):
        return DeviceInfo(identifiers={(DOMAIN, self.batch_id)})
        
class GrinderCleaningRequiredSensor(BaseBreakingBeansBinarySensor):
    """Triggers ON when grinder throughput surpasses the user-set cleaning threshold."""
    
    def __init__(self, store, grinder_id):
        super().__init__(store)
        self.grinder_id = grinder_id

    @property
    def unique_id(self):
        return f"{self.grinder_id}_cleaning_alert"

    @property
    def _grinder_data(self):
        return self.store.data["grinders"].get(self.grinder_id, {})

    @property
    def name(self):
        return f"{self._grinder_data.get('model_name', 'Unknown')} Deep Clean Required"

    @property
    def is_on(self):
        throughput = float(self._grinder_data.get("total_throughput_kg", 0.0))
        threshold = float(self._grinder_data.get("cleaning_threshold_kg", 5.0))
        return throughput >= threshold

    @property
    def device_info(self):
        return DeviceInfo(
            identifiers={(DOMAIN, self.grinder_id)}
        )

class MachineBackflushRequiredSensor(BaseBreakingBeansBinarySensor):
    """Triggers ON when espresso machine shot count surpasses its backflush threshold limit."""
    
    def __init__(self, store, machine_id):
        super().__init__(store)
        self.machine_id = machine_id

    @property
    def unique_id(self):
        return f"{self.machine_id}_backflush_alert"

    @property
    def _machine_data(self):
        return self.store.data["machines"].get(self.machine_id, {})

    @property
    def name(self):
        return f"{self._machine_data.get('model_name', 'Unknown Machine')} Backflush Required"

    @property
    def is_on(self):
        shots = int(self._machine_data.get("total_shot_count", 0))
        threshold = int(self._machine_data.get("backflush_threshold_shots", 100))
        return shots >= threshold

    @property
    def device_info(self):
        return DeviceInfo(
            identifiers={(DOMAIN, self.machine_id)}
        )
