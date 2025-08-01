
import React, { useEffect, useState } from 'react';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { ImageFileType } from '../../types/ImageFileType';
import { Image } from 'primereact/image';

type Props = {
    name?: string;
    initialImage?: ImageFileType;
    onUpload: (file: ImageFileType) => void;
}
export const UploadImage = (props: Props) => {
    const { name, initialImage = null, onUpload } = props;
    const [uploadedFile, setUploadedFile] = useState<ImageFileType | null>(initialImage);

    useEffect(() => {
        if (uploadedFile) {
            onUpload(uploadedFile);
        }
    }, [uploadedFile, onUpload]);

    const customBase64Uploader = async (event: FileUploadHandlerEvent) => {
        const file = event.files[0];
        const reader = new FileReader();

        // @ts-ignore
        let blob = await fetch(file.objectURL).then((r) => r.blob());

        reader.readAsDataURL(blob);

        reader.onloadend = function () {
            const base64data = reader.result;
            if (base64data && typeof base64data === 'string') {
                setUploadedFile({
                    name: file.name,
                    lastModified: file.lastModified,
                    size: file.size,
                    type: file.type,
                    url: base64data
                })
            } else {
                setUploadedFile(null);
            }
        };
    };

    // TODO: improve X styles
    return (
        <div className="card flex justify-content-center">
            {uploadedFile ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <Image
                        src={uploadedFile.url}
                        zoomSrc={uploadedFile.url}
                        alt={uploadedFile.name}
                        width="80"
                        height="80"
                        preview
                    />
                    <button
                        type="button"
                        onClick={() => setUploadedFile(null)}
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0,
                        }}
                        aria-label="Remove image"
                    >
                        <i className="pi pi-times" />
                    </button>
                </div>) : <FileUpload auto mode="basic" name={name || 'uploadImage'} accept="image/*" customUpload uploadHandler={customBase64Uploader} />}
        </div>
    )
}