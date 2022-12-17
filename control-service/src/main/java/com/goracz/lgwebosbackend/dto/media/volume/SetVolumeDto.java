package com.goracz.lgwebosbackend.dto.media.volume;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class SetVolumeDto implements Serializable {
    private int volume;
}
