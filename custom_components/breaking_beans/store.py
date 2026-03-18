"""Data storage for Breaking Beans."""
import logging
from typing import Any, Dict

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.util import slugify

from .const import (
    DOMAIN, 
    STORAGE_KEY, 
    STORAGE_VERSION,
    SIGNAL_UPDATE_BREAKING_BEANS,
    SIGNAL_ADD_GRINDER,
    SIGNAL_ADD_MACHINE,
    SIGNAL_ADD_BATCH
)

_LOGGER = logging.getLogger(__name__)

class BreakingBeansStore:
    """Class to hold Breaking Beans relational JSON data."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the storage engine."""
        self.hass = hass
        self.store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.data: Dict[str, Any] = {
            "beans": {},
            "batches": {},
            "grinders": {},
            "machines": {},
            "journal": []
        }

    async def async_load(self) -> None:
        """Load data from the store on HA startup."""
        data = await self.store.async_load()
        if data is not None:
            self.data = data
        else:
            await self.async_save()

    async def async_save(self) -> None:
        """Save data to the physical .storage file."""
        await self.store.async_save(self.data)
        async_dispatcher_send(self.hass, SIGNAL_UPDATE_BREAKING_BEANS)

    def _generate_id(self, prefix: str, name: str, collection: str) -> str:
        """Generate a human-readable slugified id (e.g. batch_halo_beriti)."""
        slug = slugify(name)
        base_id = f"{prefix}_{slug}"
        
        final_id = base_id
        counter = 1
        
        target_dict = self.data.get(collection, {})
        
        # Prevent collisions if you buy the same batch name twice
        while final_id in target_dict:
            final_id = f"{base_id}_{counter}"
            counter += 1
            
        return final_id

    async def async_add_bean_option(self, data: Dict[str, Any]) -> str:
        """Add a master bean profile."""
        bean_id = self._generate_id("bean", data.get("name", "unknown"), "beans")
        self.data["beans"][bean_id] = data
        await self.async_save()
        try:
            from homeassistant.helpers.dispatcher import async_dispatcher_send
            from .const import SIGNAL_ADD_BEAN_OPTION
            async_dispatcher_send(self.hass, SIGNAL_ADD_BEAN_OPTION, bean_id)
        except Exception as e:
            _LOGGER.error("Error dispatching bean profile update: %s", e)
            
        return bean_id

    async def async_add_bean_batch(self, data: Dict[str, Any]) -> str:
        """Add an active bean batch to inventory."""
        bean_id = data.get("bean_id")
        bean_data = self.data["beans"].get(bean_id, {})
        brand = bean_data.get("brand", "Unknown")
        name = bean_data.get("name", "Unknown")
        p_date = data.get("purchase_date", "")
        
        base_name = f"{brand} {name} ({p_date})"
        batch_name = base_name
        
        existing_names = [b.get("batch_name") for b in self.data["batches"].values()]
        
        if batch_name in existing_names:
            import string
            suffix_idx = 0
            while f"{base_name} {string.ascii_lowercase[suffix_idx]}" in existing_names:
                suffix_idx += 1
                if suffix_idx >= len(string.ascii_lowercase):
                    break
            batch_name = f"{base_name} {string.ascii_lowercase[suffix_idx]}"
            
        data["batch_name"] = batch_name
        batch_id = self._generate_id("batch", batch_name, "batches")
        
        # Initialize default tracking fields based on PRD
        data["used_weight"] = 0.0
        data["remaining_weight"] = float(data.get("initial_weight", 0.0))
        
        self.data["batches"][batch_id] = data
        await self.async_save()
        async_dispatcher_send(self.hass, SIGNAL_ADD_BATCH, batch_id)
        return batch_id

    async def async_add_grinder(self, data: Dict[str, Any]) -> str:
        """Register a grinder profile."""
        grinder_id = self._generate_id("grinder", data.get("model_name", "unknown"), "grinders")
        # Initialize default maintenance states
        data["total_throughput_kg"] = 0.0
        data["current_setting"] = 0.0
        self.data["grinders"][grinder_id] = data
        await self.async_save()
        async_dispatcher_send(self.hass, SIGNAL_ADD_GRINDER, grinder_id)
        return grinder_id

    async def async_add_machine(self, data: Dict[str, Any]) -> str:
        """Register an espresso machine."""
        machine_id = self._generate_id("machine", data.get("model_name", "unknown"), "machines")
        # Initialize default maintenance states
        data["total_shot_count"] = 0
        self.data["machines"][machine_id] = data
        await self.async_save()
        async_dispatcher_send(self.hass, SIGNAL_ADD_MACHINE, machine_id)
        return machine_id

    async def async_add_brew(self, data: Dict[str, Any]) -> None:
        """Log a new espresso shot and update linked hardware/inventory automatically."""
        import uuid
        from datetime import datetime
        
        # 1. Add unique ID for deletion
        if "id" not in data:
            data["id"] = str(uuid.uuid4())
            
        # 2. Add current iso timestamp if frontend didn't provide one
        if "timestamp" not in data:
            data["timestamp"] = datetime.now().isoformat()
            
        # 3. Add to the journal list
        self.data["journal"].append(data)
        
        dose = float(data.get("dose", 0.0))
        
        # 2. Update Actice Batch Weight (Strict Dose decrement per PRD)
        batch_id = data.get("batch_id")
        if batch_id and batch_id in self.data["batches"]:
            self.data["batches"][batch_id]["used_weight"] += dose
            self.data["batches"][batch_id]["remaining_weight"] -= dose
            
        # 3. Update Grinder total throughput (kg) and save the current specific setting
        grinder_id = data.get("grinder_id")
        if grinder_id and grinder_id in self.data["grinders"]:
            self.data["grinders"][grinder_id]["total_throughput_kg"] += (dose / 1000.0)
            if "grinder_setting" in data:
                self.data["grinders"][grinder_id]["current_setting"] = float(data["grinder_setting"])
            
        # 4. Update Machine overall shot count
        machine_id = data.get("machine_id")
        if machine_id and machine_id in self.data["machines"]:
            self.data["machines"][machine_id]["total_shot_count"] += 1
            
        await self.async_save()

    async def async_purge_beans(self, batch_id: str, amount: float) -> None:
        """Purge lost/wasted beans manually from the active inventory."""
        if batch_id in self.data["batches"]:
            self.data["batches"][batch_id]["used_weight"] += amount
            self.data["batches"][batch_id]["remaining_weight"] -= amount
            await self.async_save()
            
    async def async_reset_maintenance_counter(self, device_id: str, target: str) -> None:
        """Reset maintenance counters for deep cleaning / backflushing."""
        if target == "grinder" and device_id in self.data["grinders"]:
            self.data["grinders"][device_id]["total_throughput_kg"] = 0.0
            await self.async_save()
        elif target == "machine" and device_id in self.data["machines"]:
            self.data["machines"][device_id]["total_shot_count"] = 0
            await self.async_save()

    async def async_delete_brew(self, brew_id: str, return_beans: bool = False) -> None:
        """Delete a brew from history, and optionally return its beans to the batch."""
        journal = self.data["journal"]
        brew = next((b for b in journal if b.get("id") == brew_id), None)
        if not brew:
            return

        journal.remove(brew)

        if return_beans:
            batch_id = brew.get("batch_id")
            if batch_id and batch_id in self.data["batches"]:
                dose = float(brew.get("dose", 0.0))
                self.data["batches"][batch_id]["used_weight"] = max(0.0, self.data["batches"][batch_id]["used_weight"] - dose)
                self.data["batches"][batch_id]["remaining_weight"] += dose
                
        # We don't rewind grinder throughput / total machine shots generally, as the wear/tear happened.
        await self.async_save()

    async def async_deplete_batch(self, batch_id: str) -> None:
        """Mark a batch as completely empty."""
        if batch_id in self.data["batches"]:
            amount_left = self.data["batches"][batch_id]["remaining_weight"]
            self.data["batches"][batch_id]["used_weight"] += amount_left
            self.data["batches"][batch_id]["remaining_weight"] = 0.0
            await self.async_save()
