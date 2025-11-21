import React, { useState, useRef, useEffect, useCallback } from 'react';
import style from './index.module.scss';
import { PUT } from '../../dataSaver';
import { Classes, Dialog } from '@blueprintjs/core';
import { ErrorToaster2, SuccessToaster2 } from '../../../utils/toaster';
import { Tooltip } from '@mui/material';
import { DocumentEditorContainerComponent } from '@syncfusion/ej2-react-documenteditor';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-dropdowns/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import '@syncfusion/ej2-splitbuttons/styles/material.css';
import '@syncfusion/ej2-navigations/styles/material.css';
import '@syncfusion/ej2-react-documenteditor/styles/material.css';

const PNPManagerStep2 = ({ setStep1, setStep2, setStep3, mdValue, getMD, setMdValue, setSelectedMdId }) => {
    const fileInputRef = useRef(null);
    const editorRef = useRef(null);
    const [isSaveInProgressDialog, setIsSaveInProgressDialog] = useState(false);
    const [isConfirmationDialog, setIsConfirmationDialog] = useState(false);

    // Build a map of placeholder tokens to system values
    const getSystemVariableMap = useCallback(() => {
        try {
            const user = JSON.parse(sessionStorage.getItem('user') || '{}');
            const workMode = sessionStorage.getItem('workModeType') || '';
            const selectedSite = sessionStorage.getItem('selectedSite') || '';
            const today = new Date().toLocaleDateString();

            const userName = (user?.name?.firstName && user?.name?.lastName)
                ? `${user?.name?.firstName} ${user?.name?.lastName}`
                : (user?.email?.officialEmail || '');

            return {
                '{{USER_NAME}}': userName,
                '{{WORK_MODE}}': workMode,
                '{{SITE_ID}}': selectedSite,
                '{{TODAY}}': today,
            };
        } catch (e) {
            return {
                '{{USER_NAME}}': '',
                '{{WORK_MODE}}': '',
                '{{SITE_ID}}': '',
                '{{TODAY}}': new Date().toLocaleDateString(),
            };
        }
    }, []);

    const replaceSystemVariables = useCallback(() => {
        const docEditor = editorRef.current?.documentEditorInternal;
        if (!docEditor) return false;

        console.log("🟡 Starting system variable replacement...");
        const vars = getSystemVariableMap();
        console.log("📄 System variables map:", vars);

        const sfdt = JSON.parse(docEditor.serialize());
        console.log("🔍 Raw SFDT data (before parse):", sfdt);

        let modified = false;

        const replaceInText = (text) => {
            let newText = text;
            Object.entries(vars).forEach(([token, value]) => {
                const safeToken = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                const regex = new RegExp(safeToken, "g");
                if (regex.test(newText)) {
                    console.log(`🪄 Replacing "${token}" → "${value}"`);
                    newText = newText.replace(regex, value);
                    modified = true;
                }
            });
            return newText;
        };

        const walkInlines = (inlines) => {
            if (!Array.isArray(inlines)) return;
            inlines.forEach((inline) => {
                if (inline.tlp) {
                    const newText = replaceInText(inline.tlp);
                    if (newText !== inline.tlp) {
                        inline.tlp = newText;
                    }
                }
                if (inline.text) {
                    const newText = replaceInText(inline.text);
                    if (newText !== inline.text) {
                        inline.text = newText;
                    }
                }
            });
        };

        const walkBlocks = (blocks) => {
            if (!Array.isArray(blocks)) return;
            blocks.forEach((block) => {
                if (block.i) walkInlines(block.i);
                if (Array.isArray(block.b)) walkBlocks(block.b);
            });
        };

        // ✅ Adjust for "sec" instead of "sections"
        const sections = sfdt.sections || sfdt.sec;
        if (Array.isArray(sections)) {
            sections.forEach((section) => {
                if (Array.isArray(section.b)) walkBlocks(section.b);
            });
        } else {
            console.warn("⚠️ No sections found in SFDT. Check property names:", Object.keys(sfdt));
        }

        if (modified) {
            docEditor.open(JSON.stringify(sfdt));
            console.log("✅ Variables replaced successfully");
            return true;
        } else {
            console.log("ℹ️ No variables found to replace");
            return false;
        }
    }, [getSystemVariableMap]);


    const handleEditorCreated = useCallback(() => {
        console.log('=== handleEditorCreated CALLED ===');

        // Use requestAnimationFrame to ensure this runs after the current render cycle
        requestAnimationFrame(async () => {
            console.log('Document editor created and ready');
            console.log('mdValue file URL:', mdValue?.file?.fileURL);
            console.log('Editor ref:', editorRef.current);
            console.log('Document editorInternal:', editorRef.current?.documentEditorInternal);

            // Try to access the editor
            const docEditor = editorRef.current?.documentEditorInternal;

            if (docEditor) {
                try {
                    const fileURL = mdValue?.file?.fileURL;

                    if (fileURL) {
                        // Load existing document from URL
                        console.log('Loading document from URL:', fileURL);
                        try {
                            // Fetch the file
                            const response = await fetch(fileURL);
                            const arrayBuffer = await response.arrayBuffer();
                            const blob = new Blob([arrayBuffer], {
                                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                            });

                            // Convert blob to base64 or use import method
                            // Try using the openUrl method or import with proper format
                            const reader = new FileReader();
                            reader.onload = async (e) => {
                                try {
                                    // Try importing as DOCX
                                    const base64 = e.target.result.split(',')[1];
                                    // Use the import method for DOCX files
                                    docEditor.import(base64, 'Docx');
                                    console.log('Document imported successfully via base64');

                                    // Wait longer for document to fully load and be ready for operations
                                    setTimeout(() => {
                                        console.log('Replacing variables after document load');
                                        // Try replacement multiple times to ensure it works
                                        const attemptReplacement = () => {
                                            const success = replaceSystemVariables();
                                            if (!success) {
                                                console.log('First attempt failed, retrying in 500ms...');
                                                setTimeout(() => {
                                                    replaceSystemVariables();
                                                }, 500);
                                            }
                                        };
                                        attemptReplacement();
                                    }, 2000);
                                } catch (importError) {
                                    console.error('Error importing document:', importError);
                                    // Try alternative method - open with array buffer
                                    try {
                                        // Some versions use open() with array buffer
                                        docEditor.open(arrayBuffer);
                                        setTimeout(() => {
                                            replaceSystemVariables();
                                        }, 500);
                                    } catch (openError) {
                                        console.error('Error with open method:', openError);
                                        // Fallback to blank
                                        docEditor.openBlank();
                                        setTimeout(() => {
                                            replaceSystemVariables();
                                        }, 100);
                                    }
                                }
                            };
                            reader.readAsDataURL(blob);
                        } catch (error) {
                            console.error('Error loading document from URL:', error);
                            // Fallback to blank document
                            docEditor.openBlank();
                            setTimeout(() => {
                                replaceSystemVariables();
                            }, 100);
                        }
                    } else {
                        // No existing document, open blank
                        docEditor.openBlank();
                        console.log('Opened blank document');

                        setTimeout(() => {
                            replaceSystemVariables();
                        }, 100);
                    }
                } catch (error) {
                    console.error('Error initializing document:', error);
                }
            } else {
                console.log('Editor not yet available in onCreated');
            }
        });
    }, [replaceSystemVariables, mdValue]);

    // Debug: Log mdValue changes
    useEffect(() => {
        console.log('=== mdValue changed ===', mdValue);
        console.log('File info:', mdValue?.file);
    }, [mdValue]);

    const saveDocument = async () => {
        // Access the editor using the correct property name
        const docEditor = editorRef.current?.documentEditorInternal;

        if (editorRef.current && docEditor) {
            try {
                const documentEditor = docEditor;
                // Ensure placeholders are resolved before export
                console.log('Replacing variables before save...');
                const replacementSuccess = replaceSystemVariables();

                if (!replacementSuccess) {
                    console.log('First replacement attempt failed, retrying...');
                    // Wait a bit and try again
                    await new Promise(resolve => setTimeout(resolve, 300));
                    replaceSystemVariables();
                }

                // Wait a moment for replacements to complete before exporting
                await new Promise(resolve => setTimeout(resolve, 500));

                // Export as DOCX format
                const exportOptions = {
                    formatType: 'Docx',
                    enableFootnotes: true,
                    enableEndnotes: true
                };

                // Use Promise to handle async export
                const blob = await new Promise((resolve, reject) => {
                    documentEditor.saveAsBlob('Docx', exportOptions).then((blob) => {
                        resolve(blob);
                    }).catch((error) => {
                        reject(error);
                    });
                });

                const file = new File([blob], mdValue?.file?.fileName || 'document.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                await handleContinue(file);
                return true;
            } catch (error) {
                console.error('Error saving document:', error);
                ErrorToaster2('Failed to save document. Please try again.');
                return false;
            }
        }
        return false;
    };

    const handleReplaceCopy = () => {
        fileInputRef.current.click();
    }

    const handleUploadFile = async (event) => {
        const file = event.target.files[0];
        console.log('Selected file:', file);
        if (file) {
            console.log('Selected file:', file);
            handleContinue(file)
        }
    };

    const handleContinue = async (file) => {
        const formData = new FormData();
        console.log(mdValue)
        let data = mdValue;
        data.file = {
            fileName: file?.name,
        }

        formData.append(
            "metaDataDTO",
            new Blob([JSON.stringify(data)], {
                type: "application/json",
            })
        );
        formData.append("file", file);

        console.log(data)

        await PUT(`policy-and-procedure-management-service/policyAndProcedures/${mdValue?.id}`, formData)
            .then(response => {
                SuccessToaster2('P&P Uploaded Successfully');
                console.log(response?.data)
                setStep3(false)
                getMD(response?.data);
            })
            .catch(error => {
                ErrorToaster2('P&P Upload Failed');
            })

    }

    const handleSaveInProgress = async () => {
        await PUT(`policy-and-procedure-management-service/policyAndProcedures/${mdValue?.id}/saveInprogress`, 'step2')
            .then(response => {
                SuccessToaster2('P&P Saved Successfully');
                console.log(response?.data)
                setStep2(false)
            })
            .catch(error => {
            })
    }

    const handleClose = () => {
        setMdValue();
        setSelectedMdId('');
    }

    const handleConfirmReplace = () => {
        setIsConfirmationDialog(false);
        handleReplaceCopy();
    }

    // Check if the file is a DOCX file
    const isDocxFile = () => {
        const fileName = mdValue?.file?.fileName?.toLowerCase() || '';
        const fileURL = mdValue?.file?.fileURL?.toLowerCase() || '';
        return fileName.endsWith('.docx') ||
            fileName.endsWith('.doc') ||
            fileURL.endsWith('.docx') ||
            fileURL.endsWith('.doc');
    };

    const showEditor = isDocxFile();
    const previewUrl = mdValue?.file?.fileURL;

    console.log('=== Step2 Render ===');
    console.log('mdValue:', mdValue);
    console.log('mdValue.file:', mdValue?.file);
    console.log('Is DOCX file:', showEditor);
    return (
        <div className={style.stepsBackground}>
            <div className={`${style.stepHeader} ${style.spaceBetween} ${style.verticalAlignCenter}`}>
                <div className={style.displayInRow}>
                    <div className={`${style.stepNumber} ${style.marginLeft10}`}>Step 2</div>
                    <div className={`${style.stepHeading} ${style.marginLeft20}`}>Review Policy & Procedure</div>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUploadFile}
                    style={{ display: "none" }}
                />
                <div className={style.displayInRow}>
                    <div className={`${style.spaceBetween}`}>
                        <Tooltip arrow title='Click to go Back'>
                            <button className={`${style.buttonStyleMd} ${style.marginRight} `} onClick={() => { setStep1(true); setStep2(false) }} >BACK</button>
                        </Tooltip>
                        <Tooltip arrow title='Click to Replace Document'>
                            <button className={`${style.outlinedButtonMd} ${style.marginRight} `} onClick={() => setIsConfirmationDialog(true)} >REPLACE DOCUMENT</button>
                        </Tooltip>
                        <Tooltip arrow title='Click to Save In-Progress'>
                            <button className={`${style.outlinedButtonMd} ${style.marginRight} `} onClick={() => { setIsSaveInProgressDialog(true) }} >SAVE IN PROGRESS</button>
                        </Tooltip>
                        <Tooltip arrow title='Click to Continue'>
                            <button className={`${style.buttonStyleMd} ${style.marginRight} `} onClick={async () => {
                                if (showEditor) {
                                    // For DOCX files, save the document from editor
                                    const saved = await saveDocument();
                                    if (saved) {
                                        setStep2(false);
                                        setStep3(true);
                                    }
                                } else {
                                    // For non-DOCX files, just proceed to next step
                                    setStep2(false);
                                    setStep3(true);
                                }
                            }} >CONTINUE</button>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div className={style.stepContentCard}>
                <div className={`${style.stepsTitleBar} ${style.verticalAlignCenter}`}>
                    <div className={style.stepsTitleText}>Policy & Procedure Meta Data</div>
                </div>
                <div className={style.marginTop20} style={{ height: "calc(100vh - 200px)", position: 'relative' }}>
                    {showEditor ? (
                        <DocumentEditorContainerComponent
                            ref={editorRef}
                            id="container"
                            enableToolbar={true}
                            height="100%"
                            onCreated={handleEditorCreated}
                            documentEditorSettings={{
                                isReadOnly: false,
                                enableEditor: true
                            }}
                        />
                    ) : (
                        previewUrl && (
                            <iframe
                                src={previewUrl}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none'
                                }}
                                title="Document Preview"
                            />
                        )
                    )}
                </div>
            </div>
            <Dialog isOpen={isConfirmationDialog} onClose={() => setIsConfirmationDialog(false)} className={`${style.addMDDialogBackground} ${style.confirmationDialog} `}>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.attestationDialogHeaderCard}>
                        <div className={`${style.attestationDialogTitle} ${style.padding20} `}>Confirm Document Replacement</div>
                    </div>
                    <div className={`${style.marginTop10} `}>
                        <div className={style.labelStyle}>Are you sure you want to replace the existing Policy & Procedure document by uploading a new one?</div>
                    </div>

                    <div>
                        <div className={`${style.spaceBetween} ${style.marginTop20} `}>
                            <button className={`${style.outlinedButton} `} onClick={() => setIsConfirmationDialog(false)} >CANCEL</button>
                            <button className={`${style.buttonStyle} ${style.marginLeft10} `} onClick={() => handleConfirmReplace()} >{'YES, UPLOAD'}</button>
                        </div>
                    </div>
                </div>
            </Dialog >
            <Dialog isOpen={isSaveInProgressDialog} onClose={() => setIsSaveInProgressDialog(false)} className={`${style.addMDDialogBackground} ${style.confirmationDialog} `}>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.attestationDialogHeaderCard}>
                        <div className={`${style.attestationDialogTitle} ${style.padding20} `}>Confirm Save In-Progress</div>
                    </div>
                    <div className={`${style.marginTop10} `}>
                        <div className={style.labelStyle}>Your current progress will be saved. You can return and continue from where you left off.</div>
                    </div>

                    <div>
                        <div className={`${style.spaceBetween} ${style.marginTop20} `}>
                            <button className={`${style.outlinedButtonWithBiggerWidth} `} onClick={() => setIsSaveInProgressDialog(false)} >CANCEL</button>
                            <button className={`${style.buttonStyleWithBiggerWidth} ${style.marginLeft10} `} onClick={() => { handleSaveInProgress() }} >{'SAVE & CONTINUE LATER'}</button>
                        </div>
                    </div>
                </div>
            </Dialog >
        </div>
    )
}

export default PNPManagerStep2;
