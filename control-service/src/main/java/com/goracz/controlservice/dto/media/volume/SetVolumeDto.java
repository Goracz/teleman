package com.goracz.controlservice.dto.media.volume;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class SetVolumeDto implements Serializable {
    private int volume;
}
