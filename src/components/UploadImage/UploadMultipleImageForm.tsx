import { Button } from "primereact/button";
import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, ItemTemplateOptions } from "primereact/fileupload"
import { ProgressBar } from "primereact/progressbar";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip"
import { useEffect, useRef, useState } from "react";
import { blobToURL, fromURL } from 'image-resize-compress';
import { ImageFileType } from "../../types/ImageFileType";
import watermarkImage from 'watermarkjs';
import { addWatermark } from "./utils";


type Props = {
    initialImages?: ImageFileType[];
    onUpload: (files: ImageFileType[]) => void;
    watermark?: string | ImageFileType;
}
const resizeImage = async (imageBlob: string) => {
    const quality = 60;
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

export const UploadMultipleImageForm: React.FC<Props> = ({
    initialImages = [],
    onUpload,
    watermark
}) => {
    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState<ImageFileType[]>(initialImages);
    const fileUploadRef = useRef(null);

    useEffect(() => {
        onUpload(uploadedFiles);
    }, [uploadedFiles, onUpload, watermark]);

    useEffect(() => {
        // @ts-ignore
        if (fileUploadRef.current && initialImages.length > 0) {
            const fileUploadInstance = fileUploadRef.current as any;
            const newFiles = initialImages.map(image => ({
                name: image.name,
                objectURL: image.url,
                url: image.url,
                size: image.size,
                type: image.type,
                lastModified: image.lastModified,
            }))
            setTotalSize(newFiles.reduce((acc, file) => acc + file.size, 0));

            fileUploadInstance.setUploadedFiles(newFiles);
        }
    }, [initialImages, fileUploadRef]);

    const onTemplateSelect = async (e: FileUploadSelectEvent) => {
        let _totalSize = 0;
        let files = e.files;
        const resizedFiles = []

        for (let file of files) {
            const watermarkUrl = 'https://media-hosting.imagekit.io/0ecef4194db74725/favicon2%20(1).png?Expires=1839591324&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=I9bf3NtcweLFPgL6nGm1KF1YHTrGjR9sctbljjm-kaJ2ptmRSV2IlQAyIFVNLUCHC-kYwmpDALqjnka3-W-2cMhH8CSokCb~KWls3ctp3BaMeDiQ-nrQnR~8ui-UgVCTZi95XrPE-xg8eZ8bGyike0n2PqF45qcRNGCtOnWN5Im6NoafDrdrd5qyFG-Tp0-C0380SP~RltN084FgwqtctEsMAyAWk51jhA-9NJdFBSVk5ycTuu30bfvQQ6KlQF~xdmp1zzBT5W78DKmHpVyt2ABiMZj9OSxGECTC4PGeEJEmEKGJI6MzOY79pzULuJRfmAS2fiPwYttv4zvTfE-5UA__'
            const options = {
                init(img: any) {
                    img.crossOrigin = 'anonymous'
                },
            };
            const wt = await watermarkImage([file, watermarkUrl], options)
                .image(watermarkImage.image.center(0.5));

            // @ts-ignore
            const resizedFile = await resizeImage(wt.src);

            const newFile: ImageFileType = {
                ...resizedFile,
                name: file.name,
                lastModified: file.lastModified,
            } as any;
            resizedFiles.push(newFile)
            _totalSize += resizedFile.size || 0;

            const watermark2 = await addWatermark({ image: file })
            // @ts-ignore
           // console.log('wt.src', wt.src)
           // console.log('watermark2', watermark2)
           // console.log('file', file)
            const resizedFile2 = await resizeImage(watermark2?.previewUrl);
            const newFile2: ImageFileType = {
                ...resizedFile2,
                name: file.name,
                lastModified: file.lastModified,
            } as any;
            //resizedFiles.push(newFile2)
        }

        setUploadedFiles(resizedFiles as ImageFileType[]);
        setTotalSize(_totalSize);
    };

    const onTemplateRemove = (file: File, callback: any) => {
        const resizedFile = uploadedFiles.find(f => f.name === file.name);

        if (resizedFile) {
            setTotalSize(totalSize - resizedFile.size);
            setUploadedFiles(uploadedFiles.filter(f => f.name !== resizedFile.name));
        }

        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 20000;

        const formattedTotalSize = (totalSize / (1024 * 1024)).toFixed(2) + ' MB';
        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex flex-column align-items-center gap-3 ml-auto">
                    <span>{formattedTotalSize} / 2 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (file: any, props: ItemTemplateOptions) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '60%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={260} height={260} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => {
                    onTemplateRemove(file, props.onRemove)
                }} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop Image Here
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined', style: { display: 'none' } };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    return (
        <div>
            <Toast ref={toast}></Toast>

            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

            <FileUpload mode={"advanced"} ref={fileUploadRef} name="images" multiple accept="image/*" maxFileSize={5000000}
                onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
        </div>
    )
}