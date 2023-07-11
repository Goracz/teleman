// @ts-ignore
import ColorThief from 'colorthief';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

import { rgbToHex } from './utils';

type FetcherArgs = Omit<RequestInit, 'body'> & { body?: any };

export const fetcher = async <T>(url: string, args: FetcherArgs = {}): Promise<T> => {
    const modifiedArgs = { ...args };
    const token = localStorage.getItem('token');
    if (token) {
        modifiedArgs.headers = {
            ...modifiedArgs.headers,
            Authorization: `Bearer ${token}`,
        };
    }
    if (args.body) {
        modifiedArgs.body = JSON.stringify(args.body);
        modifiedArgs.headers = {
            ...modifiedArgs.headers,
            'Content-Type': 'application/json',
        };
    }
    const response = await fetch(url, modifiedArgs);
    return await response.json();
};

export const useImage = (imageUrl?: string): HTMLImageElement | undefined => {
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (!imageUrl) return;

        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageUrl;

        img.onload = () => {
            setImage(img as any);
        };
    }, [imageUrl]);

    return image as any;
};

export const useHumanizedSeconds = (secondsToHumanize?: number): string | undefined => {
    return useMemo(() => {
        return secondsToHumanize ? moment.duration(secondsToHumanize, 'seconds').humanize() : undefined;
    }, [secondsToHumanize])
};

export const useDominantColor = (image?: HTMLImageElement, opacity: number = 100): string | undefined => {
    if (!image) return;

    const dominantColor = new ColorThief().getColor(image);
    return rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2], opacity);
};
