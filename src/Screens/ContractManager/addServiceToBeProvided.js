import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, EditableText, RadioGroup, Radio, Checkbox} from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import style from './index.module.scss';
import SendEmailUserList from './mailUser';

const AddServiceProvided = ({getAddServiceDialog, getAddOn}) => {
  const [sendEmailNotification, setSendEmailNotification] = useState(false);
  const [activityType, setActivityType] = useState('OutPatient Surgery Clinic Session');
  const [activityContractedFor, setActivityContractedFor] = useState('Clinic Session Blocks');
  const [isDesignatedSpecificContractor,setIsDesignatedSpecificContractor] = useState(true);
  const [addOnService,setAddOnService] = useState('Clinic Session');
  const getSendEmailNotification = (value) => {
    setSendEmailNotification(value)
  }
    const leftElementButton = (text) => {
        return(
            <button className={`${style.minMaxLeftElement}`} >{text}</button>
        )
    }

    const inputElementText = (text) => {
      return(
        <button className={`${style.textElement}`} >{text}</button>
      )
    }

    useEffect(() => {
        if(activityContractedFor === "Add-On Services Allowed Upon Request Approval"
        || activityContractedFor === "Department Oversight Role & Responsibility"
        ||activityContractedFor === "Administrative / Miscellaneous Services"){
            getAddOn(true);
            console.log('entered')
        } else {
            getAddOn(false);
        }
    }, [activityContractedFor]);

    return(
      <div>
        <Dialog isOpen={getAddServiceDialog} onClose={() => getAddServiceDialog(false)} className={`${style.addProofDialog} ${style.addManagerDialogBackground}`}>
          <div className={`${Classes.DIALOG_BODY} `}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Add Services To Be Provided As Per Contract</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getAddServiceDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <div className={style.proofBorder}>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Activity /Service Type*</div>
                    <div>
                        <select
                            name="class"
                            id="Class"
                            className={`${style.fullWidth} ${style.marginRight20}`}>
                                <option value="Medical / Surgical Care Contracted Services" >
                                Medical / Surgical Care Contracted Services
                                </option>
                                <option value="User" >
                                User
                                </option>
                        </select>
                    </div>
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Designate Specific Contractor*</div>
                    <div className={`${style.displayInRow} `}>
                        <FormControlLabel
                            control={
                                <Switch checked={isDesignatedSpecificContractor} className={`${style.textAlignLeft}`} onChange={()=>setIsDesignatedSpecificContractor(!isDesignatedSpecificContractor)}/>
                            }
                            className={`${style.switchFontStyle} ${style.flexLeft} ${style.marginTop10} `}
                            label={isDesignatedSpecificContractor ? 'YES' : 'NO'}                   
                        />
                        {isDesignatedSpecificContractor&&<select
                            name="class"
                            id="Class"
                            className={`${style.fullWidth} ${style.marginLeft20} `}>
                                <option value="Select Contracted Services Provided" >
                                    Select Contracted Services Provided
                                </option>
                                <option value="User" >
                                User
                                </option>
                        </select>}
                    </div>
                </div>
                {activityType !== "Surgery Session" && (
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Specific Activity Contracted For*</div>
                        <div>
                            <select
                                name="class"
                                id="Class"
                                value={activityContractedFor}
                                onChange={(e) => setActivityContractedFor(e.target.value)}
                                className={`${style.fullWidth} ${style.marginRight20} `}>
                                    <option value="Clinic Session Blocks" >
                                    Clinic Session Blocks
                                    </option>
                                    <option value="On Call Coverage Duty Days" >
                                    On Call Coverage Duty Days
                                    </option>
                                    <option value="Supplemental Clinical Services">
                                    Supplemental Clinical Services
                                    </option>
                                    <option value="Add-On Services Allowed Upon Request Approval">
                                    Add-On Services Allowed Upon Request Approval
                                    </option>
                                    <option value="Department Oversight Role & Responsibility">
                                    Department Oversight Role & Responsibility
                                    </option>
                                    <option value="Administrative / Miscellaneous Services">
                                    Administrative / Miscellaneous Services
                                    </option>
                            </select>
                        </div>
                    </div>
                )}

                {activityContractedFor === 'Administrative / Miscellaneous Services'?
                <div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Regular {activityType === "Surgery Session" ? 'Surgery' : 'Clinic'} Schedule*</div>
                    <div className={style.displayInRow}>
                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                            <EditableText value="4" className={style.editableTextStyle} />
                            <div className={style.textElementWithoutBackground}>Hours</div>
                        </div>
                        <select
                            name="class"
                            id="Class"
                            className={` ${style.threeFieldWidth} ${style.marginLeft20} ${style.reduceTop}`}>
                                <option value="Per Week" >
                                Per Week
                                </option>
                                <option value="User" >
                                User
                                </option>
                        </select>
                        <Checkbox checked={false} label="All Activities" className={`${style.marginLeft20} ${style.marginTop10}`} />
                    </div>
                </div>
                <div className={style.marginTop20}>
                    <div className={style.twoCol}>
                    <Checkbox checked={false} label="Periodic Productivity Data Review (Monthly)" />
                    <Checkbox checked={false} label="PA & Non-Physician Staff Supervision" />
                    </div>
                    <div className={style.twoCol}>
                    <Checkbox checked={false} label="Administrative & Business Reports Creation" />
                    <Checkbox checked={false} label="Peer Review Meetings" />
                    </div>
                    <div className={style.twoCol}>
                    <Checkbox checked={false} label="Administrative & Business Records Maintenance" />
                    <Checkbox checked={false} label="Performance of Time Studies" />
                    </div>
                    <div className={style.twoCol}>
                    <Checkbox checked={false} label="Credentials Committee Meeting" />
                    <Checkbox checked={false} label="Performance Improvement Project Meeting" />
                    </div>
                    <div className={style.twoCol}>
                    <Checkbox checked={false} label="Corrective Action Plan Participation" />
                    <Checkbox checked={false} label="Performance Metric Review" />
                    </div>
                    <div className={style.twoCol}>
                    <Checkbox checked={false} label="Contractor Clinic ? OR Schedule Maintenance (weekly)" />
                    <Checkbox checked={false} label="Quality Assurance Meeting" />
                    </div>
                    <div className={style.twoCol}>
                    <Checkbox checked={false} label="Contractor On Call Schedule Maintenance (Weekly)" />
                    <Checkbox checked={false} label="Review of Services Provided by PA & Non-Physician Staff" />
                    </div>
                    <div className={style.twoCol}>
                    <Checkbox checked={false} label="Clinic Performance Review" />
                    <Checkbox checked={false} label="Service Billing & Coding" />
                    </div>
                    <div className={style.twoCol}>
                    <Checkbox checked={false} label="Contract Performance Review Meeting" />
                    <Checkbox checked={false} label="Training & Education Activity" />
                    </div>
                    <div className={style.twoCol}>
                    <Checkbox checked={false} label="Medical Records Maintenance" />
                    <Checkbox checked={false} label="Utilization Review Meeting" />
                    </div>
                </div>
                </div>
                  :activityContractedFor === 'Department Oversight Role & Responsibility'?
                <div>
                <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                <div className={`${style.addManagerGrid}`}>
                    <div className={style.extentionLableStyle}>Title*</div>
                        <select
                            name="class"
                            id="Class"
                            className={`${style.fullWidth} ${style.marginRight20} `}>
                                <option value="Title(fetched from earlier Scenario)" >
                                  Title(fetched from earlier Scenario)
                                </option>
                        </select>
                </div>
                <div className={` ${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Additional Compensation*</div>
                    <div className={style.displayInRow}> 
                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                            <div className={style.textElementWithoutBackground}>$</div>
                            <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                        </div>
                        <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Month</p>
                    </div>
                </div>
                </div>
                </div>
                :activityContractedFor === 'Add-On Services Allowed Upon Request Approval'?
                <div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Specify Addon Service*</div>
                        <div>
                            <select
                                name="class"
                                id="Class"
                                onChange={(e)=>setAddOnService(e.target.value)}
                                value={addOnService}
                                className={`${style.fullWidth} ${style.marginRight20} `}>
                                    <option value="Clinic Session" >
                                      Clinic Session
                                    </option>
                                    <option value="Surgical care activities" >
                                      Surgical care activities
                                    </option>
                                    <option value="On Call Duty Services/activities" >
                                      On Call Duty Services/activities
                                    </option>
                            </select>
                        </div>
                    </div>
                    {addOnService === 'On Call Duty Services/activities'?
                    <div>
                        <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                        <div className={`${style.addManagerGrid} `}>
                            <div className={style.extentionLableStyle}>After Hours Applicable Period*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value="17:01" className={style.threeFieldWidth} />
                                <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop}`}>To</p>
                                <InputGroup value="07:29" className={style.threeFieldWidth} />
                            </div>
                        </div>
                          <p className={`${style.blue} ${style.marginTop20} ${style.alignCenter}`}> For Case Not Able To Be Done During Regular Hours (Nights, Weekends And Holidays).</p>
                       </div>
                       <Checkbox checked={true} label="On Call Duty/Emergency call Day" className={style.marginTop30} />
                       <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                       <div className={` ${style.addManagerGrid}`}>
                           <div className={`${style.extentionLableStyle} ${style.marginTop10}`}>On-Call Coverage Rate*</div>
                           <div className={style.displayInRow}> 
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                    <div className={style.textElementWithoutBackground}>$</div>
                                    <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                                </div>
                                <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Excess Coverage Day</p>
                            </div>
                       </div>
                       </div>
                       <Checkbox checked={true} label="Emergency Call Consult" className={style.marginTop30} />
                       <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                       <div className={` ${style.addManagerGrid} `}>
                           <div className={`${style.extentionLableStyle} ${style.marginTop10}`}>Consult Day Rate*</div>
                           <div className={style.displayInRow}> 
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                    <div className={style.textElementWithoutBackground}>$</div>
                                    <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                                </div>
                                <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Surgery Assist Session</p>
                            </div>
                       </div>
                       </div>
                       <Checkbox checked={true} label="Inpatient Call Consult" className={style.marginTop30} />
                       <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                       <div className={` ${style.addManagerGrid}`}>
                           <div className={`${style.extentionLableStyle} ${style.marginTop10}`}>Consult Day Rate*</div>
                           <div className={style.displayInRow}> 
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                    <div className={style.textElementWithoutBackground}>$</div>
                                    <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                                </div>
                                <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Surgery Assist Session</p>
                            </div>
                       </div>
                       </div>
                    <Checkbox checked={true} label="Trauma Service/Call on demand" className={style.marginTop30} />
                    <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                    <div className={` ${style.addManagerGrid}`}>
                        <div className={`${style.extentionLableStyle} ${style.marginTop10}`}>Trauma Service Hourly Rate*</div>
                        <div className={style.displayInRow}> 
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElementWithoutBackground}>$</div>
                                <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                            </div>
                            <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Hour</p>
                        </div>
                    </div>
                    </div>
                  </div>
                    :
                      addOnService === 'Surgical care activities'?
                      <div>
                            <Checkbox checked={true} label="Surgery Session" className={style.marginTop20} />
                            <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                            <div className={` ${style.addManagerGrid}`}>
                                <div className={style.extentionLableStyle}>Surgery Session Rate*</div>
                                <div className={style.displayInRow}>
                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                        <div className={style.textElementWithoutBackground}>$</div>
                                        <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                                    </div>
                                    <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Additional Surgery Session</p>
                                </div>
                            </div>
                            <div className={`  ${style.addManagerGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Surgery Session Duration*</div>
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                    <EditableText value="4" className={style.editableTextStyle} />
                                    <div className={style.textElementWithoutBackground}>Hour</div>
                                </div>
                            </div>
                         </div>
                         <Checkbox checked={true} label="Surgery Session Extension" className={style.marginTop30} />
                         <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                         <div className={` ${style.addManagerGrid}`}>
                             <div className={style.extentionLableStyle}>Surgery Extension Hourly Rate*</div>
                             <div className={style.displayInRow}> 
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                    <div className={style.textElementWithoutBackground}>$</div>
                                    <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                                </div>
                                <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Hour</p>
                            </div>
                         </div>
                         </div>
                         <Checkbox checked={true} label="Surgery Assist Session" className={style.marginTop30} />
                         <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                         <div className={` ${style.addManagerGrid}`}>
                             <div className={style.extentionLableStyle}>Surgery Session Rate*</div>
                             <div className={style.displayInRow}>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElementWithoutBackground}>$</div>
                                <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                            </div>
                            <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Additional Surgery Session</p>
                          </div>
                         </div>
                         <div className={`  ${style.addManagerGrid} ${style.marginTop20}`}>
                             <div className={style.extentionLableStyle}>Surgery Assist Session Duration*</div>
                             <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                 <EditableText value="4" className={style.editableTextStyle} />
                                 <div className={style.textElementWithoutBackground}>Hour</div>
                             </div>
                         </div>
                      </div>
                         <Checkbox checked={true} label="Surgery Assist Session Extension" className={style.marginTop30} />
                         <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                         <div className={` ${style.addManagerGrid}`}>
                             <div className={style.extentionLableStyle}>Surgery Assist Session Hourly Rate*</div>
                             <div className={style.displayInRow}> 
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                    <div className={style.textElementWithoutBackground}>$</div>
                                    <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                                </div>
                                <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Hour</p>
                            </div>
                         </div>
                         </div>
                         <Checkbox checked={true} label="Inpatient Post-Operative Care Services" className={style.marginTop30} />
                         <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                         <div className={` ${style.addManagerGrid}`}>
                             <div className={style.extentionLableStyle}>Inpatient Post-Operative Care Services Hourly Rate**</div>
                             <div className={style.displayInRow}> 
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                    <div className={style.textElementWithoutBackground}>$</div>
                                    <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                                </div>
                                <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Hour</p>
                            </div>
                         </div>
                         </div>
                         <Checkbox checked={true} label="Elective Surgery Case" className={style.marginTop30} />
                         <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                         <div className={` ${style.addManagerGrid}`}>
                             <div className={style.extentionLableStyle}>Elective Surgery Hourly Rate*</div>
                             <div className={style.displayInRow}> 
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                    <div className={style.textElementWithoutBackground}>$</div>
                                    <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                                </div>
                                <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Hour</p>
                            </div>
                         </div>
                         </div>
                         <Checkbox checked={true} label="Emergency / After hours Surgery Case" className={style.marginTop30} />
                         <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                         <div className={` ${style.addManagerGrid} `}>
                             <div className={style.extentionLableStyle}>Emergency Surgery Case Hourly Rate*</div>
                             <div className={style.displayInRow}> 
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                    <div className={style.textElementWithoutBackground}>$</div>
                                    <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                                </div>
                                <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Hour</p>
                            </div>
                         </div>
                         <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                             <div className={style.extentionLableStyle}>After Hours Period*</div>
                             <div className={style.displayInRow}>
                                 <InputGroup value="17:01" className={style.threeFieldWidth} />
                                 <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop}`}>To</p>
                                 <InputGroup value="07:29" className={style.threeFieldWidth} />
                             </div>
                         </div>
                         <p className={`${style.blue} ${style.alignCenter} ${style.marginTop20}`}> For Case Not Able To Be Done During Regular Hours (Nights, Weekends And Holidays).</p>
                      </div>
                      </div>

                      : addOnService === 'Clinic Session'?
                      <div><Checkbox checked={true} label="Outpatient Clinic Session Block"  className={style.marginTop20}/>
                      <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                      <div className={` ${style.addManagerGrid} `}>
                          <div className={style.extentionLableStyle}>Outpatient Clinic Session Rate*</div>
                          <div className={style.displayInRow}>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElementWithoutBackground}>$</div>
                                <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                            </div>
                            <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Additional Clinic Session</p>
                          </div>
                      </div>
                      <div className={`  ${style.addManagerGrid} ${style.marginTop20}`}>
                          <div className={style.extentionLableStyle}>Clinic Session Duration*</div>
                          <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                              <EditableText value="4" className={style.editableTextStyle} />
                              <div className={style.textElementWithoutBackground}>Hour</div>
                          </div>
                      </div>
                   </div>
                   <Checkbox checked={true} label="Fracture Clinic Session" className={style.marginTop30} />
                   <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                   <div className={` ${style.addManagerGrid}`}>
                       <div className={style.extentionLableStyle}>Fracture Session Rate*</div>
                       <div className={style.displayInRow}>
                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                            <div className={style.textElementWithoutBackground}>$</div>
                            <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                        </div>
                        <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Additional Fracture Clinic Session</p>
                       </div>
                   </div>
                   <div className={`  ${style.addManagerGrid} ${style.marginTop20}`}>
                       <div className={style.extentionLableStyle}>Fracture Session Duration*</div>
                       <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                           <EditableText value="4" className={style.editableTextStyle} />
                           <div className={style.textElementWithoutBackground}>Hour</div>
                       </div>
                   </div>
                   </div>
                   <Checkbox checked={true} label="Clinic Session Extension" className={style.marginTop30} />
                   <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                   <div className={` ${style.addManagerGrid}`}>
                       <div className={style.extentionLableStyle}>Clinic Extension Hourly Rate*</div>
                       <div className={style.displayInRow}> 
                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                            <div className={style.textElementWithoutBackground}>$</div>
                            <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                        </div>
                        <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Hour</p>
                       </div>
                   </div>
                  </div>
                  <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Allowable Working Day Hours For Clinic Sessions*</div>
                      <div className={style.displayInRow}>
                          <InputGroup value="07:30" className={style.threeFieldWidth} />
                          <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop}`}>To</p>
                          <InputGroup value="17:00" className={style.threeFieldWidth} />
                      </div>
                  </div></div> : ''
                    }


                </div>
                :activityContractedFor === 'Supplemental Clinical Services' ?
                <div>
                  <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Applicable Supplemental Clinical Services*</div>
                      <div>
                          <Checkbox checked={false} label="Outpatient Clinic Session Block" />
                          <Checkbox checked={false} label="Clinic Session Extensio" />
                          <Checkbox checked={false} label="Fracture Clinic Session" />
                          <Checkbox checked={false} label="Fracture Clinic Extension" />
                          <Checkbox checked={false} label="Additional Clinical Services Required" />
                          <Checkbox checked={false} label="Additional Surgical Services Required" />
                      </div>
                   </div>
                   <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                       <div className={style.extentionLableStyle}>Contracted Number of Supplemental Hours*</div>
                       <div className={style.displayInRow}>
                           <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                               <div className={style.textElement}>MIN</div>
                               <EditableText value="2" className={style.editableTextStyle} />
                           </div>
                           <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                               <div className={style.textElement}>MAX</div>
                               <EditableText value="3" className={style.editableTextStyle} />
                           </div>
                           <select
                               name="class"
                               id="Class"
                               className={` ${style.threeFieldWidth} ${style.marginLeft20} ${style.reduceTop}`}>
                                   <option value="Per Week/Month" >
                                   Per Week/Month
                                   </option>
                           </select>
                       </div>
                   </div>
                   <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                       <div className={style.extentionLableStyle}>Supplemental Clinical Service Hour Value*</div>
                       <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                           <div className={style.textElementWithoutBackground}>$</div>
                           <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                       </div>
                   </div>
                   <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                       <div className={style.extentionLableStyle}>Total Contracted Suplemental Service Sessions*</div>
                       <div className={style.twoCol}>
                           <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                               <EditableText value="98" className={style.editableSessionTextStyle} />
                               <div className={style.textElement}>120 Specified</div>
                           </div>
                           <select
                               name="class"
                               id="Class"
                               className={`${style.fullWidth} ${style.reduceTop} `}>
                                   <option value="Per Contract Year" >
                                   Per Contract Year
                                   </option>
                           </select>
                       </div>
                   </div>
                   <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                       <div className={style.extentionLableStyle}>Allowable Working Day Hours For Supplemental Services*</div>
                       <div className={style.displayInRow}>
                           <InputGroup value="07:30" className={style.threeFieldWidth} />
                           <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop}`}>To</p>
                           <InputGroup value="17:00" className={style.threeFieldWidth} />
                       </div>
                   </div>
                  </div>
                  :activityContractedFor === "Clinic Session Blocks" ? (
                    <div>
                        {/* <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Specify Activity Type</div>
                            <div>
                                <select
                                    name="class"
                                    id="Class"
                                    value={activityType}
                                    onChange={(e) => setActivityType(e.target.value)}
                                    className={`${style.fullWidth} ${style.marginRight20} `}>
                                        <option value="OutPatient Surgery Clinic Session" >
                                        OutPatient Surgery Clinic Session
                                        </option>
                                        <option value="Fracture Clinic Session" >
                                        Fracture Clinic Session
                                        </option>
                                        <option value="Surgery Session" >
                                        Surgery Session
                                        </option>
                                </select>
                            </div>
                        </div> */}
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Regular {activityType === "Surgery Session" ? 'Surgery' : 'Clinic'} Schedule*</div>
                            <div className={style.displayInRow}>
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                    <div className={style.textElement}>MIN</div>
                                    <EditableText value="2" className={style.editableTextStyle} />
                                </div>
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                    <div className={style.textElement}>MAX</div>
                                    <EditableText value="3" className={style.editableTextStyle} />
                                </div>
                                <select
                                    name="class"
                                    id="Class"
                                    className={` ${style.threeFieldWidth} ${style.marginLeft20} ${style.reduceTop}`}>
                                        <option value="Per Week" >
                                        Per Week
                                        </option>
                                        <option value="User" >
                                        User
                                        </option>
                                </select>
                            </div>
                        </div>
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>{activityType === "Surgery Session" ? 'Surgery Case' : 'Clinic Patient'} Target*</div>
                            <div className={`${style.displayInRow} `}>
                                {activityType !== "Surgery Session" ? (
                                <div className={`${style.displayInRow} ${style.fullWidth}`}>
                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.twoFieldWidth} `}>
                                        <div className={style.textElementWithNurse}>WITH NURSE</div>
                                        <EditableText value="20" className={style.editableTextStyle} />
                                    </div>
                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.twoFieldWidth}`}>
                                        <div className={style.textElementWithNurse}>WITHOUT NURSE</div>
                                        <EditableText value="15" className={style.editableTextStyle} />
                                    </div>
                                </div>
                                ) : (
                                    <InputGroup value="1" className={`${style.marginLeft20} ${style.threeFieldWidth}`} />
                                )}
                                <RadioGroup
                                    inline={true}
                                    className={`${style.marginLeft20} ${activityType === "Surgery Session" && style.marginTop } `}
                                >
                                    <Radio label="No Target Applicable" value="No Target Applicable"  />
                                </RadioGroup>
                            </div>
                        </div>
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Additional {activityType === "Surgery Session" ? 'Surgery' : 'Clinic'} Schedule*</div>
                            <div className={style.displayInRow}>
                                <div className={`${style.threeFieldWidth}`} >
                                    <FormControlLabel
                                        control={
                                            <Switch checked={true} className={` ${style.textAlignLeft}`} />
                                        }
                                        className={`${style.switchFontStyle} ${style.flexLeft}`}
                                        label={'YES'}                  
                                    />
                                </div>
                                <InputGroup value="2" className={`${style.marginLeft20} ${style.threeFieldWidth}`} />
                                <select
                                    name="class"
                                    id="Class"
                                    className={`${style.threeFieldWidth} ${style.marginLeft20} ${style.reduceTop}`}>
                                        <option value="Every Other Week" >
                                        Every Other Week
                                        </option>
                                        <option value="User" >
                                        User
                                        </option>
                                </select>
                            </div>
                        </div>
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>{activityType === "Surgery Session" ? 'Surgery' : 'Clinic'} Session Duration</div>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <EditableText value="1" className={style.editableTextStyle} />
                                <div className={style.textElementWithoutBackground}>Hours</div>
                            </div>
                        </div>
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>{activityType === "Surgery Session" ? 'Surgery' : 'Clinic'} Session Payment Amount*</div>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElementWithoutBackground}>$</div>
                                <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                            </div>
                        </div>
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Total Contracted Service Sessions**</div>
                            <div className={style.twoCol}>
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                    <EditableText value="98" className={style.editableSessionTextStyle} />
                                    <div className={style.textElement}>120 Specified</div>
                                </div>
                                <select
                                    name="class"
                                    id="Class"
                                    className={`${style.fullWidth} ${style.reduceTop} `}>
                                        <option value="Per Contract Year" >
                                        Per Contract Year
                                        </option>
                                </select>
                            </div>
                        </div>
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Allowable Working Day Hours For {activityType === "Surgery Session" ? 'Surgery' : 'Clinic'}*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value="07:30" className={style.threeFieldWidth} />
                                <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop}`}>To</p>
                                <InputGroup value="17:00" className={style.threeFieldWidth} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>On Call Service Duty Days*</div>
                            <RadioGroup
                                inline={true}
                                className={`${style.marginLeft20} ${activityType === "Surgery Session" && style.marginTop } `}
                                selectedValue="Weekdays"
                            >
                                <Radio label="Weekdays" value="Weekdays" checked />
                                <Radio label="Weekends" value="Weekends"  />
                                <Radio label="Holidays" value="Holidays"  />
                            </RadioGroup>
                        </div>
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Coverage Call Duty Type*</div>
                            <div>
                                <select
                                    name="class"
                                    id="Class"
                                    className={`${style.fullWidth} ${style.marginRight20} `}>
                                        <option value="All On Call Service Duty" >
                                        All On Call Service Duty
                                        </option>
                                </select>
                            </div>
                        </div>
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Number of On Call Duty Days*</div>
                            <div className={style.displayInRow}>
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                    <div className={style.textElement}>MIN</div>
                                    <EditableText value="2" className={style.editableTextStyle} />
                                </div>
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                    <div className={style.textElement}>MAX</div>
                                    <EditableText value="3" className={style.editableTextStyle} />
                                </div>
                                <select
                                    name="class"
                                    id="Class"
                                    className={` ${style.threeFieldWidth} ${style.marginLeft20} ${style.reduceTop}`}>
                                        <option value="Per Week" >
                                        Per Month
                                        </option>
                                </select>
                            </div>
                        </div>
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>On Call Duty Duration</div>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <EditableText value="12" className={style.editableTextStyle} />
                                <div className={style.textElementWithoutBackground}>Hours</div>
                            </div>
                        </div>
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>On Call Start</div>
                            <div className={style.displayInRow}>
                                <InputGroup value="07:30" className={style.threeFieldWidth} />
                                <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop}`}>To</p>
                                <InputGroup value="17:00" className={style.threeFieldWidth} />
                            </div>
                        </div>
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>On Call Coverage Session Unit Value*</div>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElementWithoutBackground}>$</div>
                                <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                            </div>
                        </div>
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Total Contracted Service Sessions*</div>
                            <div className={style.twoCol}>
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                    <EditableText value="98" className={style.editableSessionTextStyle} />
                                    <div className={style.textElement}>120 Specified</div>
                                </div>
                                <select
                                    name="class"
                                    id="Class"
                                    className={`${style.fullWidth} `}>
                                        <option value="Per Contract Year" >
                                        Per Contract Year
                                        </option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            </div>
            <div>
                <div className={`${style.floatRight}`}>
                    <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={()=>setSendEmailNotification(true)}>ADD MORE</button>
                    <button className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE & EXIT</button>
                </div>
            </div>
        </Dialog>
        {sendEmailNotification&&(
          <SendEmailUserList  getSendEmailNotification={getSendEmailNotification} />
        )}
      </div>
    )
}

export default AddServiceProvided;
