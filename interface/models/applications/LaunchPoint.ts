import { PreviewMetadata } from './PreviewMetadata';

export interface LaunchPoint {
    mediumLargeIcon: string;
    bgColor: string;
    installTime: number;
    systemApp: boolean;
    appDescription: string;
    launchPointId: string;
    bgImages: unknown[];
    lptype: string;
    relaunch: boolean;
    favicon: string;
    previewMetadata: PreviewMetadata;
    icon: string;
    removable: boolean;
    bgImage: string;
    largeIcon: string;
    id: string;
    iconColor: string;
    tileSize: string;
    userData: string;
    params: unknown;
    unmovable: boolean;
    extraLargeIcon: string;
    imageForRecents: string;
    miniicon: string;
    title: string;
};
