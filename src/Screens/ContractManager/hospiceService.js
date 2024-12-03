import React, { useState, useEffect } from "react";
import cloneDeep from "lodash.clonedeep";
import AddIcon from "@mui/icons-material/Add";
import { TimePicker } from "@blueprintjs/datetime";
import DatalistInput, { useComboboxControls } from "react-datalist-input";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import InputAdornment from "@mui/material/InputAdornment";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import {
    CLINIC,
    PROCEDUREREADING,
    SURGERY,
    HOSPICE,
    ONCALL,
} from "../../Constants";
import {
    FormControl,
    InputLabel,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Checkbox,
    Select,
} from "@material-ui/core";
import OutlinedInput from '@mui/material/OutlinedInput';
import MultiSelectDisplay from "../../Components/ReusableSmallComponents/multiSelectDisplay";
import { GetDateFromHours } from "./../../utils/formatting";
import { POST, GET, PUT } from "./../dataSaver";
import ReviewerApproverField from "./reviewerApproverField";
import { workFlowDataGenerator } from "./workflowDataGenerator";
import CommonInputField from "../../Components/CommonFields/CommonInputField";
import CommonCheckBox from "../../Components/CommonFields/CommonCheckBox";
import CommonSwitch from "../../Components/CommonFields/CommonSwitch";
import CommonTextField from "../../Components/CommonFields/CommonTextField";
import CommonLabel from "../../Components/CommonFields/CommonLabel";
import { valueCheck } from "../../utils/valueCheck";

import style from "./index.module.scss";
import CommonSelectField from "../../Components/CommonFields/CommonSelectField";

const ITEM_HEIGHT = 38;
const ITEM_PADDING_TOP = 5;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            // width: 300,
        },
    },
};

const HospiceService = ({
    getMetaData,
    services,
    locationItems,
    getNewLocation,
    locationToAdd,
    editService,
    serviceSelected,
    isReset,
    getIsReset,
    sites,
    contractId,
}) => {
    const limit5 = 5;
    let additionalDetails = [
        "Require Patient Data",
        "Require CPT / HCPCS code",
        "Require Details Documentation for service",
        "Prior Pre-Authorization Required",
        "Administrative Approval For Payment Required",
    ];
    const [fields, setFields] = useState();
    const [showNewService, setShowNewService] = useState(false);
    const [selectedService, setSelectedService] = useState("");
    const [selectedServices, setSelectedServices] = useState([]);
    const [addOnWorkFlow, setAddOnWorkFlow] = useState([]);
    const [CPTCode, setCPTCode] = useState([]);
    const [hospiceServiceFields, setHospiceServiceFields] = useState([]);
    const [newServices, setNewServices] = useState({
        name: "",
        rate: "0",
        sessionDuration: 1,
        serviceRate: '0',
        serviceRateFrequency: 'SESSION',
        duringNormalWorkingHours: false,
        afterWorkingHours: false,
        showLocation: true,
        locations: [],
        additionalDetails: [],
        approver: undefined,
        approverTitle: {},
        paymentApprover: undefined,
        billableService: true,
        workingTimeFrom: null,
        workingTimeTo: null,
        cptcodeRequired: false,
        reasonRequired: false,
        administrativeApprovalForPaymentRequired: false,
        patientMRNRequired: false
    });
    const [currentServiceData, setCurrentServiceData] = useState();
    const [metadata, setMetadata] = useState([]);
    const [users, setUsers] = useState([]);
    const [title, setTitle] = useState([]);
    const { setValue, value } = useComboboxControls({ initialValue: "" });
    const [codes, setCodes] = useState([{ id: '1', codeName: 'Code 1' },
    { id: '2', codeName: 'Code 2' },
    { id: '3', codeName: 'Code 3' },
    { id: '4', codeName: 'Code 4' },
    { id: '5', codeName: 'Code 5' },]);
    const [selectedCodes, setSelectedCodes] = useState([]);
    useEffect(() => {
        getFields();
    }, [locationItems]);

    useEffect(() => {
        getMetaData(metadata);
        generateHospiceFields();
    }, [metadata]);

    useEffect(() => {
        generateHospiceFields();
    }, [metadata?.serviceRate, metadata?.serviceRateFrequency])

    useEffect(() => {
        if (isReset) {
            resetMetadata();
            getIsReset(false);
        }
    }, [isReset]);

    useEffect(() => {
        getUserData();
        getTimeSheetWorkFlow();
        getCPTCode();
    }, []);

    useEffect(() => {
        setSelectedValues();
    }, [addOnWorkFlow, serviceSelected, users]);

    const resetMetadata = () => {
        setMetadata([]);
    };

    const getCPTCode = async () => {
        const { data: cptCode } = await GET("entity-service/cptCode");
        if (cptCode) {
            setCPTCode(cptCode)
        }
    }

    console.log('cpt code', CPTCode);

    const getTimeSheetWorkFlow = async () => {
        const { data: timesheetWorkFlow } = await GET(
            "timesheet-management-service/workflow"
        );
        if (timesheetWorkFlow) {
            setAddOnWorkFlow(timesheetWorkFlow);
        }
    };

    const setSelectedValues = async () => {
        if (editService) {
            let temp = [];
            let data = {
                refId: serviceSelected?.refId,
                activities: serviceSelected?.activities,
                min: serviceSelected?.contractedSchedules?.[0]?.minimum?.value,
                max: serviceSelected?.contractedSchedules?.[0]?.maximum?.value,
                frequency: serviceSelected?.contractedSchedules?.[0]?.frequency,
                sessionDuration: serviceSelected?.duration?.hours,
                serviceRate: serviceSelected?.serviceRate?.rate,
                serviceRateFrequency: serviceSelected?.serviceRate?.rateFrequency,
                sessionAmount: serviceSelected?.payableAmount?.value,
                hourlyRate: {
                    value: (
                        parseInt(serviceSelected?.payableAmount?.value) /
                        parseInt(serviceSelected?.duration?.hours)
                    ).toFixed(2),
                },
                totalSession: serviceSelected?.totalSessions?.value,
                totalSessionFrequency: serviceSelected?.totalSessions?.frequency,
                workingTimeFrom: serviceSelected?.workingPeriod?.from,
                workingTimeTo: serviceSelected?.workingPeriod?.to,
                serviceDays: serviceSelected?.serviceDays,
                activityType: { activityType: HOSPICE },
                performingActivity: serviceSelected?.performingActivity?.activity,
                payableAmount: { value: serviceSelected?.payableAmount?.value },
                locations: serviceSelected?.serviceLocations,
                locationSpecified: serviceSelected?.locationSpecified,
                addOnActivityType: serviceSelected?.addOnActivityType?.activityType,
                workingHours: {
                    normalWorkingHours: serviceSelected?.workingHours?.normalWorkingHours,
                    afterWorkingHours: serviceSelected?.workingHours?.afterWorkingHours,
                },
                cptcodeRequired: serviceSelected?.cptcodeRequired,
                reasonRequired: serviceSelected?.reasonRequired,
                administrativeApprovalForPaymentRequired: serviceSelected?.administrativeApprovalForPaymentRequired,
                patientMRNRequired: serviceSelected?.patientMRNRequired,
                billableService: serviceSelected?.billableService,
                activityApprovalWFRequired: serviceSelected?.activityApprovalWFRequired,
                activityResponse: serviceSelected?.activityResponse,
                activityApprovalWFRequired: serviceSelected?.activityApprovalWFRequired,
                workflowId: serviceSelected?.workFlow?.id,
                workflowName: serviceSelected?.workFlow?.workFlowName?.name,
                billableService: serviceSelected?.billableService,
                workingTimeFrom: GetDateFromHours(
                    serviceSelected?.workingPeriod?.from?.toString() || ""
                ),
                workingTimeTo: GetDateFromHours(
                    serviceSelected?.workingPeriod?.to?.toString() || ""
                ),

            };
            let workflowData =
                addOnWorkFlow
                    ?.filter((data) => data?.id === serviceSelected?.workFlow?.id)
                    ?.map((data) => data?.workFlowMap?.workflow)[0] || {};
            let workFlowValues = Object?.values(workflowData);
            if (workFlowValues?.length === 1) {
                data.approver = users
                    ?.filter((data) => data?.id === workFlowValues?.[0]?.workFlowUser?.id)
                    ?.map((data) => data)[0];
                data.paymentApprover = users
                    ?.filter((data) => data?.id === workFlowValues?.[0]?.workFlowUser?.id)
                    ?.map((data) => data)[0];
            } else {
                data.approver = users
                    ?.filter((data) => data?.id === workFlowValues?.[0]?.workFlowUser?.id)
                    ?.map((data) => data)[0];
                data.paymentApprover = users
                    ?.filter((data) => data?.id === workFlowValues?.[1]?.workFlowUser?.id)
                    ?.map((data) => data)[0];
            }

            temp.push(data);
            setMetadata(temp);
            let selectedServiceTemp = selectedServices;
            selectedServiceTemp?.push(serviceSelected?.performingActivity?.activity);
            setSelectedServices(selectedServiceTemp);
        }
    };

    const resetNewServices = () => {
        setNewServices({
            name: "",
            rate: "0",
            duringNormalWorkingHours: false,
            afterWorkingHours: false,
            showLocation: true,
            locations: [],
            additionalDetails: [],
            approver: undefined,
            approverTitle: {},
            paymentApprover: undefined,
            billableService: false,
            workingTimeFrom: null,
            workingTimeTo: null,
        });
    };

    const getUserData = async () => {
        let siteId = sites?.map((data) => data?.id);
        let deptId = [];
        sites?.map((data) =>
            data?.departmentList?.departments?.map((dept) => {
                deptId.push(`${data?.id}#${dept?.id}`);
            })
        );
        let encodedDept = encodeURIComponent(deptId);
        let uri = `user-management-service/user/workFlowUser?sites=${siteId}&sitedepartments=${encodedDept}&contractIdToIgnore=${contractId}`;
        const { data: userList } = await GET(uri);
        if (userList) {
            setUsers(userList);
            let temp = [];
            userList?.map((data) =>
                data?.sites?.sites?.map((site) => {
                    if (
                        data?.name?.firstName &&
                        site?.siteName?.siteName &&
                        site?.siteResponsibility?.title
                    ) {
                        if (
                            site?.siteResponsibility?.title !== "" &&
                            site?.siteResponsibility?.title !== undefined &&
                            site?.siteResponsibility?.title !== null
                        ) {
                            temp.push({
                                fname: data?.name?.firstName,
                                lname: data?.name?.lastName,
                                suffix: data?.name?.suffix?.suffix || "",
                                site: site?.siteName?.siteName,
                                title: site?.siteResponsibility?.title,
                                id: data?.id,
                                approver:
                                    data?.roles
                                        ?.filter((role) => role?.roleName === "Approver")
                                        ?.map((data) => data)?.length !== 0
                                        ? true
                                        : false,
                                reviewer:
                                    data?.roles
                                        ?.filter((role) => role?.roleName === "Reviewer")
                                        ?.map((data) => data)?.length !== 0
                                        ? true
                                        : false,
                            });
                        }

                        site?.departmentList?.departments?.map((dept) => {
                            if (
                                dept?.departmentResponsibility?.title !== "" &&
                                dept?.departmentResponsibility?.title !== undefined &&
                                dept?.departmentResponsibility?.title !== null
                            ) {
                                temp.push({
                                    fname: data?.name?.firstName,
                                    lname: data?.name?.lastName,
                                    suffix: data?.name?.suffix?.suffix || "",
                                    site: dept?.departmentName?.name,
                                    title: dept?.departmentResponsibility?.title,
                                    id: data?.id,
                                    approver:
                                        data?.roles
                                            ?.filter((role) => role?.roleName === "Approver")
                                            ?.map((data) => data)?.length !== 0
                                            ? true
                                            : false,
                                    reviewer:
                                        data?.roles
                                            ?.filter((role) => role?.roleName === "Reviewer")
                                            ?.map((data) => data)?.length !== 0
                                            ? true
                                            : false,
                                });
                            }
                        });
                    }
                })
            );
            setTitle(temp);
        }
        // const { data: userList } = await GET(`contract-managment-service/contracts/workFlowUser`)
        // if (userList) {
        //   setUsers(userList);
        // }
    };

    const getSelectedLocation = (serviceName) => {
        let location = metadata
            ?.filter((data) => data?.performingActivity === serviceName)
            ?.map((data) => data?.locations)?.[0];
        let locationList = location?.map((location) => location?.location) || [];
        return locationList;
    };

    const handleCodeChange = (value) => {
        setSelectedCodes(value);
    }

    console.log('selectedCodes', selectedCodes);

    const removeLocation = (locationIndex) => {
        let locationTemp =
            metadata
                ?.filter((data) => data?.performingActivity === selectedService)
                ?.map((data) => data?.locations)[0] || [];
        let temp = metadata;
        temp
            ?.filter((data) => data?.performingActivity === selectedService)
            ?.map((data) => {
                data.locations = locationTemp
                    ?.filter((location, index) => locationIndex !== index)
                    ?.map((data) => data);
            });
        setMetadata(temp);
        getFields();
    };

    const currentService = (name) => {
        let serviceData = metadata
            ?.filter(
                (data) =>
                    getServiceName(
                        data?.activityType?.activityType,
                        data?.activities?.map((data) => data?.activity)
                    ) === name
            )
            ?.map((data) => data)[0];
        return serviceData;
        setCurrentServiceData(serviceData);
    };

    const switchShowLocation = (name) => {
        let temp = metadata;
        temp
            ?.filter((data) => data?.performingActivity === name)
            ?.map((data) => {
                data.locationSpecified = !data.locationSpecified;
            });
        setMetadata(temp);
        getFields();
    };

    const onApproverSelected = (value, serviceName, title) => {
        console.log(" Inside approval selection value", value, serviceName);
        let temp = metadata;
        temp
            ?.filter((data) => data?.performingActivity === serviceName)
            ?.map((data) => {
                data.approver = value;
                data.approverTitle = title;
            });
        console.log("temp value", temp);
        setMetadata(temp);
        getFields();
    };

    const getFields = () => {
        let serviceFields = [];
        setFields(serviceFields);
    };

    let serviceList = [];
    let temp = services;
    temp
        ?.filter((data) =>
            [CLINIC, SURGERY, PROCEDUREREADING, ONCALL]?.includes(
                data?.activityTypeTemplate?.activityTypeTemplate
            )
        )
        ?.map((data) => {
            let activityName = data?.activityType?.activityType;
            let activities = data?.activities?.map((data) => data?.activity);
            let result =
                activities?.length !== 0
                    ? `${activityName} (${activities?.map((data) => data)?.join(", ")})`
                    : `${activityName}`;
            let alreadyExist = services
                ?.filter(
                    (data) =>
                        data?.activityTypeTemplate?.activityTypeTemplate === HOSPICE &&
                        data?.performingActivity?.activity ===
                        `${activities?.map((data) => data)?.join("-")}`
                )
                ?.map((data) => data);
            if (alreadyExist?.length === 0) {
                serviceList.push(result);
            }
        });

    const selectLocation = (location, name) => {
        let locationTemp =
            metadata
                ?.filter((data) => data?.performingActivity === name)
                ?.map((data) => data?.locations)[0] || [];
        if (
            !locationTemp.map((data) => data?.location)?.includes(location?.location)
        ) {
            let temp = metadata;
            temp
                ?.filter((data) => data?.performingActivity === name)
                ?.map((data) => {
                    locationTemp.push(location);
                    data.locations = locationTemp;
                });
            setMetadata(temp);
        }
        setValue("");
        getFields();
    };

    const getServiceName = (activityName, activities) => {
        let result =
            `${activityName} (${activities?.map((data) => data)?.join(", ")})` || "";
        return result;
    };

    const selectService = (name, checked) => {
        if (checked) {
            let temp = metadata;
            const selectedData = cloneDeep(
                services
                    ?.filter(
                        (data) =>
                            getServiceName(
                                data?.activityType?.activityType,
                                data?.activities?.map((data) => data?.activity)
                            ) === name
                    )
                    ?.map((data) => data)[0]
            );
            selectedData.parentActivity = cloneDeep(
                services
                    ?.filter(
                        (data) =>
                            getServiceName(
                                data?.activityType?.activityType,
                                data?.activities?.map((data) => data?.activity)
                            ) === name
                    )
                    ?.map((data) => data)[0]
            )?.activityType?.activityType;
            selectedData.performingActivity = name;
            selectedData.activityType = { activityType: HOSPICE };
            selectedData.selectedActivityId = selectedData?.refId;
            selectedData.refId = null;
            selectedData.sessionDuration = selectedData?.duration?.hours;
            selectedData.contractedSchedules = [];
            selectedData.patientsSeenTargets = [];
            selectedData.scheduledPatientsTargets = [];
            selectedData.workingTimeFrom = selectedData?.workingTimeFrom;
            selectedData.workingTimeTo = selectedData?.workingTimeTo;
            selectedData.locations = selectedData?.serviceLocations;
            temp.push(selectedData);
            setSelectedServices(temp?.map((data) => data?.performingActivity));
            setMetadata(temp);
            console.log("temp", temp);
        } else {
            metadata
                ?.filter((data) => data?.performingActivity !== name)
                ?.map((data) => {
                    data.parentActivity = data?.activityType?.activityType;
                });
            let temp = metadata
                ?.filter((data) => data?.performingActivity !== name)
                ?.map((data) => data);
            console.log("temp 2", temp);
            setMetadata(temp);
            setSelectedServices(temp?.map((data) => data?.performingActivity));
        }
        getFields();
    };

    const handleRequestApprovalChange = (name) => {
        let temp = metadata;
        temp
            ?.filter((data) => data?.performingActivity === name)
            ?.map((data) => {
                data.activityApprovalWFRequired = !data.activityApprovalWFRequired;
                data.approver = undefined;
                data.paymentApprover = undefined;
            });

        setMetadata(temp);
        getFields();
    };

    const handleSessionAmountChange = (name, value) => {
        let temp = metadata;
        temp
            ?.filter((data) => data?.allowableAddOnWorkingHours === name)
            ?.map((data) => {
                data.sessionAmount = value;
            });
        setMetadata(temp);
        getFields();
    };

    const handleNewServiceChange = (name, value) => {
        if (name === "billableService" && !value) {
            setNewServices({ ...newServices, billableService: value, rate: 0 });
        } else if (name === 'serviceRate') {
            setNewServices({ ...newServices, serviceRate: parseFloat(value), rate: newServices?.serviceRateFrequency === 'SESSION' ? parseFloat(value) : (newServices?.serviceRate * (newServices?.sessionDuration || 0)) });
        } else if (name === 'serviceRateFrequency') {
            setNewServices({ ...newServices, serviceRateFrequency: value, rate: value === 'SESSION' ? parseFloat(newServices?.serviceRate) : (newServices?.serviceRate * (newServices?.sessionDuration || 0)) });
        } else if (name === 'sessionDuration') {
            setNewServices({ ...newServices, sessionDuration: parseFloat(value), rate: newServices?.serviceRateFrequency === 'SESSION' ? parseFloat(newServices?.serviceRate) : (newServices?.serviceRate * (parseFloat(value) || 0)) });
        } else {
            setNewServices({ ...newServices, [name]: value });
        }
    };

    const updateWorkingHours = (name, value, index) => {
        let temp = metadata;
        // if (name === 'workingTimeFrom') {
        //   temp[index]['workingPeriod']['from'] = value;
        // }
        // if (name === 'workingTimeTo') {
        //   temp[index]['workingPeriod']['to'] = value;
        // }
        temp[index][name] = value;
        // temp?.map(data => {
        //   data[name] = value;
        // })
        setMetadata(temp);
        generateHospiceFields();
        console.log('temp', temp);
    }

    console.log('New Services', newServices);

    const handleNewServiceLocation = (selectedItem) => {
        if (newServices?.locations?.map((data) => data)?.includes(selectedItem)) {
            ErrorToaster("Location Already Exists");
            return;
        }
        let temp = newServices?.locations;
        temp.push(selectedItem);
        setNewServices({ ...newServices, locations: temp });
        setValue("");
    };

    const handleAdditionalDetailSelection = (data) => {
        console.log('Inside Handle Function', data)

        let temp = newServices?.additionalDetails || [];
        if (temp?.includes(data)) {
            if (data === "Prior Pre-Authorization Required") {
                temp = temp
                    ?.filter(
                        (detail) =>
                            detail !== "Administrative Approval For Payment Required"
                    )
                    ?.map((data) => data);
            }
            temp = temp?.filter((detail) => detail !== data)?.map((data) => data);
        } else {
            if (
                data === "Administrative Approval For Payment Required" &&
                !temp?.includes("Prior Pre-Authorization Required")
            ) {
                return;
            }
            temp?.push(data);
        }
        if (data === "Require Patient Data") {
            setNewServices({ ...newServices, patientMRNRequired: !newServices?.patientMRNRequired, additionalDetails: temp })
        } else if (data === "Prior Pre-Authorization Required") {
            setNewServices({ ...newServices, activityApprovalWFRequired: !newServices?.activityApprovalWFRequired, additionalDetails: temp })
        } else if (data === "Administrative Approval For Payment Required") {
            setNewServices({ ...newServices, administrativeApprovalForPaymentRequired: !newServices?.administrativeApprovalForPaymentRequired, additionalDetails: temp })
        } else if (data === "Require CPT / HCPCS code") {
            setNewServices({ ...newServices, cptcodeRequired: !newServices?.cptcodeRequired, additionalDetails: temp })
        }
        else {
            setNewServices({ ...newServices, reasonRequired: !newServices?.reasonRequired, additionalDetails: temp })
        }
        // setNewServices({ ...newServices, additionalDetails: temp });
    };

    const addToMetaData = () => {
        if (newServices?.billableService && newServices?.rate === "0") {
            ErrorToaster("Payment Rate Cannot be 0 if Billable");
            return;
        }
        let temp = metadata;
        temp.push({
            sites: [],
            activities: [{ activity: newServices?.name }],
            activityType: { activityType: HOSPICE },
            performingActivity: newServices?.name,
            parentActivity: "Hospice Clinical Consult Services",
            sessionAmount: newServices?.rate,
            sessionDuration: 1,
            serviceRate: newServices?.serviceRate,
            hourlyRate: {
                value: newServices?.rate,
            },
            serviceDays: {
                friday: true,
                isholidays: true,
                monday: true,
                tuesday: true,
                wednesday: true,
                thursday: true,
                saturday: true,
                sunday: true,
                weekDays: true,
                weekEnds: true,
            },
            locations: newServices?.locations,
            locationSpecified: newServices?.showLocation,
            workingHours: {
                normalWorkingHours: newServices?.duringNormalWorkingHours,
                afterWorkingHours: newServices?.afterWorkingHours,
            },
            workingTimeFrom: newServices?.workingTimeFrom,
            workingTimeTo: newServices?.workingTimeTo,
            workingPeriod: {
                from: newServices?.workingTimeFrom
                    ?.toLocaleTimeString("it-IT")
                    .toString(),
                to: newServices?.workingTimeTo?.toLocaleTimeString("it-IT").toString(),
            },
            activityResponse: {
                dataMap: {
                    additionalDetails: newServices?.additionalDetails,
                },
            },
            activityApprovalWFRequired: newServices?.additionalDetails?.includes(
                "Prior Pre-Authorization Required"
            ),
            patientMRNRequired: newServices?.patientMRNRequired,
            cptcodeRequired: newServices?.cptcodeRequired,
            reasonRequired: newServices?.reasonRequired,
            administrativeApprovalForPaymentRequired: newServices?.administrativeApprovalForPaymentRequired,
            approver: newServices?.approver,
            paymentApprover: newServices?.paymentApprover,
            billableService: newServices?.billableService,
        });
        setMetadata(temp);
        let selectedServiceTemp = selectedServices;
        selectedServiceTemp?.push(newServices?.name);
        setSelectedServices(selectedServiceTemp);
        resetNewServices();
        setShowNewService(false);
        generateHospiceFields();
    };

    const handleNewServiceName = () => {
        if (newServices?.name === "") {
            ErrorToaster("New Service Name is Mandatory");
            return;
        }
        if (selectedServices?.includes(newServices?.name)) {
            ErrorToaster("Service Name cannot be duplicated");
            return;
        }
        setShowNewService(true);
    };

    const generateHospiceFields = () => {
        let temp = [];
        metadata?.[0]?.activityResponse?.dataMap?.selectedActivityId ===
            undefined &&
            metadata
                ?.filter(
                    (data) =>
                        !serviceList
                            ?.map((service) => service)
                            ?.includes(data?.performingActivity) || editService
                )
                ?.map((data, index) => temp.push((
                    <div
                        className={style.marginTop20}
                        onClick={() => setSelectedService(data?.performingActivity)}
                    >
                        <CommonCheckBox
                            checked={selectedServices?.includes(data?.performingActivity)}
                            onChange={(e) =>
                                selectService(data?.performingActivity, e.target.checked)
                            }
                            label={
                                data?.performingActivity?.activity || data?.performingActivity
                            }
                        />
                        <div className={`${style.addonBoxStyle} ${style.marginTop20}`}>
                            {data?.billableService && (
                                <>
                                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                        <CommonLabel value='Service Rate' />
                                        <div className={`${style.displayInRow}`}>
                                            <div className={`${style.threeFieldWidth}`}>
                                                <CommonTextField
                                                    type="number"
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>
                                                    }}
                                                    value={data?.serviceRate}
                                                    onChange={(e) => e.target.value >= 0 && updateServiceRate(data?.performingActivity, parseFloat(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                        <CommonLabel value='Service Frequency' />
                                        <div className={`${style.displayInRow}`}>
                                            <div className={`${style.threeFieldWidth}`}>
                                                <CommonSelectField
                                                    value={data?.serviceRateFrequency || ''}
                                                    onChange={(e) => updateServiceRateFrequency(data?.performingActivity, e.target.value)}
                                                    firstOptionLabel={'Select Frequency'} firstOptionValue={''}
                                                    valueList={['SESSION', 'HOUR']}
                                                    labelList={['Per Session', 'Per Hour']}
                                                    disabledList={[false, false]} />
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={`${style.addManagerGrid} ${style.marginTop20}`}
                                    >
                                        <CommonLabel value="Payment Rate*" />
                                        <div className={`${style.displayInRow}`}>
                                            <div className={`${style.threeFieldWidth}`}>
                                                <CommonTextField
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment
                                                                position="start"
                                                                sx={{ fontSize: 10 }}
                                                            >
                                                                $
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    disabled={true}
                                                    defaultValue={data?.sessionAmount || '0'}
                                                    onChange={(e) =>
                                                        updateRate(data?.performingActivity, e.target.value)
                                                    }
                                                />
                                            </div>
                                            {/* <div className={style.verticalAlignCenter}>
                                                <CommonLabel
                                                    className={`${style.marginLeft20}`}
                                                    value={data?.serviceRateFrequency}
                                                />
                                            </div> */}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <CommonLabel value="Additional Details*" />
                                <div>
                                    {additionalDetails?.map((details, index) => (
                                        <>
                                            <div
                                                className={`${style.additionalDetails} ${data?.activityResponse?.dataMap?.additionalDetails?.includes(
                                                    details
                                                )
                                                    ? style.additionalDetailsSelected
                                                    : ""
                                                    } ${style.cursorPointer} ${index !== 0 ? style.marginTop10 : ""
                                                    }`}
                                                onClick={() =>
                                                    additionalDetailSelectionChange(details)
                                                }
                                            >
                                                <div className={style.alignCenter}>
                                                    <TaskAltIcon
                                                        sx={{
                                                            color:
                                                                data?.activityResponse?.dataMap?.additionalDetails?.includes(
                                                                    details
                                                                )
                                                                    ? "#06617A"
                                                                    : "#E4E4E4",
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    className={`${style.additionalDetailsTextStyle} ${style.verticalAlignCenter}`}
                                                >
                                                    {details}
                                                </div>
                                            </div>
                                            {data?.activityResponse?.dataMap?.additionalDetails?.includes(
                                                "Require CPT / HCPCS code"
                                            ) &&
                                                details === "Require CPT / HCPCS code" && (
                                                    <div className={`${style.grid3} ${style.marginTop20}`}>

                                                        <CommonLabel value={"Applicable CPT / HCPCS Code*"} />
                                                        <FormControl sx={{ m: 1, width: 300 }} size="small">
                                                            <Select
                                                                labelId="demo-multiple-checkbox-label"
                                                                id="demo-multiple-checkbox"
                                                                multiple
                                                                value={CPTCode?.map(data => data)}
                                                                onChange={(e) => handleCodeChange(e.target.value)}
                                                                input={<OutlinedInput label="" />}
                                                                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                                                renderValue={CPTCode => CPTCode.map(data => data?.description)?.join(', ')}
                                                                MenuProps={MenuProps}
                                                            >
                                                                {CPTCode?.map((name) => (
                                                                    <MenuItem key={name} value={name?.description}>
                                                                        <Checkbox checked={CPTCode?.map(data => data?.description)?.includes(name?.description)} style={{ color: '#06617A' }} />
                                                                        <ListItemText primary={name?.description} />
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                        <div
                                                            className={`${style.addCptCodeButton} ${style.alignCenter}`}
                                                            onClick={() => { }}
                                                        >
                                                            ADD / MODIFY CPT CODE
                                                        </div>
                                                    </div>
                                                )}
                                            {data?.activityResponse?.dataMap?.additionalDetails?.includes(
                                                "Prior Pre-Authorization Required"
                                            ) &&
                                                details === "Prior Pre-Authorization Required" && (
                                                    // <ReviewerApproverField data={users} label="Designate Request Approver*" selectLabel="Select Approver" onValueChange={(value) => { onAdditionalServiceApproverChange(data?.performingActivity, users?.filter(user => user?.userId === value)?.map(user => user)[0]) }} value={data?.approver?.userId} />
                                                    <div
                                                        className={`${style.addManagerGrid} ${style.marginTop20}`}
                                                    >
                                                        <CommonLabel
                                                            value={"Designate Request Approver*"}
                                                        />
                                                        <div className={style.fullWidth}>
                                                            <CommonSelectField
                                                                className={`${style.fullWidth} `}
                                                                defaultValue={data?.approver?.id}
                                                                value={
                                                                    data?.approver?.id
                                                                        ? data?.approver?.id
                                                                        : "0"
                                                                }
                                                                onChange={(e) => {
                                                                    onAdditionalServiceApproverChange(
                                                                        data?.performingActivity,
                                                                        users
                                                                            ?.filter(
                                                                                (user) => user?.id === e.target.value
                                                                            )
                                                                            ?.map((user) => user)[0]
                                                                    );
                                                                }}
                                                                firstOptionLabel={"Select Approver"}
                                                                firstOptionValue={"0"}
                                                                valueList={title
                                                                    ?.filter(
                                                                        (titleData) =>
                                                                            titleData?.approver === true
                                                                    )
                                                                    ?.map((titleData) => titleData?.id)}
                                                                labelList={title
                                                                    ?.filter(
                                                                        (titleData) =>
                                                                            titleData?.approver === true
                                                                    )
                                                                    ?.map(
                                                                        (titleData) =>
                                                                            `${titleData?.fname} ${titleData?.lname}, ${titleData?.suffix}, ${titleData?.title} - ${titleData?.site}`
                                                                    )}
                                                                disabledList={title
                                                                    ?.filter(
                                                                        (titleData) =>
                                                                            titleData?.approver === true
                                                                    )
                                                                    ?.map((data) => false)}
                                                                widthValue={370}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            {data?.activityResponse?.dataMap?.additionalDetails?.includes(
                                                "Administrative Approval For Payment Required"
                                            ) &&
                                                details ===
                                                "Administrative Approval For Payment Required" && (
                                                    // <ReviewerApproverField data={users} label="Designate Payment Approver*" selectLabel="Select Payment Approver" onValueChange={(value) => { onAdditionalServicePaymentApproverChange(data?.performingActivity, users.filter(user => user?.userId === value)?.map(user => user)[0]) }} value={data?.paymentApprover?.userId} />
                                                    <div
                                                        className={`${style.addManagerGrid} ${style.marginTop20}`}
                                                    >
                                                        <CommonLabel
                                                            value={"Designate Payment Approver*"}
                                                        />
                                                        <div className={style.fullWidth}>
                                                            <CommonSelectField
                                                                className={`${style.fullWidth} `}
                                                                defaultValue={data?.paymentApprover?.id}
                                                                value={
                                                                    data?.paymentApprover?.id
                                                                        ? data?.paymentApprover?.id
                                                                        : "0"
                                                                }
                                                                onChange={(e) => {
                                                                    onAdditionalServicePaymentApproverChange(
                                                                        data?.performingActivity,
                                                                        users
                                                                            .filter(
                                                                                (user) => user?.id === e.target.value
                                                                            )
                                                                            ?.map((user) => user)[0]
                                                                    );
                                                                }}
                                                                firstOptionLabel={"Select Payment Approver"}
                                                                firstOptionValue={"0"}
                                                                valueList={title
                                                                    ?.filter(
                                                                        (titleData) =>
                                                                            titleData?.approver === true
                                                                    )
                                                                    ?.map((data) => data?.id)}
                                                                labelList={title
                                                                    ?.filter(
                                                                        (titleData) =>
                                                                            titleData?.approver === true
                                                                    )
                                                                    ?.map(
                                                                        (titleData) =>
                                                                            `${titleData?.fname} ${titleData?.lname}, ${titleData?.suffix}, ${titleData?.title} - ${titleData?.site}`
                                                                    )}
                                                                disabledList={title?.map((data) => false)}
                                                                widthValue={370}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                        </>
                                    ))}
                                </div>
                            </div>
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <CommonLabel value="Allowable Working Hours*" />
                                <div className={style.twoCol}>
                                    <CommonCheckBox
                                        checked={data?.workingHours?.normalWorkingHours}
                                        className={`${style.marginLeft10}`}
                                        onChange={(e) =>
                                            handleWorkingHoursChange(
                                                data?.performingActivity,
                                                e.target.checked,
                                                "normalWorkingHours"
                                            )
                                        }
                                        label="During Normal Working Hours"
                                    />
                                    <CommonCheckBox
                                        checked={data?.workingHours?.afterWorkingHours}
                                        className={`${style.marginLeft10}`}
                                        onChange={(e) =>
                                            handleWorkingHoursChange(
                                                data?.performingActivity,
                                                e.target.checked,
                                                "afterWorkingHours"
                                            )
                                        }
                                        label="After Working Hours"
                                    />
                                </div>
                            </div>
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <CommonLabel value="Allowable Working Day Hours For Service*" />
                                <div className={style.displayInRow}>
                                    <TimePicker
                                        useAmPm={false}
                                        onChange={(e) => {
                                            updateWorkingHours("workingTimeFrom", e, index);
                                        }}
                                        value={data?.workingTimeFrom === null ? null : new Date(data?.workingTimeFrom)}

                                    />
                                    <p
                                        className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}
                                    >
                                        To
                                    </p>
                                    <TimePicker
                                        useAmPm={false}
                                        onChange={(e) =>
                                            updateWorkingHours("workingTimeTo", e, index)
                                        }
                                        value={data?.workingTimeTo === null ? null : new Date(data?.workingTimeTo)}
                                    // minTime={new Date(new Date(metadata?.workingTimeFrom).getTime() + (metadata?.sessionDuration * 60 * 60 * 1000))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )))
        setHospiceServiceFields(temp);
    }

    const updateRate = (serviceName, value) => {
        let temp = metadata;
        temp
            ?.filter((data) => data?.performingActivity === serviceName)
            ?.map((data) => {
                data.sessionAmount = value;
                data.hourlyRate = {
                    value: (data.sessionAmount / data.sessionDuration).toFixed(2),
                };
            });
        setMetadata(temp);
        getFields();
    };

    const updateServiceRate = (serviceName, value) => {
        let temp = metadata;
        temp
            ?.filter((data) => data?.performingActivity === serviceName)
            ?.map((data) => {
                data.sessionAmount = data?.serviceRate === 'SESSION' ? parseFloat(value) : (data?.serviceRate * data?.sessionDuration);
                data.serviceRate = parseFloat(value)
            });
        setMetadata(temp);
        getFields();
        generateHospiceFields();
    };

    const updateServiceRateFrequency = (serviceName, value) => {
        let temp = metadata;
        temp
            ?.filter((data) => data?.performingActivity === serviceName)
            ?.map((data) => {
                data.sessionAmount = value === 'SESSION' ? parseFloat(data?.serviceRate) : (data?.serviceRate * data?.sessionDuration);
                data.serviceRateFrequency = value
            });
        setMetadata(temp);
        getFields();
        generateHospiceFields();
    };

    const updateSessionDuration = (serviceName, value) => {
        let temp = metadata;
        temp
            ?.filter((data) => data?.performingActivity === serviceName)
            ?.map((data) => {
                data.sessionDuration = value;
                data.hourlyRate = {
                    value: (data.sessionAmount / data.sessionDuration).toFixed(2),
                };
            });
        setMetadata(temp);
        getFields();
    };

    const UpdateBillable = (serviceName, value) => {
        console.log("inside func", value, serviceName);
        let temp = metadata;
        temp
            ?.filter((data) => data?.performingActivity === serviceName)
            ?.map((data) => {
                data.billableService = value;
                if (!value) {
                    data.sessionAmount = "0";
                }
            });
        setMetadata(temp);
        getFields();
    };

    const handleWorkingHoursChange = (serviceName, value, name) => {
        let temp = metadata;
        temp
            ?.filter((data) => data?.performingActivity === serviceName)
            ?.map((data) => {
                data.workingHours = { ...data.workingHours, [name]: value };
            });
        setMetadata(temp);
        getFields();
        generateHospiceFields();
    };

    const onAdditionalServiceApproverChange = (name, value) => {
        let temp = metadata;
        temp
            ?.filter((data) => data?.performingActivity === name)
            ?.map((data) => {
                console.log("temp check", data?.performingActivity);
                data.approver = value;
            });
        setMetadata(temp);
        getFields();
        generateHospiceFields();
    };

    const onAdditionalServicePaymentApproverChange = (name, value) => {
        let temp = metadata;
        temp
            ?.filter((data) => data?.performingActivity === name)
            ?.map((data) => {
                data.paymentApprover = value;
            });
        setMetadata(temp);
        getFields();
        generateHospiceFields();
    };

    const additionalDetailSelectionChange = (data) => {
        let temp =
            metadata?.[0]?.activityResponse?.dataMap?.additionalDetails || [];
        let approver = metadata?.[0]?.approver;
        let paymentApprover = metadata?.[0]?.paymentApprover;
        if (temp?.includes(data)) {
            if (data === "Prior Pre-Authorization Required") {
                approver = undefined;
                paymentApprover = undefined;
                temp = temp
                    ?.filter(
                        (detail) =>
                            detail !== "Administrative Approval For Payment Required"
                    )
                    ?.map((data) => data);
            }
            if (data === "Administrative Approval For Payment Required") {
                paymentApprover = undefined;
            }
            temp = temp?.filter((detail) => detail !== data)?.map((data) => data);
        } else {
            if (
                data === "Administrative Approval For Payment Required" &&
                !temp?.includes("Prior Pre-Authorization Required")
            ) {
                return;
            }
            temp?.push(data);
        }
        let tempData = metadata;
        tempData[0].approver = approver;
        tempData[0].paymentApprover = paymentApprover;
        tempData[0].activityResponse = { dataMap: { additionalDetails: temp } };
        if (data === "Require Patient Data") {
            tempData[0].patientMRNRequired = !tempData[0]?.patientMRNRequired;
        } else if (data === "Prior Pre-Authorization Required") {
            tempData[0].activityApprovalWFRequired = !tempData[0]?.activityApprovalWFRequired;
        } else if (data === "Administrative Approval For Payment Required") {
            tempData[0].administrativeApprovalForPaymentRequired = !tempData[0]?.administrativeApprovalForPaymentRequired;
        } else if (data === "Require CPT / HCPCS code") {
            tempData[0].cptcodeRequired = !tempData[0]?.cptcodeRequired;
        }
        else {
            tempData[0].reasonRequired = !tempData[0]?.reasonRequired;
        }
        // setMetadata({ ...metadata, 'activityResponse': { 'dataMap': { 'additionalDetails': temp } } });
        setMetadata(tempData);
        getFields();
        generateHospiceFields();
    };

    console.log("metadata", metadata);

    const dataCheck = (value) => {
        if (editService) {
            return valueCheck(value);
        } else {
            return false;
        }
    };

    return (
        <div>
            {hospiceServiceFields}

            {
                // editService &&
                //     metadata
                //         ?.filter(
                //             (data) => data?.activityResponse?.dataMap?.selectedActivityId
                //         )
                //         ?.map((data) => (
                //             <div className={style.marginTop20}>
                //                 <CommonCheckBox
                //                     checked={true}
                //                     label={`${data?.addOnActivityType
                //                         } (${data?.performingActivity?.replaceAll("-", ", ")})`}
                //                 />
                //                 <div className={`${style.addonBoxStyle}`}>
                //                     <div className={`${style.addManagerGrid}`}>
                //                         <CommonLabel value="Only Allow Upon Request / Notification Approval" />
                //                         <CommonSwitch
                //                             label={data?.activityApprovalWFRequired ? "YES" : "NO"}
                //                             className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`}
                //                             checked={data?.activityApprovalWFRequired}
                //                             onChange={() =>
                //                                 handleRequestApprovalChange(data?.performingActivity)
                //                             }
                //                         />
                //                     </div>
                //                     {data?.activityApprovalWFRequired && (
                //                         // <ReviewerApproverField data={users} label="Designate Request Approver*" selectLabel="Select Approver" onValueChange={(value) => { onApproverSelected(users?.filter(data => data?.userId === value)?.map(data => data)[0], data?.performingActivity) }} value={metadata?.[0]?.approver?.userId} />
                //                         <div
                //                             className={`${style.addManagerGrid} ${style.marginTop20}`}
                //                         >
                //                             <CommonLabel value={"Designate Request Approver*"} />
                //                             <div className={style.fullWidth}>
                //                                 <CommonSelectField
                //                                     className={`${style.fullWidth} `}
                //                                     defaultValue={metadata?.[0]?.approver?.id}
                //                                     value={
                //                                         metadata?.[0]?.approver?.id
                //                                             ? metadata?.[0]?.approver?.id
                //                                             : "0"
                //                                     }
                //                                     onChange={(e) => {
                //                                         onApproverSelected(
                //                                             users
                //                                                 ?.filter((data) => data?.id === e.target.value)
                //                                                 ?.map((data) => data)[0],
                //                                             data?.performingActivity,
                //                                             title
                //                                                 ?.filter(
                //                                                     (titleData) => titleData?.approver === true
                //                                                 )
                //                                                 ?.map((data) => data)[0]
                //                                         );
                //                                     }}
                //                                     firstOptionLabel={"Select Approver"}
                //                                     firstOptionValue={"0"}
                //                                     valueList={title
                //                                         ?.filter((titleData) => titleData?.approver === true)
                //                                         ?.map((data) => data?.id)}
                //                                     labelList={title
                //                                         ?.filter((titleData) => titleData?.approver === true)
                //                                         ?.map(
                //                                             (titleData) =>
                //                                                 `${titleData?.fname} ${titleData?.lname}, ${titleData?.suffix}, ${titleData?.title} - ${titleData?.site}`
                //                                         )}
                //                                     disabledList={title?.map((data) => false)}
                //                                     widthValue={550}
                //                                 />
                //                             </div>
                //                         </div>
                //                     )}

                //                 </div>
                //             </div>
                //         ))
            }

            {!editService && (
                <div className={`${style.marginTop20} ${style.addAddonGrid}`}>
                    <CommonInputField
                        className={style.fullWidth}
                        placeholder="Enter Consult Service"
                        value={newServices?.name}
                        onChange={(e) =>
                            setNewServices({ ...newServices, name: e.target.value })
                        }
                    />
                    <div
                        className={`${style.addAddonServiceButton} ${style.alignCenter}`}
                        onClick={handleNewServiceName}
                    >
                        ADD CONSULTS
                    </div>
                </div>
            )}

            {showNewService && (
                <div className={`${style.addonAddBox} ${style.marginTop20}`}>
                    <div className={`${style.addManagerGrid}`}>
                        <CommonLabel value="Consult Service Name*" />
                        <CommonInputField
                            value={newServices?.name}
                            className={style.fullWidth}
                            onChange={(e) => {
                                handleNewServiceChange("name", e.target.value);
                            }}
                        />
                    </div>
                    {newServices?.billableService && (
                        <>
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <CommonLabel value='ADD-ON Service Rate' />
                                <div className={`${style.displayInRow}`}>
                                    <div className={`${style.threeFieldWidth}`}>
                                        <CommonTextField
                                            type="number"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>
                                            }}
                                            value={newServices?.serviceRate}
                                            onChange={(e) => e.target.value >= 0 && handleNewServiceChange('serviceRate', parseFloat(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <CommonLabel value='ADD-ON Service Frequency' />
                                <div className={`${style.displayInRow}`}>
                                    <div className={`${style.threeFieldWidth}`}>
                                        <CommonSelectField
                                            value={newServices?.serviceRateFrequency}
                                            onChange={(e) => handleNewServiceChange('serviceRateFrequency', e.target.value)}
                                            firstOptionLabel={'Select Frequency'} firstOptionValue={''}
                                            valueList={['SESSION', 'HOUR']}
                                            labelList={['Per Session', 'Per Hour']}
                                            disabledList={[false, false]} />
                                    </div>
                                </div>
                            </div>
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <CommonLabel value="Payment Rate*" />
                                <div className={`${style.displayInRow}`}>
                                    <div className={`${style.threeFieldWidth}`}>
                                        <CommonTextField
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start" sx={{ fontSize: 10 }}>
                                                        $
                                                    </InputAdornment>
                                                ),
                                            }}
                                            disabled={true}
                                            value={newServices?.rate || '0'}
                                            onChange={(e) => {
                                                handleNewServiceChange("rate", e.target.value);
                                            }}
                                        />
                                    </div>
                                    {/* <div className={style.verticalAlignCenter}>
                                        <CommonLabel
                                            className={`${style.marginLeft20}`}
                                            value={newServices?.serviceRateFrequency}
                                        />
                                    </div> */}
                                </div>
                            </div>
                        </>
                    )}


                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <CommonLabel value="Additional Details*" />
                        <div>
                            {additionalDetails?.map((data, index) => (
                                <>
                                    <div
                                        className={`${style.additionalDetails} ${newServices?.additionalDetails?.includes(data)
                                            ? style.additionalDetailsSelected
                                            : ""
                                            } ${style.cursorPointer} ${index !== 0 ? style.marginTop10 : ""
                                            }`}
                                        onClick={() => handleAdditionalDetailSelection(data)}
                                    >
                                        <div className={style.alignCenter}>
                                            <TaskAltIcon
                                                sx={{
                                                    color: newServices?.additionalDetails?.includes(data)
                                                        ? "#06617A"
                                                        : "#E4E4E4",
                                                }}
                                            />
                                        </div>
                                        <div
                                            className={`${style.additionalDetailsTextStyle} ${style.verticalAlignCenter}`}
                                        >
                                            {data}
                                        </div>
                                    </div>
                                    {newServices?.additionalDetails?.includes(
                                        "Require CPT / HCPCS code"
                                    ) &&
                                        data === "Require CPT / HCPCS code" && (
                                            <div className={`${style.grid3} ${style.marginTop20}`}>

                                                <CommonLabel value={"Applicable CPT / HCPCS Code*"} />
                                                <FormControl sx={{ m: 1, width: 300 }} size="small">
                                                    <Select
                                                        labelId="demo-multiple-checkbox-label"
                                                        id="demo-multiple-checkbox"
                                                        multiple
                                                        value={CPTCode?.map(data => data)}
                                                        onChange={(e) => handleCodeChange(e.target.value)}
                                                        input={<OutlinedInput label="" />}
                                                        SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                                        renderValue={CPTCode => CPTCode.map(data => data?.description)?.join(', ')}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {CPTCode.map((name) => (
                                                            <MenuItem key={name} value={name}>
                                                                <Checkbox checked={CPTCode?.map(data => data?.id)?.includes(name?.id)} style={{ color: '#06617A' }} />
                                                                <ListItemText primary={name?.description} />
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <div
                                                    className={`${style.addCptCodeButton} ${style.alignCenter}`}
                                                    onClick={() => { }}
                                                >
                                                    ADD / MODIFY CPT CODE
                                                </div>
                                            </div>
                                        )}
                                    {newServices?.additionalDetails?.includes(
                                        "Prior Pre-Authorization Required"
                                    ) &&
                                        data === "Prior Pre-Authorization Required" && (
                                            // <ReviewerApproverField data={users} label="Designate Request Approver*" selectLabel="Select Approver" onValueChange={(value) => { setNewServices({ ...newServices, approver: users?.filter(data => data?.userId === value)?.map(data => data)[0] }) }} />
                                            <div
                                                className={`${style.addManagerGrid} ${style.marginTop20}`}
                                            >
                                                <CommonLabel value={"Designate Request Approver*"} />
                                                <div className={style.fullWidth} key={index}>
                                                    <CommonSelectField
                                                        className={`${style.fullWidth} `}
                                                        defaultValue={newServices?.approver}
                                                        value={
                                                            newServices?.approver
                                                                ? newServices?.approver?.id
                                                                : "0"
                                                        }
                                                        onChange={(e) => {
                                                            setNewServices({
                                                                ...newServices,
                                                                approver: users
                                                                    ?.filter(
                                                                        (data) => data?.id === e.target.value
                                                                    )
                                                                    ?.map((data) => data)[0],
                                                                approverTitle: title
                                                                    ?.filter(
                                                                        (titleData) => titleData?.approver === true
                                                                    )
                                                                    ?.map((data) => data)[0],
                                                            });
                                                        }}
                                                        firstOptionLabel={"Select Approver"}
                                                        firstOptionValue={"0"}
                                                        valueList={title
                                                            ?.filter(
                                                                (titleData) => titleData?.approver === true
                                                            )
                                                            ?.map((data) => data?.id)}
                                                        labelList={title
                                                            ?.filter(
                                                                (titleData) => titleData?.approver === true
                                                            )
                                                            ?.map(
                                                                (titleData) =>
                                                                    `${titleData?.fname} ${titleData?.lname}, ${titleData?.suffix}, ${titleData?.title} - ${titleData?.site}`
                                                            )}
                                                        disabledList={title?.map((data) => false)}
                                                        widthValue={370}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    {newServices?.additionalDetails?.includes(
                                        "Administrative Approval For Payment Required"
                                    ) &&
                                        data === "Administrative Approval For Payment Required" && (
                                            // <ReviewerApproverField data={users} label="Designate Payment Approver*" selectLabel="Select Payment Approver" onValueChange={(value) => { setNewServices({ ...newServices, paymentApprover: users.filter(data => data?.userId === value)?.map(data => data)[0] }) }} />
                                            <div
                                                className={`${style.addManagerGrid} ${style.marginTop20}`}
                                            >
                                                <CommonLabel value={"Designate Payment Approver*"} />
                                                <div className={style.fullWidth} key={index}>
                                                    <CommonSelectField
                                                        className={`${style.fullWidth} `}
                                                        defaultValue={newServices?.paymentApprover}
                                                        value={
                                                            newServices?.paymentApprover
                                                                ? newServices?.paymentApprover?.id
                                                                : "0"
                                                        }
                                                        onChange={(e) => {
                                                            setNewServices({
                                                                ...newServices,
                                                                paymentApprover: users
                                                                    .filter((data) => data?.id === e.target.value)
                                                                    ?.map((data) => data)[0],
                                                                approverTitle: title
                                                                    ?.filter(
                                                                        (titleData) => titleData?.approver === true
                                                                    )
                                                                    ?.map((data) => data)[0],
                                                            });
                                                        }}
                                                        firstOptionLabel={"Select Payment Approver"}
                                                        firstOptionValue={"0"}
                                                        valueList={title
                                                            ?.filter(
                                                                (titleData) => titleData?.approver === true
                                                            )
                                                            ?.map((data) => data?.id)}
                                                        labelList={title
                                                            ?.filter(
                                                                (titleData) => titleData?.approver === true
                                                            )
                                                            ?.map(
                                                                (titleData) =>
                                                                    `${titleData?.fname} ${titleData?.lname}, ${titleData?.suffix}, ${titleData?.title} - ${titleData?.site}`
                                                            )}
                                                        disabledList={title?.map((data) => false)}
                                                        widthValue={370}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                </>
                            ))}
                        </div>
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <CommonLabel value="Allowable Working Hours*" />
                        <div className={style.twoCol}>
                            <CommonCheckBox
                                checked={newServices?.duringNormalWorkingHours}
                                className={`${style.marginLeft10}`}
                                onChange={(e) => {
                                    handleNewServiceChange(
                                        "duringNormalWorkingHours",
                                        e.target.checked
                                    );
                                }}
                                label="During Normal Working Hours"
                            />
                            <CommonCheckBox
                                checked={newServices?.afterWorkingHours}
                                className={`${style.marginLeft10}`}
                                onChange={(e) =>
                                    handleNewServiceChange("afterWorkingHours", e.target.checked)
                                }
                                label="After Working Hours"
                            />
                        </div>
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <CommonLabel value="Allowable Working Day Hours For Service*" />
                        <div className={style.displayInRow}>
                            <TimePicker
                                useAmPm={false}
                                onChange={(e) => {
                                    handleNewServiceChange("workingTimeFrom", e);
                                }}
                                value={
                                    newServices?.workingTimeTo === null
                                        ? null
                                        : new Date(newServices?.workingTimeFrom)
                                }
                            />
                            <p
                                className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}
                            >
                                To
                            </p>
                            <TimePicker
                                useAmPm={false}
                                onChange={(e) => handleNewServiceChange("workingTimeTo", e)}
                                value={
                                    newServices?.workingTimeTo === null
                                        ? null
                                        : new Date(newServices?.workingTimeTo)
                                }
                            // minTime={new Date(new Date(metadata?.workingTimeFrom).getTime() + (metadata?.sessionDuration * 60 * 60 * 1000))}
                            />
                        </div>
                    </div>

                    <div>
                        <div className={`${style.twoCol} ${style.marginTop20}`}>
                            <button
                                className={`${style.outlinedButton} ${style.fullWidth}`}
                                onClick={() => {
                                    resetNewServices();
                                    setShowNewService(false);
                                }}
                            >
                                CANCEL
                            </button>
                            <button
                                className={`${style.buttonStyle} ${style.fullWidth}`}
                                onClick={addToMetaData}
                            >
                                SAVE
                            </button>
                        </div>
                        <br />
                    </div>
                </div>
            )}
        </div>
    );
};

export default HospiceService;
