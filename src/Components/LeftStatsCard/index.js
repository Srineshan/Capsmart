import React, { useState, useEffect } from 'react';
import ProgressBar from "@ramonak/react-progress-bar";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CommonInputField from '../CommonFields/CommonInputField';
import CommonCheckBox from '../CommonFields/CommonCheckBox';
import CommonDateField from '../CommonFields/CommonDateField';
import { sub, add } from "date-fns";
import TextField from '@mui/material/TextField';
import { GET } from '../../Screens/dataSaver';

import style from './index.module.scss';

const LeftStatsCard = ({ metadata, getContractFilterValues, selectedContract }) => {
    let individualCount = metadata?.metaData?.individualContractCount;
    let multipleCount = metadata?.metaData?.multipleContractCount;
    let expiringDoc = metadata?.metaData?.contractWithExpiringDocCount;
    const month = new Date(Date.now());
    const year = new Date().getFullYear();
    const [contractTypeFilter, setContractTypeFilter] = useState(false);
    const [contractIdFilter, setContractIdFilter] = useState(false);
    const [numberOfContractFilter, setNumberOfContractFilter] = useState(false);
    const [contractTimeCommitmentFilter, setContractTimeCommitmentFilter] = useState(false);
    const [calendarStart, setCalendarStart] = useState(false);
    const [calendarEnd, setCalendarEnd] = useState(false);
    const [contractFilter, setContractFilter] = useState({
        contractType: '',
        contractId: '',
        numberOfContract: { min: 0, max: 0 },
        contractTimeCommitment: { from: null, to: null }
    })

    useEffect(() => {
        // getFilterData();
    }, [])

    useEffect(() => {
        getContractFilterValues(contractFilter)
    }, [contractFilter])

    const getFilterData = async () => {
        const { data: filterData } = await GET(`contract-managment-service/contracts/filters?tab=${selectedContract}`);
        setContractFilter(filterData);
    };

    const reset = () => {
        setContractFilter({
            contractType: '',
            contractId: '',
            numberOfContract: { min: 0, max: 0 },
            contractTimeCommitment: { from: null, to: null }
        })
    }
    console.log(contractFilter)
    return (
        <div className={`${style.bigCardStyle} ${style.bigCalendarLeftCardWidth}`}>
            {/* <h5 className={style.statisticsHeading}>{month.toLocaleString('en-US', { month: 'long' })} {year} Summary</h5>
            <div>
                <div className={style.progressbarStyle}>
                    <div className={style.spaceBetween}>
                        <p className={style.statisticsProgress}><strong>{individualCount}</strong> <span className={style.marginLeft20}>INDIVIDUAL CONTRACTOR</span></p>
                        <p className={style.viewStyle}>View</p>
                    </div>
                    <ProgressBar completed={individualCount} isLabelVisible={false} height='5px' bgColor='#00C07F' baseBgColor="#ccffee" className={style.progressMargin} />
                </div>
                <div className={style.progressbarStyle}>
                    <div className={style.spaceBetween}>
                        <p className={style.statisticsProgress}><strong>{multipleCount}</strong> <span className={style.marginLeft20}>MULTIPLE PROVIDER CONTRACT</span></p>
                        <p className={style.viewStyle}>View</p>
                    </div>
                    <ProgressBar completed={multipleCount} isLabelVisible={false} height='5px' bgColor='#FEC106' baseBgColor="#fff2cc" className={style.progressMargin} />
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

            </div> */}
            <div className={`${style.filterPadding}`}>
                <div className={`${style.spaceBetween} ${style.verticalAlignCenter}`}>
                    <div className={style.filterHeading}>CONTRACT FILTERS</div>
                    <div className={style.clearText} onClick={reset}>Clear All</div>
                </div>
                <div>
                    <div className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                        <div className={`${style.filterType} ${(contractFilter?.contractType !== '' && !contractTypeFilter) ? style.purpleText : ''}`}>Contract Type</div>
                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                            <div className={`${style.clearText} ${contractFilter?.contractType !== '' ? style.purpleText : ''}`} onClick={() => setContractFilter({ ...contractFilter, contractType: '' })}>Clear </div>
                            {!contractTypeFilter ? (
                                <AddIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setContractTypeFilter(!contractTypeFilter)} />
                            ) : (
                                <RemoveIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setContractTypeFilter(!contractTypeFilter)} />
                            )}
                        </div>
                    </div>
                    <div className={style.marginTop10}>
                        {contractTypeFilter && (
                            <>
                                <CommonInputField
                                    // className={style.fullWidth}
                                    placeholder="Search"
                                    value={contractFilter?.contractId}
                                    onChange={(e) =>
                                        setContractFilter({ ...contractFilter, contractId: e.target.value })
                                    }
                                />
                                <CommonCheckBox value={`INDIVIDUAL`} checked={contractFilter?.contractType === 'INDIVIDUAL'} onChange={(e) => setContractFilter({ ...contractFilter, contractType: 'INDIVIDUAL' })} label={`INDIVIDUAL(0)`} />
                                <CommonCheckBox value={`MULTIPLE`} checked={contractFilter?.contractType === 'MULTIPLE'} onChange={(e) => setContractFilter({ ...contractFilter, contractType: 'MULTIPLE' })} label={`MULTIPLE(0)`} />
                            </>
                        )}
                    </div>
                    <div className={style.dividerStyle}></div>
                    <div className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                        <div className={`${style.filterType}  ${(contractFilter?.contractId !== '' && !contractIdFilter) ? style.purpleText : ''}`}>Contract ID</div>
                        <div className={`${style.displayInRow}  ${style.verticalAlignCenter}`}>
                            <div className={`${style.clearText} ${contractFilter?.contractId !== '' ? style.purpleText : ''}`} onClick={() => setContractFilter({ ...contractFilter, contractId: '' })}>Clear </div>
                            {!contractIdFilter ? (
                                <AddIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setContractIdFilter(!contractIdFilter)} />
                            ) : (
                                <RemoveIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setContractIdFilter(!contractIdFilter)} />
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
                    </div>
                    <div className={style.dividerStyle}></div>
                    <div className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                        <div className={`${style.filterType} ${((contractFilter?.numberOfContract?.min !== 0 || contractFilter?.numberOfContract?.max !== 0) && !numberOfContractFilter) ? style.purpleText : ''}`}>Number Of Contractors</div>
                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                            <div className={`${style.clearText} ${(contractFilter?.numberOfContract?.min !== 0 || contractFilter?.numberOfContract?.max !== 0) ? style.purpleText : ''}`} onClick={() => setContractFilter({ ...contractFilter, numberOfContract: { min: 0, max: 0 } })}>Clear </div>
                            {!numberOfContractFilter ? (
                                <AddIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setNumberOfContractFilter(!numberOfContractFilter)} />
                            ) : (
                                <RemoveIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setNumberOfContractFilter(!numberOfContractFilter)} />
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
                                    isLabelVisible={false} height='5px' bgColor='#7165E3' baseBgColor="#BCBCBC" className={style.marginTop20} />
                            </>
                        )}
                    </div>
                    <div className={style.dividerStyle}></div>
                    <div className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                        <div className={`${style.filterType} ${((contractFilter?.contractTimeCommitment?.to !== null || contractFilter?.contractTimeCommitment?.from !== null) && !contractTimeCommitmentFilter) ? style.purpleText : ''}`}>Contract Time Commitment</div>
                        <div className={`${style.displayInRow}  ${style.verticalAlignCenter}`}>
                            <div className={`${style.clearText} ${(contractFilter?.contractTimeCommitment?.to !== null || contractFilter?.contractTimeCommitment?.from !== null) ? style.purpleText : ''}`} onClick={() => setContractFilter({ ...contractFilter, contractTimeCommitment: { to: null, from: null } })}>Clear </div>
                            {!contractTimeCommitmentFilter ? (
                                <AddIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setContractTimeCommitmentFilter(!contractTimeCommitmentFilter)} />
                            ) : (
                                <RemoveIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setContractTimeCommitmentFilter(!contractTimeCommitmentFilter)} />
                            )}
                        </div>
                    </div>
                    <div className={style.marginTop10}>
                        {contractTimeCommitmentFilter && (
                            <div className={style.contractTimeCommitmentGrid}>
                                <div>
                                    <div className={style.labelText}>To</div>
                                    <CommonDateField
                                        open={calendarStart}
                                        onOpen={() => setCalendarStart(true)}
                                        onClose={() => setCalendarStart(false)}
                                        minDate={sub(new Date(), { years: 3 })}
                                        maxDate={add(new Date(), { months: 6 })}
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
                                <div>
                                    <div className={style.labelText}>From</div>
                                    <CommonDateField
                                        open={calendarEnd}
                                        onOpen={() => setCalendarEnd(true)}
                                        onClose={() => setCalendarEnd(false)}
                                        minDate={sub(new Date(), { years: 3 })}
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftStatsCard;
