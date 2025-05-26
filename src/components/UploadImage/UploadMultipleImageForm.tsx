import { Button } from "primereact/button";
import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, ItemTemplateOptions } from "primereact/fileupload"
import { ProgressBar } from "primereact/progressbar";
import { Tooltip } from "primereact/tooltip"
import { useEffect, useRef, useState } from "react";

import { ImageFileType } from "../../types/ImageFileType";

import { addWatermark } from "./utils";
import { Loader } from "../Loader";


type Props = {
    initialImages?: ImageFileType[];
    onUpload: (files: ImageFileType[]) => void;
    watermark: ImageFileType | null;
}

export const UploadMultipleImageForm: React.FC<Props> = ({
    initialImages = [],
    onUpload,
    watermark
}) => {
    const [totalSize, setTotalSize] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState<ImageFileType[]>(initialImages);
    const fileUploadRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
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

    useEffect(() => {
        if (fileUploadRef.current) {
            setIsLoading(true);
            const fileUploadInstance = fileUploadRef.current as any;
            fileUploadInstance.clear();
            setTotalSize(uploadedFiles.reduce((acc, file) => acc + file.size, 0));
            fileUploadInstance.setUploadedFiles(uploadedFiles.map(file => ({ ...file, objectURL: file.url })));

            setTimeout(() => {
                setIsLoading(false);
            }, 200);
        }

        onUpload(uploadedFiles);
    }, [uploadedFiles, fileUploadRef]);

    const onTemplateSelect = async (e: FileUploadSelectEvent) => {
        setIsLoading(true);
        let _totalSize = 0;
        let files = e.files;
        const resizedFiles: ImageFileType[] = []

        for (let file of files) {
            const newFile = await addWatermark({ image: file, watermarkUrl: watermark?.url })

            if (newFile) {
                resizedFiles.push(newFile)
                _totalSize += newFile.size || 0;
            }
        }

        setUploadedFiles(uploadedFiles => uploadedFiles.concat(resizedFiles));
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
                <div style={{ position: 'absolute', top: 0, left: 0, width: '500px' }}><Loader key={1} show={isLoading} /></div>
                <div className="flex align-items-center" style={{ width: '60%' }}>
                    <div>
                        <img alt={file.name} role="presentation" src={file.objectURL} width={260} height={260} />
                    </div>
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