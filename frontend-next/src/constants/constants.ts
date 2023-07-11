export class Constants {
    // Text
    public static readonly UNKNOWN_VALUE_TEXT = 'Unknown';
    public static readonly NOT_AVAILABLE_TEXT = 'N/A';
    public static readonly LOADING_TEXT = 'Loading...';

    // Service base URLs
    public static readonly INTERFACE_BASE_URL = import.meta.env.VITE_INTERFACE_BASE_URL;
    public static readonly CONTROL_SERVICE_BASE_URL = import.meta.env.VITE_CONTROL_SERVICE_BASE_URL
    public static readonly STATISTICS_SERVICE_BASE_URL = import.meta.env.VITE_STATISTICS_SERVICE_BASE_URL
    public static readonly META_DATA_SERVICE_BASE_URL = import.meta.env.VITE_META_DATA_SERVICE_BASE_URL
    public static readonly AUTOMATION_SERVICE_BASE_URL = import.meta.env.VITE_AUTOMATION_SERVICE_BASE_URL
};
