import React, { useState, useEffect, useMemo } from "react";
import AddIcon from "@mui/icons-material/Add";
import InputAdornment from "@mui/material/InputAdornment";
import DatalistInput, { useComboboxControls } from "react-datalist-input";
import { CLINIC, SURGERY, ONCALL, PROCEDUREREADING } from "../../Constants";
import ServiceDays from "../../Components/ReusableSmallComponents/serviceDays";
import { TimePicker } from "@blueprintjs/datetime";
import FormControl from "@mui/material/FormControl";
import { GetDateFromHours } from "./../../utils/formatting";
import CommonSwitch from "../../Components/CommonFields/CommonSwitch";
import CommonTextField from "../../Components/CommonFields/CommonTextField";
import CommonLabel from "../../Components/CommonFields/CommonLabel";
import CommonCheckBox from "../../Components/CommonFields/CommonCheckBox";
import style from "./index.module.scss";
import MultiSelectDisplay from "../../Components/ReusableSmallComponents/multiSelectDisplay";
import CommonSelectField from "../../Components/CommonFields/CommonSelectField";
import CommonMultiSelectField from "../../Components/CommonFields/CommonMultiSelectField";
import { valueCheck } from "../../utils/valueCheck";
import { format } from "date-fns";

const SupplementalFields = ({
    getMetaData,
    services,
    serviceSelected,
    editService,
    isReset,
    getIsReset,
}) => {
    const [availableActivities, setAvailableActivities] = useState([]);
    const { setValue, value } = useComboboxControls({ initialValue: "" });
    const [newServiceName, setNewServiceName] = useState("");
    const contractStatus = sessionStorage.getItem('Selected Contract Status');

    console.log("selected Service", serviceSelected);

    let specificDedicatedHoursList = [];
    services
        ?.filter((data) =>
            [CLINIC, SURGERY, ONCALL, PROCEDUREREADING]?.includes(
                data?.activityType?.activityType
            )
        )
        ?.map((data) => {
            let activityName = data?.activityType?.activityType;
            let activities = data?.activities?.map((data) => data?.activity);
            let result = `${activityName} (${activities
                ?.map((data) => data)
                ?.join(", ")})`;
            specificDedicatedHoursList.push(result);
        });

    let supplementServiceType = [];
    services
        ?.filter((data) =>
            [CLINIC, SURGERY, ONCALL, PROCEDUREREADING]?.includes(
                data?.activityType?.activityType
            )
        )
        ?.map((data) => {
            let activityName = data?.activityType?.activityType;
            let result = activityName;
            if (!supplementServiceType?.map((data) => data)?.includes(result)) {
                supplementServiceType.push(result);
            }
        });

    const getAvailableActivities = () => {
        let temp = [];
        metadata?.supplementalActivityType?.map((supplementalActivityType) => {
            console.log("supplemental Activity Type", supplementalActivityType);
            let activityType =
                supplementalActivityType !== ""
                    ? `[${supplementalActivityType}]`
                    : [CLINIC, SURGERY, ONCALL, PROCEDUREREADING];

            services
                ?.filter((data) =>
                    activityType?.includes(data?.activityType?.activityType)
                )
                ?.map((data) => {
                    let activityName = data?.activityType?.activityType;
                    let activities = data?.activities?.map((data) => data?.activity);
                    console.log(
                        "selected activity type",
                        data?.activities?.activityType,
                        activityType
                    );
                    activities?.map((data) => {
                        temp.push(`${activityName} - ${data}`);
                    });
                });
        });

        setAvailableActivities(temp);
    };

    console.log("available activities", availableActivities);

    const getSelectedActivity = () => {
        let activityName = metadata?.dedicatedHoursActivityType;
        let activities = metadata?.dedicatedHoursPerformingActivity;
        let result = `${activityName} (${activities})`;
        return result;
    };

    const selectedHours = (index) => {
        // let temp = services?.findIndexOf(data => [CLINIC, SURGERY, ONCALL, PROCEDUREREADING]?.includes(data?.activityType?.activityType));
        // let temp;
        services?.filter(data => [CLINIC, SURGERY, ONCALL, PROCEDUREREADING]?.includes(data?.activityType?.activityType))?.map(data => {
            let activityName = data?.activityType?.activityType;
            let activities = data?.activities?.map(data => data?.activity);
            if (`${activityName} (${activities?.map(data => data)?.join(', ')})` === index) {
                let dedicatedHoursActivityType = data?.activityType?.activityType;
                let dedicatedHoursPerformingActivity = data?.activities?.map(data => data?.activity)?.join(', ');
                setMetadata({
                    ...metadata,
                    dedicatedHoursActivityType: dedicatedHoursActivityType,
                    dedicatedHoursPerformingActivity: dedicatedHoursPerformingActivity,
                    billableService: data?.billableService,
                    rateType: data?.rateType,
                    sessionAmount: data?.payableAmount?.value,
                    sessionDuration: data?.duration?.hours,
                    totalSession: data?.totalSessions?.value,
                    totalSessionFrequency: data?.totalSessions?.frequency,
                    hourlyRate: data?.hourlyRate?.value,
                });
            }
        });
    }

    const [metadata, setMetadata] = useState({
        dedicatedHoursSpecified: false,
        dedicatedHoursActivityType: '',
        dedicatedHoursPerformingActivity: '',
        supplementalActivityType: [],
        supplementServiceName: [],
        baseServiceAvailable: false,
        baseServices: [],
        billableService: true,
        rateType: 'HOURLY',
        totalSession: '0',
        totalSessionFrequency: 'NA',
        sessionAmount: '',
        sessionDuration: '0',
        sessionsAsNeeded: false,
        workingTimeFrom: null,
        workingTimeTo: null,
        serviceDays: {
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
            weekDays: false,
            weekEnds: false,
            monday: false
        },
        weekdaysCount: '0',
        weekendsCount: '0'
    })

    const resetMetadata = () => {
        setMetadata({
            dedicatedHoursSpecified: false,
            dedicatedHoursActivityType: '',
            dedicatedHoursPerformingActivity: '',
            supplementalActivityType: [],
            supplementServiceName: [],
            baseServiceAvailable: false,
            baseServices: [],
            billableService: true,
            rateType: 'HOURLY',
            totalSession: '0',
            totalSessionFrequency: 'NA',
            sessionAmount: '',
            sessionDuration: '0',
            sessionsAsNeeded: false,
            workingTimeFrom: null,
            workingTimeTo: null,
            serviceDays: {
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                sunday: false,
                weekDays: false,
                weekEnds: false,
                monday: false
            },
            weekdaysCount: '0',
            weekendsCount: '0'
        })

    }

    useEffect(() => {
        if (isReset) {
            console.log("inside reset function");
            resetMetadata();
            getIsReset(false);
        }
    }, [isReset]);

    useEffect(() => {
        console.log(
            "supplementServiceName",
            metadata?.supplementalActivityType,
            metadata?.supplementServiceName
        );
        console.log("services", services);
        // if (!editService) {
        let temp = [];
        console.log('value check', metadata?.supplementalActivityType);
        metadata?.supplementalActivityType?.map(supplementalActivityType => {
            services?.filter(service => service?.activityType?.activityType === supplementalActivityType)?.map(service => {
                console.log('inside service', metadata?.supplementServiceName);
                metadata?.supplementServiceName?.filter(serviceName => service?.activities?.map(activity => activity?.activity)?.includes(serviceName?.split(' - ')?.[1]))?.map(serviceName => {
                    console.log('inside servicename')
                    temp.push({
                        "activityType": {
                            "activityType": supplementalActivityType
                        },
                        "performingActivity": {
                            "activity": service?.performingActivity?.activity
                        },
                        "derivedActivity": {
                            "activity": serviceName,
                        },
                        "activity": {
                            "activity": serviceName?.split(' - ')?.[1]
                        }
                    })
                })
            })
        })

        setMetadata({ ...metadata, 'baseServices': temp });
        // }
    }, [
        metadata?.supplementalActivityType,
        metadata?.supplementServiceName?.length,
        services,
    ]);

    useEffect(() => {
        getAvailableActivities();
    }, [metadata?.supplementalActivityType?.length]);

    useEffect(() => {
        if (editService) {
            setSelectedValues();
        }
    }, [serviceSelected]);


    console.log("Supplemental Service Name", metadata?.supplementalActivityType);

    const setSelectedValues = () => {
        setMetadata({
            ...metadata,
            refId: serviceSelected?.refId,
            dedicatedHoursSpecified: serviceSelected?.dedicatedHoursSpecified,
            dedicatedHoursActivityType:
                serviceSelected?.hoursBorrowed?.activityType?.activityType,
            dedicatedHoursPerformingActivity:
                serviceSelected?.hoursBorrowed?.performingActivity?.activity,
            supplementServiceName: serviceSelected?.activities?.map(
                (data) => data?.activity
            ),
            billableService: serviceSelected?.billableService,
            rateType: serviceSelected?.rateType,
            sessionAmount: serviceSelected?.payableAmount?.value,
            sessionDuration: serviceSelected?.duration?.hours || "0",
            totalSession: serviceSelected?.totalSessions?.value,
            sessionsAsNeeded: serviceSelected?.sessionsAsNeeded,
            totalSessionFrequency: serviceSelected?.totalSessions?.frequency,
            workingTimeFrom: GetDateFromHours(
                serviceSelected?.workingPeriod?.from?.toString() || ""
            ),
            workingTimeTo: GetDateFromHours(
                serviceSelected?.workingPeriod?.to?.toString() || ""
            ),
            serviceDays: serviceSelected?.serviceDays,
            baseServiceAvailable: serviceSelected?.baseServiceAvailable,
            baseServices: serviceSelected?.baseServices,
            supplementalActivityType: serviceSelected?.baseServices?.map(data => data?.activityType?.activityType),
        });
    };

    const limit5 = 5;

    useEffect(() => {
        getMetaData(metadata);
    }, [metadata]);

    const handleValueChange = (name, value) => {
        if (name === "dedicatedHoursSpecified") {
            if (value) {
                setMetadata({
                    ...metadata,
                    sessionDuration: "1",
                    totalSession: "0",
                    sessionAmount: "",
                    totalSessionFrequency: "NA",
                    dedicatedHoursActivityType: "",
                    dedicatedHoursPerformingActivity: "",
                    dedicatedHoursSpecified: value,
                });
            } else {
                setMetadata({
                    ...metadata,
                    sessionDuration: "0",
                    dedicatedHoursActivityType: "",
                    sessionAmount: "",
                    totalSession: "0",
                    totalSessionFrequency: "NA",
                    dedicatedHoursPerformingActivity: "",
                    dedicatedHoursSpecified: value,
                });
            }
        }
        //  else if (name === 'dedicatedHoursActivityType') {
        //     setMetadata({ ...metadata, supplementServiceName: [], [name]: value });
        // }
        else {
            setMetadata({ ...metadata, [name]: value });
        }
    };

    const getServiceDaysMetadata = (serviceDays) => {
        setMetadata({ ...metadata, serviceDays: serviceDays });
    };

    const addSupplementService = (value) => {
        let temp = metadata?.supplementServiceName;
        if (!temp?.includes(value)) {
            temp?.push(value);
            setMetadata({ ...metadata, supplementServiceName: temp });
        }
        setValue("");
    };

    const removeSupplementServiceName = (index) => {
        let temp = metadata?.supplementServiceName;
        setMetadata({
            ...metadata,
            supplementServiceName: temp
                ?.filter((data, indexValue) => index !== indexValue)
                ?.map((data) => data),
        });
    };

    const removeSupplementActivityType = (index) => {
        let temp = metadata?.supplementalActivityType;
        let activityName = metadata?.supplementalActivityType
            ?.filter((activityName, indexValue) => index === indexValue)
            ?.map((data) => data)[0];
        console.log(
            "supplemental service name",
            metadata?.supplementServiceName?.map((data) => data?.split(" - ")?.[0])
        );
        let tempActivities = metadata?.supplementServiceName
            ?.filter((activity) => activity?.split(" - ")?.[0] !== activityName)
            ?.map((data) => data);
        let baseServiceTemp = metadata?.baseServices
            ?.filter(
                (service) => service?.activityType?.activityType !== activityName
            )
            ?.map((data) => data);
        setMetadata({
            ...metadata,
            supplementalActivityType: temp
                ?.filter((data, indexValue) => index !== indexValue)
                ?.map((data) => data),
            supplementServiceName: tempActivities,
            baseServices: baseServiceTemp,
        });
    };

    const avilableActivityItems = useMemo(
        () =>
            availableActivities?.map((data) => ({
                value: data,
            })),
        [availableActivities]
    );

    const serviceNameToAdd = () => {
        let services = metadata.supplementServiceName;
        services.push(newServiceName);
        setMetadata({ ...metadata, supplementServiceName: services });
        setValue("");
    };

    const updateSupplementalActivity = (value) => {
        let temp = metadata?.supplementalActivityType;
        temp.push(value);
        setMetadata({ ...metadata, supplementalActivityType: temp });
    };

    console.log("metadata", metadata);

    const dataCheck = (value) => {
        if (editService) {
            return valueCheck(value);
        } else {
            return false;
        }
    }

    console.log('metadata', metadata);
    return (
        <div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Dedicated Hours For Supplemental Services*' />
                <div className={`${style.displayInRow} `}>
                    <CommonSwitch className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`} label={metadata?.dedicatedHoursSpecified ? 'YES' : 'NO'} checked={metadata?.dedicatedHoursSpecified} onChange={(e) => handleValueChange('dedicatedHoursSpecified', !metadata?.dedicatedHoursSpecified)} />
                    {!metadata?.dedicatedHoursSpecified && (
                        <FormControl sx={{ width: 480 }}>
                            <CommonSelectField className={`${style.fullWidth}`}
                                value={getSelectedActivity() || ''}
                                onChange={(e) => selectedHours(e.target.value)}
                                firstOptionLabel={'Select source of hours for this service'} firstOptionValue={''}
                                valueList={specificDedicatedHoursList}
                                labelList={specificDedicatedHoursList}
                                disabledList={specificDedicatedHoursList?.map(data => false)} />
                        </FormControl>
                    )}
                </div>
            </div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Base Service Available*' />
                <CommonSwitch className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`} label={metadata?.baseServiceAvailable ? 'YES' : 'NO'} checked={metadata?.baseServiceAvailable} onChange={(e) => handleValueChange('baseServiceAvailable', !metadata?.baseServiceAvailable)} />
            </div>
            {/* 
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Supplemental Services To Perform*' />
                <div>
                    <CommonSelectField className={`${style.fullWidth}`}
                        onChange={(e) => { addSupplementService(e.target.value) }}
                        firstOptionLabel={'Select Supplemental Services specified in contract'} firstOptionValue={''}
                        valueList={availableActivities}
                        labelList={availableActivities}
                        disabledList={availableActivities?.map(data => false)} />
                    {
                        metadata?.supplementServiceName?.length !== 0 && metadata?.supplementServiceName &&
                        <MultiSelectDisplay values={metadata?.supplementServiceName} removeItem={removeSupplementServiceName} />
                    }
                </div>
            </div> */}
            {
                metadata?.baseServiceAvailable && (
                    <div>
                        <div className={`${style.addManagerGrid} ${style.marginTop20} `}>
                            <CommonLabel
                                value="Supplemental Service Type*"
                                className={editService && (!metadata?.supplementalActivityType || metadata?.supplementalActivityType?.length === 0) ? style.redLable : ""}
                            />
                            <div>
                                <div>
                                    <CommonSelectField
                                        className={`${style.fullWidth}`}
                                        value={metadata?.supplementalActivityType}
                                        onChange={(e) => updateSupplementalActivity(e.target.value)}
                                        firstOptionLabel={"Select Supplemental Service Type"}
                                        firstOptionValue={""}
                                        valueList={supplementServiceType
                                            ?.filter(
                                                (data) =>
                                                    !metadata?.supplementalActivityType?.includes(data)
                                            )
                                            ?.map((data) => data)}
                                        labelList={supplementServiceType
                                            ?.filter(
                                                (data) =>
                                                    !metadata?.supplementalActivityType?.includes(data)
                                            )
                                            ?.map((data) => data)}
                                        disabledList={supplementServiceType
                                            ?.filter(
                                                (data) =>
                                                    !metadata?.supplementalActivityType?.includes(data)
                                            )
                                            ?.map((data) => false)}
                                    />
                                </div>

                                {metadata?.supplementalActivityType?.length !== 0 &&
                                    metadata?.supplementalActivityType && (
                                        <MultiSelectDisplay
                                            values={Array.from(new Set(metadata?.supplementalActivityType))}
                                            removeItem={removeSupplementActivityType}
                                        />
                                    )}
                            </div>
                        </div>
                    </div>
                )}

            <div>
                <div className={`${style.addManagerGrid} ${style.marginTop20} `}>
                    <CommonLabel
                        value="Supplement Services To Perform*"
                        className={editService && (!metadata?.supplementServiceName || metadata?.supplementServiceName?.length === 0) ? style.redLable : ""}

                    />
                    <div>
                        <div className={style.addGrid}>
                            <DatalistInput
                                value={value}
                                setValue={setValue}
                                items={
                                    avilableActivityItems?.filter(
                                        (data) =>
                                            !metadata?.supplementServiceName?.includes(data?.value)
                                    ) || []
                                }
                                onSelect={(item) => {
                                    addSupplementService(item.value);
                                }}
                                className={style.fullWidth}
                                onChange={(e) => {
                                    setNewServiceName(e.target.value);
                                    const caret = e.target.selectionStart;
                                    const element = e.target;
                                    window.requestAnimationFrame(() => {
                                        element.selectionStart = caret;
                                        element.selectionEnd = caret;
                                    });
                                }}
                                inputProps={{ disabled: contractStatus === "ACTIVE" ? true : false }}
                            />
                            <div
                                className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer} `}
                            >
                                <AddIcon
                                    sx={{ fontSize: 25, color: "white" }}
                                    onClick={value !== "" && serviceNameToAdd}
                                />
                            </div>
                        </div>
                        {metadata?.supplementServiceName?.length !== 0 &&
                            metadata?.supplementServiceName && (
                                <MultiSelectDisplay
                                    values={metadata?.supplementServiceName}
                                    removeItem={removeSupplementServiceName}
                                />
                            )}
                    </div>
                </div>
            </div>
            <>
                {metadata?.dedicatedHoursSpecified && (
                    <>
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <CommonLabel value="Billable Service*" />
                            <div className={style.displayInRow}>
                                <div className={`${style.threeFieldWidth}`}>
                                    <CommonSwitch
                                        checked={metadata?.billableService}
                                        className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft} `}
                                        onChange={() =>
                                            setMetadata({
                                                ...metadata,
                                                billableService: !metadata?.billableService,
                                                sessionAmount: "0",
                                            })
                                        }
                                        label={metadata?.billableService ? "YES" : "NO"}
                                    />
                                </div>
                                {
                                    // metadata?.billableService &&
                                    //   <Select
                                    //       displayEmpty
                                    //       SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                    //       className={`${style.threeFieldWidth} ${style.marginLeft20}`}
                                    //       value={metadata?.rateType}
                                    //       onChange={(e)=>handleValueChange('rateType', e.target.value)}
                                    //   >
                                    //       <MenuItem value={'HOURLY'}>Hourly</MenuItem>
                                    //   </Select>
                                }
                            </div>
                        </div>

                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <CommonLabel
                                value="Separate Service Hours Specified*"
                                className={
                                    dataCheck(metadata?.totalSession) ? style.redLable : ""
                                }
                            />
                            <div className={style.grid3WithoutGap}>
                                <div className={`${style.threeFieldWidth}`}>
                                    <CommonTextField
                                        type="tel"
                                        maxLength="3"
                                        disabled={metadata?.sessionsAsNeeded}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end" sx={{ fontSize: 10 }}>
                                                    Hours
                                                </InputAdornment>
                                            ),
                                        }}
                                        onChange={(e) =>
                                            e.target.value >= 0 &&
                                            handleValueChange("totalSession", e.target.value)
                                        }
                                        value={metadata?.totalSession}
                                    />
                                </div>
                                <CommonSelectField
                                    className={`${style.threeFieldWidth} ${style.marginLeft20}`}
                                    onChange={(e) =>
                                        handleValueChange("totalSessionFrequency", e.target.value)
                                    }
                                    value={metadata?.totalSessionFrequency || "NA"}
                                    firstOptionLabel={"Select Frequency"}
                                    firstOptionValue={""}
                                    valueList={["WEEK", "MONTH", "YEAR"]}
                                    labelList={["Per Week", "Per Month", "Per Year"]}
                                    disabledList={[false, false, false]}
                                    disabledSelect={metadata?.sessionsAsNeeded}
                                />
                                <div
                                    className={`${style.threeFieldWidth} ${style.marginLeft20}`}
                                >
                                    <CommonCheckBox
                                        value="NA"
                                        checked={metadata?.sessionsAsNeeded}
                                        onChange={(e) =>
                                            setMetadata({
                                                ...metadata,
                                                sessionsAsNeeded: e.target.checked,
                                                totalSession: 0,
                                                totalSessionFrequency: "NA",
                                            })
                                        }
                                        label="As Needed"
                                    />
                                </div>
                            </div>
                        </div>

                        {
                            // <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            //     <div className={style.extentionLableStyle}>Service Session Duration</div>
                            //     <div className={`${style.threeFieldWidth}`}>
                            //         <TextField
                            //             size="small"
                            //             type="tel"
                            //             maxLength="3"
                            //             InputProps={{
                            //                 endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                            //             }}
                            //             onChange={(e) =>e.target.value >= 0 && setMetadata({...metadata, sessionDuration:e.target.value, sessionAmount:'0'})}
                            //             value={metadata?.sessionDuration}
                            //         />
                            //     </div>
                            // </div>
                        }

                        {metadata?.billableService && (
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <CommonLabel
                                    value="Supplemental Service Payment Amount*"
                                    className={
                                        dataCheck(metadata?.sessionAmount) ? style.redLable : ""
                                    }
                                />
                                <div className={`${style.displayInRow}`}>
                                    <div className={`${style.threeFieldWidth}`}>
                                        <CommonTextField
                                            type="tel"
                                            maxLength="5"
                                            disabled={
                                                metadata?.totalSession === "" ||
                                                metadata?.totalSession === "0" ||
                                                metadata?.totalSession === undefined
                                            }
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
                                            value={metadata?.sessionAmount}
                                            onChange={(e) =>
                                                e.target.value >= 0 &&
                                                handleValueChange("sessionAmount", e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className={style.verticalAlignCenter}>
                                        {metadata?.sessionAmount !== "" &&
                                            metadata?.sessionAmount !== "0" && (
                                                <CommonLabel
                                                    className={`${style.marginLeft20}`}
                                                    value={
                                                        metadata?.sessionsAsNeeded
                                                            ? `${parseInt(metadata?.sessionAmount)?.toFixed(
                                                                2
                                                            )} per Hour (Pro Rata)`
                                                            : `${(
                                                                metadata?.sessionAmount /
                                                                metadata?.totalSession || 0
                                                            )?.toFixed(2)} per Hour (Pro Rata)`
                                                    }
                                                />
                                            )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <CommonLabel
                        value="Allowable Working Day Hours For Service*"
                        className={
                            format(metadata?.workingTimeTo || new Date(), "H") === "0" &&
                                format(metadata?.workingTimeFrom || new Date(), "H") === "0"
                                ? style.redLable
                                : ""
                        }
                    />
                    <div className={style.displayInRow}>
                        <TimePicker
                            useAmPm={false}
                            onChange={(e) => {
                                handleValueChange("workingTimeFrom", e);
                            }}
                            value={
                                metadata?.workingTimeFrom === null
                                    ? null
                                    : new Date(metadata?.workingTimeFrom)
                            }
                            disabled={contractStatus === "ACTIVE" ? true : false}
                        />
                        <p
                            className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}
                        >
                            To
                        </p>
                        <TimePicker
                            useAmPm={false}
                            onChange={(e) => handleValueChange("workingTimeTo", e)}
                            value={
                                metadata?.workingTimeTo === null
                                    ? null
                                    : new Date(metadata?.workingTimeTo)
                            }
                            disabled={contractStatus === "ACTIVE" ? true : false}
                        // minTime={new Date(new Date(metadata?.workingTimeFrom).getTime() + (metadata?.totalSession * 60 * 60 * 1000))}
                        />
                    </div>
                </div>

                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <CommonLabel
                        value="Applicable Supplemental Workdays*"
                        className={
                            metadata?.serviceDays === null ||
                                (metadata?.serviceDays !== undefined &&
                                    Object?.values(metadata?.serviceDays)?.filter(
                                        (data) => data === true
                                    )?.length === 0)
                                ? style.redLable
                                : ""
                        }
                    />
                    <ServiceDays
                        setMetaData={getServiceDaysMetadata}
                        selectedService={serviceSelected}
                        isReset={isReset}
                        setIsReset={getIsReset}
                    />
                </div>
            </>
        </div>
    );
};

export default SupplementalFields;
