import React, { useState, useCallback, useRef, createRef, useEffect } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import FullscreenSharpIcon from '@mui/icons-material/FullscreenSharp';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import LoadingScreen from "../LoadingScreen";
import PdfDoc from "../../images/pdfDoc.png";
import ImgDoc from "../../images/imgDoc.png";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import DeleteIcon from "../../images/deleteHcRow.png";
import VerifiedImage from "../../images/verifiedImage.png";
import ToBeVerifiedImage from "../../images/toBeVerifiedImage.png";
import style from './index.module.scss'
import ESignature from '../ESignature';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CommonRadio from '../CommonFields/CommonRadio';

const PrivilegeDisplayDialog = ({ getIsOpen, privilegeList }) => {
    const [isContinue, setIsContinue] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPrintClicked, setIsPrintClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const componentRef = useRef(null);
    const PDFRef = createRef();

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);

    const handlePrintClick = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: "Staff Application",
        removeAfterPrint: true,
    });

    return (
        <>
            {isLoading && (
                <div className={style.loadingOverlay}>
                    <LoadingScreen />
                </div>
            )}
            <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog}  ${isExpanded ? style.eSignDialogBackground1 : style.eSignDialogBackground} ${isExpanded ? style.expandedDialog : ''}`} canOutsideClickClose={false} canEscapeKeyClose={false} ref={PDFRef}>
                <div>
                    <div className={Classes.DIALOG_BODY}>
                        {/* <div className={` ${isExpanded ? style.dialog :Classes.DIALOG_BODY}`}> */}
                        <div className={style.spaceBetween}>
                            <div className={style.heading}>Requested Privileges</div>
                            <div className={style.displayInRow}>
                                <div
                                    className={`${isPrintClicked && style.addStyle} ${style.alignCenter
                                        } ${style.cursorPointer} ${style.marginRight}`}
                                >
                                    <PrintOutlinedIcon
                                        sx={{
                                            fontSize: isPrintClicked ? 20 : 25,
                                            color: isPrintClicked ? "#fff" : "#06617A",
                                        }}
                                        onClick={handlePrintClick}
                                    />
                                </div>
                                {!isExpanded ? (
                                    <FullscreenSharpIcon
                                        className={`${style.iconStyle} ${style.cursorPointer} `}
                                        onClick={toggleExpand}
                                        sx={{ color: '#06617A' }}
                                    />) : (
                                    <FullscreenExitIcon
                                        className={`${style.iconStyle} ${style.cursorPointer} `}
                                        onClick={toggleExpand}
                                        sx={{ color: '#06617A' }}
                                    />
                                )
                                }
                                {/* <FullscreenSharpIcon
                                className={`${style.iconStyle} ${style.cursorPointer} `}
                                onClick={toggleExpand}
                                sx={{ color: '#06617A' }} 
                            /> */}
                                <img
                                    src={CrossPink}
                                    alt="cross"
                                    className={`${style.crossStyle} ${style.cursorPointer} `}
                                    onClick={() => { getIsOpen(false) }}
                                />
                            </div>
                        </div>
                        <div className={style.marginTop}>
                            {privilegeList?.map((privilegeData, privilegeIndex) => (
                                <div>
                                    <div className={style.padding}>
                                        <div className={style.cardTitle}>{`${privilegeData?.privilegeSetTitle?.toUpperCase()}`}</div>

                                        {privilegeData?.privilegeDetails?.corePrivileges?.privilegesByCategories?.map(
                                            (categories, index) => (
                                                <div>
                                                    <div className={style.categoryGrid}>
                                                        <div className={style.itemLeft}>
                                                            <strong>
                                                                {categories?.category === null
                                                                    ? ""
                                                                    : categories?.category}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                    <>
                                                        {categories?.privileges?.map((privileges) => (
                                                            <div className={style.privilegeCodeGrid}>
                                                                <div className={style.itemLeft}>
                                                                    <strong>{privileges?.privilegeId || ""}</strong>
                                                                </div>
                                                                <div className={style.itemLeft}>
                                                                    {privileges?.title || ""}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </>
                                                </div>
                                            )
                                        )
                                        }
                                        {privilegeData?.privilegeDetails?.corePrivileges
                                            ?.privilegesByCategories?.[0]?.privileges?.length !== 0 &&
                                            privilegeList?.[0]?.privilegeDetails?.corePrivileges
                                                ?.privilegesByCategories?.[0]?.privileges?.length !==
                                            undefined && (
                                                <div className={style.twoCol}>
                                                    <div>
                                                        <ESignature
                                                            userName={
                                                                privilegeData?.privilegeDetails
                                                                    ?.corePrivileges?.esign !== null
                                                                    ? privilegeData?.privilegeDetails
                                                                        ?.corePrivileges?.esign?.name
                                                                    : ""
                                                            }
                                                            encData={
                                                                privilegeData?.privilegeDetails
                                                                    ?.corePrivileges?.esign !== null
                                                                    ? privilegeData?.privilegeDetails
                                                                        ?.corePrivileges?.esign?.esign
                                                                    : ""
                                                            }
                                                            showData={
                                                                privilegeData?.privilegeDetails
                                                                    ?.corePrivileges?.esign !== null &&
                                                                    privilegeData?.privilegeDetails
                                                                        ?.corePrivileges?.esign !== undefined
                                                                    ? true
                                                                    : false
                                                            }
                                                            showDatais={true}
                                                        />
                                                    </div>
                                                    <div className={style.verticalAlignCenter}>
                                                        <div className={style.displayInRow}>
                                                            <div className={style.dateTitle}>Date: </div>
                                                            <div className={`${style.date} ${style.marginLeft}`}>
                                                                {privilegeData?.privilegeDetails
                                                                    ?.corePrivileges?.esign !== null
                                                                    ? privilegeData?.privilegeDetails
                                                                        ?.corePrivileges?.esign?.signedDate
                                                                    : ""}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                    </div>

                                    {privilegeData?.privilegeDetails
                                        ?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges
                                        ?.length !== 0 &&
                                        privilegeData?.privilegeDetails
                                            ?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges
                                            ?.length !== undefined && (
                                            <div className={style.padding}>
                                                <div className={style.cardDescription}>
                                                    {
                                                        "The following privileges are restricted and require evidence of qualification and competence. Continued competence would be evaluated as that being acceptable to the Medical Consultant of the Program. Please signify your intention regarding each privilege by marking and sign below."
                                                    }
                                                </div>

                                                {privilegeData?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.map(
                                                    (categories, categoriesIndex) => (
                                                        <div key={`${privilegeIndex}${categoriesIndex}`}>
                                                            <div className={style.categoryGrid}></div>
                                                            <>
                                                                {categories?.privileges?.map(
                                                                    (privileges, privilegesIndex) => (
                                                                        <div
                                                                            className={`${style.restrictedPrivilegeGrid} ${privilegesIndex === 0 ? style.marginTop : ""
                                                                                }`}
                                                                            key={`${privilegeIndex}${privilegesIndex}`}
                                                                        >
                                                                            <div className={style.itemLeft}>
                                                                                <strong>
                                                                                    {privileges?.privilegeId || ""}
                                                                                </strong>
                                                                            </div>
                                                                            <div className={style.itemLeft}>
                                                                                {privileges?.title || ""}
                                                                            </div>
                                                                            <div className={style.floatRight}>
                                                                                <CommonRadio
                                                                                    value={privileges?.response || ""}
                                                                                    radioValue={["NO", "YES"]}
                                                                                    label={["No", "Yes"]}
                                                                                />
                                                                            </div>
                                                                            {privileges?.response === "YES" &&
                                                                                (privileges?.isevidenceRequired ||
                                                                                    privileges?.isevidenceRequired ===
                                                                                    undefined) && (
                                                                                    <>
                                                                                        <div className={style.marginTop}>
                                                                                            <CKEditor
                                                                                                editor={ClassicEditor}
                                                                                                data={privileges?.notes?.notes || ""}

                                                                                                onReady={(editor) => {
                                                                                                    editor.editing.view.change(
                                                                                                        (writer) => {
                                                                                                            writer.setStyle(
                                                                                                                "height",
                                                                                                                "150px",
                                                                                                                editor.editing.view.document.getRoot()
                                                                                                            );
                                                                                                        }
                                                                                                    );
                                                                                                }}
                                                                                                config={{
                                                                                                    placeholder:
                                                                                                        "Please provide details of your qualification and competence for this privilege (Mandatory)",
                                                                                                    toolbar: {
                                                                                                        shouldNotGroupWhenFull: true,
                                                                                                        sticky: true,
                                                                                                        items: [
                                                                                                            'undo', 'redo',
                                                                                                            '|',
                                                                                                            'heading',
                                                                                                            '|',
                                                                                                            'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                                                                                                            '|',
                                                                                                            'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                                                                                                            '|',
                                                                                                            'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
                                                                                                        ],
                                                                                                    },
                                                                                                    autoGrow: false,
                                                                                                }}
                                                                                            />
                                                                                        </div>

                                                                                        <div className={style.marginTop10}>
                                                                                            <div
                                                                                                className={`${style.uploadButton}`}
                                                                                            >
                                                                                                <div className={style.uploadGrid}>
                                                                                                    {privileges?.file !== undefined &&
                                                                                                        privileges?.file !== null ? (
                                                                                                        <img
                                                                                                            src={VerifiedImage}
                                                                                                            alt=""
                                                                                                            className={`${style.imgIcon} `}
                                                                                                        />
                                                                                                    ) : (
                                                                                                        <img
                                                                                                            src={ToBeVerifiedImage}
                                                                                                            alt=""
                                                                                                            className={style.imgIcon}
                                                                                                        />
                                                                                                    )}
                                                                                                    <div
                                                                                                        className={`${style.uploadText} ${style.verticalAlignCenter}`}
                                                                                                    >
                                                                                                        Upload any supporting documents
                                                                                                        for evidence of qualification and
                                                                                                        competence (Optional)
                                                                                                    </div>

                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        {privileges?.file !== null &&
                                                                                            privileges?.file?.fileName !==
                                                                                            undefined && (
                                                                                                <div
                                                                                                    className={`${style.fileDisplay} ${style.fileDisplayText} ${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}
                                                                                                >
                                                                                                    <div className={style.displayInRow}>
                                                                                                        <div
                                                                                                            onClick={() => {
                                                                                                                window.open(
                                                                                                                    privileges?.file?.fileURL,
                                                                                                                    "_blank"
                                                                                                                );
                                                                                                            }}
                                                                                                        >
                                                                                                            {privileges?.file?.fileType ===
                                                                                                                "application/pdf" ? (
                                                                                                                <img
                                                                                                                    src={PdfDoc}
                                                                                                                    alt=""
                                                                                                                    className={
                                                                                                                        style.docTypeImgStyle
                                                                                                                    }
                                                                                                                />
                                                                                                            ) : privileges?.file?.fileType?.startsWith(
                                                                                                                "image/"
                                                                                                            ) ? (
                                                                                                                <img
                                                                                                                    src={ImgDoc}
                                                                                                                    alt=""
                                                                                                                    className={
                                                                                                                        style.docTypeImgStyle
                                                                                                                    }
                                                                                                                />
                                                                                                            ) : (
                                                                                                                <img
                                                                                                                    src={PdfDoc}
                                                                                                                    alt=""
                                                                                                                    className={
                                                                                                                        style.docTypeImgStyle
                                                                                                                    }
                                                                                                                />
                                                                                                            )}
                                                                                                        </div>
                                                                                                        <div className={style.marginLeft}>
                                                                                                            {privileges?.file?.fileName}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                        <br />
                                                                                    </>
                                                                                )}
                                                                        </div>
                                                                    )
                                                                )}
                                                            </>
                                                        </div>
                                                    )
                                                )
                                                }
                                                <div className={style.twoCol}>
                                                    <div>
                                                        <ESignature
                                                            userName={
                                                                privilegeData?.privilegeDetails
                                                                    ?.restrictedPrivileges?.esign !== null
                                                                    ? privilegeData?.privilegeDetails
                                                                        ?.restrictedPrivileges?.esign?.name
                                                                    : ""
                                                            }
                                                            encData={
                                                                privilegeData?.privilegeDetails
                                                                    ?.restrictedPrivileges?.esign !== null
                                                                    ? privilegeData?.privilegeDetails
                                                                        ?.restrictedPrivileges?.esign?.esign
                                                                    : ""
                                                            }
                                                            showData={
                                                                privilegeData?.privilegeDetails
                                                                    ?.restrictedPrivileges?.esign !== null &&
                                                                    privilegeData?.privilegeDetails
                                                                        ?.restrictedPrivileges?.esign !== undefined
                                                                    ? true
                                                                    : false
                                                            }
                                                            showDatais={true}
                                                        />
                                                    </div>
                                                    <div className={style.verticalAlignCenter}>
                                                        <div className={style.displayInRow}>
                                                            <div className={style.dateTitle}>Date: </div>
                                                            <div className={`${style.date} ${style.marginLeft}`}>
                                                                {privilegeData?.privilegeDetails
                                                                    ?.restrictedPrivileges?.esign !== null
                                                                    ? privilegeData?.privilegeDetails
                                                                        ?.restrictedPrivileges?.esign?.signedDate
                                                                    : ""}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            ))}
                        </div>
                        <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                            <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getIsOpen(false); }}>CLOSE</div>
                        </div>
                    </div>

                </div>
            </Dialog >
        </>
    )
}

export default PrivilegeDisplayDialog;
