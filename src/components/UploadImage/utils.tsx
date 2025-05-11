import Watermark from "@be-tech/watermarkjs";

export const addWatermark = async (options: { image: File }) => {
    try {
        const { image } = options
        const params = {
            init(img: any) {
                img.crossOrigin = 'anonymous'
            },
        };
        // pass the image to apply watermark
        const watermark = Watermark.load(image);

        await watermark.applyText({
            text: "Watermark Text",
            position: "center",
            style: {
                size: "48px",
                family: "Arial",
                color: "rgba(255, 255, 255, 0.5)", // Transparent white
            }
        });

        // get the image with all watermark added
        const watermarked = watermark.result;
        return watermarked
    } catch (error) {
        console.error(error);
    }
};
