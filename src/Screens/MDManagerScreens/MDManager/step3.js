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
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import { Tooltip } from '@mui/material';

const MDManagerStep3 = ({ setStep2, setStep3, setStep4, mdValue, setMdValue, setSelectedMdId }) => {
    const containerRef = useRef(null);
    const containerRef2 = useRef(null);
    const [targetStaff, setTargetStaff] = useState('ALL_STAFFS');
    const [attestationReviewFrequency, setAttestationReviewFrequency] = useState('');
    const [groupTitle, setGroupTitle] = useState('');
    const [groupType, setGroupType] = useState('');
    const [groupDesc, setGroupDesc] = useState('');
    const [staffList, setStaffList] = useState([]);
    const [staffListForExclude, setStaffListForExclude] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [groupById, setGroupById] = useState();
    const [autoTriggerOnUpdate, setAutoTriggerOnUpdate] = useState(true);
    const [autoTriggerForNewAppointment, setAutoTriggerForNewAppointment] = useState(false);
    const [autoTriggerForReappointment, setAutoTriggerForReappointment] = useState(false);
    const [autoTriggerForLocum, setAutoTriggerForLocum] = useState(false);
    const [showAttestationGroupList, setShowAttestationGroupList] = useState(false);
    const [showAcknowledgementGroupList, setShowAcknowledgementGroupList] = useState(false);
    const [showAttestationGroup, setShowAttestationGroup] = useState(false);
    const [selectedStaffs, setSelectedStaffs] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedAcknowledgementGroups, setSelectedAcknowledgementGroups] = useState([]);
    const [workflowEdited, setWorkflowEdited] = useState(false);
    const [workFlow1IsMandatory, setWorkFlow1IsMandatory] = useState(false);
    const [workFlow2IsMandatory, setWorkFlow2IsMandatory] = useState(false);
    const [selectedRolesWorkflow1, setSelectedRolesWorkflow1] = useState([]);
    const [selectedRolesWorkflow, setSelectedRolesWorkflow] = useState([]);
    const [selectedStaffsWorkflow, setSelectedStaffsWorkflow] = useState([]);
    const [selectedGroupsWorkflow, setSelectedGroupsWorkflow] = useState([]);
    const [selectedExcludeMembers, setSelectedExcludeMembers] = useState([]);
    const [selectedStaffForMove, setSelectedStaffForMove] = useState([]);
    const [workflowStructure, setWorkflowStructure] = useState();
    const [createdWorkflowStructure, setCreatedWorkflowStructure] = useState();
    const [showWorkflowSelection, setShowWorkflowSelection] = useState(false);
    const [roles, setRoles] = useState([]);
    const [isGroupEdited, setIsGroupEdited] = useState(false);
    const [acknowledgementExists, setAcknowledgementExists] = useState(false);
    console.log(mdValue, 'mdValue')
    useEffect(() => {
        getGroupList()
        getPublicationWorkflow();
        getRoles();
    }, [])

    useEffect(() => {
        getStaffList()
    }, [groupType])

    useEffect(() => {
        getStaffListForExclude()
    }, [targetStaff])

    useEffect(() => {
        console.log(mdValue, 'mdValue', mdValue?.departments?.flatMap(data => data?.serviceAreas?.map(innerData => innerData?.id) || []) || [])
        if (mdValue) {
            setAttestationReviewFrequency(mdValue?.attestationPeriod?.value === 1 ? 'EVERY_1_YEAR' : mdValue?.attestationPeriod?.value === 2 ? 'EVERY_2_YEARS' : mdValue?.attestationPeriod?.value === 3 ? 'EVERY_3_YEARS' : '');
            setAutoTriggerOnUpdate(mdValue?.autoTriggerOnUpdate)
            setTargetStaff(mdValue?.updateFor);
            setSelectedExcludeMembers(mdValue?.excludedUsers?.map(data => data?.id) || [])
            setSelectedGroups(mdValue?.groups?.map(data => data?.id) || [])
            setAutoTriggerForNewAppointment(mdValue?.triggerForNewAppointment)
            setAutoTriggerForReappointment(mdValue?.triggerForReAppointment)
            setAutoTriggerForLocum(mdValue?.triggerForLocum)
            getWorkflow();
        }
    }, [mdValue])

    const getWorkflow = async () => {
        const response = await GET(
            `medical-directive-service/medicalDirectives/${mdValue?.id}/workflow`
        );
        if (response?.data) {
            setCreatedWorkflowStructure(response?.data)
            setWorkFlow1IsMandatory(response?.data?.approvalFlowMap?.workflow['1']?.flowDetails?.[0]?.approvalRequirement === 'MANDATORY' ? true : false)
            setSelectedAcknowledgementGroups(response?.data?.approvalFlowMap?.workflow['1']?.flowDetails?.[0]?.groups?.map(data => data?.group?.id) || [])
            setAcknowledgementExists(response?.data?.approvalFlowMap?.workflow['1']?.flowDetails?.[0]?.groups?.map(data => data?.group?.id)?.length !== 0)
        }
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

    const getStaffListForExclude = async () => {
        const deptPayload = mdValue?.sites?.map(site => ({
            siteId: site.id,
            departmentAndServiceAreaId: site.departments.map(dept => ({
                id: dept.id,
                serviceAreaIds: [],
                serviceAreaSpecific: false
            })),
            departmentSpecific: site.departmentSpecific
        }));

        const divPayload = mdValue?.sites?.map(site => ({
            siteId: site.id,
            departmentAndServiceAreaId: site.departments.map(dept => ({
                id: dept.id,
                serviceAreaIds: dept.serviceAreas.map(sa => sa.id),
                serviceAreaSpecific: dept.serviceAreaSpecific
            })),
            departmentSpecific: site.departmentSpecific
        }));

        let url = `user-management-service/user/allStaffs?status=ACTIVE`
        let response;
        if (targetStaff === 'ALL_STAFFS') {
            response = await POST(url);
        } else if (targetStaff === 'SELECTED_DEPARTMENTS') {
            response = await POST(url, deptPayload);
        } else if (targetStaff === 'SELECTED_DIVISIONS') {
            response = await POST(url, divPayload);
        }
        console.log(response?.data);
        setStaffListForExclude(response?.data)
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

    const getPublicationWorkflow = async () => {
        const response = await GET(
            `medical-directive-service/publicationWorkFlow`
        );
        setWorkflowStructure(response.data?.[0])
        console.log(response.data?.[0], 'workflow');
    }

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

    const handleBlur = (e, ref) => {
        setTimeout(() => {
            if (
                ref.current &&
                !ref.current.contains(document.activeElement)
            ) {
                setShowAttestationGroupList(false);
                setShowAcknowledgementGroupList(false);
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
        if (!selectedGroups?.includes(id)) {
            setSelectedGroups(prev => [...prev, id]);
        }
    }

    const handleGroupSelectAcknowledgement = (id) => {
        setWorkflowEdited(true)
        if (!selectedAcknowledgementGroups?.includes(id)) {
            setSelectedAcknowledgementGroups(prev => [...prev, id]);
        }
    }

    const handleGroupDialogClose = () => {
        setGroupById();
        getGroupList();
        setShowAttestationGroup(false);
        setIsGroupEdited(false);
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
        if (!isSaveInProgress) {
            let errors = [];

            if (workFlow1IsMandatory && selectedAcknowledgementGroups?.length === 0) errors.push("Acknowledgement Group selection is required.");
            if (targetStaff === 'SELECTED_GROUPS' && selectedGroups?.length === 0) errors.push("Attestation Group Selection is required.");
            if (!attestationReviewFrequency) errors.push("Frequency of Review for Attestation (if none within the period selected) is required");
            if (errors.length) {
                errors.forEach(err => ErrorToaster2(err));
                return;
            }
        }
        let excludedUserList = targetStaff === 'SELECTED_GROUPS' ? Object.values(
            groupList
                .filter(obj => selectedGroups?.includes(obj?.id))
                .flatMap(obj => obj?.members)
                .reduce((acc, member) => {
                    acc[member.id] = member;
                    return acc;
                }, {})
        ) : staffListForExclude;
        const formData = new FormData();
        console.log(mdValue)

        let data = mdValue;
        data.attestationPeriod = {
            value: attestationReviewFrequency === "EVERY_1_YEAR" ? 1 : attestationReviewFrequency === "EVERY_2_YEARS" ? 2 : attestationReviewFrequency === "EVERY_3_YEARS" ? 3 : 0,
            unit: "YEARS"
        };
        data.autoTriggerOnUpdate = autoTriggerOnUpdate;
        data.updateFor = targetStaff;
        data.groups = filteredGroupArray;
        data.triggerForNewAppointment = autoTriggerForNewAppointment;
        data.triggerForReAppointment = autoTriggerForReappointment;
        data.triggerForLocum = autoTriggerForLocum;
        data.excludedUsers = excludedUserList?.filter(obj => selectedExcludeMembers?.includes(obj.id)).map(user => ({
            id: user?.id,
            name: user?.name,
            email: user?.email,
            title: user?.title,
            sites: user?.sites,
            appointmentType: user?.appointmentType,
            positionType: user?.positionType,
            tenant: user?.tenant
        }))
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
                SuccessToaster2('MD Updateded Successfully');
                console.log(response?.data)
            })
            .catch(error => {
                ErrorToaster2('MD Upload Failed');
            })
        // if (isPublish) {
        //     try {
        //         const { data: publishedMD } = await POST(`medical-directive-service/medicalDirectives/${mdValue?.id}/publish`);
        //         SuccessToaster2('Medical Directive published successfully');
        //     } catch (error) {
        //         console.error(error);
        //         ErrorToaster2('Failed to publish Medical Directive');
        //     }
        // }
        let acknowledgementData = mdValue?.workflowStatus === "NA" ? workflowStructure : createdWorkflowStructure;
        const transformedGroups = selectedAcknowledgementGroups?.map((groupId) => {
            const group = groupList.find((g) => g.id === groupId);

            return {
                group: {
                    id: group?.id,
                    name: group?.name,
                },
                approvalRequirementType: "ANY_MEMBER",
            };
        });
        if (workFlow1IsMandatory) {
            acknowledgementData.approvalFlowMap.workflow[1].flowDetails[0].approvalRequirement = 'MANDATORY';
            if (workflowStructure?.approvalFlowMap?.workflow[1]?.flowDetails?.[0]?.approvalBy === 'GROUP') {
                acknowledgementData.approvalFlowMap.workflow[1].flowDetails[0].groups = transformedGroups
            }
        } else {
            acknowledgementData.approvalFlowMap.workflow[1].required = false;
        }
        if (workflowEdited) {
            if (mdValue?.workflowStatus === "NA") {
                await POST(`medical-directive-service/medicalDirectives/${mdValue?.id}/workflow`, acknowledgementData)
                    .then(response => {
                        SuccessToaster2('Workflow Added Successfully');
                    })
                    .catch(error => {
                        ErrorToaster2('Something Failed. Please Try later!');
                    })
            } else {
                await PUT(`medical-directive-service/medicalDirectives/${mdValue?.id}/workflow`, acknowledgementData)
                    .then(response => {
                        SuccessToaster2('Workflow Added Successfully');
                    })
                    .catch(error => {
                        ErrorToaster2('Something Failed. Please Try later!');
                    })
            }
        }
        if (isSaveInProgress) {
            handleClose()
        } else {
            setStep3(false)
            setStep4(true)
        }
        // setShowWorkflowSelection(true)
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
        setIsGroupEdited(false);
    }

    const handleSaveWorkflow = async (type) => {
        let data = workflowStructure;
        const transformedGroups = selectedAcknowledgementGroups?.map((groupId) => {
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
            data.approvalFlowMap.workflow[2].flowDetails[0].approvalRequirement = 'MANDATORY';
            if (workflowStructure?.approvalFlowMap?.workflow[2]?.flowDetails?.[0]?.approvalBy === 'GROUP') {
                data.approvalFlowMap.workflow[2].flowDetails[0].groups = transformedGroups
            }
        } else {
            if (data?.approvalFlowMap?.workflow?.[2]) {
                delete data.approvalFlowMap.workflow["2"]
            }
        }
        console.log(workflowStructure?.approvalFlowMap?.workflow[2]?.flowDetails?.[0]?.approvalBy === 'GROUP', data)
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
        setStep3(false);
    }

    let excludeLabelList = targetStaff === 'SELECTED_GROUPS' ? Object.values(
        groupList
            .filter(obj => selectedGroups?.includes(obj?.id))
            .flatMap(obj => obj?.members)
            .reduce((acc, member) => {
                acc[member.id] = member;
                return acc;
            }, {})
    ).map(m => `${m?.name?.firstName} ${m?.name?.lastName}`) : staffListForExclude?.map(m => `${m?.name?.firstName} ${m?.name?.lastName} ${m?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.departmentName?.name ? `( ${m?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.departmentName?.name} ${m?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.serviceAreaSpecific ? `- ${m?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.serviceAreas?.[0]?.name}` : ''})` : ''
        }`);

    let excludeIdList = targetStaff === 'SELECTED_GROUPS' ? [...new Set(groupList.filter(obj => selectedGroups?.includes(obj?.id)).flatMap(obj => obj?.members?.map(m => m.id)))] : staffListForExclude?.map(m => m?.id)

    let excludeDisabledList = targetStaff === 'SELECTED_GROUPS' ? [...new Set(groupList.filter(obj => selectedGroups?.includes(obj?.id)).flatMap(obj => obj?.members?.map(m => m.id)))]?.map(() => false) : staffListForExclude?.map(m => false)
    console.log(staffList?.filter(staff => selectedStaffs?.includes(staff.id)), 'filterCheck', selectedStaffs, selectedStaffForMove, Object.values(
        groupList
            .filter(obj => selectedGroups?.includes(obj?.id))
            .flatMap(obj => obj?.members)
            .reduce((acc, member) => {
                acc[member.id] = member;
                return acc;
            }, {})
    ).map(m => `${m?.name?.firstName} ${m?.name?.lastName} `), [...new Set(groupList.filter(obj => selectedGroups?.includes(obj?.id)).flatMap(obj => obj?.members?.map(m => m?.id)))])
    return (
        <div className={style.stepsBackground}>
            <div className={`${style.stepHeader} ${style.spaceBetween} ${style.verticalAlignCenter} `}>
                <div className={style.displayInRow}>
                    <div className={`${style.stepNumber} ${style.marginLeft10} `}>Step 3</div>
                    <div className={`${style.stepHeading} ${style.marginLeft20} `}>Set Up Staff Review & Attestation Rules</div>
                </div>
                <div className={style.displayInRow}>
                    <div className={`${style.spaceBetween} `}>
                        <Tooltip arrow title='Click to go Back'>
                            <button className={`${style.buttonStyleMd} ${style.marginRight} `} onClick={() => { setStep2(true); setStep3(false) }} >BACK</button>
                        </Tooltip>
                        {/* {mdValue?.creationType === "RENEW" && (
                            <button className={`${ style.buttonStyle } ${ style.marginRight } `} onClick={() => handleContinue(true)} >{'PUBLISH'}</button>
                        )} */}
                        <Tooltip arrow title='Click to Save In-Progress'>
                            <button className={`${style.outlinedButtonMd} ${style.marginRight} `} onClick={() => { handleContinue(true) }} >SAVE IN PROGRESS</button>
                        </Tooltip>
                        <Tooltip arrow title='Click to Continue'>
                            <button className={`${style.buttonStyleMd} ${style.marginRight} `} onClick={() => { handleContinue() }} >CONTINUE</button>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div className={`${style.stepContentCard} `}>
                <div className={`${style.stepsTitleBar} ${style.verticalAlignCenter} `}>
                    <div className={style.stepsTitleText}>Staff Review for Acknowledgement Prior to Publication</div>
                </div>
                <div className={`${style.padding40} ${style.marginTop20} `}>
                    <div className={`${style.marginTop20} ${style.twoCol} ${acknowledgementExists ? style.disabledView : ''} `}>
                        <div className={style.labelStyle}>Staff Acknowledgement Required?</div>
                        <CommonSwitch label={workFlow1IsMandatory ? 'YES' : 'NO'} checked={workFlow1IsMandatory} onChange={acknowledgementExists ? () => { } : (e) => { setWorkFlow1IsMandatory(e.target.checked); setWorkflowEdited(true) }} labelName={''} />
                    </div>
                    {workFlow1IsMandatory && (
                        <div className={`${style.padding20} ${acknowledgementExists ? style.disabledView : ''} `}>
                            <div className={style.labelStyle}>Select Acknowledgement Groups*</div>
                            <div className={`${style.attestationGrid} `}>
                                <div ref={containerRef} onFocus={acknowledgementExists ? () => { } : () => setShowAttestationGroupList(true)} onBlur={(e) => handleBlur(e, containerRef)}
                                    tabIndex={0}>
                                    <CommonInputField
                                        className={style.fullWidth}
                                        // value={keyword}
                                        // onChange={(e) => setKeyword(e.target.value)}
                                        type="text"
                                    // placeholder="Enter Keywords / Tags"
                                    />
                                    {showAttestationGroupList && (
                                        <div className={`${style.attestationGroupCard} ${style.padding20} `} tabIndex={0}>
                                            {groupList?.filter(data => data?.type === "ACKNOWLEDGEMENT")?.map((data, index) => (
                                                <div className={`${style.groupDisplayGrid} ${style.verticalAlignCenter} `}>
                                                    <div className={`${style.labelStyle} ${style.cursorPointer} `} onClick={acknowledgementExists ? () => { } : () => handleGroupSelectAcknowledgement(data?.id)}>{data?.name}</div>
                                                    <div className={`${style.attestationDescStyle} ${style.verticalAlignCenter} `}
                                                        dangerouslySetInnerHTML={{ __html: data?.description }} />
                                                    <div className={`${style.attestationViewButton} ${style.cursorPointer} `} onClick={acknowledgementExists ? () => { } : () => getGroupListById(data?.id)}>View Group Members</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className={` ${style.addNewButton} ${style.textColorWhite} ${style.createGroupButton} ${style.marginLeft20} ${style.cursorPointer} `} onClick={acknowledgementExists ? () => { } : () => handleCreateGroup()}>
                                    <AddIcon />
                                    <span> Create New Group</span>
                                </div>
                            </div>
                            <div>
                                <div className={`${style.chipsContainer} ${style.marginTop10} ${acknowledgementExists ? style.disabledView : ''} `}>
                                    {selectedAcknowledgementGroups?.map(data => {
                                        return (
                                            <div className={`${style.chips} ${style.displayInRow} `}>
                                                <div>{groupList?.filter(groupData => groupData?.id === data)?.[0]?.name}</div> <div className={`${style.verticalAlignCenter} ${style.marginLeft10} ${style.cursorPointer} `}
                                                    onClick={acknowledgementExists ? () => { } : () => { setSelectedAcknowledgementGroups(selectedAcknowledgementGroups?.filter(innerData => innerData !== data)); setWorkflowEdited(true) }}
                                                ><CancelIcon sx={{ color: '#06617A', fontSize: 20 }} /></div></div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className={`${style.stepsTitleBar} ${style.verticalAlignCenter} ${style.marginTop20} `}>
                    <div className={style.stepsTitleText}>Attestation Rules to apply</div>
                </div>
                <div className={`${style.padding40} ${style.marginTop20} `}>
                    <div className={`${style.marginTop20} ${style.twoCol} `}>
                        <div className={style.labelStyle}>Target Staff for Medical Directive review and attestation</div>
                        <CommonRadio
                            value={targetStaff}
                            onChange={(e) => setTargetStaff(e.target.value)}
                            radioValue={["ALL_STAFFS", "SELECTED_DEPARTMENTS", "SELECTED_DIVISIONS", "SELECTED_GROUPS"]}
                            label={["All Staff Members", "All Department Staff", "Only Selected Division/Specialty Staff", "Selected Groups"]}
                        />
                    </div>
                    {targetStaff === "SELECTED_GROUPS" && (
                        <div className={style.padding20}>
                            {/* <CommonSelectField
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
                            /> */}
                            <div className={style.labelStyle}>Select Staff to Attest to this Medical Directive*</div>
                            <div className={style.attestationGrid}>
                                <div ref={containerRef2} onFocus={() => setShowAcknowledgementGroupList(true)} onBlur={(e) => handleBlur(e, containerRef2)}
                                    tabIndex={0}>
                                    <CommonInputField
                                        className={style.fullWidth}
                                        // value={keyword}
                                        // onChange={(e) => setKeyword(e.target.value)}
                                        type="text"
                                    // placeholder="Enter Keywords / Tags"
                                    />
                                    {showAcknowledgementGroupList && (
                                        <div className={`${style.attestationGroupCard} ${style.padding20} `} tabIndex={0}>
                                            {groupList?.filter(data => data?.type === "ATTESTATION")?.map((data, index) => (
                                                <div className={`${style.groupDisplayGrid} ${style.verticalAlignCenter} `}>
                                                    <div className={`${style.labelStyle} ${style.cursorPointer} `} onClick={() => handleGroupSelect(data?.id)}>{data?.name}</div>
                                                    <div className={`${style.attestationDescStyle} ${style.verticalAlignCenter} `}
                                                        dangerouslySetInnerHTML={{ __html: data?.description }} />
                                                    <div className={`${style.attestationViewButton} ${style.cursorPointer} `} onClick={() => getGroupListById(data?.id)}>View Group Members</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className={` ${style.addNewButton} ${style.textColorWhite} ${style.createGroupButton} ${style.marginLeft20} ${style.cursorPointer} `} onClick={() => handleCreateGroup()}>
                                    <AddIcon />
                                    <span> Create New Group</span>
                                </div>
                            </div>
                            <div>
                                <div className={`${style.chipsContainer} ${style.marginTop10} `}>
                                    {selectedGroups?.map(data => {
                                        return (
                                            <div className={`${style.chips} ${style.displayInRow} `}>
                                                <div>{groupList?.filter(groupData => groupData?.id === data)?.[0]?.name}</div> <div className={`${style.verticalAlignCenter} ${style.marginLeft10} ${style.cursorPointer} `}
                                                    onClick={() => setSelectedGroups(selectedGroups?.filter(innerData => innerData !== data))}
                                                ><CancelIcon sx={{ color: '#06617A', fontSize: 20 }} /></div></div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className={`${style.marginTop20} ${style.twoCol} `}>
                        <div>
                            <div className={style.labelStyle}>Select Staff to Exclude from Attesting to this Medical Directive</div>
                            <CommonMultiSelectField
                                value={selectedExcludeMembers}
                                onChange={(e) => setSelectedExcludeMembers(e.target.value)}
                                className={style.fullWidth1}
                                // firstOptionLabel={'All'}
                                // firstOptionValue={''}
                                valueList={excludeIdList}
                                labelList={excludeLabelList}
                                disabledList={excludeDisabledList}
                                required={false}
                                label={'Excluded Staff Members'}
                            />
                        </div>
                    </div>
                    <div className={`${style.marginTop20} ${style.twoCol} `}>
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
                            label={"Frequency of Review for Attestation (if none within the period selected)*"}
                        />
                    </div>
                    <div className={style.marginTop10}>
                        <CommonDivider />
                    </div>
                    <div className={`${style.marginTop20} ${style.twoCol} `}>
                        <div className={style.labelStyle}>Auto trigger reviews and attestations on <strong>Revision / Update</strong> of Medical Directive</div>
                        <CommonSwitch label={autoTriggerOnUpdate ? 'YES' : 'NO'} checked={autoTriggerOnUpdate} onChange={(e) => setAutoTriggerOnUpdate(e.target.checked)} labelName={''} />
                    </div>
                    <div className={`${style.marginTop20} ${style.twoCol} `}>
                        <div className={style.labelStyle}>Auto trigger review and attestations for <strong>New Staff Applicant</strong></div>
                        <CommonSwitch label={autoTriggerForNewAppointment ? 'YES' : 'NO'} checked={autoTriggerForNewAppointment} onChange={(e) => setAutoTriggerForNewAppointment(e.target.checked)} labelName={''} />
                    </div>
                    <div className={`${style.marginTop20} ${style.twoCol} `}>
                        <div className={style.labelStyle}>Auto trigger review and attestations for <strong>Staff Reappointment</strong></div>
                        <CommonSwitch label={autoTriggerForReappointment ? 'YES' : 'NO'} checked={autoTriggerForReappointment} onChange={(e) => setAutoTriggerForReappointment(e.target.checked)} labelName={''} />
                    </div>
                    <div className={`${style.marginTop20} ${style.twoCol} `}>
                        <div className={style.labelStyle}>Auto trigger review and attestations for <strong>Locum Renewal / Extensions</strong></div>
                        <CommonSwitch label={autoTriggerForLocum ? 'YES' : 'NO'} checked={autoTriggerForLocum} onChange={(e) => setAutoTriggerForLocum(e.target.checked)} labelName={''} />
                    </div>
                </div>
            </div>
            <Dialog isOpen={showAttestationGroup} onClose={() => handleGroupDialogClose()} className={`${style.addMDDialogBackground} ${style.attestationDialog} `}>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.attestationDialogHeaderCard}>
                        <div className={`${style.attestationDialogTitle} ${style.padding20} `}>Attestation Group</div>
                    </div>
                    <div className={style.marginTop10}>
                        <div className={style.labelStyle}>Group Title*</div>
                        <CommonInputField
                            className={style.fullWidth}
                            value={groupTitle}
                            onChange={(e) => { setGroupTitle(e.target.value); setIsGroupEdited(true) }}
                            type="text"
                            maxLength={25}
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
                                maxLength={100}
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
                                            <div className={`${style.staffName} ${style.verticalAlignCenter} ${style.cursorPointer} ${selectedStaffForMove === data?.id ? style.selectedStaff : ''} `} onClick={() => setSelectedStaffForMove(data?.id)}>{`${data?.name?.firstName} ${data?.name?.lastName?.toUpperCase()}${data?.serviceProviderType?.contractedServiceProviderType ? `, ${data?.serviceProviderType?.contractedServiceProviderType}` : ''} `}</div>
                                            {/* <div className={style.staffName}></div> */}
                                            <div className={`${style.labelStyle} ${selectedStaffForMove === data?.id ? style.selectedStaff : ''} `}>{data?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.departmentName?.name ? data?.sites?.sites?.[0]?.departmentList?.departments?.map(
                                                (dept) => dept?.departmentName?.name
                                            )?.join(', ') : ''}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={style.verticalAlignCenter}>
                                <div className={`${style.displayInCol} `}>
                                    <div className={`${style.moveCard} ${style.justifyCenter} ${style.verticalAlignCenter} ${staffList?.filter(staff => !selectedStaffs?.includes(staff.id))?.length === 0 ? style.disabledView : style.cursorPointer} `} onClick={staffList?.filter(staff => !selectedStaffs?.includes(staff.id))?.length === 0 ? () => { } : () => handleMove()}>
                                        <KeyboardArrowRightIcon sx={{ color: '#06617A' }} />
                                    </div>
                                    <div className={`${style.moveCard} ${style.marginTop10} ${style.justifyCenter} ${style.verticalAlignCenter} ${staffList?.filter(staff => !selectedStaffs?.includes(staff.id))?.length === 0 ? style.disabledView : style.cursorPointer} `} onClick={staffList?.filter(staff => !selectedStaffs?.includes(staff.id))?.length === 0 ? () => { } : () => handleMoveBulk()}>
                                        <KeyboardDoubleArrowRightIcon sx={{ color: '#06617A' }} />
                                    </div>
                                    <div className={`${style.moveCard} ${style.marginTop20} ${style.justifyCenter} ${style.verticalAlignCenter} ${staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.length === 0 ? style.disabledView : style.cursorPointer} `} onClick={staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.length === 0 ? () => { } : () => handleRemove()}>
                                        <KeyboardArrowLeftIcon sx={{ color: '#06617A' }} />
                                    </div>
                                    <div className={`${style.moveCard} ${style.marginTop10} ${style.justifyCenter} ${style.verticalAlignCenter} ${staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.length === 0 ? style.disabledView : style.cursorPointer} `} onClick={staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.length === 0 ? () => { } : () => handleRemoveBulk()}>
                                        <KeyboardDoubleArrowLeftIcon sx={{ color: '#06617A' }} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className={style.labelStyle}>Group Members ({staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.length})</div>
                                <div className={style.attestationGroupRightCard}>
                                    {staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.map((data, index) => (
                                        <div className={style.groupGrid} key={index}>
                                            <div className={`${style.staffName} ${style.verticalAlignCenter} ${style.cursorPointer} ${selectedStaffForMove === data?.id ? style.selectedStaff : ''} `} onClick={() => setSelectedStaffForMove(data?.id)}>{`${data?.name?.firstName} ${data?.name?.lastName?.toUpperCase()}${data?.serviceProviderType?.contractedServiceProviderType ? `, ${data?.serviceProviderType?.contractedServiceProviderType}` : ''} `}</div>
                                            {/* <div className={style.staffName}></div> */}
                                            <div className={`${style.labelStyle} ${selectedStaffForMove === data?.id ? style.selectedStaff : ''} `}>{data?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.departmentName?.name ? data?.sites?.sites?.[0]?.departmentList?.departments?.map(
                                                (dept) => dept?.departmentName?.name
                                            )?.join(', ') : ''}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={`${style.spaceBetween} ${style.marginTop20} `}>
                            <button className={`${style.outlinedButton} `} onClick={() => handleGroupDialogClose()} >CANCEL</button>
                            <button className={`${style.buttonStyle} ${!isGroupEdited ? style.disabledView : ''} `} onClick={!isGroupEdited ? () => { } : () => handleAddGroup()} >{groupById ? 'UPDATE' : 'ADD'}</button>
                        </div>
                    </div>
                </div>
            </Dialog >
            <Dialog isOpen={showWorkflowSelection} onClose={() => setShowWorkflowSelection(false)} className={`${style.addMDDialogBackground} ${style.attestationDialog} `}>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.attestationDialogHeaderCard}>
                        <div className={`${style.attestationDialogTitle} ${style.padding20} `}>Workflow Selection</div>
                    </div>
                    <div className={`${style.marginTop20} ${style.twoCol} `}>
                        <div className={style.labelStyle}>BOD Approval required?</div>
                        <CommonSwitch label={workFlow1IsMandatory ? 'YES' : 'NO'} checked={workFlow1IsMandatory} onChange={(e) => setWorkFlow1IsMandatory(e.target.checked)} labelName={''} />
                    </div>
                    {workFlow1IsMandatory && workflowStructure?.approvalFlowMap?.workflow[1]?.flowDetails?.map(data =>
                        // data?.approvalRequirement === "MANDATORY" && (
                        <div>
                            {data?.approvalBy === 'ROLE' ? (
                                <div>
                                    <div className={style.labelStyle}>Roles</div>
                                    <CommonMultiSelectField
                                        value={selectedRolesWorkflow1}
                                        onChange={(e) => setSelectedRolesWorkflow1(e.target.value)}
                                        className={style.fullWidth}
                                        // firstOptionLabel={'All'}
                                        // firstOptionValue={''}
                                        valueList={roles?.map(option => option?.id)}
                                        labelList={roles?.map(option => `${option?.roleName} `)}
                                        disabledList={roles?.map(() => false)}
                                        required={false}
                                        label={''}
                                    />
                                </div>
                            ) : data?.approvalBy === 'INDIVIDUAL' ? (
                                <div>
                                    <div className={style.labelStyle}>Staffs</div>
                                    <CommonSelectField
                                        value={selectedStaffsWorkflow}
                                        onChange={(e) => setSelectedStaffsWorkflow(e.target.value)}
                                        className={style.fullWidth}
                                        // firstOptionLabel={'All'}
                                        // firstOptionValue={''}
                                        valueList={staffList?.map(option => option?.id)}
                                        labelList={staffList?.map(option => `${option?.applicant?.name?.firstName} ${option?.applicant?.name?.lastName} `)}
                                        disabledList={staffList?.map(() => false)}
                                        required={false}
                                        label={'Staffs'}
                                    />
                                </div>
                            ) : data?.approvalBy === 'GROUP' ? (
                                <div>
                                    <div className={style.labelStyle}>Attestation Groups</div>
                                    <CommonMultiSelectField
                                        value={selectedGroupsWorkflow}
                                        onChange={(e) => setSelectedGroupsWorkflow(e.target.value)}
                                        className={style.fullWidth}
                                        // firstOptionLabel={'All'}
                                        // firstOptionValue={''}
                                        valueList={groupList?.map(option => option?.id)}
                                        labelList={groupList?.map(option => `${option?.name} `)}
                                        disabledList={groupList?.map(() => false)}
                                        required={false}
                                        label={'Attestation Groups'}
                                    />
                                </div>
                            ) : ''}
                        </div>
                        // )
                    )}
                    <div className={`${style.marginTop20} ${style.twoCol} `}>
                        <div className={style.labelStyle}>Staff Acknowledgement required?</div>
                        <CommonSwitch label={workFlow2IsMandatory ? 'YES' : 'NO'} checked={workFlow2IsMandatory} onChange={(e) => setWorkFlow2IsMandatory(e.target.checked)} labelName={''} />
                    </div>
                    {workFlow2IsMandatory && workflowStructure?.approvalFlowMap?.workflow[2]?.flowDetails?.map(data =>
                        // data?.approvalRequirement === "MANDATORY" && (
                        <div>
                            {data?.approvalBy === 'ROLE' ? (
                                <div>
                                    <div className={style.labelStyle}>Roles</div>
                                    <CommonSelectField
                                        value={selectedRolesWorkflow}
                                        onChange={(e) => setSelectedRolesWorkflow(e.target.value)}
                                        className={style.fullWidth}
                                        // firstOptionLabel={'All'}
                                        // firstOptionValue={''}
                                        valueList={roles?.map(option => option?.id)}
                                        labelList={roles?.map(option => `${option?.roleName} `)}
                                        disabledList={roles?.map(() => false)}
                                        required={false}
                                        label={'Roles'}
                                    />
                                </div>
                            ) : data?.approvalBy === 'INDIVIDUAL' ? (
                                <div>
                                    <div className={style.labelStyle}>Staffs</div>
                                    <CommonSelectField
                                        value={selectedStaffsWorkflow}
                                        onChange={(e) => setSelectedStaffsWorkflow(e.target.value)}
                                        className={style.fullWidth}
                                        // firstOptionLabel={'All'}
                                        // firstOptionValue={''}
                                        valueList={staffList?.map(option => option?.id)}
                                        labelList={staffList?.map(option => `${option?.applicant?.name?.firstName} ${option?.applicant?.name?.lastName} `)}
                                        disabledList={staffList?.map(() => false)}
                                        required={false}
                                        label={'Staffs'}
                                    />
                                </div>
                            ) : data?.approvalBy === 'GROUP' ? (
                                <div>
                                    <div className={style.labelStyle}>Attestation Groups</div>
                                    <CommonMultiSelectField
                                        value={selectedGroupsWorkflow}
                                        onChange={(e) => setSelectedGroupsWorkflow(e.target.value)}
                                        className={style.fullWidth}
                                        // firstOptionLabel={'All'}
                                        // firstOptionValue={''}
                                        valueList={groupList?.map(option => option?.id)}
                                        labelList={groupList?.map(option => `${option?.name} `)}
                                        disabledList={groupList?.map(() => false)}
                                        required={false}
                                        label={'Attestation Groups'}
                                    />
                                </div>
                            ) : ''}
                        </div>
                        // )
                    )}
                    <div>
                        <div className={`${style.spaceBetween} ${style.marginTop20} `}>
                            <button className={`${style.outlinedButton} `} onClick={() => handleWorkflowClose()} >CANCEL</button>
                            <div className={style.displayInRow}>
                                <button className={`${style.buttonStyle} `} onClick={() => handleSaveWorkflow('Save_And_Start')} >{'Start Sign Off'}</button>
                                <button className={`${style.buttonStyle} ${style.marginLeft10} `} onClick={() => handleSaveWorkflow('Save')} >{'Save'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog >
        </div>
    )
}

export default MDManagerStep3;