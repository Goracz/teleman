import { ResponseInfo } from '../channels/ResponseInfo';

export interface SoftwareInformation extends ResponseInfo {
    product_name: string;
    model_name: string;
    sw_type: string;
    major_ver: string;
    minor_ver: string;
    country: string;
    country_group: string;
    device_id: string;
    auth_flag: string;
    ignore_disable: string;
    eco_info: string;
    config_key: string;
    language_code: string;
};
