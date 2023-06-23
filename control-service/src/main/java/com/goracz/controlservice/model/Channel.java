package com.goracz.controlservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.goracz.controlservice.model.response.CASystemIDList;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Channel {
    private String channelNumber;
    private int majorNumber;
    private int minorNumber;
    private String chanCode;
    private String channelName;
    private int physicalNumber;
    private int sourceIndex;
    private String channelType;
    private int channelTypeId;
    private String channelMode;
    private int channelModeId;
    private String signalChannelId;
    private boolean descrambled;
    private boolean skipped;
    private boolean locked;
    private boolean fineTuned;
    private boolean satelliteLcn;
    private int shortCut;
    private boolean scrambled;
    private int serviceType;
    private int display;
    @JsonProperty("ONID")
    private int oNID;
    @JsonProperty("TSID")
    private int tSID;
    @JsonProperty("SVCID")
    private int sVCID;
    private String callSign;
    private String ipChanServerUrl;
    private boolean payChan;
    @JsonProperty("IPChannelCode")
    private String iPChannelCode;
    private String ipCallNumber;
    private boolean otuFlag;
    private int adFlag;
    @JsonProperty("HDTV")
    private boolean hDTV;
    @JsonProperty("Invisible")
    private boolean invisible;
    @JsonProperty("DTV")
    private boolean dTV;
    @JsonProperty("ATV")
    private boolean aTV;
    @JsonProperty("Data")
    private boolean data;
    @JsonProperty("Radio")
    private boolean radio;
    @JsonProperty("Numeric")
    private boolean numeric;
    @JsonProperty("PrimaryCh")
    private boolean primaryCh;
    @JsonProperty("TV")
    private boolean tV;
    private int configurationId;
    private String satelliteName;
    @JsonProperty("Bandwidth")
    private int bandwidth;
    @JsonProperty("Frequency")
    private int frequency;
    private boolean specialService;
    @JsonProperty("CASystemIDListCount")
    private int cASystemIDListCount;
    private String channelGenreCode;
    private String channelLogoSize;
    private String imgUrl;
    private String imgUrl2;
    private int favoriteIdxA;
    private int favoriteIdxB;
    private int favoriteIdxC;
    private int favoriteIdxD;
    private int favoriteIdxE;
    private int favoriteIdxF;
    private int favoriteIdxG;
    private int favoriteIdxH;
    private String waterMarkUrl;
    private String ipChanType;
    private boolean ipChanInteractive;
    private String ipChanCategory;
    private String channelNameSortKey;
    private String ipChanCpId;
    private String playerService;
    private boolean configured;
    private int adultFlag;
    private int isFreeviewPlay;
    private int hasBackward;
    private boolean numUnSel;
    private boolean rfIpChannel;
    private ArrayList<Integer> groupIdList;
    private String lastUpdated;
    private String channelId;
    private ArrayList<Object> favoriteGroup;
    private String programId;
    @JsonProperty("CASystemIDList")
    @JsonIgnore
    private CASystemIDList cASystemIDList;
}
