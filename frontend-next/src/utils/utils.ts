export const rgbToHex = (r: number, g: number, b: number, opacity: number = 100): string => {
    let alpha = Math.round(opacity * 255 / 100);
    let hexAlpha = alpha.toString(16).padStart(2, '0');

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1) + hexAlpha;
}
