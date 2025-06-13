// @ts-ignore @TODO: add declaration file for watermarkjs
import watermarkImage from 'watermarkjs';
import { blobToURL, fromURL } from 'image-resize-compress';
import { ImageFileType } from '../../types/ImageFileType';

export const resizeImage = async (imageBlob: string) => {
    const quality = 100;
    const width = 'auto';
    const height = 'auto';
    const format = 'jpeg';

    const resizedBlob = await fromURL(imageBlob, quality, width, height, format);
    const url = await blobToURL(resizedBlob);

    return {
        url,
        size: resizedBlob.size,
        type: resizedBlob.type,
    };
};

export const addWatermark = async (options: { image: File, watermarkUrl?: string, watermarkText?: string }): Promise<ImageFileType | undefined> => {
    try {
        const { image, watermarkUrl, watermarkText = 'Default watermark' } = options;
        const params = {
            init(img: any) {
                img.crossOrigin = 'anonymous'
            },
        }

        if (options.watermarkUrl) {
            const wt = await watermarkImage([image, watermarkUrl], params)
                .image(watermarkImage.image.center(0.5));

            const resizedFile = await resizeImage(wt.src);
            const newFile: ImageFileType = {
                url: resizedFile.url as string,
                size: resizedFile.size,
                type: resizedFile.type,
                name: image.name,
                lastModified: image.lastModified,
            }

            return newFile;
        }
        const wt = await watermarkImage([image], params)
            .image(watermarkImage.text.center(watermarkText, '28px serif', '#fff', 0.5));

        const resizedFile = await resizeImage(wt.src);
        const newFile: ImageFileType = {
            url: resizedFile.url as string,
            size: resizedFile.size,
            type: resizedFile.type,
            name: image.name,
            lastModified: image.lastModified,
        }

        return newFile;
    } catch (error) {
        console.error(error);
    }
};
