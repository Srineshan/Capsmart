import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { Dialog, Classes } from "@blueprintjs/core";
import RedAlert from "../../../images/redAlert.png";
import BlueInfo from "../../../images/blueInfo.png";

import style from "./index.module.scss";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const CommonDropZone = ({
    title,
    description,
    changeHandler,
    maxFiles,
    isDisabled,
}) => {
    const [showSizeErrorDialog, setShowSizeErrorDialog] = useState(false);
    const [rejectedFileNames, setRejectedFileNames] = useState([]);
    const [showHelpDialog, setShowHelpDialog] = useState(false);

    const dropzoneStyle = {
        width: "100%",
        height: "auto",
        borderWidth: 2,
        borderColor: "rgb(102, 102, 102)",
        borderStyle: "dashed",
        borderRadius: 5,
    };

    const getRejectionErrorMessage = (fileRejections) => {
        const hasFileTooLarge = fileRejections.some(({ errors }) =>
            errors.some((err) => err.code === "file-too-large")
        );
        const hasTooManyFiles = fileRejections.some(({ errors }) =>
            errors.some((err) => err.code === "too-many-files")
        );
        if (hasFileTooLarge) {
            return "File size must be less than 5 MB.";
        }
        if (hasTooManyFiles) {
            return `You can upload only ${maxFiles ?? 10} files at a time`;
        }
        return "One or more files could not be uploaded. Please check file type and size.";
    };

    const handleDropRejected = (fileRejections) => {
        const tooLargeFiles = fileRejections.filter(({ errors }) =>
            errors.some((err) => err.code === "file-too-large")
        );

        if (tooLargeFiles.length > 0) {
            setRejectedFileNames(tooLargeFiles.map((f) => f.file?.name || ""));
            setShowSizeErrorDialog(true);
            return;
        }

        // For other rejection reasons, keep the existing generic message
        // (max files, invalid type, etc.)
        // eslint-disable-next-line no-alert
        alert(getRejectionErrorMessage(fileRejections));
    };

    return (
        <>
            <Dropzone
                disabled={isDisabled}
                style={dropzoneStyle}
                onDrop={(acceptedFiles) => changeHandler(acceptedFiles)}
                accept={{
                    "image/jpeg": [],
                    "image/png": [],
                    "image/jpg": [],
                    "application/pdf": [],
                }}
                maxFiles={maxFiles ?? 10}
                maxSize={MAX_FILE_SIZE_BYTES}
                onDropRejected={handleDropRejected}
            >
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <div className={`${style.uploadBorderStyle} ${style.cursorPointer}`}>
                                <p className={style.uploadTextStyle}>{title}</p>

                                <p className={style.uploadDescriptionText}>{description}</p>
                            </div>
                        </div>
                    </section>
                )}
            </Dropzone>

            <Dialog
                isOpen={showSizeErrorDialog}
                onClose={() => setShowSizeErrorDialog(false)}
                className={`${style.errorDialog} ${style.errorDialogBackground}`}
                canOutsideClickClose={false}
                canEscapeKeyClose={true}
            >
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.sizeErrorHeader}>
                        <span className={style.sizeErrorIcon}>
                            <img src={RedAlert} alt="alert" className={style.sizeErrorIconImg} />
                        </span>
                        <span className={style.sizeErrorTitle}>Document Upload Failed</span>
                    </div>

                    <p className={style.sizeErrorMainText}>
                        The documents listed below exceed the maximum file size (5 MB) allowed by
                        the system.
                    </p>

                    <p className={style.sizeErrorSubText}>
                        These documents have not been uploaded for processing.
                    </p>

                    {rejectedFileNames?.length > 0 && (
                        <ol className={style.sizeErrorList}>
                            {rejectedFileNames.map((name, index) => (
                                <li key={`${name}-${index}`}>{name || "Unnamed file"}</li>
                            ))}
                        </ol>
                    )}

                    <p className={style.sizeErrorSubText}>
                        Please retry uploading the failed documents after compressing their size.
                    </p>

                    <button
                        type="button"
                        className={style.sizeErrorHelpLink}
                        onClick={() => {
                            setShowHelpDialog(true);
                        }}
                    >
                        Click here to get help reducing your file size
                    </button>

                    <div className={style.sizeErrorActions}>
                        <button
                            type="button"
                            className={style.secondaryButton}
                            onClick={() => setShowSizeErrorDialog(false)}
                        >
                            I WILL DO THIS LATER
                        </button>
                        <button
                            type="button"
                            className={style.primaryButton}
                            onClick={() => setShowSizeErrorDialog(false)}
                        >
                            OKAY
                        </button>
                    </div>
                </div>
            </Dialog>

            <Dialog
                isOpen={showHelpDialog}
                onClose={() => setShowHelpDialog(false)}
                className={`${style.errorDialog} ${style.errorDialogBackground}`}
                canOutsideClickClose={true}
                canEscapeKeyClose={true}
            >
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.helpHeader}>
                        <span className={style.helpIcon}>
              <img src={BlueInfo} alt="info" className={style.helpIconImg} />
                        </span>
                        <span className={style.helpTitle}>How to Reduce Document File Size</span>
                    </div>

                    <p className={style.helpIntro}>
                        If your file exceeds 5 MB, try one of the following methods:
                    </p>

                    <div className={style.helpSection}>
                        <div className={style.helpSectionTitle}>Take a new photo or scan</div>
                        <div className={style.helpSectionSubtitle}>
                            If the document was scanned or photographed:
                        </div>
                        <ol className={style.helpOrderedList}>
                            <li>Take a new photo using standard or medium quality.</li>
                            <li>Crop the image to remove extra background around the document.</li>
                        </ol>
                    </div>

                    <div className={style.helpSection}>
                        <div className={style.helpSectionTitle}>
                            Use an Online Tool to Reduce the File Size
                        </div>
                        <ol className={style.helpOrderedList}>
                            <li>Open your web browser (Chrome, Edge, Safari, etc.).</li>
                            <li>
                                Go to{" "}
                                <a
                                    href="https://www.ilovepdf.com/compress_pdf"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    www.ilovepdf.com/compress_pdf
                                </a>{" "}
                                or{" "}
                                <a
                                    href="https://www.iloveimg.com/compress-image"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    www.iloveimg.com/compress-image
                                </a>
                                .
                            </li>
                            <li>
                                Click <strong>Select File</strong> and choose the document from your
                                computer.
                            </li>
                            <li>Click <strong>Compress</strong>.</li>
                            <li>
                                Once the compressed file is ready, download it to your computer.
                            </li>
                            <li>Upload the new file in the application.</li>
                        </ol>
                    </div>

                    <div className={style.helpActions}>
                        <button
                            type="button"
                            className={style.primaryButton}
                            onClick={() => setShowHelpDialog(false)}
                        >
                            CLOSE
                        </button>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default CommonDropZone;