import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import { useReactToPrint } from "react-to-print";
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import ValidationHeader from './validationHeader.js';

import { validateTabs } from './contractValidation';

import style from './index.module.scss';

const ContractValidationCheckSummary = ({ getContractValidationDialog, contract }) => {
    const componentRef = useRef(null);
    const [isTabsValid, setIsTabsValid] = useState();
    const [providerDetails, setProviderDetails] = useState([]);
    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);
    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: "Contract Validation Check Summary",
        removeAfterPrint: true
    });
    useEffect(() => {
        let temp = validateTabs(contract?.id);
        temp.then(value => {
            setIsTabsValid(value);
            console.log('fetching from promise', value);
        })
    }, [])

    useEffect(() => {
        if (isTabsValid) {
            let temp = isTabsValid?.value2;
            temp.then(value => {
                setProviderDetails(value);
            })
        }
    }, [isTabsValid])

    console.log('summary check', providerDetails);


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
                {
                    // <div className={style.marginTop20}>
                    //     <ValidationHeader heading={'CONTRACT AMENDMENTS'} result={'FAIL'} />
                    //     <div className={style.validationPadding}>
                    //         <div className={style.spaceBetween}>
                    //             <div className={style.validationTopicText}>Mandatory data element have required data mandatory data missing</div>
                    //             <div className={style.statusText}>FAIL</div>
                    //         </div>
                    //     </div>
                    // </div>
                }

                <div className={style.marginTop20}>
                    <ValidationHeader heading={'CONTRACT IDENTIFICATION & TERM LIMIT'} result={isTabsValid?.tab1 ? 'PASS' : 'FAIL'} />
                    <div className={style.validationPadding}>
                        {
                            isTabsValid?.value1?.map(data => (
                                <div className={style.spaceBetween}>
                                    <div className={style.validationTopicText}>{data}</div>
                                    <div className={style.statusText}>FAIL</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                {
                    providerDetails?.length === 1 &&
                    <div className={style.marginTop20}>
                        <ValidationHeader heading={'CONTRACTED SERVICES PROVIDER(S)'} result={providerDetails?.[0]?.[1]?.length === 0 ? 'PASS' : 'FAIL'} />
                        <div className={style.validationPadding}>
                            {
                                providerDetails?.[0]?.[1]?.map(data => (
                                    <div className={style.spaceBetween}>
                                        <div className={style.validationTopicText}>{data}</div>
                                        <div className={style.statusText}>FAIL</div>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                }

                {
                    providerDetails?.length > 1 &&
                    <div className={style.marginTop20}>
                        <ValidationHeader heading={'CONTRACTED SERVICES PROVIDER(S)'} result={providerDetails?.filter(data => data?.[1]?.length !== 0)?.map(data => data)?.length === 0 ? 'PASS' : 'FAIL'} />
                        <div className={style.marginTop20}>
                            <div className={style.grid5}>
                                <div className={`${style.validationTopicText} ${style.textAlignCenter}`}>SERVICES PROVIDER(S) NAME</div>
                                <div className={`${style.validationTopicText} ${style.textAlignCenter}`}>NPIN CANT BE MISSING, IF APPLICABLE</div>
                                <div className={`${style.validationTopicText} ${style.textAlignCenter}`}>EMAIL CONTRACTOR ID SHOULD BE AVAILABLE</div>
                                <div className={`${style.validationTopicText} ${style.textAlignCenter}`}>CELL PHONE DATA ELEMENT SHOULD BE AVAILABLE</div>
                                <div className={`${style.validationTopicText} ${style.textAlignCenter}`}>MANDATORY DATA ELEMENT HAVE REQUIRED DATA MANDATORY DATA MISSING</div>
                            </div>
                        </div>
                        {
                            providerDetails?.map(data => (
                                <div className={style.marginTop20}>
                                    <div className={style.grid5}>
                                        <div className={`${style.validationTopicText} ${style.textAlignCenter}`}>{data[0]}</div>
                                        <div className={`${style.statusText} ${style.textAlignCenter}`}>{data?.[1]?.includes('NPIN') ? 'FAIL' : 'PASS'}</div>
                                        <div className={`${style.statusText} ${style.textAlignCenter}`}>{data?.[1]?.includes('Contract Provider Email') ? 'FAIL' : 'PASS'}</div>
                                        <div className={`${style.statusText} ${style.textAlignCenter}`}>{data?.[1]?.includes('Mobile Number') ? 'FAIL' : 'PASS'}</div>
                                        <div className={`${style.statusText} ${style.textAlignCenter}`}>{data?.[1]?.length !== 0 ? 'FAIL' : 'PASS'}</div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                }
                <div className={style.marginTop20}>
                    <ValidationHeader heading={'CONTRACTOR BUSINESS ENTITY'} result={isTabsValid?.tab3 ? 'PASS' : 'FAIL'} />
                    <div className={style.validationPadding}>
                        {
                            isTabsValid?.value3?.map(data => (
                                <div className={style.spaceBetween}>
                                    <div className={style.validationTopicText}>{data}</div>
                                    <div className={style.statusText}>FAIL</div>
                                </div>
                            ))
                        }

                    </div>
                </div>
                <div className={style.marginTop20}>
                    <ValidationHeader heading={'CONTRACTED SERVICE SPECIFICATION'} result={isTabsValid?.value4?.filter(data => data?.length !== 0)?.map(data => data)?.length === 0 ? 'PASS' : 'FAIL'} />
                    <div className={style.validationPadding}>
                        <div className={style.grid4}>
                            <div className={style.validationTopicText}>ACTIVITIES TYPE</div>
                            <div className={style.validationTopicText}>SPECIFIC ACTIVITY</div>
                            <div className={style.validationTopicText}>APPLIES TO</div>
                        </div>
                    </div>
                    {
                        contract?.contractedServices?.map((data, index) => (
                            <div className={style.validationPadding}>
                                <div className={style.grid4}>
                                    <div className={style.statusText}>{data?.activityType?.activityType}</div>
                                    <div className={style.statusText}>{data?.activities?.map(data => data?.activity)?.join(', ')}</div>
                                    <div className={style.statusText}>{data?.users?.map(user => user?.name?.firstName)?.join(', ')}</div>
                                    <div className={style.statusText}>{isTabsValid?.value4?.[index]?.length !== 0 ? 'FAIL' : 'PASS'}</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                {
                    // <div className={style.marginTop20}>
                    //     <ValidationHeader heading={'DOCUMENTATION PROOF REQUIRED'} result={'FAIL'} />
                    //     <div className={style.validationPadding}>
                    //         <div className={style.validationTopicText}>POD TYPE</div>
                    //         <div className={`${style.documentationProofGrid} ${style.marginTop20}`}>
                    //             <div className={style.statusText}>Medical license Certificate</div>
                    //             <div className={style.displayInRow}>
                    //                 <TextSnippetOutlinedIcon style={{ color: "#52575D", fontSize: 20 }} />
                    //                 <div className={`${style.statusText} ${style.marginLeft10}`}>ss.png</div>
                    //             </div>
                    //             <div className={style.statusText}>PASS</div>
                    //         </div>
                    //         <div className={`${style.documentationProofGrid} ${style.marginTop20}`}>
                    //             <div className={style.statusText}>Medical license Certificate</div>
                    //             <div className={style.displayInRow}>
                    //                 <TextSnippetOutlinedIcon style={{ color: "#52575D", fontSize: 20 }} />
                    //                 <div className={`${style.statusText} ${style.marginLeft10}`}>MISSING</div>
                    //             </div>
                    //             <div className={style.statusText}>PASS</div>
                    //         </div>
                    //         <div className={`${style.documentationProofGrid} ${style.marginTop20}`}>
                    //             <div className={style.statusText}>Medical license Certificate</div>
                    //             <div className={style.displayInRow}>
                    //                 <TextSnippetOutlinedIcon style={{ color: "#52575D", fontSize: 20 }} />
                    //                 <div className={`${style.statusText} ${style.marginLeft10}`}>ss.png</div>
                    //             </div>
                    //             <div className={style.statusText}>FAIL</div>
                    //         </div>
                    //     </div>
                    // </div>
                }
                <div className={style.marginTop20}>
                    <ValidationHeader heading={'TIMESHEET SUBMISSION TERMS'} result={isTabsValid?.tab5 ? "PASS" : "FAIL"} />
                    <div className={style.validationPadding}>
                        {
                            isTabsValid?.value5?.map(data => (
                                <div className={style.spaceBetween}>
                                    <div className={style.validationTopicText}>{data}</div>
                                    <div className={style.statusText}>FAIL</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className={style.marginTop20}>
                    <ValidationHeader heading={'PAYMENT & COMPENSATION'} result={isTabsValid?.value6?.length !== 0 ? 'FAIL' : 'PASS'} />
                    <div className={style.validationPadding}>
                        {
                            isTabsValid?.value6?.map(data => (
                                <div className={style.spaceBetween}>
                                    <div className={style.validationTopicText}>{data}</div>
                                    <div className={style.statusText}>FAIL</div>
                                </div>
                            ))
                        }

                    </div>
                </div>
                <div className={style.marginTop20}>
                    <ValidationHeader heading={'TIMESHEET PROCESSING WORKFLOW'} result={isTabsValid?.tab7 ? "PASS" : "FAIL"} />
                    <div className={style.validationPadding}>
                        <div className={style.spaceBetween}>
                            <div className={style.validationTopicText}>Mandatory data element</div>
                            <div className={style.statusText}>{isTabsValid?.tab7 ? "PASS" : "FAIL"}</div>
                        </div>
                    </div>
                </div>
                <div className={`${style.floatRight} ${style.marginTop20}`}>
                    <button className={`${style.cloneOutlinedButton} ${style.buttonHeight40}`} onClick={() => getContractValidationDialog(false)}>CANCEL</button>
                    <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.buttonHeight40}`} onClick={() => getContractValidationDialog(false)}>OK</button>
                </div>
            </div>
        </Dialog>
    )
}

export default ContractValidationCheckSummary;
