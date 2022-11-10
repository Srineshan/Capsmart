import React, { useState, useEffect } from 'react';
import { InputGroup, EditableText } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import DatalistInput from 'react-datalist-input';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MultiSelectDisplay from '../../Components/ReusableSmallComponents/multiSelectDisplay';

import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';

import style from './index.module.scss';

const AddonClinicFields = ({getMetaData, services, locationItems, getNewLocation, locationToAdd}) => {
    const [addOnServiceName, setAddOnServiceName] = useState('');
    const [workingPeriodFrom, setWorkingPeriodFrom] = useState('');
    const [workingPeriodTo, setWorkingPeriodTo] = useState('');
    const [additionalClinicSchedule, setAdditionalClinicSchedule] = useState(0);
    const [additionalSchedule, setAdditionalSchedule] = useState(false);
    const [totalContractedService, setTotalContractedService] = useState(0);
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [fields, setFields] = useState();
    const [showNewService, setShowNewService] = useState(false);
    const [selectedService, setSelectedService] = useState('');
    const [newServices, setNewServices] = useState([])

    const [metadata, setMetadata] = useState([]);

    useEffect(()=>{
      getFields();
    }, [locationItems])

    const getSelectedLocation = (serviceName) => {
      let location = metadata?.filter(data=>data?.allowableAddOnWorkingHours === serviceName)?.map(data=>data?.location)?.[0];
      let locationList = location?.map(location=>location?.location) || [];
      return locationList;
    }

    const removeLocation = (locationIndex) => {
      let locationTemp = metadata?.filter(data=>data?.allowableAddOnWorkingHours === selectedService)?.map(data=>data?.location)[0] || [];
      let temp = metadata;
      temp?.filter(data=>data?.allowableAddOnWorkingHours === selectedService)?.map(data=>{
        data.location = locationTemp?.filter((location,index)=>locationIndex !== index)?.map(data=>data);
      })
      setMetadata(temp)
      getFields();
    }

    const getFields = () => {
      let serviceFields = [];
      for(let i=0; i< serviceList?.length; i++){
        serviceFields.push(
          <div className={style.marginTop20} onClick={()=>setSelectedService(serviceList?.[i] || '')}>
              <FormGroup>
                  <FormControlLabel control={<Checkbox onChange={(e)=>selectService(serviceList?.[i],e.target.checked)}/>}  label={<Typography variant="body2">{serviceList?.[i]}</Typography>} />
              </FormGroup>
              <div className={`${style.addonBoxStyle}`}>
                  <div className={`${style.addManagerGrid}`}>
                      <div className={style.extentionLableStyle}>Only Allow Upon Request Approval</div>
                      <FormControlLabel
                          control={
                              <Switch className={`${style.textAlignLeft}`} onChange={()=>handleRequestApprovalChange(serviceList?.[i])}/>
                          }
                          className={`${style.switchFontStyle} ${style.flexLeft} `}
                          label={metadata?.filter(item=>item?.allowableAddOnWorkingHours === serviceList?.[i])?.map(item=>item)[0]?.allowUponRequest === true ? 'YES' : 'NO'}
                      />
                  </div>
                  <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Specify Service Facility / Location</div>
                      <div>
                          <div className={`${style.displayInRow} `}>
                              <FormControlLabel
                                  control={
                                      <Switch className={`${style.textAlignLeft}`} />
                                  }
                                  className={`${style.switchFontStyle} ${style.flexLeft} `}
                                  label={'YES'}
                              />
                              <div className={`${style.addGrid} ${style.fullWidth}`}>
                                  <DatalistInput items={locationItems} onSelect={(location)=>selectLocation(i, location, serviceList?.[i])} className={style.fullWidth} onChange={(e)=>getNewLocation(e.target.value)}/>
                                  <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                                      <AddIcon sx={{ fontSize: 25, color: 'white' }} onClick={locationToAdd}/>
                                  </div>
                              </div>
                          </div>
                          {getSelectedLocation(serviceList?.[i])?.length !== 0 &&
                            <MultiSelectDisplay values={getSelectedLocation(serviceList?.[i])} removeItem={removeLocation}/>
                          }
                      </div>
                  </div>
              </div>
          </div>
        )
      }
      setFields(serviceFields);
    }

    let serviceList = [];
    services?.filter(data=>['Clinic Blocks','Surgery Session']?.includes(data?.activityType?.activityType))?.map(data=>{
      let activityName = data?.activityType?.activityType;
      let activities = data?.activities?.map(data=>data?.activity);
      let result = `${activityName} (${activities?.map(data=>data)?.join(', ')})`
      serviceList.push(result);
      if(fields === undefined){
        getFields();
      }
    });


    const addSelectedActivities = (activity, isPresent, index) => {
      if(isPresent){
        let tempMetadata = metadata;
        tempMetadata[index] = {
          allowUponRequest:false,
          location:[],
          activities:[{activity:activity}],
          sessionAmount:'0',
          allowableAddOnWorkingHours:'',
        }
        let temp = selectedActivities;
        temp.push(activity);
        setSelectedActivities(temp);
      }else{
        setMetadata(metadata?.filter(data=>data?.activities?.[0]?.activity !== activity)?.map(data=>data));
        setSelectedActivities(selectedActivities?.filter(data=>data !== activity)?.map(data=>data));
      }
    }

    const selectLocation = (index, location, name) => {
      let locationTemp = metadata?.filter(data=>data?.allowableAddOnWorkingHours === name)?.map(data=>data?.location)[0] || [];
      if(!locationTemp.map(data=>data?.location)?.includes(location?.location)){
        let temp = metadata;
        temp?.filter(data=>data?.allowableAddOnWorkingHours === name)?.map(data=>{
          locationTemp.push({'location':location?.location});
          data.location = locationTemp;
        })
        setMetadata(temp)
      }
      getFields();
    }

    const getServiceName = (activityName, activities) => {
      // let activityName = data?.activityType?.activityType;
      // let activities = data?.activities?.map(data=>data?.activity);
      let result = `${activityName} (${activities?.map(data=>data)?.join(', ')})` || '';
      return result;
    }

    const selectService = (name, checked) => {
      console.log('checked', checked, name);
      if(checked){
        let temp = metadata;
        services?.map(data=>{
          let serviceName = getServiceName(data?.activityType?.activityType, data?.activities?.map(data=>data?.activity));
          if(serviceName === name){
            data.performingActivity = serviceName;
            temp.push(data)
          }
        })
        setMetadata(temp);
      }else{
        console.log('else', name, checked);
        let temp = metadata?.filter(data=>getServiceName(data?.activityType?.activityType, data?.activities?.map(data=>data?.activity)) !== name)?.map(data=>data);
        console.log('temp', temp);
        setMetadata(temp);
      }
      getFields();
    }

    console.log('metadata', metadata);

    const handleRequestApprovalChange = (name) => {
      let temp = metadata;
      temp?.filter(data=>data?.allowableAddOnWorkingHours === name)?.map(data=>{
        data.allowUponRequest = !data.allowUponRequest;
      })
      setMetadata(temp);
      getFields();
      console.log('temp', temp);
    }

    const handleSessionAmountChange = (name, value) => {
      let temp = metadata;
      temp?.filter(data=>data?.allowableAddOnWorkingHours === name)?.map(data=>{
        data.sessionAmount = value;
      })
      setMetadata(temp);
      getFields();
    }

    const limit5 = 5;

    return (
        <div>
        {fields}
            <div className={style.marginTop20}>
                <FormGroup>
                    <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2">Individual Elective Surgery case</Typography>} />
                </FormGroup>
                <div className={`${style.addonBoxStyle}`}>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>ADD-ON Payment Rate*</div>
                        <div className={`${style.displayInRow}`}>
                            <div className={`${style.threeFieldWidth}`}>
                                <TextField
                                    size="small"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>
                                    }}
                                />
                            </div>
                            <div className={style.verticalAlignCenter}>
                                <p className={`${style.extentionLableStyle} ${style.marginLeft20}`}>Per Hour</p>
                            </div>
                        </div>
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Allowable Add-On Working Hours*</div>
                        <div className={style.twoCol}>
                            <FormGroup className={`${style.marginLeft10}`}>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">During Normal Working Hours</Typography>} />
                            </FormGroup>
                            <FormGroup className={`${style.marginLeft10}`}>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">After Working Hours</Typography>} />
                            </FormGroup>
                        </div>
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Specify Service Facility / Location</div>
                        <div>
                            <div className={`${style.displayInRow} `}>
                                <FormControlLabel
                                    control={
                                        <Switch className={`${style.textAlignLeft}`} />
                                    }
                                    className={`${style.switchFontStyle} ${style.flexLeft} `}
                                    label={'YES'}
                                />
                                <div className={`${style.addGrid} ${style.fullWidth}`}>
                                    <DatalistInput items={[]} onSelect={() => {}} className={style.fullWidth} />
                                    <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                                        <AddIcon sx={{ fontSize: 25, color: 'white' }} />
                                    </div>
                                </div>
                            </div>
                            <MultiSelectDisplay values={['Location 1']} />
                        </div>
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Additional Details*</div>
                        <div>
                            <FormGroup className={`${style.marginLeft10}`}>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">Require patient data</Typography>} />
                            </FormGroup>
                            <FormGroup className={`${style.marginLeft10}`}>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">Prior Pre-Authorisation Required</Typography>} />
                            </FormGroup>
                            <FormGroup className={`${style.marginLeft10}`}>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">Require Reason For Add-On Service</Typography>} />
                            </FormGroup>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${style.marginTop20} ${style.addAddonGrid}`}>
                <InputGroup className={style.fullWidth} placeholder="Enter Add-On Service" value={newServices?.serviceName} onChange={(e)=>setNewServices({...newServices, serviceName: e.target.value})}/>
                <div className={`${style.addAddonServiceButton} ${style.alignCenter}`} onClick={()=>setShowNewService(true)}>ADD ADD-ON SERVICES</div>
            </div>

          {showNewService &&
            <div className={`${style.addonAddBox} ${style.marginTop20}`}>
                <div className={`${style.addManagerGrid}`}>
                    <div className={style.extentionLableStyle}>Add-On Service Name*</div>
                    <InputGroup value={addOnServiceName} className={style.fullWidth} />
                </div>

                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>ADD-ON Payment Rate*</div>
                    <div className={`${style.displayInRow}`}>
                        <div className={`${style.threeFieldWidth}`}>
                            <TextField
                                size="small"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>
                                }}
                            />
                        </div>
                        <div className={style.verticalAlignCenter}>
                            <p className={`${style.extentionLableStyle} ${style.marginLeft20}`}>Per Hour</p>
                        </div>
                    </div>
                </div>

                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Allowable Add-On Working Hours*</div>
                    <div className={style.twoCol}>
                        <FormGroup className={`${style.marginLeft10}`}>
                            <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">During Normal Working Hours</Typography>} />
                        </FormGroup>
                        <FormGroup className={`${style.marginLeft10}`}>
                            <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">After Working Hours</Typography>} />
                        </FormGroup>
                    </div>
                </div>

                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Specify Service Facility / Location</div>
                    <div>
                        <div className={`${style.displayInRow} `}>
                            <FormControlLabel
                                control={
                                    <Switch className={`${style.textAlignLeft}`} />
                                }
                                className={`${style.switchFontStyle} ${style.flexLeft} `}
                                label={'YES'}
                            />
                            <div className={`${style.addGrid} ${style.fullWidth}`}>
                                <DatalistInput items={[]} onSelect={() => {}} className={style.fullWidth} />
                                <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                                    <AddIcon sx={{ fontSize: 25, color: 'white' }} />
                                </div>
                            </div>
                        </div>
                        <MultiSelectDisplay values={['Location 1']} />
                    </div>
                </div>

                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Additional Details*</div>
                    <div >
                        <div className={`${style.additionalDetails} ${style.additionalDetailsSelected} ${style.cursorPointer}`}>
                            <div className={style.alignCenter}>
                                <TaskAltIcon sx={{ color: '#7165E3' }} />
                            </div>
                            <div className={`${style.additionalDetailsTextStyle} ${style.verticalAlignCenter}`}>Require Patient Data</div>
                        </div>
                        <div className={`${style.additionalDetails} ${style.marginTop10} ${style.cursorPointer}`}>
                            <div className={style.alignCenter}>
                                <TaskAltIcon sx={{ color: '#E4E4E4' }} />
                            </div>
                            <div className={`${style.additionalDetailsTextStyle} ${style.verticalAlignCenter}`}>Administrative Approval For Payment Required</div>
                        </div>
                        <div className={`${style.additionalDetails} ${style.additionalDetailsSelected} ${style.marginTop10} ${style.cursorPointer}`}>
                            <div className={style.alignCenter}>
                                <TaskAltIcon sx={{ color: '#7165E3' }} />
                            </div>
                            <div className={`${style.additionalDetailsTextStyle} ${style.verticalAlignCenter}`}>Prior Pre-Authorisation Required</div>
                        </div>
                        <div className={`${style.additionalDetails} ${style.additionalDetailsSelected} ${style.marginTop10} ${style.cursorPointer}`}>
                            <div className={style.alignCenter}>
                                <TaskAltIcon sx={{ color: '#7165E3' }} />
                            </div>
                            <div className={`${style.additionalDetailsTextStyle} ${style.verticalAlignCenter}`}>Require Reason For Add-On Service</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={`${style.twoCol} ${style.marginTop20}`}>
                        <button className={`${style.outlinedButton} ${style.fullWidth}`} >CANCEL</button>
                        <button className={`${style.buttonStyle} ${style.fullWidth}`} >SAVE</button>
                    </div>
                    <br />
                </div>
                </div>
          }

        </div>
    )
}

export default AddonClinicFields;
