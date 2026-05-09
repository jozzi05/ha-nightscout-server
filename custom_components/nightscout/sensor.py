"""Nightscout sensors."""

from __future__ import annotations

from collections.abc import Callable
from datetime import datetime
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.typing import StateType
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import ATTR_DIRECTION, ATTR_RAW_MGDL, DOMAIN
from .coordinator import NightscoutCoordinator
from .parsers import NightscoutData

PARALLEL_UPDATES = 0


def _glucose_device_class() -> SensorDeviceClass | None:
    """Return glucose device class when supported by this Home Assistant version."""
    return getattr(SensorDeviceClass, "BLOOD_GLUCOSE_CONCENTRATION", None)


GLUCOSE_DESCRIPTION = SensorEntityDescription(
    key="glucose",
    translation_key="glucose",
    state_class=SensorStateClass.MEASUREMENT,
    device_class=_glucose_device_class(),
)

DELTA_DESCRIPTION = SensorEntityDescription(
    key="delta",
    translation_key="delta",
    state_class=SensorStateClass.MEASUREMENT,
)

IOB_DESCRIPTION = SensorEntityDescription(
    key="iob",
    translation_key="iob",
    native_unit_of_measurement="U",
    suggested_display_precision=2,
    state_class=SensorStateClass.MEASUREMENT,
)

COB_DESCRIPTION = SensorEntityDescription(
    key="cob",
    translation_key="cob",
    native_unit_of_measurement="g",
    suggested_display_precision=1,
    state_class=SensorStateClass.MEASUREMENT,
)

LAST_READING_DESCRIPTION = SensorEntityDescription(
    key="last_reading",
    translation_key="last_reading",
    device_class=SensorDeviceClass.TIMESTAMP,
)

PROFILE_DESCRIPTION = SensorEntityDescription(
    key="active_profile",
    translation_key="active_profile",
)

RESERVOIR_DESCRIPTION = SensorEntityDescription(
    key="reservoir",
    translation_key="reservoir",
    native_unit_of_measurement="U",
    suggested_display_precision=1,
    state_class=SensorStateClass.MEASUREMENT,
)

PUMP_BATTERY_DESCRIPTION = SensorEntityDescription(
    key="pump_battery",
    translation_key="pump_battery",
    native_unit_of_measurement="%",
    state_class=SensorStateClass.MEASUREMENT,
)

CANNULA_DESCRIPTION = SensorEntityDescription(
    key="cannula_changed",
    translation_key="cannula_changed",
    device_class=SensorDeviceClass.TIMESTAMP,
)

SENSOR_STARTED_DESCRIPTION = SensorEntityDescription(
    key="sensor_started",
    translation_key="sensor_started",
    device_class=SensorDeviceClass.TIMESTAMP,
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Nightscout sensors."""
    coordinator: NightscoutCoordinator = hass.data[DOMAIN][entry.entry_id]

    specs: list[
        tuple[
            SensorEntityDescription,
            Callable[[NightscoutData], StateType | datetime],
            Callable[[NightscoutData], bool],
        ]
    ] = [
        (GLUCOSE_DESCRIPTION, lambda d: d.glucose, lambda d: d.glucose is not None),
        (DELTA_DESCRIPTION, lambda d: d.delta, lambda d: d.delta is not None),
        (IOB_DESCRIPTION, lambda d: d.iob, lambda d: d.iob is not None),
        (COB_DESCRIPTION, lambda d: d.cob, lambda d: d.cob is not None),
        (
            LAST_READING_DESCRIPTION,
            lambda d: d.last_reading_at,
            lambda d: d.last_reading_at is not None,
        ),
        (
            PROFILE_DESCRIPTION,
            lambda d: d.active_profile,
            lambda d: d.active_profile is not None,
        ),
        (RESERVOIR_DESCRIPTION, lambda d: d.reservoir, lambda d: d.reservoir is not None),
        (
            PUMP_BATTERY_DESCRIPTION,
            lambda d: d.pump_battery_percent,
            lambda d: d.pump_battery_percent is not None,
        ),
        (
            CANNULA_DESCRIPTION,
            lambda d: d.cannula_changed_at,
            lambda d: d.cannula_changed_at is not None,
        ),
        (
            SENSOR_STARTED_DESCRIPTION,
            lambda d: d.sensor_started_at,
            lambda d: d.sensor_started_at is not None,
        ),
    ]

    async_add_entities(
        NightscoutSensor(coordinator, entry, desc, value_fn, avail_fn)
        for desc, value_fn, avail_fn in specs
    )


class NightscoutSensor(CoordinatorEntity[NightscoutCoordinator], SensorEntity):
    """Representation of a Nightscout sensor."""

    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator: NightscoutCoordinator,
        entry: ConfigEntry,
        description: SensorEntityDescription,
        value_fn: Callable[[NightscoutData], StateType | datetime],
        available_fn: Callable[[NightscoutData], bool],
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator)
        self.entity_description = description
        self._config_entry = entry
        self._value_fn = value_fn
        self._available_fn = available_fn
        self._attr_unique_id = f"{entry.unique_id}_{description.key}"

    @property
    def native_unit_of_measurement(self) -> str | None:
        """Dynamic units for glucose-related sensors."""
        data = self.coordinator.data
        if data is None:
            return self.entity_description.native_unit_of_measurement
        key = self.entity_description.key
        if key in ("glucose", "delta"):
            return data.glucose_unit
        return self.entity_description.native_unit_of_measurement

    @property
    def suggested_display_precision(self) -> int | None:
        """Precision for glucose vs mg/dL."""
        data = self.coordinator.data
        if data is None:
            return self.entity_description.suggested_display_precision
        key = self.entity_description.key
        if key == "glucose":
            return 1 if data.glucose_unit == "mmol/L" else 0
        if key == "delta":
            return 2 if data.glucose_unit == "mmol/L" else 1
        return self.entity_description.suggested_display_precision

    @property
    def native_value(self) -> StateType | datetime:
        """Return sensor state."""
        data = self.coordinator.data
        if data is None:
            return None
        return self._value_fn(data)

    @property
    def available(self) -> bool:
        """Return if entity is available."""
        data = self.coordinator.data
        if data is None:
            return False
        return self._available_fn(data)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Extra attributes for glucose."""
        data = self.coordinator.data
        if data is None or self.entity_description.key != "glucose":
            return {}
        attrs: dict[str, Any] = {}
        if data.direction:
            attrs[ATTR_DIRECTION] = data.direction
        if data.raw_mgdl is not None:
            attrs[ATTR_RAW_MGDL] = data.raw_mgdl
        return attrs

    @property
    def device_info(self) -> DeviceInfo:
        """Return device information."""
        version = None
        if self.coordinator.data and self.coordinator.data.nightscout_version:
            version = self.coordinator.data.nightscout_version
        return DeviceInfo(
            identifiers={(DOMAIN, self._config_entry.entry_id)},
            name=self._config_entry.title,
            manufacturer="Nightscout",
            model=version or "Nightscout",
            configuration_url=self.coordinator.base_url,
        )
