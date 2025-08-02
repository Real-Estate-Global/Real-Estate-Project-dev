export type ImageFileType = {
    url: string;
    size: number;
    type: string;
    name: string;
    lastModified: number;
    key: string; // Optional, used for S3 keys
};

export type WatermarkType = string | ImageFileType | null | undefined;