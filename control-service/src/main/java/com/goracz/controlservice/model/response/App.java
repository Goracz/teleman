package com.goracz.controlservice.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class App {
    private int networkStableTimeout;
    private boolean checkUpdateOnLaunch;
    private Collection<String> requiredPermissions;
    @JsonProperty("class")
    private AppClass appClass;
    private String title;
    private boolean allowWidget;
    private String icon;
    private String tileSize;
    private boolean inAppSetting;
    private boolean closeOnRotation;
    private int nativeLifeCycleInterfaceVersion;
    private String folderPath;
    private boolean transparent;
    private String version;
    private String trustLevel;
    private boolean hasPromotion;
    private boolean enableCBSPolicy;
    private boolean lockable;
    private boolean systemApp;
    private String mediumLargeIcon;
    private String main;
    private boolean visible;
    private boolean privilegedJail;
    private boolean inspectable;
    private String defaultWindowType;
    private String vendor;
    private Accessibility accessibility;
    private String deeplinkingParams;
    private String type;
    private String supportTouchMode;
    private boolean spinnerOnLaunch;
    private int installTime;
    private String id;
    private boolean disableBackHistoryAPI;
    private boolean enableBackgroundRun;
    private boolean handlesRelaunch;
    private boolean noSplashOnLaunch;
    private String useCORSWhitelist;
    private boolean removable;
    @JsonProperty("CPApp")
    private boolean cPApp;
    private Object uiRevision;
    private boolean unmovable;
    private String extraLargeIcon;
    private PreviewMetadata previewMetadata;
    private String requiredEULA;
    private String bgImage;
    private String largeIcon;
    private boolean internalInstallationOnly;
    private String iconColor;
    private String resolution;
    private boolean standAloneLaunchable;
    private String storageUseMode;
    @JsonProperty("appsize")
    private int appSize;
    private int binId;
    private String splashBackground;
    private String bgColor;
    private String dialAppName;
    private String v8SnapshotFile;
    private boolean useNativeScroll;
    private boolean enablePigScreenSaver;
    @JsonProperty("usePrerendering")
    private boolean usePreRendering;
    private String sysAssetsBasePath;
    private boolean supportPortraitMode;
    private String voiceControl;
    private boolean supportQuickStart;
    private WindowGroup windowGroup;
    private MediaExtension mediaExtension;
    private boolean resolutionIndependent;
    private boolean handleExitKey;
    private String appDescription;
    private boolean supportTouchInputDevice;
    @JsonProperty("miniicon")
    private String miniIcon;
    private boolean supportRollingScreenMode;
    private boolean supportsVoiceBrowsing;
    private Collection<MimeType> mimeTypes;
    private int requiredMemory;
    private boolean handleScreenRemoteKey;
    private BootLaunchParams bootLaunchParams;
    private boolean useGraphicCamera;
    private boolean useCamera;
    private boolean allowAudioCapture;
    private boolean allowVideoCapture;
    private String imageForRecents;
    private int suspendDOMTime;
    private VendorExtension vendorExtension;
    private String mediumIcon;
    private Collection<KeyFilterTable> keyFilterTable;
}
