import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import ProgressBar from "@ramonak/react-progress-bar";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CommonInputField from '../CommonFields/CommonInputField';
import CommonCheckBox from '../CommonFields/CommonCheckBox';
import CommonDateField from '../CommonFields/CommonDateField';
import { sub, add, subYears } from "date-fns";
import TextField from '@mui/material/TextField';
import { GET } from '../../Screens/dataSaver';

import style from './index.module.scss';

const LeftStatsCard = forwardRef(({ metadata, getContractFilterValues, selectedContract, getFilterValues, updatedFilter }, ref) => {
    let individualCount = metadata?.metaData?.individualContractCount;
    let multipleCount = metadata?.metaData?.multipleContractCount;
    let expiringDoc = metadata?.metaData?.contractWithExpiringDocCount;
    const month = new Date(Date.now());
    const year = new Date().getFullYear();
    const [contractTypeFilter, setContractTypeFilter] = useState(false);
    const [compensationPolicyFilter, setCompensationPolicyFilter] = useState(false);
    const [contractPolicyTypeFilter, setContractPolicyTypeFilter] = useState(false);
    const [contractManagersFilter, setContractManagersFilter] = useState(false);
    const [contractExpireInDaysFilter, setContractExpireInDaysFilter] = useState(false);
    const [contractIdFilter, setContractIdFilter] = useState(false);
    const [numberOfContractFilter, setNumberOfContractFilter] = useState(false);
    const [contractTimeCommitmentFilter, setContractTimeCommitmentFilter] = useState(false);
    const [calendarStart, setCalendarStart] = useState(false);
    const [calendarEnd, setCalendarEnd] = useState(false);
    const [selectedContractType, setSelectedContractType] = useState([]);
    const [selectedContractPolicyType, setSelectedContractPolicyType] = useState([]);
    const [selectedCompensationPolicy, setSelectedCompensationPolicy] = useState([]);
    const [selectedContractManagers, setSelectedContractManagers] = useState([]);
    const [contractFilter, setContractFilter] = useState({
        contractType: '',
        contractId: '',
        numberOfContract: { min: 0, max: 0 },
        contractTimeCommitment: { from: null, to: null },
        compensationPolicyCount: [],
        contractManagers: [],
        contractPolicyTypeCount: [],
        contractTypeCount: [],
        contractExpireInDays: 0
    })
    const compensationPolicyAvailableValues = {
        ACTIVITY_BASED: 'Activity Based',
        FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITH_OFFSET: 'Fixed Amount For Timesheet Period With Offset',
        SHIFT_OR_PER_DAY_BASED: 'Shift Or Per Day Based',
        FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITHOUT_OFFSET: 'Fixed Amount For Timesheet Period Without Offset'
    }

    const contractPolicyTypeAvailableValues = {
        NEWCONTRACTONEXPIRATION: 'New Contract Expiration',
        ONETIMECONTRACTTERMINATEONEXPIRATION: 'One Time Contract Termination Expiration',
        WRITTENCONTRACTEXTENSIONFORFIXEDTERM: 'Written Contract Extension For Fixed Term',
        AUTORENEWAL: 'Auto Renewal'
    }

    const contractFiltersAvailableValues = {
        INDIVIDUAL: 'Individual',
        MULTIPLE: 'Multiple',
        EMPLOYEE: 'Employee'
    }

    useEffect(() => {
        getFilterData();
    }, [selectedContract])

    useEffect(() => {
        getContractFilterValues(contractFilter)
    }, [contractFilter])

    useEffect(() => {
        getFilterValues({
            selectedContractType: selectedContractType,
            selectedContractPolicyType: selectedContractPolicyType,
            selectedCompensationPolicy: selectedCompensationPolicy,
            selectedContractManagers: selectedContractManagers,
            contractId: contractFilter?.contractId,
            maxNumberOfContractors: contractFilter?.numberOfContract?.max,
            minNumberOfContractors: contractFilter?.numberOfContract?.min,
            startDate: contractFilter?.contractTimeCommitment?.from,
            endDate: contractFilter?.contractTimeCommitment?.to,
            contractExpireInDays: contractFilter?.contractExpireInDays
        })
    }, [selectedContractType, selectedContractPolicyType, selectedCompensationPolicy, selectedContractManagers, contractFilter])

    useImperativeHandle(ref, () => ({
        updateFilter,
    }));

    const clearFilter = (data) => {
        if (data === 'contractTypeCount') {
            setSelectedContractType([]);
            let temp = contractFilter?.contractTypeCount?.map(data => {
                data.selected = false
            })
            setContractFilter({ ...contractFilter, temp })
        } else if (data === 'compensationPolicyCount') {
            setSelectedCompensationPolicy([]);
            let temp = contractFilter?.compensationPolicyCount?.map(data => {
                data.selected = false
            })
            setContractFilter({ ...contractFilter, temp })
        } else if (data === 'contractPolicyTypeCount') {
            setSelectedContractPolicyType([]);
            let temp = contractFilter?.contractPolicyTypeCount?.map(data => {
                data.selected = false
            })
            setContractFilter({ ...contractFilter, temp })
        } else if (data === 'contractManagers') {
            setSelectedContractManagers([]);
            let temp = contractFilter?.contractManagers?.map(data => {
                data.selected = false
            })
            setContractFilter({ ...contractFilter, temp })
        }
    }

    const updateFilter = (data, value) => {
        if (data === 'contractTypeCount') {
            setSelectedContractType(selectedContractType?.filter(data => data !== value)?.map(data => data));
            let temp = contractFilter?.contractTypeCount?.filter(data => data?.contractType === value)?.map(data => {
                data.selected = false
            })
            setContractFilter({ ...contractFilter, temp })
        } else if (data === 'compensationPolicyCount') {
            setSelectedCompensationPolicy(selectedCompensationPolicy?.filter(data => data !== value)?.map(data => data));
            let temp = contractFilter?.compensationPolicyCount?.filter(data => data?.compensationPolicy === value)?.map(data => {
                data.selected = false
            })
            setContractFilter({ ...contractFilter, temp })
        } else if (data === 'contractPolicyTypeCount') {
            setSelectedContractPolicyType(selectedContractPolicyType?.filter(data => data !== value)?.map(data => data));
            let temp = contractFilter?.contractPolicyTypeCount?.filter(data => data?.contractPolicyType === value)?.map(data => {
                data.selected = false
            })
            setContractFilter({ ...contractFilter, temp })
        } else if (data === 'contractManagers') {
            setSelectedContractManagers(selectedContractManagers?.filter(data => data !== value)?.map(data => data));
            let temp = contractFilter?.contractManagers?.filter(data => data?.userID === value)?.map(data => {
                data.selected = false
            })
            setContractFilter({ ...contractFilter, temp })
        } else if (data === 'contractId') {
            setContractFilter({ ...contractFilter, contractId: '' })
        } else if (data === 'contractExpireInDays') {
            setContractFilter({ ...contractFilter, contractExpireInDays: 0 })
        } else if (data === 'numberOfContract') {
            setContractFilter({ ...contractFilter, numberOfContract: { min: 0, max: 99 } })
        } else if (data === 'contractTimeCommitment') {
            setContractFilter({ ...contractFilter, contractTimeCommitment: { from: null, to: null } })
        }
    }

    const getFilterData = async () => {
        const { data: filterData } = await GET(`contract-managment-service/contracts/filters?tab=${selectedContract}`);
        setContractFilter({ ...contractFilter, ...filterData });
    };

    const reset = () => {
        setSelectedContractType([]);
        let temp = contractFilter?.contractTypeCount?.map(data => {
            data.selected = false
        })
        setContractFilter({ ...contractFilter, temp })
        setSelectedCompensationPolicy([]);
        temp = contractFilter?.compensationPolicyCount?.map(data => {
            data.selected = false
        })
        setContractFilter({ ...contractFilter, temp })
        setSelectedContractPolicyType([]);
        temp = contractFilter?.contractPolicyTypeCount?.map(data => {
            data.selected = false
        })
        setContractFilter({ ...contractFilter, temp })
        setSelectedContractManagers([]);
        temp = contractFilter?.contractManagers?.map(data => {
            data.selected = false
        })
        setContractFilter({ ...contractFilter, temp })
        setContractFilter({ ...contractFilter, contractId: '', contractExpireInDays: 0, numberOfContract: { min: 0, max: 0 }, contractTimeCommitment: { from: null, to: null } })
    }

    const handleFilterSelect = (checked, index, filterName, contractType) => {
        console.log(checked, index, filterName)
        if (filterName === 'contractTypeCount') {
            let temp = contractFilter?.contractTypeCount;
            temp[index]['selected'] = checked
            setContractFilter({ ...contractFilter, temp })
            let tempSelected = temp?.filter(data => data?.selected)?.map(data => data?.contractType)
            setSelectedContractType(tempSelected)
        } else if (filterName === 'compensationPolicyCount') {
            let tempCompensationPolicyCount = contractFilter?.compensationPolicyCount
            tempCompensationPolicyCount[index]['selected'] = checked
            setContractFilter({ ...contractFilter, tempCompensationPolicyCount })
            let tempSelected = tempCompensationPolicyCount?.filter(data => data?.selected)?.map(data => data?.compensationPolicy)
            setSelectedCompensationPolicy(tempSelected)
        } else if (filterName === 'contractPolicyTypeCount') {
            let tempContractPolicyTypeCount = contractFilter?.contractPolicyTypeCount
            tempContractPolicyTypeCount[index]['selected'] = checked
            setContractFilter({ ...contractFilter, tempContractPolicyTypeCount })
            let tempSelected = tempContractPolicyTypeCount?.filter(data => data?.selected)?.map(data => data?.contractPolicyType)
            setSelectedContractPolicyType(tempSelected)
        } else if (filterName === 'contractManagers') {
            let tempContractManagers = contractFilter?.contractManagers
            tempContractManagers[index]['selected'] = checked
            setContractFilter({ ...contractFilter, tempContractManagers })
            let tempSelected = tempContractManagers?.filter(data => data?.selected)?.map(data => data?.userID)
            setSelectedContractManagers(tempSelected)
        }
        console.log(contractFilter)
    }
    console.log(contractFilter, selectedContractType, selectedCompensationPolicy, selectedContractPolicyType, selectedContractManagers, contractFilter?.contractTimeCommitment?.from)
    return (
        <div className={`${style.bigCardStyle} ${style.bigCalendarLeftCardWidth}`}>
            <h5 className={style.statisticsHeading}>{month.toLocaleString('en-US', { month: 'long' })} {year} Summary</h5>
            <div>
                <div className={style.progressbarStyle}>
                    <div className={style.spaceBetween}>
                        <p className={style.statisticsProgress}><strong>{individualCount}</strong> <span className={style.marginLeft20}>INDIVIDUAL CONTRACTOR</span></p>
                        <p className={style.viewStyle}>View</p>
                    </div>
                    <ProgressBar completed={individualCount} isLabelVisible={false} height='5px' bgColor='#14B15A' baseBgColor="#ccffee" className={style.progressMargin} />
                </div>
                <div className={style.progressbarStyle}>
                    <div className={style.spaceBetween}>
                        <p className={style.statisticsProgress}><strong>{multipleCount}</strong> <span className={style.marginLeft20}>MULTIPLE PROVIDER CONTRACT</span></p>
                        <p className={style.viewStyle}>View</p>
                    </div>
                    <ProgressBar completed={multipleCount} isLabelVisible={false} height='5px' bgColor='#FFCA27' baseBgColor="#fff2cc" className={style.progressMargin} />
                </div>

                {
                    // <div className={style.progressbarStyle}>
                    //     <div className={style.spaceBetween}>
                    //         <p className={style.statisticsProgress}><strong>47</strong> <span className={style.marginLeft20}>UPCOMING RENEWAL</span></p>
                    //         <p className={style.viewStyle}>View</p>
                    //     </div>
                    //     <ProgressBar completed={60} isLabelVisible={false} height='5px' bgColor='#FF6562' baseBgColor="#ffcdcc" className={style.progressMargin} />
                    // </div>
                    // <div className={style.progressbarStyle}>
                    //     <div className={style.spaceBetween}>
                    //         <p className={style.statisticsProgress}><strong>50</strong> <span className={style.marginLeft20}>AUTO RENEWED</span></p>
                    //         <p className={style.viewStyle}>View</p>
                    //     </div>
                    //     <ProgressBar completed={60} isLabelVisible={false} height='5px' bgColor='#FF6562' baseBgColor="#ffcdcc" className={style.progressMargin} />
                    // </div>
                    // <div className={style.progressbarStyle}>
                    //     <div className={style.spaceBetween}>
                    //         <p className={style.statisticsProgress}><strong>{expiringDoc}</strong> <span className={style.marginLeft20}>CONTRACT WITH EXPIRING DOC</span></p>
                    //         <p className={style.viewStyle}>View</p>
                    //     </div>
                    //     <ProgressBar completed={expiringDoc} isLabelVisible={false} height='5px' bgColor='#FF6562' baseBgColor="#ffcdcc" className={style.progressMargin} />
                    // </div>
                }

            </div>
            {/* <div className={`${style.filterPadding}`}>
                <div className={`${style.spaceBetween} ${style.verticalAlignCenter}`}>
                    <div className={style.filterHeading}>CONTRACT FILTERS</div>
                    <div className={`${style.clearText} ${(contractFilter?.contractTypeCount?.filter(data => data?.selected)?.length !== 0 ||
                        contractFilter?.compensationPolicyCount?.filter(data => data?.selected)?.length !== 0 ||
                        contractFilter?.contractPolicyTypeCount?.filter(data => data?.selected)?.length !== 0 ||
                        contractFilter?.contractManagers?.filter(data => data?.selected)?.length !== 0 ||
                        contractFilter?.contractExpireInDays !== 0 ||
                        contractFilter?.numberOfContract?.min !== 0 || contractFilter?.numberOfContract?.max !== 0 ||
                        contractFilter?.contractTimeCommitment?.to !== null || contractFilter?.contractTimeCommitment?.from !== null) ? style.purpleText : ''}`} onClick={reset}>Clear All</div>
                </div>
                <div className={style.dividerStyle}></div>
                <div>
                    <div className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                        <div className={`${style.filterType} ${(contractFilter?.contractTypeCount?.filter(data => data?.selected)?.length !== 0 && !contractTypeFilter) ? style.purpleText : ''}`}>Contract Type</div>
                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                            <div className={`${style.clearText} ${contractFilter?.contractTypeCount?.filter(data => data?.selected)?.length !== 0 ? style.purpleText : ''}`} onClick={() => clearFilter('contractTypeCount')}>Clear </div>
                            {!contractTypeFilter ? (
                                <AddIcon sx={{ fontSize: 20, color: '#06617A


', cursor: 'pointer' }} onClick={() => setContractTypeFilter(!contractTypeFilter)} />
                            ) : (
                                <RemoveIcon sx={{ fontSize: 20, color: '#06617A


', cursor: 'pointer' }} onClick={() => setContractTypeFilter(!contractTypeFilter)} />
                            )}
                        </div>
                    </div>
                    <div className={style.marginTop10}>
                        {contractTypeFilter && (
                            <> */}
            {/* <CommonInputField
                                    // className={style.fullWidth}
                                    placeholder="Search"
                                    value={contractFilter?.contractId}
                                    onChange={(e) =>
                                        setContractFilter({ ...contractFilter, contractId: e.target.value })
                                    }
                                /> */}
            {/* {contractFilter?.contractTypeCount?.map((data, index) => (
                                    <CommonCheckBox checked={data?.selected === true ? true : false} onChange={(e) => handleFilterSelect(e.target.checked, index, 'contractTypeCount', data?.contractType)} label={`${contractFiltersAvailableValues[data?.contractType]} (${data?.count})`} key={index} />
                                ))}
                            </>
                        )}
                    </div>
                    <div className={style.dividerStyle}></div>
                    <div className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                        <div className={`${style.filterType} ${(contractFilter?.compensationPolicyCount?.filter(data => data?.selected)?.length !== 0 && !compensationPolicyFilter) ? style.purpleText : ''}`}>Compensation Policy</div>
                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                            <div className={`${style.clearText} ${contractFilter?.compensationPolicyCount?.filter(data => data?.selected)?.length !== 0 ? style.purpleText : ''}`} onClick={() => clearFilter('compensationPolicyCount')}>Clear </div>
                            {!compensationPolicyFilter ? (
                                <AddIcon sx={{ fontSize: 20, color: '#06617A


', cursor: 'pointer' }} onClick={() => setCompensationPolicyFilter(!compensationPolicyFilter)} />
                            ) : (
                                <RemoveIcon sx={{ fontSize: 20, color: '#06617A


', cursor: 'pointer' }} onClick={() => setCompensationPolicyFilter(!compensationPolicyFilter)} />
                            )}
                        </div>
                    </div>
                    <div className={style.marginTop10}>
                        {compensationPolicyFilter && (
                            <>
                                {contractFilter?.compensationPolicyCount?.map((data, index) => (
                                    <CommonCheckBox checked={data?.selected === true ? true : false} onChange={(e) => handleFilterSelect(e.target.checked, index, 'compensationPolicyCount', data?.compensationPolicy)} label={`${compensationPolicyAvailableValues[data?.compensationPolicy]} (${data?.count})`} key={index} className={style.textAlignLeft} />
                                ))}
                            </>
                        )}
                    </div>
                    <div className={style.dividerStyle}></div>
                    <div className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                        <div className={`${style.filterType} ${(contractFilter?.contractPolicyTypeCount?.filter(data => data?.selected)?.length !== 0 && !contractPolicyTypeFilter) ? style.purpleText : ''}`}>Contract Policy Type</div>
                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                            <div className={`${style.clearText} ${contractFilter?.contractPolicyTypeCount?.filter(data => data?.selected)?.length !== 0 ? style.purpleText : ''}`} onClick={() => clearFilter('contractPolicyTypeCount')}>Clear </div>
                            {!contractPolicyTypeFilter ? (
                                <AddIcon sx={{ fontSize: 20, color: '#06617A


', cursor: 'pointer' }} onClick={() => setContractPolicyTypeFilter(!contractPolicyTypeFilter)} />
                            ) : (
                                <RemoveIcon sx={{ fontSize: 20, color: '#06617A


', cursor: 'pointer' }} onClick={() => setContractPolicyTypeFilter(!contractPolicyTypeFilter)} />
                            )}
                        </div>
                    </div>
                    <div className={style.marginTop10}>
                        {contractPolicyTypeFilter && (
                            <>
                                {contractFilter?.contractPolicyTypeCount?.map((data, index) => (
                                    <CommonCheckBox checked={data?.selected === true ? true : false} onChange={(e) => handleFilterSelect(e.target.checked, index, 'contractPolicyTypeCount', data?.contractPolicyType)} label={`${contractPolicyTypeAvailableValues[data?.contractPolicyType]} (${data?.count})`} key={index} className={style.textAlignLeft} />
                                ))}
                            </>
                        )}
                    </div>
                    <div className={style.dividerStyle}></div>
                    <div className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                        <div className={`${style.filterType} ${(contractFilter?.contractManagers?.filter(data => data?.selected)?.length !== 0 && !contractManagersFilter) ? style.purpleText : ''}`}>Contract Managers</div>
                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                            <div className={`${style.clearText} ${contractFilter?.contractManagers?.filter(data => data?.selected)?.length !== 0 ? style.purpleText : ''}`} onClick={() => clearFilter('contractManagers')}>Clear </div>
                            {!contractManagersFilter ? (
                                <AddIcon sx={{ fontSize: 20, color: '#06617A


', cursor: 'pointer' }} onClick={() => setContractManagersFilter(!contractManagersFilter)} />
                            ) : (
                                <RemoveIcon sx={{ fontSize: 20, color: '#06617A


', cursor: 'pointer' }} onClick={() => setContractManagersFilter(!contractManagersFilter)} />
                            )}
                        </div>
                    </div>
                    <div className={style.marginTop10}>
                        {contractManagersFilter && (
                            <>
                                {contractFilter?.contractManagers?.map((data, index) => (
                                    <CommonCheckBox checked={data?.selected === true ? true : false} onChange={(e) => handleFilterSelect(e.target.checked, index, 'contractManagers', data?.contractManagers)} label={`${data?.name?.firstName} ${data?.name?.lastName}`} key={index} />
                                ))}
                            </>
                        )}
                    </div> */}
            {/* <div className={style.dividerStyle}></div>
                    <div className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                        <div className={`${style.filterType}  ${(contractFilter?.contractId !== '' && !contractIdFilter) ? style.purpleText : ''}`}>Contract ID</div>
                        <div className={`${style.displayInRow}  ${style.verticalAlignCenter}`}>
                            <div className={`${style.clearText} ${contractFilter?.contractId !== '' ? style.purpleText : ''}`} onClick={() => setContractFilter({ ...contractFilter, contractId: '' })}>Clear </div>
                            {!contractIdFilter ? (
                                <AddIcon sx={{ fontSize: 20, color: '#06617A


', cursor: 'pointer' }} onClick={() => setContractIdFilter(!contractIdFilter)} />
                            ) : (
                                <RemoveIcon sx={{ fontSize: 20, color: '#06617A


', cursor: 'pointer' }} onClick={() => setContractIdFilter(!contractIdFilter)} />
                            )}
                        </div>
                    </div>
                    <div className={style.marginTop10}>
                        {contractIdFilter && (
                            <CommonInputField
                                // className={style.fullWidth}
                                placeholder="# Search"
                                value={contractFilter?.contractId}
                                onChange={(e) =>
                                    setContractFilter({ ...contractFilter, contractId: e.target.value })
                                }
                            />
                        )}
                    </div> */}
            {/* <div className={style.dividerStyle}></div>
                    <div className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                        <div className={`${style.filterType}  ${(contractFilter?.contractExpireInDays !== 0 && !contractExpireInDaysFilter) ? style.purpleText : ''}`}>Contract Expire In Days</div>
                        <div className={`${style.displayInRow}  ${style.verticalAlignCenter}`}>
                            <div className={`${style.clearText} ${contractFilter?.contractExpireInDays !== 0 ? style.purpleText : ''}`} onClick={() => setContractFilter({ ...contractFilter, contractExpireInDays: 0 })}>Clear </div>
                            {!contractExpireInDaysFilter ? (
                                <AddIcon sx={{ fontSize: 20, color: '#06617A


', cursor: 'pointer' }} onClick={() => setContractExpireInDaysFilter(!contractExpireInDaysFilter)} />
                            ) : (
                                <RemoveIcon sx={{ fontSize: 20, color: '#06617A


', cursor: 'pointer' }} onClick={() => setContractExpireInDaysFilter(!contractExpireInDaysFilter)} />
                            )}
                        </div>
                    </div>
                    <div className={style.marginTop10}>
                        {contractExpireInDaysFilter && (
                            <CommonInputField
                                // className={style.fullWidth}
                                value={contractFilter?.contractExpireInDays}
                                onChange={(e) =>
                                    setContractFilter({ ...contractFilter, contractExpireInDays: e.target.value })
                                }
                            />
                        )}
                    </div>
                    <div className={style.dividerStyle}></div>
                    <div className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                        <div className={`${style.filterType} ${((contractFilter?.numberOfContract?.min !== 0 || contractFilter?.numberOfContract?.max !== 0) && !numberOfContractFilter) ? style.purpleText : ''}`}>Number Of Contractors</div>
                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                            <div className={`${style.clearText} ${(contractFilter?.numberOfContract?.min !== 0 || contractFilter?.numberOfContract?.max !== 0) ? style.purpleText : ''}`} onClick={() => setContractFilter({ ...contractFilter, numberOfContract: { min: 0, max: 0 } })}>Clear </div>
                            {!numberOfContractFilter ? (
                                <AddIcon sx={{ fontSize: 20, color: '#06617A


', cursor: 'pointer' }} onClick={() => setNumberOfContractFilter(!numberOfContractFilter)} />
                            ) : (
                                <RemoveIcon sx={{ fontSize: 20, color: '#06617A


', cursor: 'pointer' }} onClick={() => setNumberOfContractFilter(!numberOfContractFilter)} />
                            )}
                        </div>
                    </div>
                    <div className={style.marginTop10}>
                        {numberOfContractFilter && (
                            <>
                                <div className={style.numberOfContractorsGrid}>
                                    <div>
                                        <div className={style.labelText}>Min</div>
                                        <CommonInputField
                                            // className={style.fullWidth}
                                            placeholder="0"
                                            value={contractFilter?.numberOfContract?.min}
                                            onChange={(e) =>
                                                setContractFilter({ ...contractFilter, numberOfContract: { min: e.target.value, max: contractFilter?.numberOfContract?.max } })
                                            }
                                        />
                                    </div>
                                    <div className={`${style.labelText} ${style.alignCenter} ${style.verticalAlignCenter}`}>To</div>
                                    <div>
                                        <div className={style.labelText}>Max</div>
                                        <CommonInputField
                                            // className={style.fullWidth}
                                            placeholder="0"
                                            value={contractFilter?.numberOfContract?.max}
                                            onChange={(e) =>
                                                setContractFilter({ ...contractFilter, numberOfContract: { max: e.target.value, min: contractFilter?.numberOfContract?.min } })
                                            }
                                        />
                                    </div>
                                </div>
                                <ProgressBar completed={contractFilter?.numberOfContract?.max < contractFilter?.numberOfContract?.min ? contractFilter?.numberOfContract?.min : contractFilter?.numberOfContract?.max}
                                    isLabelVisible={false} height='5px' bgColor='#06617A


' baseBgColor="#BCBCBC" className={style.marginTop20} />
                            </>
                        )}
                    </div>
                    <div className={style.dividerStyle}></div>
                    <div className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                        <div className={`${style.filterType} ${((contractFilter?.contractTimeCommitment?.to !== null || contractFilter?.contractTimeCommitment?.from !== null) && !contractTimeCommitmentFilter) ? style.purpleText : ''}`}>Contract Term Period</div>
                        <div className={`${style.displayInRow}  ${style.verticalAlignCenter}`}>
                            <div className={`${style.clearText} ${(contractFilter?.contractTimeCommitment?.to !== null || contractFilter?.contractTimeCommitment?.from !== null) ? style.purpleText : ''}`} onClick={() => setContractFilter({ ...contractFilter, contractTimeCommitment: { from: null, to: null } })}>Clear </div>
                            {!contractTimeCommitmentFilter ? (
                                <AddIcon sx={{ fontSize: 20, color: '#06617A


', cursor: 'pointer' }} onClick={() => setContractTimeCommitmentFilter(!contractTimeCommitmentFilter)} />
                            ) : (
                                <RemoveIcon sx={{ fontSize: 20, color: '#06617A


', cursor: 'pointer' }} onClick={() => setContractTimeCommitmentFilter(!contractTimeCommitmentFilter)} />
                            )}
                        </div>
                    </div>
                    <div className={style.marginTop10}>
                        {contractTimeCommitmentFilter && (
                            <div className={style.contractTimeCommitmentGrid}>
                                <div>
                                    <div className={style.labelText}>From</div>
                                    <CommonDateField
                                        open={calendarEnd}
                                        onOpen={() => setCalendarEnd(true)}
                                        onClose={() => setCalendarEnd(false)}
                                        minDate={sub(new Date(), { years: 5 })}
                                        maxDate={add(new Date(), { months: 6 })}
                                        value={contractFilter?.contractTimeCommitment?.from}
                                        onChange={(newValue) => {
                                            setContractFilter({ ...contractFilter, contractTimeCommitment: { from: newValue ? new Date(newValue) : null, to: contractFilter?.contractTimeCommitment?.to } })
                                        }}
                                        InputProps={{
                                            style: {
                                                fontSize: 11,
                                                height: 30,
                                            },
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                inputProps={{
                                                    ...params.inputProps,
                                                    placeholder: "mm/dd/yyyy",
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    <div className={style.labelText}>To</div>
                                    <CommonDateField
                                        open={calendarStart}
                                        onOpen={() => setCalendarStart(true)}
                                        onClose={() => setCalendarStart(false)}
                                        minDate={sub(new Date(), { years: 3 })}
                                        maxDate={add(new Date(), { years: 3 })}
                                        value={contractFilter?.contractTimeCommitment?.to}
                                        onChange={(newValue) => {
                                            setContractFilter({ ...contractFilter, contractTimeCommitment: { to: newValue ? new Date(newValue) : null, from: contractFilter?.contractTimeCommitment?.from } })
                                        }}
                                        InputProps={{
                                            style: {
                                                fontSize: 11,
                                                height: 30,
                                            },
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                inputProps={{
                                                    ...params.inputProps,
                                                    placeholder: "mm/dd/yyyy",
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={style.dividerStyle}></div>
                </div>
            </div> */}
        </div>
    )
})

export default LeftStatsCard;
