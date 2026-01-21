import React, { useState } from 'react'
import CloudUpload from "../../../images/cloudUpload.png";
import HourglassImg from "../../../images/hourglassImg.png";
import UploadedImg from "../../../images/uploadedImage.png";
import Papa from "papaparse";
import Dropzone from "react-dropzone";

import style from './index.module.scss'
const CommonDropZone = ({ title, description, changeHandler, maxFiles, isDisabled }) => {

    const dropzoneStyle = {
        width: "100%",
        height: "auto",
        borderWidth: 2,
        borderColor: "rgb(102, 102, 102)",
        borderStyle: "dashed",
        borderRadius: 5,
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
            maxFiles={maxFiles ? maxFiles : 3}
            onDropRejected={(fileRejections) => {
                alert(`You can upload only ${maxFiles ? maxFiles : 3} files at a time`);
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