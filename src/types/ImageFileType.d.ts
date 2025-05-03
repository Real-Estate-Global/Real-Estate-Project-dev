export type ImageFileType = {
    url: string;
    size: number;
    type: string;
    name: string;
    lastModified: number;
};

export type WatermarkType = string | ImageFileType