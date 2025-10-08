import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { ErrorToaster2, SuccessToaster2 } from '../../../utils/toaster';
import CommonInputField from '../../../Components/CommonFields/CommonInputField';
import CommonMultiSelectField from '../../../Components/CommonFields/CommonMultiSelectField';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import { TextField, Tooltip } from '@mui/material';
import CommonCheckBox from '../../../Components/CommonFields/CommonCheckBox';

const PNPManagerStep3 = ({ setStep2, setStep3, setStep4, mdValue, setMdValue, setSelectedMdId, getMD }) => {
    const containerRef = useRef(null);
    const containerRef2 = useRef(null);
    const [targetStaff, setTargetStaff] = useState([]);
    const [attestationReviewFrequency, setAttestationReviewFrequency] = useState('EVERY_1_YEAR');
    const [groupTitle, setGroupTitle] = useState('');
    const [groupType, setGroupType] = useState('');
    const [groupDesc, setGroupDesc] = useState('');
    const [staffList, setStaffList] = useState([]);
    const [staffListForExclude, setStaffListForExclude] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [groupById, setGroupById] = useState();
    const [autoTriggerOnUpdate, setAutoTriggerOnUpdate] = useState(true);
    const [autoTriggerForNewAppointment, setAutoTriggerForNewAppointment] = useState(true);
    const [autoTriggerForReappointment, setAutoTriggerForReappointment] = useState(true);
    const [autoTriggerForLocum, setAutoTriggerForLocum] = useState(true);
    const [showAttestationGroupList, setShowAttestationGroupList] = useState(false);
    const [showAcknowledgementGroupList, setShowAcknowledgementGroupList] = useState(false);
    const [showAttestationGroup, setShowAttestationGroup] = useState(false);
    const [selectedStaffs, setSelectedStaffs] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedGroupsWithApplicantTypes, setSelectedGroupsWithApplicantTypes] = useState([]);
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
    const [selectedStaffForMoveForExclusion, setSelectedStaffForMoveForExclusion] = useState([]);
    const [workflowStructure, setWorkflowStructure] = useState();
    const [createdWorkflowStructure, setCreatedWorkflowStructure] = useState();
    const [showWorkflowSelection, setShowWorkflowSelection] = useState(false);
    const [roles, setRoles] = useState([]);
    const [selectedGroupsToList, setSelectedGroupsToList] = useState([]);
    const [isGroupEdited, setIsGroupEdited] = useState(false);
    const [isSaveInProgressDialog, setIsSaveInProgressDialog] = useState(false);
    const [acknowledgementExists, setAcknowledgementExists] = useState(false);
    const [staffType, setStaffType] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    console.log(mdValue, 'mdValue')
    useEffect(() => {
        getGroupList()
        getPublicationWorkflow();
        getRoles();
        getStaffType();
    }, [])

    useEffect(() => {
        getStaffList()
    }, [groupType])

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        getStaffListForExclude(signal)
        return () => controller.abort();
    }, [targetStaff, mdValue])

    useEffect(() => {
        console.log(mdValue, 'mdValue', mdValue?.departments?.flatMap(data => data?.serviceAreas?.map(innerData => innerData?.id) || []) || [])
        if (mdValue) {
            setAttestationReviewFrequency(mdValue?.attestationPeriod?.value === 1 ? 'EVERY_1_YEAR' : mdValue?.attestationPeriod?.value === 2 ? 'EVERY_2_YEARS' : mdValue?.attestationPeriod?.value === 3 ? 'EVERY_3_YEARS' : '');
            setAutoTriggerOnUpdate(mdValue?.autoTriggerOnUpdate)
            setTargetStaff(mdValue?.updateFor || []);
            setSelectedExcludeMembers(mdValue?.excludedUsers?.map(data => data?.id) || [])
            setSelectedGroupsWithApplicantTypes(mdValue?.groups || [])
            setSelectedGroupsToList(mdValue?.groups?.map(data => data?.id) || [])
            setAutoTriggerForNewAppointment(mdValue?.triggerForNewAppointment)
            setAutoTriggerForReappointment(mdValue?.triggerForReAppointment)
            setAutoTriggerForLocum(mdValue?.triggerForLocum)
            getWorkflow();
        }
    }, [mdValue])

    const uniqueUsers = useMemo(() => {
        let users = [];

        if (targetStaff?.includes("SELECTED_GROUPS")) {
            const groupMembers = groupList
                .filter(group =>
                    selectedGroupsWithApplicantTypes?.some(sel => sel?.id === group?.id)
                )
                .flatMap(group => {
                    const selectedGroup = selectedGroupsWithApplicantTypes?.find(
                        sel => sel?.id === group?.id
                    );

                    if (!selectedGroup) return [];

                    if (selectedGroup.applicantTypeSpecific === false) {
                        return group?.members || [];
                    }

                    const selectedApplicantTypeIds =
                        selectedGroup?.applicantTypes?.map(type => type?.id) || [];

                    return (
                        group?.members?.filter(member =>
                            selectedApplicantTypeIds.includes(member?.applicantType?.id)
                        ) || []
                    );
                });
            console.log(groupMembers, 'groupMembers', selectedGroupsWithApplicantTypes)
            users = [...users, ...groupMembers];
        }

        if (targetStaff?.includes("SELECTED_DEPARTMENT_AND_DIVISION")) {
            users = [...users, ...(Array.isArray(staffListForExclude) ? staffListForExclude : [])];
        }

        if (targetStaff?.includes("ALL_STAFFS")) {
            users = [...users, ...(Array.isArray(staffListForExclude) ? staffListForExclude : [])];
        }

        // Deduplicate by user id
        return Object.values(
            users.reduce((acc, user) => {
                acc[user.id] = user;
                return acc;
            }, {})
        );
    }, [targetStaff, groupList, staffListForExclude, selectedGroupsWithApplicantTypes]);

    const getWorkflow = async () => {
        const response = await GET(
            `policy-and-procedure-management-service/policyAndProcedures/${mdValue?.id}/workflow`
        );
        if (response?.data) {
            setCreatedWorkflowStructure(response?.data)
            setWorkFlow1IsMandatory(response?.data?.approvalFlowMap?.workflow['1']?.flowDetails?.[0]?.approvalRequirement === 'MANDATORY' ? true : false)
            setSelectedAcknowledgementGroups(response?.data?.approvalFlowMap?.workflow['1']?.flowDetails?.[0]?.groups?.map(data => data?.group?.id) || [])
            setAcknowledgementExists(mdValue?.workflowStatus === "IN_PROGRESS")
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

    const getStaffListForExclude = async (signal) => {
        const deptPayload = mdValue?.attestationSites?.map(site => ({
            siteId: site.id,
            departmentAndServiceAreaId: site.departments.map(dept => ({
                id: dept.id,
                serviceAreaIds: [],
                serviceAreaSpecific: false
            })),
            departmentSpecific: site.departmentSpecific
        }));

        const divPayload = {
            attestationSites: mdValue?.attestationSites
        }

        let url = `user-management-service/user/allStaffs?status=ACTIVE`
        let response;
        if (targetStaff?.includes("ALL_STAFFS")) {
            response = await POST(url, null, { signal });
        }

        // if (targetStaff?.includes("SELECTED_DEPARTMENTS")) {
        //     response = await POST(url, deptPayload, { signal });
        // }

        if (targetStaff?.includes("SELECTED_DEPARTMENT_AND_DIVISION")) {
            response = await POST(url, divPayload, { signal });
        }

        // if (targetStaff?.includes("SELECTED_GROUPS")) {
        //     response = await POST(url, groupsPayload);
        // }
        console.log(response?.data);
        setStaffListForExclude(response?.data)
    }

    const getGroupList = async () => {
        const response = await GET(
            `policy-and-procedure-management-service/policyAndProceduresGroup`
        );
        console.log(response.data);
        setGroupList(response?.data)
    }

    const getGroupListById = async (id) => {
        const response = await GET(
            `policy-and-procedure-management-service/policyAndProceduresGroup/${id}`
        );
        console.log(response.data);
        setGroupTitle(response?.data?.name)
        setGroupDesc(response?.data?.description)
        setGroupType(response?.data?.type)
        setSelectedStaffs(response?.data?.members?.map(data => data?.id))
        setGroupById(response?.data)
        setShowAttestationGroup(true)
    }

    const getStaffType = async () => {
        const { data: applicant } = await GET(
            `entity-service/applicantType`
        );
        setStaffType(applicant)
    }

    const getPublicationWorkflow = async () => {
        const response = await GET(
            `policy-and-procedure-management-service/publicationWorkFlow`
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

    const handleClear = () => {
        setSearchTerm('');
        setIsFocused(false);
    }

    const handleMoveForExclude = () => {
        if (!selectedExcludeMembers?.includes(selectedStaffForMoveForExclusion)) {
            setSelectedExcludeMembers(prev => [...prev, selectedStaffForMoveForExclusion]);
        }
    }

    const handleRemoveForExclude = () => {
        console.log('filterCheck')
        setSelectedExcludeMembers(staffListForExclude?.filter(data => data !== selectedStaffForMoveForExclusion))
    }

    const handleMoveBulkForExclude = () => {
        console.log('filterCheck')
        setSelectedExcludeMembers(staffListForExclude?.map(data => data?.id))
    }

    const handleRemoveBulkForExclude = () => {
        console.log('filterCheck')
        setSelectedExcludeMembers([])
    }

    const handleGroupSelection = (id) => {
        if (!selectedGroupsToList?.includes(id)) {
            setSelectedGroupsToList(prev => [...prev, id]);
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
            const { data: publishedMD } = await POST(`policy-and-procedure-management-service/policyAndProcedures/${mdValue?.id}/publish`);
            SuccessToaster2('Policy & Procedure published successfully');
        } catch (error) {
            console.error(error);
            ErrorToaster2('Failed to publish Policy & Procedure');
        }
    }


    const handleContinue = async (isSaveInProgress) => {
        if (!isSaveInProgress) {
            let errors = [];

            if (workFlow1IsMandatory && selectedAcknowledgementGroups?.length === 0) errors.push("Acknowledgement Group selection is required.");
            if (targetStaff?.includes('SELECTED_GROUPS') && selectedGroupsWithApplicantTypes?.length === 0) errors.push("Attestation Group Selection is required.");
            if (!attestationReviewFrequency) errors.push("Frequency of Review for Attestation (if none within the period selected) is required");
            if (errors.length) {
                errors.forEach(err => ErrorToaster2(err));
                return;
            }
        }
        // let excludedUserList = targetStaff?.includes("SELECTED_GROUPS") ? Object.values(
        //     groupList
        //         .filter(obj => selectedGroups?.includes(obj?.id))
        //         .flatMap(obj => obj?.members)
        //         .reduce((acc, member) => {
        //             acc[member.id] = member;
        //             return acc;
        //         }, {})
        // ) : staffListForExclude;

        const formData = new FormData();
        console.log(mdValue)

        let data = mdValue;
        data.attestationPeriod = {
            value: attestationReviewFrequency === "EVERY_1_YEAR" ? 1 : attestationReviewFrequency === "EVERY_2_YEARS" ? 2 : attestationReviewFrequency === "EVERY_3_YEARS" ? 3 : 0,
            unit: "YEARS"
        };
        data.autoTriggerOnUpdate = autoTriggerOnUpdate;
        data.updateFor = targetStaff;
        data.groups = targetStaff?.includes("SELECTED_GROUPS") ? selectedGroupsWithApplicantTypes : [];
        data.triggerForNewAppointment = autoTriggerForNewAppointment;
        data.triggerForReAppointment = autoTriggerForReappointment;
        data.triggerForLocum = autoTriggerForLocum;
        data.excludedUsers = uniqueUsers?.filter(obj => selectedExcludeMembers?.includes(obj.id)).map(user => ({
            id: user?.id,
            name: user?.name,
            email: user?.email,
            title: user?.title,
            sites: user?.sites,
            appointmentType: user?.appointmentType,
            positionType: user?.positionType,
            tenant: user?.tenant
        }))
        if (isSaveInProgress) {
            data.lastSavedSection = 'step3';
        } else {
            data.lastSavedSection = '';
        }
        formData.append(
            "metaDataDTO",
            new Blob([JSON.stringify(data)], {
                type: "application/json",
            })
        );
        // formData.append("file", mdFile);

        console.log(data)

        await PUT(`policy-and-procedure-management-service/policyAndProcedures/${mdValue?.id}`, formData)
            .then(response => {
                SuccessToaster2('P&P Updateded Successfully');
                console.log(response?.data)
                getMD(response?.data);
            })
            .catch(error => {
                ErrorToaster2('P&P Upload Failed');
            })
        // if (isPublish) {
        //     try {
        //         const { data: publishedMD } = await POST(`policy-and-procedure-management-service/policyAndProcedures/${mdValue?.id}/publish`);
        //         SuccessToaster2('Policy & Procedure published successfully');
        //     } catch (error) {
        //         console.error(error);
        //         ErrorToaster2('Failed to publish Policy & Procedure');
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
            if (
                acknowledgementData?.approvalFlowMap?.workflow &&
                acknowledgementData.approvalFlowMap.workflow[1]
            ) {
                acknowledgementData.approvalFlowMap.workflow[1].required = false;
            }
        }
        if (workflowEdited || mdValue?.workflowStatus === "NA") {
            if (mdValue?.workflowStatus === "NA") {
                await POST(`policy-and-procedure-management-service/policyAndProcedures/${mdValue?.id}/workflow`, acknowledgementData)
                    .then(response => {
                        SuccessToaster2('Workflow Added Successfully');
                    })
                    .catch(error => {
                        ErrorToaster2('Something Failed. Please Try later!');
                    })
            } else {
                await PUT(`policy-and-procedure-management-service/policyAndProcedures/${mdValue?.id}/workflow`, acknowledgementData)
                    .then(response => {
                        SuccessToaster2('Workflow Added Successfully');
                    })
                    .catch(error => {
                        ErrorToaster2('Something Failed. Please Try later!');
                    })
            }
        }
        if (isSaveInProgress) {
            await PUT(`policy-and-procedure-management-service/policyAndProcedures/${mdValue?.id}/saveInprogress`, 'step3')
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
            await POST(`policy-and-procedure-management-service/policyAndProceduresGroup`, data)
                .then(response => {
                    SuccessToaster2('Group Added Successfully');
                    console.log(response?.data)
                    handleGroupDialogClose()
                })
                .catch(error => {
                    ErrorToaster2('Something Failed. Please Try later!');
                })
        } else {
            await PUT(`policy-and-procedure-management-service/policyAndProceduresGroup/${groupById?.id}`, data)
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
        await POST(`policy-and-procedure-management-service/policyAndProcedures/${mdValue?.id}/workflow`, data)
            .then(response => {
                SuccessToaster2('Workflow Added Successfully');
            })
            .catch(error => {
                ErrorToaster2('Something Failed. Please Try later!');
            })
        if (type === 'Save_And_Start') {
            await PUT(`policy-and-procedure-management-service/policyAndProcedures/${mdValue?.id}/startWorkflow`)
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

    const handleDeptLevelStaffTypeRemoval = (deptId, staffTypeId, isChecked) => {
        if (!isChecked) {
            setMdValue(prev => {
                let temp = { ...prev };

                const deptIndex = temp?.attestationSites?.[0]?.departments?.findIndex(
                    d => d.id === deptId
                );

                if (deptIndex > -1) {
                    let dept = { ...temp.attestationSites[0].departments[deptIndex] };

                    if (dept.applicantTypes === null || dept.applicantTypes?.length === 0) {
                        dept.applicantTypes = staffType
                            ?.filter(type => type?.id !== staffTypeId)
                            ?.map(type => ({
                                id: type?.id,
                                applicantType: type?.applicantType
                            }));
                        dept.applicantTypeSpecific = staffType?.filter(type => type?.id !== staffTypeId)?.length > 0 ? true : false;
                    } else {
                        dept.applicantTypes = dept.applicantTypes
                            ?.filter(type => type?.id !== staffTypeId)
                            ?.map(type => ({
                                id: type?.id,
                                applicantType: type?.applicantType
                            }));
                        dept.applicantTypeSpecific = dept.applicantTypes?.length > 0 ? true : false;
                    }

                    temp.attestationSites[0].departments = [
                        ...temp.attestationSites[0].departments.slice(0, deptIndex),
                        dept,
                        ...temp.attestationSites[0].departments.slice(deptIndex + 1),
                    ];
                }
                console.log(temp)
                return temp;
            });
        } else {
            setMdValue(prev => {
                let temp = { ...prev };

                const deptIndex = temp?.attestationSites?.[0]?.departments?.findIndex(
                    d => d.id === deptId
                );
                if (deptIndex > -1) {
                    let dept = { ...temp.attestationSites[0].departments[deptIndex] };
                    const newStaff = staffType?.find(type => type.id === staffTypeId);

                    if (newStaff) {
                        dept.applicantTypes = [
                            ...(dept.applicantTypes || []),
                            { id: newStaff.id, applicantType: newStaff.applicantType }
                        ];
                    }
                    dept.applicantTypeSpecific = staffType?.length !== dept.applicantTypes?.length ? true : false;
                    temp.attestationSites[0].departments = [
                        ...temp.attestationSites[0].departments.slice(0, deptIndex),
                        dept,
                        ...temp.attestationSites[0].departments.slice(deptIndex + 1),
                    ];
                }
                console.log(temp)
                return temp;
            });
        }
    }

    const handleServiceLevelStaffTypeRemoval = (deptId, serviceId, staffTypeId, isChecked) => {
        if (!isChecked) {
            setMdValue(prev => {
                let temp = { ...prev };

                const deptIndex = temp?.attestationSites?.[0]?.departments?.findIndex(
                    d => d.id === deptId
                );

                if (deptIndex > -1) {
                    let dept = { ...temp.attestationSites[0].departments[deptIndex] };

                    const serviceIndex = dept?.serviceAreas?.findIndex(s => s.id === serviceId);

                    if (serviceIndex > -1) {
                        let service = { ...dept.serviceAreas[serviceIndex] };

                        if (!service.applicantTypes || service.applicantTypes?.length === 0) {
                            service.applicantTypes = staffType
                                ?.filter(type => type?.id !== staffTypeId)
                                ?.map(type => ({
                                    id: type?.id,
                                    applicantType: type?.applicantType
                                }));
                            service.applicantTypeSpecific =
                                staffType?.filter(type => type?.id !== staffTypeId)?.length > 0;
                        } else {
                            service.applicantTypes = service.applicantTypes
                                ?.filter(type => type?.id !== staffTypeId)
                                ?.map(type => ({
                                    id: type?.id,
                                    applicantType: type?.applicantType
                                }));
                            service.applicantTypeSpecific = service.applicantTypes?.length > 0;
                        }

                        // replace updated service back into dept
                        dept.serviceAreas = [
                            ...dept.serviceAreas.slice(0, serviceIndex),
                            service,
                            ...dept.serviceAreas.slice(serviceIndex + 1),
                        ];

                        // replace updated dept back into sites
                        temp.attestationSites[0].departments = [
                            ...temp.attestationSites[0].departments.slice(0, deptIndex),
                            dept,
                            ...temp.attestationSites[0].departments.slice(deptIndex + 1),
                        ];
                    }
                }
                console.log(temp)
                return temp;
            });
        } else {
            setMdValue(prev => {
                let temp = { ...prev };

                const deptIndex = temp?.attestationSites?.[0]?.departments?.findIndex(
                    d => d.id === deptId
                );

                if (deptIndex > -1) {
                    let dept = { ...temp.attestationSites[0].departments[deptIndex] };

                    const serviceIndex = dept?.serviceAreas?.findIndex(s => s.id === serviceId);

                    if (serviceIndex > -1) {
                        let service = { ...dept.serviceAreas[serviceIndex] };

                        const newStaff = staffType?.find(type => type.id === staffTypeId);

                        if (newStaff) {
                            service.applicantTypes = [
                                ...(service.applicantTypes || []),
                                { id: newStaff.id, applicantType: newStaff.applicantType }
                            ];
                        }

                        service.applicantTypeSpecific =
                            staffType?.length !== service.applicantTypes?.length;

                        // replace updated service back into dept
                        dept.serviceAreas = [
                            ...dept.serviceAreas.slice(0, serviceIndex),
                            service,
                            ...dept.serviceAreas.slice(serviceIndex + 1),
                        ];

                        // replace updated dept back into sites
                        temp.attestationSites[0].departments = [
                            ...temp.attestationSites[0].departments.slice(0, deptIndex),
                            dept,
                            ...temp.attestationSites[0].departments.slice(deptIndex + 1),
                        ];
                    }
                }
                console.log(temp)
                return temp;
            });
        }
    };

    const handleServiceAreaToggle = (deptId, serviceArea, isChecked) => {
        setMdValue(prev => {
            let temp = { ...prev };

            const deptIndex = temp?.attestationSites?.[0]?.departments?.findIndex(
                d => d.id === deptId
            );

            if (deptIndex > -1) {
                let dept = { ...temp.attestationSites[0].departments[deptIndex] };

                if (isChecked) {
                    const exists = dept.serviceAreas?.some(sa => sa.id === serviceArea.id);

                    if (!exists) {
                        const newService = {
                            id: serviceArea.id,
                            name: serviceArea.name,
                            applicantTypes: null,
                            applicantTypeSpecific: false,
                            excludedServiceAreas: [],
                            serviceAreasExcluded: false,
                            serviceAreaSpecific: false
                        };

                        dept.serviceAreas = [...(dept.serviceAreas || []), newService];
                    }
                } else {
                    dept.serviceAreas = dept.serviceAreas?.filter(sa => sa.id !== serviceArea.id) || [];
                }

                temp.attestationSites[0].departments = [
                    ...temp.attestationSites[0].departments.slice(0, deptIndex),
                    dept,
                    ...temp.attestationSites[0].departments.slice(deptIndex + 1),
                ];
            }

            return temp;
        });
    };

    const handleDepartmentToggle = (dept, isChecked) => {
        setMdValue(prev => {
            let temp = { ...prev };

            const deptIndex = temp?.attestationSites?.[0]?.departments?.findIndex(
                d => d.id === dept.id
            );

            if (isChecked) {
                if (deptIndex === -1) {
                    const newDept = {
                        id: dept.id,
                        name: dept.name,
                        serviceAreas: dept.serviceAreas,
                        excludedServiceAreas: [],
                        applicantTypes: null,
                        applicantTypeSpecific: false,
                        serviceAreasExcluded: false,
                        serviceAreaSpecific: false
                    };

                    temp.attestationSites[0].departments = [
                        ...(temp.attestationSites?.[0]?.departments || []),
                        newDept
                    ];
                }
            } else {
                temp.attestationSites[0].departments =
                    temp.attestationSites?.[0]?.departments?.filter(d => d.id !== dept.id) || [];
            }

            return temp;
        });
    };

    const handleGroupSelect = (group, checked) => {
        setSelectedGroupsWithApplicantTypes(prev => {
            if (checked) {
                if (!prev.some(g => g.id === group.id)) {
                    return [
                        ...prev,
                        {
                            id: group.id,
                            name: group.name,
                            applicantTypeSpecific: false,
                            applicantTypes: [],
                        },
                    ];
                }
                console.log(prev)
                return prev;
            } else {
                console.log(prev.filter(g => g.id !== group.id))
                return prev.filter(g => g.id !== group.id);
            }
        });
    };

    const handleGroupLevelStaffTypeToggle = (groupId, staffTypeId, isChecked) => {
        setSelectedGroupsWithApplicantTypes(prev => {
            return prev.map(group => {
                if (group.id === groupId) {
                    if (!isChecked) {
                        if (!group.applicantTypes || group.applicantTypes.length === 0) {
                            const remainingTypes = staffType
                                ?.filter(type => type.id !== staffTypeId)
                                ?.map(type => ({ id: type.id, applicantType: type.applicantType }));
                            return {
                                ...group,
                                applicantTypes: remainingTypes,
                                applicantTypeSpecific: remainingTypes.length > 0,
                            };
                        } else {
                            const updatedTypes = group.applicantTypes
                                ?.filter(type => type.id !== staffTypeId)
                                ?.map(type => ({ id: type.id, applicantType: type.applicantType }));
                            return {
                                ...group,
                                applicantTypes: updatedTypes,
                                applicantTypeSpecific: updatedTypes.length > 0,
                            };
                        }
                    } else {
                        const newStaff = staffType?.find(type => type.id === staffTypeId);
                        if (newStaff) {
                            const updatedTypes = [
                                ...(group.applicantTypes || []),
                                { id: newStaff.id, applicantType: newStaff.applicantType },
                            ];
                            return {
                                ...group,
                                applicantTypes: updatedTypes,
                                applicantTypeSpecific: updatedTypes.length < staffType.length,
                            };
                        }
                    }
                }
                return group;
            });
        });
    };

    const findGroup = (id) => {
        let group = groupList?.filter(group => selectedGroupsToList?.includes(group.id))?.find(g =>
            g?.members?.some(member => member?.id === id)
        );
        return group?.name
    }

    const searchStaff = (staffList, query) => {
        if (!query) return staffList; // if no search, return all

        const lowerQuery = query.toLowerCase();

        return staffList.filter((staff) => {
            // 1. Full Name (first + middle + last)
            const fullName = `${staff.name?.firstName || ""} ${staff.name?.middleName || ""} ${staff.name?.lastName || ""}`.toLowerCase();

            // 2. Applicant Type
            const applicantType = staff.applicantType?.applicantType?.toLowerCase() || "";

            // 3. Departments (flatten all department names for this staff)
            const departments = staff.sites?.sites
                ?.flatMap((site) => site.departmentList?.departments || [])
                ?.map((dept) => dept.departmentName?.name?.toLowerCase() || "")
                .join(" ") || "";

            // Match if query is in any of the above
            return (
                fullName.includes(lowerQuery) ||
                applicantType.includes(lowerQuery) ||
                departments.includes(lowerQuery)
            );
        });
    };

    // let users = [];

    // if (targetStaff?.includes("SELECTED_GROUPS")) {
    //     const groupMembers = groupList
    //         .filter(obj =>
    //             selectedGroupsWithApplicantTypes?.map(data => data?.id)?.includes(obj?.id)
    //         )
    //         .flatMap(obj => {
    //             if (!obj?.applicantTypeSpecific) {
    //                 return obj?.members || [];
    //             }

    //             const selectedApplicantTypeIds = selectedGroupsWithApplicantTypes
    //                 ?.find(data => data?.id === obj?.id)
    //                 ?.applicantTypes?.map(type => type?.id) || [];

    //             return obj?.members?.filter(member =>
    //                 selectedApplicantTypeIds.includes(member?.applicantType?.id)
    //             ) || [];
    //         });
    //     console.log(groupMembers, 'groupMembers')

    //     users = [...users, ...groupMembers];
    // }

    // if (targetStaff?.includes("SELECTED_DEPARTMENT_AND_DIVISION")) {
    //     users = [...users, ...(Array.isArray(staffListForExclude) ? staffListForExclude : [])];
    // }

    // if (targetStaff?.includes("ALL_STAFFS")) {
    //     users = [...users, ...(Array.isArray(staffListForExclude) ? staffListForExclude : [])];
    // }

    // const uniqueUsers = Object.values(
    //     users.reduce((acc, user) => {
    //         acc[user.id] = user;
    //         return acc;
    //     }, {})
    // );

    // let excludeLabelList = targetStaff === 'SELECTED_GROUPS' ? Object.values(
    //     groupList
    //         .filter(obj => selectedGroups?.includes(obj?.id))
    //         .flatMap(obj => obj?.members)
    //         .reduce((acc, member) => {
    //             acc[member.id] = member;
    //             return acc;
    //         }, {})
    // ).map(m => `${m?.name?.firstName} ${m?.name?.lastName}`) : staffListForExclude?.map(m => `${m?.name?.firstName} ${m?.name?.lastName} ${m?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.departmentName?.name ? `( ${m?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.departmentName?.name} ${m?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.serviceAreaSpecific ? `- ${m?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.serviceAreas?.[0]?.name}` : ''})` : ''
    //     }`);

    // let excludeIdList = targetStaff === 'SELECTED_GROUPS' ? [...new Set(groupList.filter(obj => selectedGroups?.includes(obj?.id)).flatMap(obj => obj?.members?.map(m => m.id)))] : staffListForExclude?.map(m => m?.id)

    // let excludeDisabledList = targetStaff === 'SELECTED_GROUPS' ? [...new Set(groupList.filter(obj => selectedGroups?.includes(obj?.id)).flatMap(obj => obj?.members?.map(m => m.id)))]?.map(() => false) : staffListForExclude?.map(m => false)
    // console.log(staffList?.filter(staff => selectedStaffs?.includes(staff.id)), 'filterCheck', selectedStaffs, selectedStaffForMove, Object.values(
    //     groupList
    //         .filter(obj => selectedGroups?.includes(obj?.id))
    //         .flatMap(obj => obj?.members)
    //         .reduce((acc, member) => {
    //             acc[member.id] = member;
    //             return acc;
    //         }, {})
    // ).map(m => `${m?.name?.firstName} ${m?.name?.lastName} `), [...new Set(groupList.filter(obj => selectedGroups?.includes(obj?.id)).flatMap(obj => obj?.members?.map(m => m?.id)))])

    console.log(selectedGroupsWithApplicantTypes, 'selectedGroupsWithApplicantTypes', uniqueUsers, groupList
        .filter(obj => selectedGroupsWithApplicantTypes?.map(data => data?.id)?.includes(obj?.id))
        .flatMap(obj => obj?.members))
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
                            <button className={`${style.outlinedButtonMd} ${style.marginRight} `} onClick={() => { setIsSaveInProgressDialog(true) }} >SAVE IN PROGRESS</button>
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
                    <div className={`${style.marginTop20} ${style.threeCol} ${acknowledgementExists ? style.disabledView : ''} ${style.verticalAlignCenter}`}>
                        <div className={style.labelStyle}>Staff Acknowledgement Required?</div>
                        <CommonSwitch label={workFlow1IsMandatory ? 'YES' : 'NO'} checked={workFlow1IsMandatory} onChange={acknowledgementExists ? () => { } : (e) => { setWorkFlow1IsMandatory(e.target.checked); setWorkflowEdited(true) }} labelName={''} />
                        {!workFlow1IsMandatory && (
                            <div className={style.acknowledgementNote}>
                                This Policy & Procedure does not require pre-publication acknowledgement from any department-specific staff. However, the final draft must still be reviewed and approved by the MAC and Leadership Team.
                            </div>
                        )}
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
                                                ><CancelIcon sx={{ color: '#168E0D', fontSize: 20 }} /></div></div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className={`${style.stepsTitleBar} ${style.verticalAlignCenter} ${style.marginTop20} `}>
                    <div className={style.stepsTitleText}>Post-Publication Attestation Rules</div>
                </div>
                <div className={`${style.padding40} ${style.marginTop20} `}>
                    <div className={`${style.marginTop20}`}>
                        <div className={style.labelStyle}>Target Staff to Include for reviewing and attesting to this Policy & Procedure</div>
                        <div className={style.twoCol}>
                            <CommonRadio
                                isRow={false}
                                value={targetStaff?.find(
                                    data =>
                                        data === 'ALL_STAFFS' ||
                                        data === 'SELECTED_DEPARTMENT_AND_DIVISION'
                                ) || ""}
                                onChange={(e) => {
                                    let temp = [...targetStaff];
                                    if (e.target.value === "ALL_STAFFS") {
                                        temp = ["ALL_STAFFS"];
                                    } else if (e.target.value === "SELECTED_DEPARTMENT_AND_DIVISION") {
                                        temp = ["SELECTED_DEPARTMENT_AND_DIVISION"];
                                    }
                                    setTargetStaff(temp);
                                }}
                                radioValue={["ALL_STAFFS", "SELECTED_DEPARTMENT_AND_DIVISION"]}
                                label={[
                                    "All Facility Staff Members",
                                    "Department & Division / Speciality Staff Members",
                                ]}
                            />
                            <div className={`${targetStaff?.includes("ALL_STAFFS") ? style.disabledView : ''} ${style.spaceBetween}`}>
                                <CommonCheckBox
                                    checked={targetStaff?.includes("SELECTED_GROUPS")}
                                    onChange={(e) => {
                                        let temp = [...targetStaff];
                                        if (e.target.checked && !targetStaff?.includes("ALL_STAFFS")) {
                                            if (!temp.includes("SELECTED_GROUPS")) {
                                                temp.push("SELECTED_GROUPS");
                                            }
                                        } else {
                                            temp = temp.filter(data => data !== "SELECTED_GROUPS");
                                        }
                                        setTargetStaff(temp);
                                    }}
                                    label={`Include Staff Members From Select Custom Attestation Group(s)`}
                                />
                                <div className={` ${style.addNewButton} ${style.textColorWhite} ${style.createGroupButton} ${style.cursorPointer} `} onClick={() => handleCreateGroup()}>
                                    <AddIcon />
                                    <span> Create New Group</span>
                                </div>
                            </div>
                        </div>
                        <div className={style.twoCol}>
                            <div>
                                {targetStaff?.includes("SELECTED_DEPARTMENT_AND_DIVISION") && (
                                    <div>
                                        <div className={style.exclusionNote}>
                                            Selecting this option will require Staff Members specified below to attest to this Policy & Procedure.
                                        </div>
                                        {mdValue?.sites?.[0]?.departments?.map((department) => {
                                            // find the matching dept from attestationSites by id
                                            const attDept = mdValue?.attestationSites?.[0]?.departments?.find(
                                                (d) => d.id === department.id
                                            );

                                            return (
                                                <div key={department.id} className={style.marginTop20}>
                                                    {/* Department level checkbox */}
                                                    <CommonCheckBox
                                                        checked={!!attDept}
                                                        onChange={(e) => handleDepartmentToggle(department, e.target.checked)}
                                                        label={department?.name}
                                                    />

                                                    {department?.serviceAreas?.length > 0 && (
                                                        <div className={style.marginLeft20}>
                                                            {department?.serviceAreas?.map((service) => {
                                                                const attService = attDept?.serviceAreas?.find(
                                                                    (s) => s.id === service.id
                                                                );

                                                                return (
                                                                    <div key={service.id}>
                                                                        <CommonCheckBox
                                                                            checked={!!attService}
                                                                            onChange={(e) =>
                                                                                handleServiceAreaToggle(department?.id, service, e.target.checked)
                                                                            }
                                                                            label={service?.name}
                                                                            className={style.reduceMarginTop}
                                                                        />

                                                                        {staffType?.length > 0 && (
                                                                            <div className={style.marginLeft50}>
                                                                                {staffType?.map((type) => (
                                                                                    <CommonCheckBox
                                                                                        key={type.id}
                                                                                        checked={
                                                                                            attService
                                                                                                ? attService.applicantTypes?.some(
                                                                                                    (at) => at.id === type.id
                                                                                                ) ||
                                                                                                !attService.applicantTypeSpecific
                                                                                                : false
                                                                                        }
                                                                                        onChange={(e) =>
                                                                                            handleServiceLevelStaffTypeRemoval(
                                                                                                department?.id,
                                                                                                service?.id,
                                                                                                type?.id,
                                                                                                e.target.checked
                                                                                            )
                                                                                        }
                                                                                        label={type?.applicantType}
                                                                                        className={style.reduceMarginTop}
                                                                                    />
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {department?.serviceAreas?.length === 0 && staffType?.length > 0 && (
                                                        <div className={style.marginLeft70}>
                                                            {staffType?.map((type) => (
                                                                <CommonCheckBox
                                                                    key={type.id}
                                                                    checked={
                                                                        attDept
                                                                            ? attDept.applicantTypes?.some((at) => at.id === type.id) ||
                                                                            !attDept.applicantTypeSpecific
                                                                            : false
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleDeptLevelStaffTypeRemoval(
                                                                            department?.id,
                                                                            type?.id,
                                                                            e.target.checked
                                                                        )
                                                                    }
                                                                    label={type?.applicantType}
                                                                    className={style.reduceMarginTop}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            {targetStaff?.includes("SELECTED_GROUPS") && (
                                <div>
                                    <div className={style.exclusionNote}>
                                        This will allow you to include Staff members from specific attestation groups that have been created.
                                    </div>
                                    <div className={style.marginTop20}>
                                        <div className={style.labelStyle}>Select Attestation Group*</div>
                                        <div>
                                            <div ref={containerRef2} onFocus={() => setShowAcknowledgementGroupList(true)} onBlur={(e) => handleBlur(e, containerRef2)}
                                                tabIndex={0}>
                                                <CommonInputField
                                                    className={style.fullWidth}
                                                    type="text"
                                                />
                                                {showAcknowledgementGroupList && (
                                                    <div className={`${style.attestationGroupCard} ${style.padding20} `} tabIndex={0}>
                                                        {groupList?.filter(data => data?.type === "ATTESTATION")?.map((data, index) => (
                                                            <div className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10} `}>
                                                                <div className={`${style.labelStyle} ${style.cursorPointer} `} onClick={() => handleGroupSelection(data?.id)}>{data?.name}</div>
                                                                {/* <div className={`${style.attestationDescStyle} ${style.verticalAlignCenter} `}
                                                                    dangerouslySetInnerHTML={{ __html: data?.description }} /> */}
                                                                <div className={`${style.attestationViewButton} ${style.cursorPointer} `} onClick={() => getGroupListById(data?.id)}>View Group Members</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className={`${style.chipsContainer} ${style.marginTop10} `}>
                                                {selectedGroupsToList?.map(data => {
                                                    return (
                                                        <div className={`${style.chips} ${style.displayInRow} `}>
                                                            <div>{groupList?.filter(groupData => groupData?.id === data)?.[0]?.name}</div> <div className={`${style.verticalAlignCenter} ${style.marginLeft10} ${style.cursorPointer} `}
                                                                onClick={() => setSelectedGroupsToList(selectedGroupsToList?.filter(innerData => innerData !== data))}
                                                            ><CancelIcon sx={{ color: '#168E0D', fontSize: 20 }} /></div></div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    {groupList?.filter(group => selectedGroupsToList?.includes(group.id))?.map(group => (
                                        <div key={group.id} className={style.marginTop20}>
                                            <CommonCheckBox
                                                checked={selectedGroupsWithApplicantTypes?.map(group => group?.id)?.includes(group?.id)}
                                                onChange={(e) => handleGroupSelect(group, e.target.checked)}
                                                label={group?.name}
                                                className={style.reduceMarginTop}
                                            />

                                            {staffType?.length > 0 && (
                                                <div className={style.marginLeft50}>
                                                    {staffType?.map(type => (
                                                        <CommonCheckBox
                                                            key={type.id}
                                                            checked={selectedGroupsWithApplicantTypes?.map(innerGroup => innerGroup?.id)?.includes(group?.id) && (selectedGroupsWithApplicantTypes?.filter(innerGroup => innerGroup?.id === group?.id)?.[0]?.applicantTypes?.some(t => t.id === type.id) || !selectedGroupsWithApplicantTypes?.filter(innerGroup => innerGroup?.id === group?.id)?.[0]?.applicantTypeSpecific)}
                                                            onChange={(e) => handleGroupLevelStaffTypeToggle(group.id, type.id, e.target.checked)}
                                                            label={type.applicantType}
                                                            className={style.reduceMarginTop}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* {targetStaff === "SELECTED_GROUPS" && (
                        <div className={style.padding20}>
                            <div className={style.labelStyle}>Select Staff to Attest to this Policy & Procedure*</div>
                            <div className={style.attestationGrid}>
                                <div ref={containerRef2} onFocus={() => setShowAcknowledgementGroupList(true)} onBlur={(e) => handleBlur(e, containerRef2)}
                                    tabIndex={0}>
                                    <CommonInputField
                                        className={style.fullWidth}
                                        type="text"
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
                                                ><CancelIcon sx={{ color: '#168E0D', fontSize: 20 }} /></div></div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )} */}
                    {/* <div className={`${style.marginTop20} ${style.twoCol} `}>
                        <div>
                            <div className={style.labelStyle}>Select Staff to Exclude from Attesting to this Policy & Procedure</div>
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
                    </div> */}
                    <div className={style.marginTop20}>
                        <CommonDivider />
                    </div>
                    <div className={`${style.stepsTitleBar} ${style.verticalAlignCenter} ${style.marginTop20} `}>
                        <div className={style.stepsTitleText}>Excluded Staff Members for Attestation</div>
                    </div>
                    <div className={style.marginTop20}>
                        <div className={style.attestationGroupGrid}>
                            <div>
                                <div className={style.labelStyle}>Included Staff Members For Attestation To Exclude From ({uniqueUsers?.filter(staff => !selectedExcludeMembers?.includes(staff.id))?.length})</div>
                                <div className={style.marginTop10}>
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        placeholder={'Search by Name, Type or Department'}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        fullWidth
                                        sx={{ height: "32px" }}
                                        InputProps={{
                                            sx: { height: "32px", padding: "0px 5px" },
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                            endAdornment: isFocused && (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => handleClear()} size="small">
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </div>
                                <div className={`${style.attestationGroupLeftCard} ${style.marginTop10}`}>
                                    {searchStaff(uniqueUsers, searchTerm)?.filter(staff => !selectedExcludeMembers?.includes(staff.id))?.map((data, index) => (
                                        <div className={style.groupGrid3Col} key={index}>
                                            <div className={`${style.staffName} ${style.verticalAlignCenter} ${style.cursorPointer} ${selectedStaffForMoveForExclusion === data?.id ? style.selectedStaff : ''} `} onClick={() => setSelectedStaffForMoveForExclusion(data?.id)}>{`${data?.name?.firstName} ${data?.name?.lastName?.toUpperCase()}${data?.serviceProviderType?.contractedServiceProviderType ? `, ${data?.serviceProviderType?.contractedServiceProviderType}` : ''} `}</div>
                                            <div className={`${style.labelStyle} ${selectedStaffForMoveForExclusion === data?.id ? style.selectedStaff : ''} `}>{data?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.departmentName?.name ? data?.sites?.sites?.[0]?.departmentList?.departments?.map(
                                                (dept) => dept?.departmentName?.name
                                            )?.join(', ') : ''} {data?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.serviceAreas?.length > 0 ? ` - ${data?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.serviceAreas?.map(divName => divName?.name)?.join(', ')}` : ''}</div>
                                            <div className={`${style.labelStyle}  ${selectedStaffForMoveForExclusion === data?.id ? style.selectedStaff : ''} `}>{findGroup(data?.id)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={style.verticalAlignCenter}>
                                <div className={`${style.displayInCol} `}>
                                    <div className={`${style.moveCard} ${style.justifyCenter} ${style.verticalAlignCenter} ${staffListForExclude?.filter(staff => !selectedExcludeMembers?.includes(staff.id))?.length === 0 ? style.disabledView : style.cursorPointer} `} onClick={staffListForExclude?.filter(staff => !selectedExcludeMembers?.includes(staff.id))?.length === 0 ? () => { } : () => handleMoveForExclude()}>
                                        <KeyboardArrowRightIcon sx={{ color: '#168E0D' }} />
                                    </div>
                                    <div className={`${style.moveCard} ${style.marginTop10} ${style.justifyCenter} ${style.verticalAlignCenter} ${staffListForExclude?.filter(staff => !selectedExcludeMembers?.includes(staff.id))?.length === 0 ? style.disabledView : style.cursorPointer} `} onClick={staffListForExclude?.filter(staff => !selectedExcludeMembers?.includes(staff.id))?.length === 0 ? () => { } : () => handleMoveBulkForExclude()}>
                                        <KeyboardDoubleArrowRightIcon sx={{ color: '#168E0D' }} />
                                    </div>
                                    <div className={`${style.moveCard} ${style.marginTop20} ${style.justifyCenter} ${style.verticalAlignCenter} ${staffListForExclude?.filter(staff => selectedExcludeMembers?.includes(staff.id))?.length === 0 ? style.disabledView : style.cursorPointer} `} onClick={staffListForExclude?.filter(staff => selectedExcludeMembers?.includes(staff.id))?.length === 0 ? () => { } : () => handleRemoveForExclude()}>
                                        <KeyboardArrowLeftIcon sx={{ color: '#168E0D' }} />
                                    </div>
                                    <div className={`${style.moveCard} ${style.marginTop10} ${style.justifyCenter} ${style.verticalAlignCenter} ${staffListForExclude?.filter(staff => selectedExcludeMembers?.includes(staff.id))?.length === 0 ? style.disabledView : style.cursorPointer} `} onClick={staffListForExclude?.filter(staff => selectedExcludeMembers?.includes(staff.id))?.length === 0 ? () => { } : () => handleRemoveBulkForExclude()}>
                                        <KeyboardDoubleArrowLeftIcon sx={{ color: '#168E0D' }} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className={style.labelStyle}>Staff Members To Exclude From This Attestation ({uniqueUsers?.filter(staff => selectedExcludeMembers?.includes(staff.id))?.length})</div>
                                <div className={style.attestationGroupRightCard}>
                                    {uniqueUsers?.filter(staff => selectedExcludeMembers?.includes(staff.id))?.map((data, index) => (
                                        <div className={style.groupGrid3Col} key={index}>
                                            <div className={`${style.staffName} ${style.verticalAlignCenter} ${style.cursorPointer} ${selectedStaffForMove === data?.id ? style.selectedStaff : ''} `} onClick={() => setSelectedStaffForMoveForExclusion(data?.id)}>{`${data?.name?.firstName} ${data?.name?.lastName?.toUpperCase()}${data?.serviceProviderType?.contractedServiceProviderType ? `, ${data?.serviceProviderType?.contractedServiceProviderType}` : ''} `}</div>
                                            <div className={`${style.labelStyle} ${selectedStaffForMoveForExclusion === data?.id ? style.selectedStaff : ''} `}>{data?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.departmentName?.name ? data?.sites?.sites?.[0]?.departmentList?.departments?.map(
                                                (dept) => dept?.departmentName?.name
                                            )?.join(', ') : ''} {data?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.serviceAreas?.length > 0 ? ` - ${data?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.serviceAreas?.map(divName => divName?.name)?.join(', ')}` : ''}</div>
                                            <div className={`${style.labelStyle}  ${selectedStaffForMoveForExclusion === data?.id ? style.selectedStaff : ''} `}>{findGroup(data?.id)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.marginTop20}>
                        <CommonDivider />
                    </div>
                    <div className={`${style.stepsTitleBar} ${style.verticalAlignCenter} ${style.marginTop20} `}>
                        <div className={style.stepsTitleText}>Attestation Frequency for Staff</div>
                    </div>
                    <div className={`${style.marginTop20} ${style.twoCol} `}>
                        <CommonSelectField
                            value={attestationReviewFrequency}
                            onChange={(e) => setAttestationReviewFrequency(e.target.value)}
                            className={style.fullWidth1}
                            //   firstOptionLabel={'Select Category'}
                            //   firstOptionValue={''}
                            valueList={["EVERY_1_YEAR", "EVERY_2_YEARS", "EVERY_3_YEARS"]}
                            labelList={["Once Within a year", "Every 2 Years", "Every 3 Years"]}
                            disabledList={false}
                            required={false}
                            label={"Frequency For Staff To Attest (if none within the period selected below)*"}
                        />
                    </div>
                    <div className={style.marginTop10}>
                        <CommonDivider />
                    </div>
                    <div className={`${style.stepsTitleBar} ${style.verticalAlignCenter} ${style.marginTop20} `}>
                        <div className={style.stepsTitleText}>Auto-Trigger Rules for Reviews and Attestations for Temporary Staff</div>
                    </div>
                    <div className={`${style.marginTop20} ${style.twoCol} `}>
                        <div className={style.labelStyle}>Auto trigger reviews and attestations on <strong>Revision / Update</strong> of Policy & Procedure</div>
                        <CommonSwitch label={autoTriggerOnUpdate ? 'YES' : 'NO'} checked={autoTriggerOnUpdate} onChange={(e) => setAutoTriggerOnUpdate(e.target.checked)} labelName={''} />
                    </div>
                    <div className={`${style.marginTop20} ${style.twoCol} `}>
                        <div className={style.labelStyle}>Auto trigger review and attestations for <strong>New Staff Applicant</strong></div>
                        <CommonSwitch label={autoTriggerForNewAppointment ? 'YES' : 'NO'} checked={autoTriggerForNewAppointment} onChange={(e) => setAutoTriggerForNewAppointment(e.target.checked)} labelName={''} />
                    </div>
                    {/* <div className={`${style.marginTop20} ${style.twoCol} `}>
                        <div className={style.labelStyle}>Auto trigger review and attestations for <strong>Staff Reappointment</strong></div>
                        <CommonSwitch label={autoTriggerForReappointment ? 'YES' : 'NO'} checked={autoTriggerForReappointment} onChange={(e) => setAutoTriggerForReappointment(e.target.checked)} labelName={''} />
                    </div> */}
                    <div className={`${style.marginTop20} ${style.twoCol} `}>
                        <div className={style.labelStyle}>Auto trigger review and attestations for <strong>Temporary Staffs</strong></div>
                        <CommonSwitch label={autoTriggerForLocum ? 'YES' : 'NO'} checked={autoTriggerForLocum} onChange={(e) => setAutoTriggerForLocum(e.target.checked)} labelName={''} />
                    </div>
                </div>
            </div>
            <Dialog isOpen={showAttestationGroup} onClose={() => handleGroupDialogClose()} className={`${style.addMDDialogBackground} ${style.attestationDialog} `}>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.attestationDialogHeaderCard}>
                        <div className={`${style.attestationDialogTitle} ${style.padding20} `}>Group</div>
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
                                        <KeyboardArrowRightIcon sx={{ color: '#168E0D' }} />
                                    </div>
                                    <div className={`${style.moveCard} ${style.marginTop10} ${style.justifyCenter} ${style.verticalAlignCenter} ${staffList?.filter(staff => !selectedStaffs?.includes(staff.id))?.length === 0 ? style.disabledView : style.cursorPointer} `} onClick={staffList?.filter(staff => !selectedStaffs?.includes(staff.id))?.length === 0 ? () => { } : () => handleMoveBulk()}>
                                        <KeyboardDoubleArrowRightIcon sx={{ color: '#168E0D' }} />
                                    </div>
                                    <div className={`${style.moveCard} ${style.marginTop20} ${style.justifyCenter} ${style.verticalAlignCenter} ${staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.length === 0 ? style.disabledView : style.cursorPointer} `} onClick={staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.length === 0 ? () => { } : () => handleRemove()}>
                                        <KeyboardArrowLeftIcon sx={{ color: '#168E0D' }} />
                                    </div>
                                    <div className={`${style.moveCard} ${style.marginTop10} ${style.justifyCenter} ${style.verticalAlignCenter} ${staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.length === 0 ? style.disabledView : style.cursorPointer} `} onClick={staffList?.filter(staff => selectedStaffs?.includes(staff.id))?.length === 0 ? () => { } : () => handleRemoveBulk()}>
                                        <KeyboardDoubleArrowLeftIcon sx={{ color: '#168E0D' }} />
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

export default PNPManagerStep3;