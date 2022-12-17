package com.goracz.lgwebosbackend.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class SoftwareInformationResponse {
    private boolean returnValue;
    private String product_name;
    private String model_name;
    private String sw_type;
    private String major_ver;
    private String minor_ver;
    private String country;
    private String country_group;
    private String device_id;
    private String auth_flag;
    private String ignore_disable;
    private String eco_info;
    private String config_key;
    private String language_code;
}
