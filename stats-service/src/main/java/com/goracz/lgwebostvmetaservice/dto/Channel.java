package com.goracz.lgwebostvmetaservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Channel {
    private String id;
    private String name;
    private String site;
    private String lang;
    private String logo;
    private String url;
}
