import { SoftwareType } from './software-type';

export interface SoftwareInformation {
    returnValue: boolean;
    product_name: string;
    model_name: string;
    sw_type: SoftwareType;
    major_ver: string;
    minor_ver: string;
    country: string;
    country_group: string;
    /**
     * MAC address of the device
     */
    device_id: string;
    auth_flag: 'Y' | 'N';
    ignore_disable: 'Y' | 'N';
    eco_info: string;
    config_key: string;
    language_code: string;
};
