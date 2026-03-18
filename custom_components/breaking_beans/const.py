"""Constants for the Breaking Beans integration."""

DOMAIN = "breaking_beans"

# Storage constants
STORAGE_KEY = f"{DOMAIN}_database.json"
STORAGE_VERSION = 1

# Services
SERVICE_ADD_BREW = "add_brew"
SERVICE_ADD_BEAN_OPTION = "add_bean_option"
SERVICE_ADD_BEAN_BATCH = "add_bean_batch"
SERVICE_ADD_GRINDER = "add_grinder"
SERVICE_ADD_MACHINE = "add_machine"
SERVICE_PURGE_BEANS = "purge_beans"
SERVICE_RESET_MAINTENANCE = "reset_maintenance_counter"
SERVICE_DELETE_BREW = "delete_brew"
SERVICE_DEPLETE_BATCH = "deplete_batch"

# Data dict keys
DATA_STORE = "store"

# Signals for dynamic UI updates (Dispatcher)
SIGNAL_UPDATE_BREAKING_BEANS = "breaking_beans_updated"
SIGNAL_ADD_GRINDER = "breaking_beans_add_grinder"
SIGNAL_ADD_MACHINE = "breaking_beans_add_machine"
SIGNAL_ADD_BATCH = "breaking_beans_add_batch"
SIGNAL_ADD_BEAN_OPTION = "breaking_beans_add_bean_option"

# Platforms
PLATFORMS = ["sensor", "binary_sensor"]
