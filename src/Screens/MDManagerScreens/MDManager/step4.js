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
import CommonMultiSelectField from '../../../Components/CommonFields/CommonMultiSelectField';
import { Tooltip } from '@mui/material';

const MDManagerStep4 = ({ setStep3, setStep4, mdValue, setMdValue, setSelectedMdId }) => {
    const containerRef = useRef(null);
    const [isConfirmationDialog, setIsConfirmationDialog] = useState(false);
    const [isSaveInProgressDialog, setIsSaveInProgressDialog] = useState(false);
    const [targetStaff, setTargetStaff] = useState('ALL_STAFFS');
    const [attestationReviewFrequency, setAttestationReviewFrequency] = useState('');
    const [groupTitle, setGroupTitle] = useState('');
    const [groupType, setGroupType] = useState('');
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
    const [workFlow1IsMandatory, setWorkFlow1IsMandatory] = useState(false);
    const [workFlow2IsMandatory, setWorkFlow2IsMandatory] = useState(false);
    const [selectedSignOffGroups, setSelectedSignOffGroups] = useState([]);
    const [selectedRolesWorkflow1, setSelectedRolesWorkflow1] = useState([]);
    const [selectedRolesWorkflow, setSelectedRolesWorkflow] = useState([]);
    const [selectedStaffsWorkflow, setSelectedStaffsWorkflow] = useState([]);
    const [selectedGroupsWorkflow, setSelectedGroupsWorkflow] = useState([]);
    const [selectedStaffForMove, setSelectedStaffForMove] = useState([]);
    const [workflowStructure, setWorkflowStructure] = useState();
    const [showWorkflowSelection, setShowWorkflowSelection] = useState(false);
    const [roles, setRoles] = useState([]);
    const [workflowEdited, setWorkflowEdited] = useState(false);
    const [isGroupEdited, setIsGroupEdited] = useState(false);
    const [signOffExists, setSignOffExists] = useState(false);
    console.log(mdValue, 'mdValue')
    useEffect(() => {
        getGroupList()
        // getPublicationWorkflow();
        getRoles();
    }, [])

    useEffect(() => {
        getStaffList()
    }, [groupType])

    useEffect(() => {
        console.log(mdValue, 'mdValue', mdValue?.departments?.flatMap(data => data?.serviceAreas?.map(innerData => innerData?.id) || []) || [])
        if (mdValue) {
            setAttestationReviewFrequency(mdValue?.attestationPeriod?.value === 1 ? 'EVERY_1_YEAR' : mdValue?.attestationPeriod?.value === 2 ? 'EVERY_2_YEARS' : mdValue?.attestationPeriod?.value === 3 ? 'EVERY_3_YEARS' : '');
            setAutoTriggerOnUpdate(mdValue?.autoTriggerOnUpdate)
            setTargetStaff(mdValue?.updateFor);
            setSelectedGroups(mdValue?.groups?.map(data => data?.id))
            setAutoTriggerForNewAppointment(mdValue?.triggerForNewAppointment)
            setAutoTriggerForReappointment(mdValue?.triggerForReAppointment)
            getWorkflow()
        }
    }, [mdValue])

    const getWorkflow = async () => {
        const response = await GET(
            `medical-directive-service/medicalDirectives/${mdValue?.id}/workflow`
        );
        setWorkflowStructure(response?.data)
        console.log(response, response?.data?.approvalFlowMap?.workflow['3']?.flowDetails?.[0]?.groups?.map(data => data?.group?.id) || [])
        // setWorkFlow2IsMandatory(response?.data?.approvalFlowMap?.workflow['2']?.flowDetails?.[0]?.approvalRequirement === 'MANDATORY' ? true : false)
        setSelectedSignOffGroups(response?.data?.approvalFlowMap?.workflow['3']?.flowDetails?.[0]?.groups?.map(data => data?.group?.id) || [])
        setSignOffExists(mdValue?.workflowStatus === "IN_PROGRESS")
    }

    const getStaffList = async () => {
        // const response = await GET(
        //     `application-management-service/staff?status=ACTIVE&sortByField=STAFF_NAME&isPaginationRequired=${false}&limit=${9999}`
        // );
        const response = await POST(
            `user-management-service/user/allStaffs?status=ACTIVE&roles=${groupType === "ACKNOWLEDGEMENT" ? ["Acknowledger"] : groupType === "SIGN_OFF" ? ["Reviewer / Approver"] : groupType === "ATTESTATION" ? ["Attester"] : []}`
        );
        console.log(response.data);
        setStaffList(response?.data)
    }

    const getGroupList = async () => {
        const response = await GET(
            `medical-directive-service/medicalDirectiveGroup`
        );
        console.log(response.data);
        setGroupList(response?.data)
    }

    const getGroupListById = async (id) => {
        const response = await GET(
            `medical-directive-service/medicalDirectiveGroup/${id}`
        );
        console.log(response.data);
        setGroupTitle(response?.data?.name)
        setGroupDesc(response?.data?.description)
        setGroupType(response?.data?.type)
        setSelectedStaffs(response?.data?.members?.map(data => data?.id))
        setGroupById(response?.data)
        setShowAttestationGroup(true)
    }

    // const getPublicationWorkflow = async () => {
    //     const response = await GET(
    //         `medical-directive-service/publicationWorkFlow`
    //     );
    //     setWorkflowStructure(response.data?.[0])
    //     console.log(response.data?.[0], 'workflow');
    // }

    const getRoles = async () => {
        const { data: roles } = await GET('user-management-service/roles?roleType=APP_SYSTEM&roleType=SYSTEM');
        setRoles(roles?.filter(data => data?.roleName !== 'Activity Logger')?.map(data => data));
    };

    const filteredStaffArray = selectedStaffs?.map((id) => {
        const matchedStaff = staffList?.find((staff) => staff.id === id);
        return {
            id: id,
            name: matchedStaff?.name,
            email: matchedStaff?.email,
            sites: matchedStaff?.sites
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
        setIsGroupEdited(true)
    }

    const handleRemove = () => {
        console.log('filterCheck')
        setSelectedStaffs(selectedStaffs?.filter(data => data !== selectedStaffForMove))
        setIsGroupEdited(true)
    }

    const handleMoveBulk = () => {
        console.log('filterCheck')
        setSelectedStaffs(staffList?.map(data => data?.id))
        setIsGroupEdited(true)
    }

    const handleRemoveBulk = () => {
        console.log('filterCheck')
        setSelectedStaffs([])
        setIsGroupEdited(true)
    }

    const handleGroupSelect = (id) => {
        if (!selectedSignOffGroups?.includes(id)) {
            setSelectedSignOffGroups(prev => [...prev, id]);
        }
        setWorkflowEdited(true)
    }

    const handleGroupDialogClose = () => {
        setGroupById();
        getGroupList();
        setShowAttestationGroup(false);
        setIsGroupEdited(false)
    }

    const handlePublish = async (data) => {
        try {
            const { data: publishedMD } = await POST(`medical-directive-service/medicalDirectives/${mdValue?.id}/publish`);
            SuccessToaster2('Medical Directive published successfully');
        } catch (error) {
            console.error(error);
            ErrorToaster2('Failed to publish Medical Directive');
        }
    }


    const handleContinue = async (isSaveInProgress) => {
        if (isSaveInProgress) {
            const formData = new FormData();

            let data = mdValue;
            data.lastSavedSection = 'step4';
            formData.append(
                "metaDataDTO",
                new Blob([JSON.stringify(data)], {
                    type: "application/json",
                })
            );
            await PUT(`medical-directive-service/medicalDirectives/${mdValue?.id}`, formData)
                .then(response => {
                    SuccessToaster2('MD Updateded Successfully');
                })
                .catch(error => {
                    ErrorToaster2('MD Upload Failed');
                })
            await PUT(`medical-directive-service/medicalDirectives/${mdValue?.id}/saveInprogress`, 'step4')
            handleClose();
            setStep4(false);
        } else {
            let errors = [];

            if (selectedSignOffGroups?.length === 0) errors.push("Sign Off Group selection is required.");
            if (errors.length) {
                errors.forEach(err => ErrorToaster2(err));
                return;
            }
            let acknowledgementData = workflowStructure;
            const transformedGroups = selectedSignOffGroups?.map((groupId) => {
                const group = groupList.find((g) => g.id === groupId);

                return {
                    group: {
                        id: group?.id,
                        name: group?.name,
                    },
                    approvalRequirementType: "ANY_MEMBER",
                };
            });
            if (workflowEdited) {
                if (selectedSignOffGroups?.length !== 0) {
                    if (
                        acknowledgementData?.approvalFlowMap?.workflow?.[3]?.flowDetails?.[0]
                    ) {
                        acknowledgementData.approvalFlowMap.workflow[3].flowDetails[0].approvalRequirement = "MANDATORY";
                    }
                    if (workflowStructure?.approvalFlowMap?.workflow[3]?.flowDetails?.[0]?.approvalBy === 'GROUP') {
                        acknowledgementData.approvalFlowMap.workflow[3].flowDetails[0].groups = transformedGroups
                    }
                    await PUT(`medical-directive-service/medicalDirectives/${mdValue?.id}/workflow`, acknowledgementData)
                        .then(response => {
                            SuccessToaster2('Workflow Added Successfully');
                        })
                        .catch(error => {
                            ErrorToaster2('Something Failed. Please Try later!');
                        })
                }
                await PUT(`medical-directive-service/medicalDirectives/${mdValue?.id}/startWorkflow`)
                    .then(response => {
                        // SuccessToaster2('Sign Off Started Successfully');
                    })
                    .catch(error => {
                        // ErrorToaster2('Something Failed. Please Try later!');
                    })
            }
            setIsConfirmationDialog(false)
            setStep4(false)
            // setShowWorkflowSelection(true)
        }
    }

    const handleAddGroup = async () => {
        let errors = [];

        if (!groupTitle) errors.push("Group Title is required.");
        if (!groupType) errors.push("Group Type is required.");
        if (selectedStaffs?.length === 0) errors.push("Group Members is required");
        if (errors.length) {
            errors.forEach(err => ErrorToaster2(err));
            return;
        }
        let data = {
            "name": groupTitle,
            "description": groupDesc,
            "members": filteredStaffArray,
            "type": groupType
        }

        console.log(data)
        if (!groupById) {
            await POST(`medical-directive-service/medicalDirectiveGroup`, data)
                .then(response => {
                    SuccessToaster2('Group Added Successfully');
                    console.log(response?.data)
                    handleGroupDialogClose()
                })
                .catch(error => {
                    ErrorToaster2('Something Failed. Please Try later!');
                })
        } else {
            await PUT(`medical-directive-service/medicalDirectiveGroup/${groupById?.id}`, data)
                .then(response => {
                    SuccessToaster2('Group Updated Successfully');
                    console.log(response?.data)
                    handleGroupDialogClose()
                })
                .catch(error => {
                    ErrorToaster2('Something Failed. Please Try later!');
                })
        }
        setIsGroupEdited(false)
    }

    const handleSaveWorkflow = async (type) => {
        let data = workflowStructure;
        const transformedGroups = selectedGroupsWorkflow?.map((groupId) => {
            const group = groupList.find((g) => g.id === groupId);

            return {
                group: {
                    id: group?.id,
                    name: group?.name,
                },
                approvalRequirementType: "ANY_MEMBER",
            };
        });

        const transformedRoles = selectedRolesWorkflow1?.map((roleId) => {
            const role = roles.find((r) => r.id === roleId);

            return {
                role: {
                    id: role?.id,
                    roleName: role?.roleName,
                    roleDescription: role?.roleDescription
                },
            };
        });
        data.approvalFlowMap.workflow[1].flowDetails[0].approvalRequirement = workFlow1IsMandatory ? 'MANDATORY' : 'OPTIONAL';
        if (workflowStructure?.approvalFlowMap?.workflow[1]?.flowDetails?.[0]?.approvalBy === 'ROLE') {
            data.approvalFlowMap.workflow[1].flowDetails[0].roles = transformedRoles
        }
        if (workFlow2IsMandatory) {
            data.approvalFlowMap.workflow[3].flowDetails[0].approvalRequirement = 'MANDATORY';
            if (workflowStructure?.approvalFlowMap?.workflow[3]?.flowDetails?.[0]?.approvalBy === 'GROUP') {
                data.approvalFlowMap.workflow[3].flowDetails[0].groups = transformedGroups
            }
        } else {
            if (data?.approvalFlowMap?.workflow?.[3]) {
                delete data.approvalFlowMap.workflow["3"]
            }
        }
        console.log(workflowStructure?.approvalFlowMap?.workflow[3]?.flowDetails?.[0]?.approvalBy === 'GROUP', data)
        await POST(`medical-directive-service/medicalDirectives/${mdValue?.id}/workflow`, data)
            .then(response => {
                SuccessToaster2('Workflow Added Successfully');
            })
            .catch(error => {
                ErrorToaster2('Something Failed. Please Try later!');
            })
        if (type === 'Save_And_Start') {
            await PUT(`medical-directive-service/medicalDirectives/${mdValue?.id}/startWorkflow`)
                .then(response => {
                    SuccessToaster2('Sign Off Started Successfully');
                })
                .catch(error => {
                    ErrorToaster2('Something Failed. Please Try later!');
                })
        }
        handleWorkflowClose();
    }

    const handleWorkflowClose = () => {
        setShowWorkflowSelection(false);
        setStep3(false);
        handleClose();
    }

    const handleCreateGroup = () => {
        setGroupTitle('');
        setGroupType('');
        setGroupDesc('');
        setSelectedStaffs([]);
        setShowAttestationGroup(true)
    }

    const handleClose = () => {
        setMdValue();
        setSelectedMdId('');
    }
    return (
        <div className={style.stepsBackground}>
            <div className={`${style.stepHeader} ${style.spaceBetween} ${style.verticalAlignCenter}`}>
                <div className={style.displayInRow}>
                    <div className={`${style.stepNumber} ${style.marginLeft10}`}>Step 4</div>
                    <div className={`${style.stepHeading} ${style.marginLeft20}`}>Set Up Leadership Sign Off</div>
                </div>
                <div className={style.displayInRow}>
                    <div className={`${style.spaceBetween}`}>
                        <Tooltip arrow title='Click to go Back'>
                            <button className={`${style.buttonStyleMd} ${style.marginRight} `} onClick={() => { setStep3(true); setStep4(false) }} >BACK</button>
                        </Tooltip>
                        {/* {mdValue?.creationType === "RENEW" && (
                            <button className={`${style.buttonStyle} ${style.marginRight} `} onClick={() => handleContinue(true)} >{'PUBLISH'}</button>
                        )} */}
                        <Tooltip arrow title='Click to Save In-Progress'>
                            <button className={`${style.outlinedButtonMd} ${style.marginRight} `} onClick={() => { setIsSaveInProgressDialog(true) }} >SAVE IN PROGRESS</button>
                        </Tooltip>
                        <Tooltip arrow title='Click to Continue'>
                            <button className={`${style.buttonStyleMd} ${style.marginRight} `} onClick={() => { signOffExists ? setStep4(false) : setIsConfirmationDialog(true) }} >CONTINUE</button>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div className={`${style.stepContentCard}`}>
                <div className={`${style.stepsTitleBar} ${style.verticalAlignCenter}`}>
                    <div className={style.stepsTitleText}>Leadership Sign Off Prior To Publication Of This Medical Directive Into The Library</div>
                </div>
                <div className={`${style.padding40} ${style.marginTop20} ${signOffExists ? style.disabledView : ''}`}>
                    <div className={style.padding20}>
                        <div className={style.labelStyle}>Select Leadership Sign Off Group*</div>
                        <div className={style.attestationGrid}>
                            <div ref={containerRef} onFocus={signOffExists ? () => { } : () => setShowAttestationGroupList(true)} onBlur={handleBlur}
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
                                        {groupList?.filter(data => data?.type === "SIGN_OFF" && !selectedSignOffGroups?.includes(data?.id))?.map((data, index) => (
                                            <div className={`${style.groupDisplayGrid} ${style.verticalAlignCenter}`}>
                                                <div className={`${style.labelStyle} ${style.cursorPointer}`} onClick={signOffExists ? () => { } : () => handleGroupSelect(data?.id)}>{data?.name}</div>
                                                <div className={`${style.attestationDescStyle} ${style.verticalAlignCenter}`}
                                                    dangerouslySetInnerHTML={{ __html: data?.description }} />
                                                <div className={`${style.attestationViewButton} ${style.cursorPointer}`} onClick={signOffExists ? () => { } : () => getGroupListById(data?.id)}>View Group Members</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className={` ${style.addNewButton} ${style.textColorWhite} ${style.createGroupButton} ${style.marginLeft20} ${style.cursorPointer}`} onClick={signOffExists ? () => { } : () => handleCreateGroup()}>
                                <AddIcon />
                                <span> Create New Group</span>
                            </div>
                        </div>
                        <div>
                            <div className={`${style.chipsContainer} ${style.marginTop10}`}>
                                {selectedSignOffGroups?.map(data => {
                                    return (
                                        <div className={`${style.chips} ${style.displayInRow}`}>
                                            <div>{groupList?.filter(groupData => groupData?.id === data)?.[0]?.name}</div> <div className={`${style.verticalAlignCenter} ${style.marginLeft10} ${style.cursorPointer}`}
                                                onClick={signOffExists ? () => { } : () => { setSelectedSignOffGroups(selectedSignOffGroups?.filter(innerData => innerData !== data)); setWorkflowEdited(true) }}
                                            ><CancelIcon sx={{ color: '#06617A', fontSize: 20 }} /></div></div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog isOpen={showAttestationGroup} onClose={() => handleGroupDialogClose()} className={`${style.addMDDialogBackground} ${style.attestationDialog}`}>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.attestationDialogHeaderCard}>
                        <div className={`${style.attestationDialogTitle} ${style.padding20}`}>Group</div>
                    </div>
                    <div className={style.marginTop10}>
                        <div className={style.labelStyle}>Group Title*</div>
                        <CommonInputField
                            className={style.fullWidth}
                            value={groupTitle}
                            onChange={(e) => { setGroupTitle(e.target.value); setIsGroupEdited(true) }}
                            type="text"
                            maxLength={35}
                        // placeholder="Enter Keywords / Tags"
                        />
                    </div>
                    <div className={style.marginTop10}>
                        <div className={style.labelStyle}>Group Type*</div>
                        <CommonSelectField
                            value={groupType}
                            onChange={(e) => { setGroupType(e.target.value); setIsGroupEdited(true) }}
                            className={style.fullWidth1}
                            //   firstOptionLabel={'Select Category'}
                            //   firstOptionValue={''}
                            valueList={["ACKNOWLEDGEMENT", "ATTESTATION", "SIGN_OFF"]}
                            labelList={["Acknowledgement", "Attestation", "Sign Off"]}
                            disabledList={false}
                            required={false}
                        // label={""}
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
                                    const plainText = data.replace(/<[^>]*>/g, ""); // strip HTML tags
                                    const maxLength = 200; // your limit

                                    if (plainText.length <= maxLength) {
                                        setGroupDesc(data);
                                        setIsGroupEdited(true);
                                    } else {
                                        // if pasted/typed exceeds max, truncate
                                        const truncated = plainText.substring(0, maxLength);
                                        editor.setData(truncated);
                                        setGroupDesc(truncated);
                                        setIsGroupEdited(true);
                                    }
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
                                            <div className={`${style.staffName} ${style.verticalAlignCenter} ${style.cursorPointer} ${selectedStaffForMove === data?.id ? style.selectedStaff : ''}`} onClick={() => setSelectedStaffForMove(data?.id)}>{`${data?.name?.firstName} ${data?.name?.lastName?.toUpperCase()}${data?.serviceProviderType?.contractedServiceProviderType ? `, ${data?.serviceProviderType?.contractedServiceProviderType}` : ''}`}</div>
                                            {/* <div className={style.staffName}></div> */}
                                            <div className={`${style.labelStyle} ${selectedStaffForMove === data?.id ? style.selectedStaff : ''}`}>{data?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.departmentName?.name ? data?.sites?.sites?.[0]?.departmentList?.departments?.map(
                                                (dept) => dept?.departmentName?.name
                                            )?.join(', ') : ''}</div>
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
                                <div className={style.labelStyle}>Group Members ({staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.length})</div>
                                <div className={style.attestationGroupRightCard}>
                                    {staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.map((data, index) => (
                                        <div className={style.groupGrid} key={index}>
                                            <div className={`${style.staffName} ${style.verticalAlignCenter} ${style.cursorPointer} ${selectedStaffForMove === data?.id ? style.selectedStaff : ''}`} onClick={() => setSelectedStaffForMove(data?.id)}>{`${data?.name?.firstName} ${data?.name?.lastName?.toUpperCase()}${data?.serviceProviderType?.contractedServiceProviderType ? `, ${data?.serviceProviderType?.contractedServiceProviderType}` : ''}`}</div>
                                            {/* <div className={style.staffName}></div> */}
                                            <div className={`${style.labelStyle} ${selectedStaffForMove === data?.id ? style.selectedStaff : ''}`}>{data?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.departmentName?.name ? data?.sites?.sites?.[0]?.departmentList?.departments?.map(
                                                (dept) => dept?.departmentName?.name
                                            )?.join(', ') : ''}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                            <button className={`${style.outlinedButton} `} onClick={() => handleGroupDialogClose()} >CANCEL</button>
                            <button className={`${style.buttonStyle}  ${!isGroupEdited ? style.disabledView : ''}`} onClick={!isGroupEdited ? () => { } : () => handleAddGroup()} >{groupById ? 'UPDATE' : 'ADD'}</button>
                        </div>
                    </div>
                </div>
            </Dialog >
            <Dialog isOpen={isConfirmationDialog} onClose={() => setIsConfirmationDialog(false)} className={`${style.addMDDialogBackground} ${style.confirmationDialog} `}>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.attestationDialogHeaderCard}>
                        <div className={`${style.attestationDialogTitle} ${style.padding20} `}>Great Job! Your Medical Directive Authoring is Complete!</div>
                    </div>
                    <div className={`${style.marginTop10} `}>
                        <div className={style.labelStyle}>All of the steps required for publishing this Medical Directive have been defined. Once you click on "Start Pre-Publication Workflow" this Medical Directive will be moved over to "MD Review & Approvals" list.</div>
                        <div className={`${style.labelStyle} ${style.marginTop20}`}>Please note, from this list you will only be able to assign or reassign members within workflow groups, but not be able modify the meta data or the content of the Medical Directive.</div>
                    </div>

                    <div>
                        <div className={`${style.spaceBetween} ${style.marginTop20} `}>
                            <button className={`${style.outlinedButtonWithBiggerWidth} `} onClick={() => setIsConfirmationDialog(false)} >CANCEL</button>
                            <button className={`${style.buttonStyleWithBiggerWidth} ${style.marginLeft10} `} onClick={() => handleContinue()} >{'START PRE-PUBLICATION WORKFLOW'}</button>
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
                            <button className={`${style.buttonStyleWithBiggerWidth} ${style.marginLeft10} `} onClick={() => { handleContinue(true) }} >{'SAVE & CONTINUE LATER'}</button>
                        </div>
                    </div>
                </div>
            </Dialog >
        </div>
    )
}

export default MDManagerStep4;