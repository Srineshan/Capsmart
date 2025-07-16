import React, { useState, useEffect, useRef } from 'react';
import style from './index.module.scss';
import { Classes, Dialog } from '@blueprintjs/core';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CommonSelectField from '../../../Components/CommonFields/CommonSelectField';
import CommonSwitch from '../../../Components/CommonFields/CommonSwitch';
import CommonRadio from '../../../Components/CommonFields/CommonRadio';
import CancelIcon from '@mui/icons-material/Cancel';
import { GET, POST, PUT } from '../../dataSaver';
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { ErrorToaster2, SuccessToaster2 } from '../../../utils/toaster';
import CommonInputField from '../../../Components/CommonFields/CommonInputField';

const MDManagerStep3 = ({ setStep3, mdValue }) => {
    const containerRef = useRef(null);
    const [targetStaff, setTargetStaff] = useState('ALL_STAFFS');
    const [attestationReviewFrequency, setAttestationReviewFrequency] = useState('');
    const [groupTitle, setGroupTitle] = useState('');
    const [groupDesc, setGroupDesc] = useState('');
    const [staffList, setStaffList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [groupById, setGroupById] = useState();
    const [autoTriggerOnUpdate, setAutoTriggerOnUpdate] = useState(true);
    const [autoTriggerForNewAppointment, setAutoTriggerForNewAppointment] = useState(true);
    const [autoTriggerForReappointment, setAutoTriggerForReappointment] = useState(true);
    const [showAttestationGroupList, setShowAttestationGroupList] = useState(false);
    const [showAttestationGroup, setShowAttestationGroup] = useState(false);
    const [selectedStaffs, setSelectedStaffs] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedStaffForMove, setSelectedStaffForMove] = useState([]);
    console.log(mdValue, 'mdValue')
    useEffect(() => {
        getStaffList()
        getGroupList()
    }, [])

    const getStaffList = async () => {
        const response = await GET(
            `application-management-service/staff?status=ACTIVE&sortByField=STAFF_NAME&isPaginationRequired=${false}&limit=${9999}`
        );
        console.log(response.data);
        setStaffList(response?.data?.staffs)
    }

    const getGroupList = async () => {
        const response = await GET(
            `medical-directive-service/attestationGroup`
        );
        console.log(response.data);
        setGroupList(response?.data)
    }

    const getGroupListById = async (id) => {
        const response = await GET(
            `medical-directive-service/attestationGroup/${id}`
        );
        console.log(response.data);
        setGroupTitle(response?.data?.name)
        setGroupDesc(response?.data?.description)
        setSelectedStaffs(response?.data?.members?.map(data => data?.id))
        setGroupById(response?.data)
        setShowAttestationGroup(true)
    }

    const filteredStaffArray = selectedStaffs?.map((id) => {
        const matchedStaff = staffList?.find((staff) => staff.id === id);
        return {
            id: id,
            name: matchedStaff?.applicant?.name,
            email: matchedStaff?.applicant?.email,
        };
    });

    const filteredGroupArray = selectedGroups?.map((id) => {
        const matchedGroup = groupList?.find((group) => group.id === id);
        return {
            id: id,
            name: matchedGroup?.name,
        };
    });

    const handleBlur = (e) => {
        setTimeout(() => {
            if (
                containerRef.current &&
                !containerRef.current.contains(document.activeElement)
            ) {
                setShowAttestationGroupList(false);
            }
        }, 0);
    };

    const handleMove = () => {
        if (!selectedStaffs?.includes(selectedStaffForMove)) {
            setSelectedStaffs(prev => [...prev, selectedStaffForMove]);
        }
    }

    const handleRemove = () => {
        console.log('filterCheck')
        setSelectedStaffs(selectedStaffs?.filter(data => data !== selectedStaffForMove))
    }

    const handleMoveBulk = () => {
        console.log('filterCheck')
        setSelectedStaffs(staffList?.map(data => data?.id))
    }

    const handleRemoveBulk = () => {
        console.log('filterCheck')
        setSelectedStaffs([])
    }

    const handleGroupSelect = (id) => {
        if (!selectedGroups?.includes(id)) {
            setSelectedGroups(prev => [...prev, id]);
        }
    }

    const handleGroupDialogClose = () => {
        setGroupById();
        getGroupList();
        setShowAttestationGroup(false);
    }


    const handleContinue = async () => {
        const formData = new FormData();
        console.log(mdValue)
        let data = {
            id: mdValue?.id,
            title: mdValue?.title,
            mdID: mdValue?.mdID,
            departments: mdValue?.departments,
            // implementers: [],
            reviewFrequency: mdValue?.reviewFrequency,
            attestationPeriod: {
                value: attestationReviewFrequency === "EVERY_1_YEAR" ? 1 : attestationReviewFrequency === "EVERY_2_YEARS" ? 2 : attestationReviewFrequency === "EVERY_3_YEARS" ? 3 : 0,
                unit: "YEARS"
            },
            author: mdValue?.author,
            publishedDate: mdValue?.publishedDate,
            tags: mdValue?.tags,
            file: mdValue?.file,
            autoTriggerOnUpdate: autoTriggerOnUpdate,
            updateFor: targetStaff,
            groups: filteredGroupArray,
            triggerForNewAppointment: autoTriggerForNewAppointment,
            triggerForReAppointment: autoTriggerForReappointment,
            departmentSpecific: mdValue?.departmentSpecific,
        }

        formData.append(
            "metaDataDTO",
            new Blob([JSON.stringify(data)], {
                type: "application/json",
            })
        );
        // formData.append("file", mdFile);

        console.log(data)

        await PUT(`medical-directive-service/medicalDirectives/${mdValue?.id}`, formData)
            .then(response => {
                SuccessToaster2('MD Uploaded Successfully');
                console.log(response?.data)
                setStep3(false)
            })
            .catch(error => {
                ErrorToaster2('MD Upload Failed');
            })

    }

    const handleAddGroup = async () => {
        let data = {
            "name": groupTitle,
            "description": groupDesc,
            "members": filteredStaffArray
        }

        console.log(data)
        if (!groupById) {
            await POST(`medical-directive-service/attestationGroup`, data)
                .then(response => {
                    SuccessToaster2('Group Added Successfully');
                    console.log(response?.data)
                    handleGroupDialogClose()
                })
                .catch(error => {
                    ErrorToaster2('Something Failed. Please Try later!');
                })
        } else {
            await PUT(`medical-directive-service/attestationGroup/${groupById?.id}`, data)
                .then(response => {
                    SuccessToaster2('Group Updated Successfully');
                    console.log(response?.data)
                    handleGroupDialogClose()
                })
                .catch(error => {
                    ErrorToaster2('Something Failed. Please Try later!');
                })
        }
    }

    console.log(staffList.filter(staff => selectedStaffs?.includes(staff.id)), 'filterCheck', selectedStaffs, selectedStaffForMove)
    return (
        <div className={style.stepsBackground}>
            <div className={`${style.stepHeader} ${style.spaceBetween} ${style.verticalAlignCenter}`}>
                <div className={style.displayInRow}>
                    <div className={`${style.stepNumber} ${style.marginLeft10}`}>Step 3</div>
                    <div className={`${style.stepHeading} ${style.marginLeft20}`}>Set Up Staff Review & Attestation Rules</div>
                </div>
                <div className={style.displayInRow}>
                    <div className={`${style.spaceBetween}`}>
                        <button className={`${style.outlinedButtonMd} ${style.marginRight} `} onClick={() => { setStep3(false) }} >SAVE IN PROGRESS</button>
                        <button className={`${style.buttonStyleMd} ${style.marginRight} `} onClick={() => { handleContinue() }} >CONTINUE</button>
                    </div>
                </div>
            </div>
            <div className={style.stepContentCard}>
                <div className={`${style.stepsTitleBar} ${style.verticalAlignCenter}`}>
                    <div className={style.stepsTitleText}>Attestation Rules to apply</div>
                </div>
                <div className={`${style.padding40} ${style.marginTop20}`}>
                    <div className={`${style.marginTop20} ${style.twoCol}`}>
                        <div className={style.labelStyle}>Target Staff for Medical Directive review and attestation</div>
                        <CommonRadio
                            value={targetStaff}
                            onChange={(e) => setTargetStaff(e.target.value)}
                            radioValue={["ALL_STAFFS", "SELECTED_GROUPS"]}
                            label={["All Staff Members", "Selected Groups"]}
                        />
                    </div>
                    {targetStaff === "SELECTED_GROUPS" && (
                        <div className={style.padding20}>
                            <CommonSelectField
                                //   value={selectedCategory}
                                //   onChange={(e) => setSelectedCategory(e.target.value)}
                                className={style.fullWidth1}
                                //   firstOptionLabel={'Select Category'}
                                //   firstOptionValue={''}
                                valueList={["Emergency Department Registered Users", "Every 2 Year", "Every 3 Year"]}
                                labelList={["Emergency Department Registered Users", "Every 2 Year", "Every 3 Year"]}
                                disabledList={false}
                                required={true}
                                label={"Authorized Implementers / Responsible Disciplines"}
                            />
                            <div className={style.labelStyle}>Select Attestation Groups for Medical Directive reviews</div>
                            <div className={style.attestationGrid}>
                                <div ref={containerRef} onFocus={() => setShowAttestationGroupList(true)} onBlur={handleBlur}
                                    tabIndex={0}>
                                    <CommonInputField
                                        className={style.fullWidth}
                                        // value={keyword}
                                        // onChange={(e) => setKeyword(e.target.value)}
                                        type="text"
                                    // placeholder="Enter Keywords / Tags"
                                    />
                                    {showAttestationGroupList && (
                                        <div className={`${style.attestationGroupCard} ${style.padding20}`} tabIndex={0}>
                                            {groupList?.map((data, index) => (
                                                <div className={`${style.groupDisplayGrid} ${style.verticalAlignCenter}`}>
                                                    <div className={`${style.labelStyle} ${style.cursorPointer}`} onClick={() => handleGroupSelect(data?.id)}>{data?.name}</div>
                                                    <div className={`${style.attestationDescStyle} ${style.verticalAlignCenter}`}
                                                        dangerouslySetInnerHTML={{ __html: data?.description }} />
                                                    <div className={`${style.attestationViewButton} ${style.cursorPointer}`} onClick={() => getGroupListById(data?.id)}>View Group Members</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className={` ${style.addNewButton} ${style.textColorWhite} ${style.createGroupButton} ${style.marginLeft20} ${style.cursorPointer}`} onClick={() => setShowAttestationGroup(true)}>
                                    <AddIcon />
                                    <span> Create New Group</span>
                                </div>
                            </div>
                            <div>
                                <div className={`${style.chipsContainer} ${style.marginTop10}`}>
                                    {selectedGroups?.map(data => {
                                        return (
                                            <div className={`${style.chips} ${style.displayInRow}`}>
                                                <div>{groupList?.filter(groupData => groupData?.id === data)?.[0]?.name}</div> <div className={`${style.verticalAlignCenter} ${style.marginLeft10} ${style.cursorPointer}`}
                                                    onClick={() => setSelectedGroups(selectedGroups?.filter(innerData => innerData !== data))}
                                                ><CancelIcon sx={{ color: '#06617A', fontSize: 20 }} /></div></div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className={`${style.marginTop20} ${style.twoCol}`}>
                        <div className={style.labelStyle}>Auto trigger reviews and attestations on revision / update of Medical Directive</div>
                        <CommonSwitch label={autoTriggerOnUpdate ? 'YES' : 'NO'} checked={autoTriggerOnUpdate} onChange={(e) => setAutoTriggerOnUpdate(e.target.checked)} labelName={''} />
                    </div>
                    <div className={`${style.marginTop20} ${style.twoCol}`}>
                        <div className={style.labelStyle}>Auto trigger review and attestations for approved new staff applicant</div>
                        <CommonSwitch label={autoTriggerForNewAppointment ? 'YES' : 'NO'} checked={autoTriggerForNewAppointment} onChange={(e) => setAutoTriggerForNewAppointment(e.target.checked)} labelName={''} />
                    </div>
                    <div className={`${style.marginTop20} ${style.twoCol}`}>
                        <div className={style.labelStyle}>Auto trigger review and attestations for staff reappointment</div>
                        <CommonSwitch label={autoTriggerForReappointment ? 'YES' : 'NO'} checked={autoTriggerForReappointment} onChange={(e) => setAutoTriggerForReappointment(e.target.checked)} labelName={''} />
                    </div>
                    <div className={`${style.marginTop20} ${style.twoCol}`}>
                        <CommonSelectField
                            value={attestationReviewFrequency}
                            onChange={(e) => setAttestationReviewFrequency(e.target.value)}
                            className={style.fullWidth1}
                            //   firstOptionLabel={'Select Category'}
                            //   firstOptionValue={''}
                            valueList={["EVERY_1_YEAR", "EVERY_2_YEARS", "EVERY_3_YEARS"]}
                            labelList={["Every 1 Year", "Every 2 Years", "Every 3 Years"]}
                            disabledList={false}
                            required={false}
                            label={"Frequency of Review for Attestation (if none within the period selected)"}
                        />
                    </div>
                </div>
            </div>
            <Dialog isOpen={showAttestationGroup} onClose={() => handleGroupDialogClose()} className={`${style.addMDDialogBackground} ${style.attestationDialog}`}>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.attestationDialogHeaderCard}>
                        <div className={`${style.attestationDialogTitle} ${style.padding20}`}>Attestation Group</div>
                    </div>
                    <div className={style.marginTop10}>
                        <div className={style.labelStyle}>Group Title*</div>
                        <CommonInputField
                            className={style.fullWidth}
                            value={groupTitle}
                            onChange={(e) => setGroupTitle(e.target.value)}
                            type="text"
                        // placeholder="Enter Keywords / Tags"
                        />
                    </div>
                    <div>
                        <div className={style.marginTop10}>
                            <div className={style.labelStyle}>Group Description</div>
                            <CKEditor
                                editor={ClassicEditor}
                                data={groupDesc}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setGroupDesc(data);
                                }}
                                onReady={(editor) => {
                                    editor.editing.view.change((writer) => {
                                        writer.setStyle(
                                            "height",
                                            "50px",
                                            editor.editing.view.document.getRoot()
                                        );
                                    });
                                }}
                                config={{
                                    placeholder: "Type your content here...",
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
                    </div>
                    <div className={style.marginTop10}>
                        <div className={style.attestationGroupGrid}>
                            <div>
                                <div className={style.labelStyle}>Available Staff Members ({staffList?.filter(staff => !selectedStaffs?.includes(staff.id))?.length})</div>

                                <div className={style.attestationGroupRightCard}>
                                    {staffList?.filter(staff => !selectedStaffs?.includes(staff.id))?.map((data, index) => (
                                        <div className={style.groupGrid} key={index}>
                                            <div className={`${style.staffName} ${style.cursorPointer} ${selectedStaffForMove === data?.id ? style.selectedStaff : ''}`} onClick={() => setSelectedStaffForMove(data?.id)}>{`${data?.applicant?.name?.firstName} ${data?.applicant?.name?.lastName?.toUpperCase()}${data?.basicDetailReferences?.applicantType?.serviceProviderType ? `, ${data?.basicDetailReferences?.applicantType?.serviceProviderType}` : ''}`}</div>
                                            {/* <div className={style.staffName}></div> */}
                                            <div className={`${style.labelStyle} ${selectedStaffForMove === data?.id ? style.selectedStaff : ''}`}>{data?.basicDetailReferences?.department?.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={style.verticalAlignCenter}>
                                <div className={`${style.displayInCol}`}>
                                    <div className={`${style.moveCard} ${style.justifyCenter} ${style.verticalAlignCenter} ${staffList?.filter(staff => !selectedStaffs?.includes(staff.id))?.length === 0 ? style.disabledView : style.cursorPointer}`} onClick={staffList?.filter(staff => !selectedStaffs?.includes(staff.id))?.length === 0 ? () => { } : () => handleMove()}>
                                        <KeyboardArrowRightIcon sx={{ color: '#06617A' }} />
                                    </div>
                                    <div className={`${style.moveCard} ${style.marginTop10} ${style.justifyCenter} ${style.verticalAlignCenter} ${staffList?.filter(staff => !selectedStaffs?.includes(staff.id))?.length === 0 ? style.disabledView : style.cursorPointer}`} onClick={staffList?.filter(staff => !selectedStaffs?.includes(staff.id))?.length === 0 ? () => { } : () => handleMoveBulk()}>
                                        <KeyboardDoubleArrowRightIcon sx={{ color: '#06617A' }} />
                                    </div>
                                    <div className={`${style.moveCard} ${style.marginTop20} ${style.justifyCenter} ${style.verticalAlignCenter} ${staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.length === 0 ? style.disabledView : style.cursorPointer}`} onClick={staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.length === 0 ? () => { } : () => handleRemove()}>
                                        <KeyboardArrowLeftIcon sx={{ color: '#06617A' }} />
                                    </div>
                                    <div className={`${style.moveCard} ${style.marginTop10} ${style.justifyCenter} ${style.verticalAlignCenter} ${staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.length === 0 ? style.disabledView : style.cursorPointer}`} onClick={staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.length === 0 ? () => { } : () => handleRemoveBulk()}>
                                        <KeyboardDoubleArrowLeftIcon sx={{ color: '#06617A' }} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className={style.labelStyle}>Attestation Group Members ({staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.length})</div>
                                <div className={style.attestationGroupRightCard}>
                                    {staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.map((data, index) => (
                                        <div className={style.groupGrid} key={index}>
                                            <div className={`${style.staffName} ${style.cursorPointer} ${selectedStaffForMove === data?.id ? style.selectedStaff : ''}`} onClick={() => setSelectedStaffForMove(data?.id)}>{`${data?.applicant?.name?.firstName} ${data?.applicant?.name?.lastName?.toUpperCase()}${data?.basicDetailReferences?.applicantType?.serviceProviderType ? `, ${data?.basicDetailReferences?.applicantType?.serviceProviderType}` : ''}`}</div>
                                            {/* <div className={style.staffName}></div> */}
                                            <div className={`${style.labelStyle} ${selectedStaffForMove === data?.id ? style.selectedStaff : ''}`}>{data?.basicDetailReferences?.department?.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                            <button className={`${style.outlinedButton} `} onClick={() => handleGroupDialogClose()} >CANCEL</button>
                            <button className={`${style.buttonStyle} `} onClick={() => handleAddGroup()} >{groupById ? 'UPDATE' : 'ADD'}</button>
                        </div>
                    </div>
                </div>
            </Dialog >
        </div>
    )
}

export default MDManagerStep3;