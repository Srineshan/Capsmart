import React, { useRef, useCallback } from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import { useReactToPrint } from "react-to-print";
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';

import style from './index.module.scss';

const ValidationHeader = ({ heading, result }) => {
    return (
        <div>
            <div className={`${style.validationBoxHeader} ${style.spaceBetween} ${style.verticalAlignCenter} ${result === 'FAIL' && style.redBorder}`}>
                <div className={style.validationHeaderText}>{heading}</div>
                {result === 'PASS' ? (
                    <TaskAltOutlinedIcon style={{ color: "#14B15A" }} />
                ) : (
                    <div className={style.displayInRow}>
                        <DraftsOutlinedIcon style={{ color: "#52575D" }} />
                        <div className={style.marginLeft20}>
                            <EditOutlinedIcon style={{ color: "#F94848" }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const ContractValidationCheckSummary = ({ getContractValidationDialog }) => {
    const componentRef = useRef(null);

    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: "Contract Validation Check Summary",
        removeAfterPrint: true
    });
    return (
        <Dialog isOpen={getContractValidationDialog} onClose={() => getContractValidationDialog(false)} className={`${style.addServiceDialog} ${style.addManagerDialogBackground}`}>
            <div className={`${Classes.DIALOG_BODY} `} ref={componentRef}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>NEW CONTRACT VALIDATION CHECK SUMMARY</p>
                    <div className={style.displayInRow}>
                        <div className={`${style.iconPadding} ${style.cursorPointer}`} onClick={() => handlePrint()}>
                            <PrintOutlinedIcon style={{ color: "#7165E3" }} />
                        </div>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getContractValidationDialog(false)} />
                    </div>
                </div>
                <div className={style.extensionBorder}></div>
                <div className={style.marginTop20}>
                    <ValidationHeader heading={'CONTRACT AMENDMENTS'} result={'FAIL'} />
                    <div className={style.validationPadding}>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Mandatory data element have required data mandatory data missing</div>
                            <div className={style.statusText}>FAIL</div>
                        </div>
                    </div>
                </div>
                <div className={style.marginTop20}>
                    <ValidationHeader heading={'CONTRACT IDENTIFICATION & TERM LIMIT'} result={'FAIL'} />
                    <div className={style.validationPadding}>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Mandatory data element have required data mandatory data missing</div>
                            <div className={style.statusText}>FAIL</div>
                        </div>
                    </div>
                    <div className={style.validationPadding}>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Contract id missing or available</div>
                            <div className={style.statusText}>FAIL</div>
                        </div>
                    </div>
                    <div className={style.validationPadding}>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Fully executed copy not on file</div>
                            <div className={style.statusText}>FAIL</div>
                        </div>
                    </div>
                    <div className={style.validationPadding}>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Fully executed copy on file</div>
                            <div className={style.statusText}>PASS</div>
                        </div>
                    </div>
                </div>
                <div className={style.marginTop20}>
                    <ValidationHeader heading={'CONTRACTED SERVICES PROVIDER(S)'} result={'PASS'} />
                    <div className={style.validationPadding}>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>NPIN cant be missing:: if applicable</div>
                            <div className={style.statusText}>PASS</div>
                        </div>
                    </div>
                </div>
                <div className={style.marginTop20}>
                    <ValidationHeader heading={'CONTRACTED SERVICES PROVIDER(S)'} result={'FAIL'} />
                    <div className={style.marginTop20}>
                        <div className={style.grid5}>
                            <div className={`${style.validationTopicText} ${style.textAlignCenter}`}>SERVICES PROVIDER(S) NAME</div>
                            <div className={`${style.validationTopicText} ${style.textAlignCenter}`}>NPIN CANT BE MISSING, IF APPLICABLE</div>
                            <div className={`${style.validationTopicText} ${style.textAlignCenter}`}>EMAIL CONTRACTOR ID SHOULD BE AVAILABLE</div>
                            <div className={`${style.validationTopicText} ${style.textAlignCenter}`}>CELL PHONE DATA ELEMENT SHOULD BE AVAILABLE</div>
                            <div className={`${style.validationTopicText} ${style.textAlignCenter}`}>MANDATORY DATA ELEMENT HAVE REQUIRED DATA MANDATORY DATA MISSING</div>
                        </div>
                    </div>
                    <div className={style.marginTop20}>
                        <div className={style.grid5}>
                            <div className={`${style.validationTopicText} ${style.textAlignCenter}`}>Provider 1</div>
                            <div className={`${style.statusText} ${style.textAlignCenter}`}>PASS</div>
                            <div className={`${style.statusText} ${style.textAlignCenter}`}>PASS</div>
                            <div className={`${style.statusText} ${style.textAlignCenter}`}>PASS</div>
                            <div className={`${style.statusText} ${style.textAlignCenter}`}>PASS</div>
                        </div>
                    </div>
                    <div className={style.marginTop20}>
                        <div className={style.grid5}>
                            <div className={`${style.validationTopicText} ${style.textAlignCenter}`}>Provider 2</div>
                            <div className={`${style.statusText} ${style.textAlignCenter}`}>PASS</div>
                            <div className={`${style.statusText} ${style.textAlignCenter}`}>PASS</div>
                            <div className={`${style.statusText} ${style.textAlignCenter}`}>PASS</div>
                            <div className={`${style.statusText} ${style.textAlignCenter}`}>PASS</div>
                        </div>
                    </div>
                    <div className={style.marginTop20}>
                        <div className={style.grid5}>
                            <div className={`${style.validationTopicText} ${style.textAlignCenter}`}>Provider 3</div>
                            <div className={`${style.statusText} ${style.textAlignCenter}`}>PASS</div>
                            <div className={`${style.statusText} ${style.textAlignCenter}`}>PASS</div>
                            <div className={`${style.statusText} ${style.textAlignCenter}`}>PASS</div>
                            <div className={`${style.statusText} ${style.textAlignCenter}`}>PASS</div>
                        </div>
                    </div>
                </div>
                <div className={style.marginTop20}>
                    <ValidationHeader heading={'CONTRACTOR BUSINESS ENTITY'} result={'PASS'} />
                    <div className={style.validationPadding}>
                        <div className={style.grid4}>
                            <div className={style.validationTopicText}>ACTIVITIES TYPE</div>
                            <div className={style.validationTopicText}>SPECIFIC ACTIVITY</div>
                            <div className={style.validationTopicText}>APPLIES TO</div>
                        </div>
                    </div>
                    <div className={style.validationPadding}>
                        <div className={style.grid4}>
                            <div className={style.statusText}>Lorem ipsum</div>
                            <div className={style.statusText}>Lorem ipsum</div>
                            <div className={style.statusText}>Lorem ipsum</div>
                            <div className={style.statusText}>PASS</div>
                        </div>
                    </div>
                    <div className={style.validationPadding}>
                        <div className={style.grid4}>
                            <div className={style.statusText}>Lorem ipsum</div>
                            <div className={style.statusText}>Lorem ipsum</div>
                            <div className={style.statusText}>Lorem ipsum</div>
                            <div className={style.statusText}>PASS</div>
                        </div>
                    </div>
                    <div className={style.validationPadding}>
                        <div className={style.grid4}>
                            <div className={style.statusText}>Lorem ipsum</div>
                            <div className={style.statusText}>Lorem ipsum</div>
                            <div className={style.statusText}>Lorem ipsum</div>
                            <div className={style.statusText}>PASS</div>
                        </div>
                    </div>
                </div>
                <div className={style.marginTop20}>
                    <ValidationHeader heading={'DOCUMENTATION PROOF REQUIRED'} result={'FAIL'} />
                    <div className={style.validationPadding}>
                        <div className={style.validationTopicText}>POD TYPE</div>
                        <div className={`${style.documentationProofGrid} ${style.marginTop20}`}>
                            <div className={style.statusText}>Medical license Certificate</div>
                            <div className={style.displayInRow}>
                                <TextSnippetOutlinedIcon style={{ color: "#52575D", fontSize: 20 }} />
                                <div className={`${style.statusText} ${style.marginLeft10}`}>ss.png</div>
                            </div>
                            <div className={style.statusText}>PASS</div>
                        </div>
                        <div className={`${style.documentationProofGrid} ${style.marginTop20}`}>
                            <div className={style.statusText}>Medical license Certificate</div>
                            <div className={style.displayInRow}>
                                <TextSnippetOutlinedIcon style={{ color: "#52575D", fontSize: 20 }} />
                                <div className={`${style.statusText} ${style.marginLeft10}`}>MISSING</div>
                            </div>
                            <div className={style.statusText}>PASS</div>
                        </div>
                        <div className={`${style.documentationProofGrid} ${style.marginTop20}`}>
                            <div className={style.statusText}>Medical license Certificate</div>
                            <div className={style.displayInRow}>
                                <TextSnippetOutlinedIcon style={{ color: "#52575D", fontSize: 20 }} />
                                <div className={`${style.statusText} ${style.marginLeft10}`}>ss.png</div>
                            </div>
                            <div className={style.statusText}>FAIL</div>
                        </div>
                    </div>
                </div>
                <div className={style.marginTop20}>
                    <ValidationHeader heading={'TIMESHEET SUBMISSION TERMS'} result={'PASS'} />
                    <div className={style.validationPadding}>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Mandatory data element have required data mandatory data missing</div>
                            <div className={style.statusText}>PASS</div>
                        </div>
                    </div>
                </div>
                <div className={style.marginTop20}>
                    <ValidationHeader heading={'PAYMENT & COMPENSATION'} result={'PASS'} />
                    <div className={style.validationPadding}>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Mandatory data element have required data mandatory data missing</div>
                            <div className={style.statusText}>PASS</div>
                        </div>
                    </div>
                </div>
                <div className={style.marginTop20}>
                    <ValidationHeader heading={'TIMESHEET PROCESSING WORKFLOW'} result={'PASS'} />
                    <div className={style.validationPadding}>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Mandatory data element have required data mandatory data missing</div>
                            <div className={style.statusText}>PASS</div>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default ContractValidationCheckSummary;