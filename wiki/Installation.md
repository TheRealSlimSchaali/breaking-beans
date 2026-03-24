# Installation

Breaking Beans is built as a Home Assistant Custom Component. The easiest and recommended way to install it is via **HACS** (Home Assistant Community Store).

## Option 1: HACS (Recommended)

1. Open **HACS** in your Home Assistant sidebar.
2. Navigate to **Integrations**.
3. Click the **Custom Repositories** icon (three dots in the top right corner).
4. Add the following repository URL: `TheRealSlimSchaali/breaking-beans`
5. Select **Integration** as the category.
6. Click **Add**.
7. Close the modal, find **Breaking Beans** in the HACS store, and click **Download**.
8. **Restart Home Assistant** to load the custom component into memory.
9. Go to **Settings** -> **Devices & Services** -> **Add Integration** and search for **Breaking Beans**.

## Option 2: Manual Installation

If you prefer not to use HACS, you can install the integration manually:

1. Download the latest release from the GitHub repository.
2. Extract the `custom_components/breaking_beans` folder into your Home Assistant's `custom_components` directory.
   *(If the folder doesn't exist, create it in your `config` directory)*
3. **Restart Home Assistant**.
4. Go to **Settings** -> **Devices & Services** -> **Add Integration** and search for **Breaking Beans**.

## Next Steps
Once Breaking Beans is installed and running, proceed to the [Configuration Guide](Configuration) to set up your Lovelace dashboard and initial database.
