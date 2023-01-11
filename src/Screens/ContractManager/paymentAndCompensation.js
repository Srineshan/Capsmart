import React, { useState, useEffect } from 'react';
import { InputGroup } from '@blueprintjs/core';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { GET, PUT } from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import LoadingScreen from '../../Components/LoadingScreen';
import RedirectingPopUp from './redirectingPopUp';

import style from './index.module.scss';

const switchTheme = createTheme({
    palette: {
        primary: {
            main: '#7165E3',
        },
    },
});

const PaymentAndCompensation = ({ selectContractInfo, getViewPage8, getCurrentPage, contractId, checkFieldAndPopAlert, getShowAlert, isEditable, getTabDataStatus }) => {
    const [compensation, setCompensation] = useState('RVUBASED');
    const [paymentAndCompensation, setPaymentAndCompensation] = useState({});
    const [rvuQuantity, setRvuQuantity] = useState({
        quantity: 0
    })
    const [frequency, setFrequency] = useState('')
    const [fteEquivalent, setFteEquivalent] = useState({
        value: parseFloat(0)
    })
    const [rvuReferenceUsed, setRvuReferenceUsed] = useState({
        value: ''
    })
    const [rvuQuantityVariance, setRvuQuantityVariance] = useState({
        value: 0
    })
    const [rvuQuantityPeriod, setRvuQuantityPeriod] = useState({
        days: 0
    })
    const [dollarRate, setDollarRate] = useState({
        hour: parseFloat(0),
        notApplicable: false,
    })
    const [dollarValue, setDollarValue] = useState({
        perTimesheetSubmission: 0,
        perContractedPeriod: 0
    })
    const [compensationOffsetCriteria, setCompensationOffsetCriteria] = useState({
        reducedNumberOfServices: '',
        providingAdditionalServices: ''
    });
    const [timesheetPayments, setTimesheetPayments] = useState([]);
    const [paymentFields, setPaymentFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [timeSheetTabs, setTimeSheetTabs] = useState([]);
    const limit3 = 3;
    const limit4 = 4;
    const limit5 = 5;
    const limit7 = 7;

    const handleContinue = async (buttonType) => {
        const data = {
            compensationBasis: compensation,
            rvuQuantity: rvuQuantity,
            frequency: frequency,
            fteEquivalent: fteEquivalent,
            rvuReferenceUsed: rvuReferenceUsed,
            rvuQuantityVariance: rvuQuantityVariance,
            rvuQuantityPeriod: rvuQuantityPeriod,
            compensationOffsetCriteria: compensationOffsetCriteria,
            dollarRate: dollarRate,
            dollarValue: dollarValue,
            timesheetPayments:timesheetPayments,
        }
        const response = await PUT(`contract-managment-service/contracts/${contractId}/paymentAndCompensation`, JSON.stringify(data));
        if (response) {
            SuccessToaster('Payment And Compensation Updated Successfully');
        }
        else {
            ErrorToaster('Unexpected Error');
        }
        if(buttonType !== 'Continue'){
          getShowAlert(true);
        }
        getTabDataStatus();
    }

    const getPaymentAndCompensation = async () => {
        const { data: paymentAndCompensation } = await GET(`contract-managment-service/contracts/${contractId}/paymentAndCompensation`);
        setPaymentAndCompensation(paymentAndCompensation);
    };

    useEffect(() => {
        setCompensation(paymentAndCompensation?.compensationBasis);
        setRvuQuantity(paymentAndCompensation?.rvuQuantity);
        setFrequency(paymentAndCompensation?.frequency);
        setFteEquivalent(paymentAndCompensation?.fteEquivalent);
        setRvuReferenceUsed(paymentAndCompensation?.rvuReferenceUsed);
        setRvuQuantityPeriod(paymentAndCompensation?.rvuQuantityPeriod);
        setRvuQuantityVariance(paymentAndCompensation?.rvuQuantityVariance);
        setDollarRate({...dollarRate, hour:paymentAndCompensation?.dollarRate?.hour, notApplicable:paymentAndCompensation?.dollarRate?.notApplicable});
        setDollarValue(paymentAndCompensation?.dollarValue);
        setCompensationOffsetCriteria(paymentAndCompensation?.compensationOffsetCriteria);
        setTimesheetPayments(paymentAndCompensation?.timesheetPayments || []);
        if(paymentAndCompensation?.timesheetPayments?.length !== 0){
          setTimesheetPaymentsValue()
        }
    }, [paymentAndCompensation])

    useEffect(()=>{
      setTimesheetPaymentsValue()
    }, [timeSheetTabs?.length, timesheetPayments?.length])

    const setTimesheetPaymentsValue = () => {
      if(timeSheetTabs?.length && timesheetPayments?.length === 0){
        console.log('init', timesheetPayments)
        let temp = [];
        timeSheetTabs?.map(data=>{
          temp.push({
          timesheetLabel: {
            label: data?.timesheetLabel?.label
          },
          paymentFrequency: "",
          maxPaymentPerTimesheetSubmission: parseFloat(0),
          maxPaymentPerContract: parseFloat(0),
          reducedNumberOfServices: "",
          providingAdditionalServices: "",
          overUnderPayment: "",
          paymentBasedonFixedHoursVsActual: true
        });
      });
        setTimesheetPayments(temp)
      }
    }

    useEffect(() => {
        getPaymentAndCompensation();
        getTimeSheetValues();
        setTimesheetPaymentsValue();
    }, [])

    useEffect(()=>{
      getPaymentFields();
    },[timesheetPayments?.length])

    const updateTimesheetPayment = (value, name, index) => {
      let temp = timesheetPayments;
      temp?.filter((data,indexVal)=>index === indexVal)?.map(data=>{
        data[name] = value;
        if(name === 'paymentBasedonFixedHoursVsActual' && !value){
          data['maxPaymentPerTimesheetSubmission'] = parseFloat(0);
          data['maxPaymentPerContract'] = parseFloat(0);
        }
      });
      setTimesheetPayments(temp);
      getPaymentFields();
    }

    const getPaymentFields = () => {
      let temp = [];
      for(let i=0;i < timesheetPayments?.length; i++){
        temp[i] = (
          <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
              <div className={`${style.extentionGrid}`}>
                  <div className={style.extentionLableStyle}>Timesheet Name*</div>
                  <InputGroup className={style.fullWidth} value={timesheetPayments?.[i]?.timesheetLabel?.label || ''} readOnly/>
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                  <div className={style.extentionLableStyle}>Payment Processing Criteria*</div>
                  <FormControl size="small">
                      <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                          value={timesheetPayments?.[i]?.paymentFrequency}
                          onChange={(e)=>updateTimesheetPayment(e.target.value, 'paymentFrequency', i)}
                      >
                          <MenuItem value={''}>Select Payment Frequency</MenuItem>
                          <MenuItem value={'WEEK'}>Per Week</MenuItem>
                          <MenuItem value={'MONTH'}>Per Month</MenuItem>
                          <MenuItem value={'YEAR'}>Per Year</MenuItem>
                      </Select>
                  </FormControl>
              </div>
              <div className={`${style.extentionGrid}`}>
                  <div className={`${style.extentionLableStyle} ${style.marginTop20}`}>Payment Based On Fixed Hours Vs Actual *</div>
                  <div className={`${style.displayInRow}  ${style.verticalAlignCenter}`}>
                      <ThemeProvider theme={switchTheme}>
                          <FormControlLabel
                              control={
                                  <Switch className={`${style.textAlignLeft}`} checked={timesheetPayments?.[i]?.paymentBasedonFixedHoursVsActual} onChange={(e)=>updateTimesheetPayment(e.target.checked, 'paymentBasedonFixedHoursVsActual', i)}/>
                              }
                              color='primary'
                              className={`${style.switchFontStyle} ${style.marginTop20}`}
                              label={timesheetPayments?.[i]?.paymentBasedonFixedHoursVsActual ? 'YES' : 'NO'}
                          />
                      </ThemeProvider>
                      {
                      //   timesheetPayments?.[i]?.paymentBasedonFixedHoursVsActual &&
                      //   <div className={`${style.twoFieldWidth} ${style.marginLeft20}`}>
                      //     <div className={style.helperTextPayment}>Max. Compensation Value Per Timesheet Submission*</div>
                      //     <TextField
                      //         type="number"
                      //         min="0"
                      //         size="small"
                      //         InputProps={{
                      //             startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                      //         }}
                      //         onChange={(e)=>updateTimesheetPayment(parseFloat(e.target.value), 'maxPaymentPerTimesheetSubmission', i)}
                      //         value={timesheetPayments?.[i]?.maxPaymentPerTimesheetSubmission}
                      //         inputProps={{
                      //             style: {
                      //                 height: 15,
                      //             },
                      //         }}
                      //     />
                      // </div>
                  }
                  </div>
              </div>
          { timesheetPayments?.[i]?.paymentBasedonFixedHoursVsActual &&
              <>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                  <div className={style.extentionLableStyle}>Max. Compensation Value Per Timesheet Submission*</div>
                  <TextField
                      className={style.twoFieldWidth}
                      type="number"
                      min="0"
                      size="small"
                      InputProps={{
                          startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                      }}
                      onChange={(e)=>updateTimesheetPayment(parseFloat(e.target.value), 'maxPaymentPerTimesheetSubmission', i)}
                      value={timesheetPayments?.[i]?.maxPaymentPerTimesheetSubmission}
                      inputProps={{
                          style: {
                              height: 15,
                          },
                      }}
                  />
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                  <div className={style.extentionLableStyle}>Compensation Offset Criteria For Reduced Number Of Agreed To Services*</div>
                  <FormControl size="small">
                      <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={timesheetPayments?.[i]?.reducedNumberOfServices}
                          onChange={(e)=> updateTimesheetPayment(e.target.value, 'reducedNumberOfServices', i)}
                          SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                      >
                          <MenuItem value={'TIMESHEET'}>Per Timesheet Period</MenuItem>
                          <MenuItem value={'CONTRACT_END'}>On Last Invoice For Contract Year</MenuItem>
                      </Select>
                  </FormControl>
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                  <div className={style.extentionLableStyle}>Max. Compensation Value Per Contract*</div>
                  <TextField
                      className={style.twoFieldWidth}
                      type="number"
                      min="0"
                      size="small"
                      InputProps={{
                          startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                      }}
                      onChange={(e)=>updateTimesheetPayment(parseFloat(e.target.value), 'maxPaymentPerContract', i)}
                      value={timesheetPayments?.[i]?.maxPaymentPerContract}
                      inputProps={{
                          style: {
                              height: 15,
                          },
                      }}
                  />
              </div>

              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                  <div className={style.extentionLableStyle}>Compensation Offset Criteria For Providing Additional Services To The Agreed To Services*</div>
                  <FormControl size="small">
                      <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={timesheetPayments?.[i]?.providingAdditionalServices}
                          onChange={(e)=> updateTimesheetPayment(e.target.value, 'providingAdditionalServices', i)}
                          SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                      >
                          <MenuItem value={'TIMESHEET'}>Per Timesheet Period</MenuItem>
                          <MenuItem value={'CONTRACT_END'}>On Last Invoice For Contract Year</MenuItem>
                      </Select>
                  </FormControl>
              </div>


              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                  <div className={style.extentionLableStyle}>Compensation Offset Criteria For Over/ Under Payment *</div>
                  <FormControl size="small">
                      <Select
                          labelId="demo-select-small"
                          id="demo-select-small"
                          value={timesheetPayments?.[i]?.overUnderPayment}
                          onChange={(e)=> updateTimesheetPayment(e.target.value, 'overUnderPayment', i)}
                          SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                      >
                          <MenuItem value={'TIMESHEET'}>Per Timesheet</MenuItem>
                          <MenuItem value={'CONTRACT_END'}>Contract Year End</MenuItem>
                      </Select>
                  </FormControl>
              </div>

              </>
            }

          </div>
        )
      }
      setPaymentFields(temp);
    }

    const getTimeSheetValues = async () => {
        setIsLoading(true);
        const { data: timesheetSubmissionTerms } = await GET(`contract-managment-service/contracts/${contractId}/timesheetSubmissionTerms`);
        setTimeSheetTabs(timesheetSubmissionTerms?.timesheetActivitiesPeriods?.map(data => data) || []);
        setIsLoading(false);
    }

    const leftElement = () => {
        return (
            <button className={`${style.dollarLeftElement}`} >$</button>
        )
    }

    const onCompensationUpdate = (value) => {
      setCompensation(value);
      if(value !== 'RVUBASED'){
        setRvuQuantity(null);
        setFteEquivalent(null);
        setRvuReferenceUsed(null);
        setRvuQuantityPeriod(null);
        setRvuQuantityVariance(null);
      }
    }

    if (isLoading) {
        return <LoadingScreen text={['Sit Back And Relax', 'Loading Your Details']} />
    }

    return (
        <>
            {
                timeSheetTabs?.length !== 0 ?
                    <div className={style.cloneBlockStyle}>
                        <div className={`${style.newContractFromCloneBoxStyle}`}>
                            <div className={`${style.extentionGrid} ${selectContractInfo === "Individual Contractor" && style.marginTop20}`} onFocus={() => { checkFieldAndPopAlert(compensation, 'Compensation Basis') }}>
                                <div className={style.extentionLableStyle}>Compensation Basis*</div>
                                {/* <div>
                        <RadioGroup
                            inline={true}
                            className={`${style.marginTop} ${style.leftAlign}`}
                            selectedValue={compensation}
                            onChange={(e) => setCompensation(e.target.value)}
                        >
                            <Radio label="RVU Based" value="RVUBASED" />
                            <Radio label="Dollar Based Rate" value="DOLLARBASEDRATE" />
                        </RadioGroup>
                    </div> */}
                                <FormControl>
                                    <RadioGroup
                                        row className={`${style.leftAlign}`}
                                        value={compensation}
                                        onChange={(e) => onCompensationUpdate(e.target.value)}
                                        sx={{ color: '#52575D' }}
                                    >
                                        <FormControlLabel value="RVUBASED"
                                            control={<Radio sx={{ color: '#B3B8BD', '&.Mui-checked': { color: '#7165E3' } }} size='small' />}
                                            label="RVU Based" componentsProps={{ typography: { variant: 'subtitle2' } }} />
                                        <FormControlLabel
                                            value="DOLLARBASEDRATE"
                                            control={<Radio sx={{ color: '#B3B8BD', '&.Mui-checked': { color: '#7165E3' } }} size='small' />}
                                            label="Dollar Based Rate" componentsProps={{ typography: { variant: 'subtitle2' } }} />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                            {compensation === "RVUBASED" && (
                                <div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`} onFocus={() => { checkFieldAndPopAlert(rvuQuantity?.quantity, 'RVU Quantity') }}>
                                        <div className={style.extentionLableStyle}>RVU Quantity*</div>
                                        <div className={style.displayInRow}>
                                            <InputGroup className={style.fourFieldWidth} value={rvuQuantity?.quantity} placeholder="0"
                                                type='number'
                                                min="0"
                                                onChange={(e) => e.target.value >= 0 && setRvuQuantity({
                                                    ...rvuQuantity, quantity: e.target.value.slice(0, limit5)
                                                })} />
                                            {/* <select
                                                name="class"
                                                id="Class"
                                                value={frequency}
                                                onChange={(e) => setFrequency(e.target.value)}
                                                className={`${style.twoFieldWidth} ${style.marginLeft20} ${style.reduceTop}`}>
                                                <option value="WEEK" >
                                                    Per Week
                                                </option>
                                                <option value="MONTH" >
                                                    Per Month
                                                </option>
                                                <option value="YEAR" >
                                                    Per Contract Year
                                                </option>
                                            </select> */}
                                            <FormControl className={`${style.twoFieldWidth} ${style.marginLeft} ${style.reduceTop}`} size="small">
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={frequency}
                                                    onChange={(e) => setFrequency(e.target.value)}
                                                    SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                                >
                                                    <MenuItem value={'WEEK'}>Per Week</MenuItem>
                                                    <MenuItem value={'MONTH'}>Per Month</MenuItem>
                                                    <MenuItem value={'YEAR'}>Per Contract Year</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`} onFocus={() => { checkFieldAndPopAlert(fteEquivalent?.value, 'FTE Equivalent') }} >
                                        <div className={style.extentionLableStyle}>FTE Equivalent</div>
                                        <InputGroup className={style.twoFieldWidth} value={fteEquivalent?.value} placeholder="0" type="number"
                                            min="0"
                                            onChange={(e) => setFteEquivalent({
                                                ...fteEquivalent, value: parseFloat(e.target.value.slice(0, limit4))
                                            })} />
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`} onFocus={() => { checkFieldAndPopAlert(rvuReferenceUsed?.value, 'RVU Reference Used') }}>
                                        <div className={style.extentionLableStyle}>RVU Reference Used</div>
                                        <InputGroup className={style.fullWidth} value={rvuReferenceUsed?.value} placeholder="Enter RVU Reference Used"
                                            min="0"
                                            onChange={(e) => setRvuReferenceUsed({
                                                ...rvuReferenceUsed, value: e.target.value
                                            })} />
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`} onFocus={() => { checkFieldAndPopAlert(rvuQuantityVariance?.value, 'RVU Quantity Variance (+/-)') }}>
                                        <div className={style.extentionLableStyle}>RVU Quantity Variance (+/-)</div>
                                        <InputGroup className={style.twoFieldWidth} value={rvuQuantityVariance?.value} placeholder="0" type='number'
                                            min="0" onChange={(e) => setRvuQuantityVariance({
                                                ...rvuQuantityVariance, value: e.target.value.slice(0, limit3)
                                            })} />
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>RVU Quantity Period</div>
                                        <TextField
                                            size="small"
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Days</InputAdornment>,
                                            }}
                                            onChange={(e) => setRvuQuantityPeriod({
                                                ...rvuQuantityPeriod, days: e.target.value.slice(0, limit4)
                                            })}
                                            className={style.renewalWidth}
                                            value={rvuQuantityPeriod?.days}
                                            inputProps={{
                                                style: {
                                                    height: 20,
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Dollar Hourly Rate*</div>
                                <div className={style.twoCol}>
                                <TextField
                                    type="number"
                                    min="0"
                                    size="small"
                                    disabled={dollarRate?.notApplicable}
                                    value={dollarRate?.hour}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                                    }}
                                    onChange={(e) => setDollarRate({
                                        ...dollarRate, hour: parseFloat(e.target.value.slice(0, limit7)), notApplicable:false})}
                                    inputProps={{
                                        style: {
                                            height: 15,
                                        },
                                    }}
                                />
                                <FormGroup>
                                  <FormControlLabel control={<Checkbox value="NA" checked={dollarRate?.notApplicable} onChange={(e)=>setDollarRate({...dollarRate, notApplicable:e.target.checked, hour:parseFloat(0)})}/>} label={<Typography variant="body2" color="textSecondary">NA</Typography>} />
                                </FormGroup>
                              </div>
                            </div>

                            <div className={`${style.paymentTimesheetDetailsHeading} ${style.marginTop20}`}>
                                INDIVIDUAL TIMESHEET DETAILS
                            </div>
                            {paymentFields}
                          </div>
                          {isEditable &&
                            <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                                <button className={`${style.newContractButtonStyle}`} onClick={() => { getCurrentPage('Timesheet Submission Terms') }}>BACK</button>
                                <div>
                                    <button className={style.newContractOutlinedButton} onClick={() => handleContinue('Save In Progress')}>SAVE IN-PROGRESS</button>
                                    <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`}
                                        onClick={() => { handleContinue('Continue'); getViewPage8(true); getCurrentPage('Timesheet Processing Workflow') }}
                                    >CONTINUE</button>
                                </div>
                            </div>
                          }

                    </div> :
                    <RedirectingPopUp getCurrentPage={getCurrentPage} tabName={'Timesheet Submission Terms'} title={'NO TIMESHEET FOUND'} description={'No Timesheet Is Found.'} buttonText={'ADD TIMESHEET'} />
            }
        </>
    )
}

export default PaymentAndCompensation;
