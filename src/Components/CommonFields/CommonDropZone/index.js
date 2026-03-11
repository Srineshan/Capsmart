import React, { useState } from 'react'
import CloudUpload from "../../../images/cloudUpload.png";
import HourglassImg from "../../../images/hourglassImg.png";
import UploadedImg from "../../../images/uploadedImage.png";
import Papa from "papaparse";
import Dropzone from "react-dropzone";

import style from './index.module.scss'
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const CommonDropZone = ({ title, description, changeHandler, maxFiles, isDisabled }) => {

    const dropzoneStyle = {
        width: "100%",
        height: "auto",
        borderWidth: 2,
        borderColor: "rgb(102, 102, 102)",
        borderStyle: "dashed",
        borderRadius: 5,
    }

    const getRejectionErrorMessage = (fileRejections) => {
        const hasFileTooLarge = fileRejections.some(({ errors }) =>
            errors.some((err) => err.code === 'file-too-large')
        );
        const hasTooManyFiles = fileRejections.some(({ errors }) =>
            errors.some((err) => err.code === 'too-many-files')
        );
        if (hasFileTooLarge) {
            return 'File size must be less than 5 MB.';
        }
        if (hasTooManyFiles) {
            return `You can upload only ${maxFiles ?? 10} files at a time`;
        }
        return 'One or more files could not be uploaded. Please check file type and size.';
    }

    return (
        <Dropzone
            disabled={isDisabled}
            style={dropzoneStyle}
            onDrop={(acceptedFiles) => changeHandler(acceptedFiles)}
            accept={{
                'image/jpeg': [],
                'image/png': [],
                'image/jpg': [],
                'application/pdf': []
            }}
            maxFiles={maxFiles ?? 10}
            maxSize={MAX_FILE_SIZE_BYTES}
            onDropRejected={(fileRejections) => {
                alert(getRejectionErrorMessage(fileRejections));
            }}
        >
            {({ getRootProps, getInputProps }) => (
                <section>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {/* {files?.length === 0 ? ( */}
                        <div className={`${style.uploadBorderStyle} ${style.cursorPointer}`}>
                            <p className={style.uploadTextStyle}>
                                {title}
                            </p>

                            <p className={style.uploadDescriptionText}>
                                {description}
                            </p>
                        </div>
                        {/* ) : (
                            <div className={style.uploadBorderStyle}>
                                <p className={style.uploadTextStyle}>
                                    Records Successfully Uploaded
                                </p>

                                <p className={style.uploadDescriptionText}>
                                    {description}
                                </p>
                            </div>
                        )} */}
                    </div>
                </section>
            )}
        </Dropzone>
    )
}

export default CommonDropZone;