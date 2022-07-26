import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { InputGroup, Icon, Intent, TagInput, Dialog, Classes } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import DatalistInput from 'react-datalist-input';
import {Link} from 'react-router-dom';
import {GET, tenantID, POST} from './entityDataSaver';
import Step1 from './../../images/step12.png';
import Step2 from './../../images/step23.png';
import Step3 from './../../images/step34.png';
import Step4 from './../../images/step44.png';
import Step5 from './../../images/step5.png';
import CloudUpload from './../../images/cloudUpload.png';
import HourglassImg from './../../images/hourglassImg.png';
import UploadedImg from './../../images/uploadedImage.png';
import Download from './../../images/download.png';
import Dropzone from "react-dropzone";
import {Auth} from './../../utils/auth';
import { CSVLink } from "react-csv";
import Papa from 'papaparse';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';

import style from './index.module.scss';
import 'react-datalist-input/dist/styles.css';

const VALUES = ['Site 1', "Site 1", "Site", 'Site 1'];

const dropzoneStyle = {
    width: "100%",
    height: "auto",
    borderWidth: 2,
    borderColor: "rgb(102, 102, 102)",
    borderStyle: "dashed",
    borderRadius: 5,
  }

const SiteUsers = ({getActiveStep}) => {
    const [isAppUserContractor,setIsAppUserContractor] = useState(true);
    const [tags, setTags] = useState(VALUES);
    const [entityRoles,setEntityRoles] = useState([]);
    const [selectedRoles,setSelectedRoles] = useState([]);
    const [siteSpecific, setSiteSpecific] = useState(true);
    const [showUserTable, setShowUserTable] = useState(true);
    const [selectedSites, setSelectedSites] = useState([]);
    const [siteID, setSiteID] = useState('3578689');
    const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);
    const [showUploading, setShowUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [item, setItem] = useState();
    const [user,setUser] = useState([]);
    const accessToken = Auth();
    const [entitySite,setEntitySite] = useState([]);
    const [userDataCSV,setUserDataCSV] = useState([]);
    const [userData,setUserData] = useState({firstName:'',lastName:'',suffix:'',isAdmin:false,title:'',email:'',phone:''});


    const columns = [
      {
        label: "NPIN",
        key: "npin", // String-based value accessors!
      },
      {
        label: "Site Name",
        key: "site_name",
      },
      {
        label: "Site Type",
        key:"site_type",
      },
      {
        label: "Address Line",
        key:"address_line",
      },
      {
        label: "City",
        key:"city",
      },
      {
        label: "State",
        key:"state",
      },
      {
        label: "Zipcode",
        key:"zipcode",
      },
      {
        label: "Country",
        key:"country",
      },
      {
        label: "Setup Department",
        key: "setup_department",
      },
      {
        label: "Department Name",
        key: "department",
      }
    ];


    useEffect(()=>{
      getUserData();
      getSiteData();
      getRolesData();
    },[])

    const getUserData = async() => {
      const {data: users} = await GET('user-management-service/user');
      setUser(users);
      setShowUserTable(user?.length !==0?true:false);
    }

    const getSiteData = async() =>{
      const {data: data} = await GET(`entity-service/entity/${tenantID}`);
      setEntitySite(data?.sites);
    }

    const getRolesData = async() =>{
      const {data: data} = await GET(`user-management-service/roles`);
      setEntityRoles(data);
    }

    const items = useMemo(
        () =>
          entitySite?.map((option) => ({
            id: option?.id,
            value: option.siteName.siteName,
            ...option,
          })),
        [entitySite],
      );

    console.log('items',selectedSites,entitySite);
      const onSelect = (selectedItem) => {
        setItem(selectedItem)
        let temp = selectedSites;
        temp.push(selectedItem);
        setSelectedSites(temp);
      }


    const handleTagsRemove = (tags, index) => {
      setSelectedSites(selectedSites?.filter((data,indexValue)=>indexValue!==index)?.map(data=>data));
    };

    const roleItems = useMemo(
        () =>
          entityRoles?.map((option) => ({
            id: option?.id,
            value: option.roleName,
            ...option,
          })),
        [entityRoles],
      );

      const onSelectRoles = (selectedItem) => {
        setItem(selectedItem)
        let temp = selectedRoles;
        temp.push(selectedItem);
        setSelectedRoles(temp);
      }


    const handleTagsRemoveRoles = (tags, index) => {
      setSelectedRoles(selectedRoles?.filter((data,indexValue)=>indexValue!==index)?.map(data=>data));
    };


    const handleUserData = (name,value) => {
      setUserData({...userData, [name]:value});
    }

    const changeHandler = (event) => {
    Papa.parse(event?.[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log(results.data)
        setUserDataCSV(results.data);
      },
    });
  };

  const addUser = async() => {
    if(userData.firstName !== '' && userData.email !== '' && userData.phone !== '' && userData.email.includes('@') && userData.email.includes('.')){
      let data = {
        "name": {
          "firstName": userData.firstName,
          "lastName": userData.lastName,
          "suffix": userData.suffix,
        },
        "userType": userData.isAdmin ? "ADMIN" : "",
        "title": {
          "title": userData.title
        },
        "email": {
          "officialEmail": userData.email
        },
        "password": {
          "password": "admin123"
        },
        "communication": {
          "personalEmail": userData.email,
          "mobileNumber": userData.phone,
          "landlineNumber": "string"
        },
        "roles": selectedRoles,
        "tenant": {
          "tenantId": tenantID,
        },
        "sites": {
          "sites": siteSpecific ? selectedSites : entitySite,
        },
        "blocked": false
      }
    await POST('user-management-service/user/register',data)
    .then(response=>{
    SuccessToaster('User Created Successfully');
    resetValues();
    }).catch(error=>{
      ErrorToaster('Unexpected Error Creating User');
    });
    }
    else{
      ErrorToaster('First Name, Phone and valid Email fields are mandatory')
    }

  }

  const resetValues = () => {
    setUserData({firstName:'',lastName:'',suffix:'',isAdmin:false,title:'',email:'',phone:''});
    setSelectedRoles([]);
    setSelectedSites([]);
  }
    console.log('user data',userData);

    return(
        <div className={style.entitySetupBackground}>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} />
            <div className={style.stepperMargin}>
                <div className={style.stepperGrid}>
                    <div onClick={() => getActiveStep('entitySetup')}>
                        <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                            <img src={Step1} alt="Step1" className={style.stepperImgStyle} />
                        </div>
                        <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>ENTITY SETUP</p>
                    </div>
                    {/* <div>
                        <div className={`${style.stepperImgBackground} ${style.completedStepperStyle} `}>
                            <img src={Step2} alt="Step2" className={style.stepperImgStyle} />
                        </div>
                        <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>ENTITY SYSTEM ADMIN</p>
                    </div> */}
                    <div onClick={() => getActiveStep('siteInformation')}>
                        <div className={`${style.stepperImgBackground} ${style.completedStepperStyle} `}>
                            <img src={Step3} alt="Step3" className={style.stepperImgStyle} />
                        </div>
                        <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>SITES FOR APP USE</p>
                    </div>
                    <div onClick={() => getActiveStep('siteUsers')}>
                        <div className={`${style.stepperImgBackground} ${style.activeStepperStyle} `}>
                            <img src={Step4} alt="Step4" className={style.stepperImgStyle} />
                        </div>
                        <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>APP USERS</p>
                    </div>
                    <div onClick={() => getActiveStep('appSubscription')}>
                        <div className={style.stepperImgBackground}>
                            <img src={Step5} alt="Step5" className={style.stepperImgStyle} />
                        </div>
                        <p className={style.entityTextColor}>APP SUBSCRIPTION</p>
                    </div>
                </div>
                <div className={style.stepperDivider4}></div>
            </div>
            {showUserTable ? (
                <div className={style.entitySetupCardStyle}>
                    <p className={style.heading}>Add Registered Users</p>
                    <div className={style.greyBorder}></div>
                    <div className={style.entityDescription}>
                    Help lorem ipsum dolor sit amet, consectetur adipiscing elit. sed finibus
                    quam nec tellus dictum, vitae ultrices urna porttitor. donec commodo tellus
                    dapibus semper mattis. aenean ut massa vitae tortor consequat tristique. etiam
                    eget condimentum sapien. morbi est ante, sagittis ac rhoncus eget, faucibus ut
                    felis. pellentesque iaculis aliquam massa. lorem ipsum dolor sit amet, consectetur
                    adipiscing elit. sed finibus quam nec tellus dictum.
                    </div>
                    <div>
                        <div className={style.cloneBlockStyle}>
                            <div className={`${style.newContractFromCloneBoxStyle}`}>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Is App User A Contractor? *</div>
                                    <div className={style.displayInRow}>
                                        <FormControlLabel
                                            control={
                                                <Switch checked={true} className={` ${style.textAlignLeft} `}  />
                                            }
                                            className={`${style.switchFontStyle} ${style.fourFieldWidth}`}
                                            label={'YES'}
                                        />
                                        <select
                                            name="class"
                                            id="Class"
                                            className={`${style.twoFieldWidth} ${style.marginLeft20}`}>
                                                <option value="Select Contractor" >
                                                Select Contractor
                                                </option>
                                        </select>
                                        <p className={`${style.fourFieldWidth}`}></p>
                                    </div>
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Name*</div>
                                    <div className={`${style.displayInRow}`}>
                                        <InputGroup placeholder="First Name" className={`${style.fourFieldWidth}`} value={userData.firstName} onChange={(e)=>handleUserData('firstName',e.target.value)}/>
                                        <InputGroup placeholder="LAST NAME" className={`${style.fourFieldWidth} ${style.marginLeft20}`} value={userData.lastName} onChange={(e)=>handleUserData('lastName',e.target.value)}/>
                                        <InputGroup placeholder="Suffix" className={`${style.fourFieldWidth} ${style.marginLeft20}`} value={userData.suffix} onChange={(e)=>handleUserData('suffix',e.target.value)}/>
                                        <p className={`${style.fourFieldWidth}`}></p>
                                    </div>
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Functional Title *</div>
                                    <select
                                        name="class"
                                        id="Class"
                                        className={style.fullWidth}
                                        value={userData.title}
                                        onChange={(e)=>handleUserData('title',e.target.value)}>
                                            <option value="Select" >
                                            Select
                                            </option>
                                            <option value="Anesthesiologist" >
                                            Anesthesiologist
                                            </option>
                                            <option value="Cardiologist" >
                                            Cardiologist
                                            </option>
                                            <option value="Chief Medical Information" >
                                            Chief Medical Information
                                            </option>
                                            <option value="Chief Medical Officer" >
                                            Chief Medical Officer
                                            </option>
                                            <option value="Chief of Staff" >
                                            Chief of Staff
                                            </option>
                                    </select>
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Email Address*</div>
                                    <InputGroup placeholder="Email" className={`${style.twoFieldWidth}`} value={userData.email} onChange={(e)=>handleUserData('email',e.target.value)}/>
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Cell Phone</div>
                                    <InputGroup placeholder="+1 (342) 444-5505" className={`${style.twoFieldWidth}`} value={userData.phone} onChange={(e)=>handleUserData('phone',e.target.value)}/>
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Specific Site Access*</div>
                                    <div>
                                        <div className={style.displayInRow}>
                                            <FormControlLabel
                                                control={
                                                    <Switch checked={siteSpecific} className={` ${style.textAlignLeft}`} onChange={() => setSiteSpecific(!siteSpecific)}  />
                                                }
                                                className={`${style.switchFontStyle}`}
                                                label={siteSpecific ? 'YES' : "NO"}
                                            />
                                            {siteSpecific && (
                                                <>
                                                    <DatalistInput items={items} placeholder="Select sites" onSelect={onSelect} className={`${style.fullWidth} ${style.marginLeft20} ${style.textAlignLeft}`} />
                                                </>
                                            )}
                                        </div>

                                        {siteSpecific && (
                                            <TagInput
                                                placeholder="Enter tags/keywords relative to the post"
                                                values={selectedSites?.map(data=>data?.siteName?.siteName)}
                                                className={`${style.marginTop20} ${style.tagInputStyle}`}
                                                onRemove={handleTagsRemove}
                                                separator={/[\s,]/}
                                                addOnBlur={true}
                                                addOnPaste={true}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Sys admin access*</div>
                                        <FormControlLabel
                                            control={
                                                <Switch checked={userData.isAdmin} onChange={(e)=>setUserData({...userData, isAdmin:(!userData.isAdmin)})} className={` ${style.textAlignLeft}`}  />
                                            }
                                            className={`${style.switchFontStyle} ${style.fourFieldWidth}`}
                                            label={'YES'}
                                        />
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Other App Role*</div>
                                    <div>
                                            <DatalistInput items={roleItems} placeholder="Select Roles" onSelect={onSelectRoles} className={`${style.fullWidth} ${style.marginLeft20} ${style.textAlignLeft}`} />

                                            <TagInput
                                                placeholder="Enter tags/keywords relative to the post"
                                                values={selectedRoles?.map(data=>data?.roleName)}
                                                className={`${style.marginTop20} ${style.tagInputStyle}`}
                                                onRemove={handleTagsRemoveRoles}
                                                separator={/[\s,]/}
                                                addOnBlur={true}
                                                addOnPaste={true}
                                            />

                                    </div>
                                </div>
                            </div>
                            <div className={style.spaceBetween}>
                                <div className={`${style.marginTop20} ${style.buttonPositionLeft}`}>
                                    <button className={style.outlinedButton}>BULK UPLOAD</button>
                                </div>
                                <div className={`${style.buttonPosition} ${style.floatRight} ${style.marginTop20}`}>
                                    <button className={style.outlinedButton} onClick={addUser}>SAVE IN-PROGRESS</button>
                                    <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={addUser}>SAVE & ADD MORE</button>
                                    {/* <Link to={'/appSubscription'}> */}
                                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => {getActiveStep('appSubscription')}}>CONTINUE</button>
                                    {/* </Link> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={style.entitySetupCardStyle}>
                    <p className={style.heading}>Registered App Users</p>
                    <div className={`${style.floatRight} ${style.siteButtonPosition}`}>
                        <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer}`} onClick={()=> setShowUserTable(true) }>ADD USERS</button>
                        <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer}`} onClick={() => setShowBulkUploadDialog(true)}>BULK UPLOAD</button>
                    </div>
                    <div className={style.greyBorder}></div>
                    <div className={style.tableHeight}>
                        <div className={`${style.tableHeader} ${style.marginTop20}`}>
                            <p className={style.tableHeaderFontStyle}>USER NAME</p>
                            <p className={style.tableHeaderFontStyle}>SUFFIX</p>
                            <p className={style.tableHeaderFontStyle}>TITLE</p>
                            <p className={style.tableHeaderFontStyle}>SITES</p>
                            <p className={style.tableHeaderFontStyle}>SYS ADMIN</p>
                            <p className={style.tableHeaderFontStyle}>OTHER ROLE</p>
                            <p className={style.tableHeaderFontStyle}>SOURCE</p>
                        </div>
                        <div className={`${style.tableData} ${style.displayInCol}`} >
                        {
                          user?.map(data=>(
                            <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                <p className={style.tableDataFontStyle}>{data?.name?.firstName}{' '}{data?.name?.lastName}</p>
                                <p className={style.tableDataFontStyle}>{data?.name?.suffix}</p>
                                <p className={style.tableDataFontStyle}>{data?.title?.title}</p>
                                <p className={style.tableDataFontStyle}>{data?.sites?.sites?.length || 0}</p>
                                <p className={style.tableDataFontStyle}>{data?.userType === "ADMIN"?'YES':'NO'}</p>
                                <p className={style.tableDataFontStyle}>{data?.roles?.[0]?.roleName || ''}</p>
                                <p className={style.tableDataFontStyle}>Upload</p>
                            </div>
                          ))
                        }
                        </div>
                    </div>
                    <div className={` ${style.floatRight} ${style.marginTop20} ${style.marginRightForPositionButton}`}>
                        <button className={style.outlinedButton}>SAVE IN-PROGRESS</button>
                        <Link to={'/appSubscription'}>
                            <button className={`${style.buttonStyle} ${style.marginLeft20}`}>CONTINUE</button>
                        </Link>
                    </div>
                </div>
            )}
            <Dialog isOpen={showBulkUploadDialog} onClose={() => setShowBulkUploadDialog(false)} className={`${style.bulkUploadDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.bulkUploadDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p className={style.extensionStyle}>USERS BULK UPLOAD FOR CUSTOMER NAME</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.alertCrossStyle} onClick={() => setShowBulkUploadDialog(false)}  />
                    </div>
                    <div className={style.extensionBorder}></div>
                    <div className={`${style.dashborderStyle} ${style.marginTop20}`}>
                        <div className={style.alignCenter}>
                        {/* {isUploaded ? (
                            <div onClick={() => setShowUploading(false)}>
                                <img src={UploadedImg} alt="done" className={style.uploadImgStyle} />
                                <p className={style.uploadTextStyle}>
                                20 RECORDS SUCCESSFULLY UPLOADED
                                </p>
                            </div>
                        ) : showUploading ? (
                            <div onClick={() => setIsUploaded(true)}>
                                <img src={HourglassImg} alt="hourGlass" className={style.uploadImgStyle} />
                                <p className={style.uploadTextStyle}>
                                5 OF 20 RECORD PROCESSING, 1 MIN LEFT...
                                </p>
                            </div>
                        ) : !showUploading ? (
                            <div onClick={() => setShowUploading(true)}>
                                <img src={CloudUpload} alt="cloud" className={style.uploadImgStyle} />
                                <p className={style.uploadTextStyle}>
                                DRAG AND DROP, OR CLICK TO UPLOAD THE EXCEL TEMPLATE
                                </p>
                            </div>
                        ) : ''} */}
                            <Dropzone style={dropzoneStyle} accept=".csv" onDrop={acceptedFiles => changeHandler(acceptedFiles)}>
                                {({getRootProps, getInputProps}) => (
                                    <section>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} accept=".csv" />
                                        {userDataCSV?.length === 0 ? (
                                        <>
                                        <img src={CloudUpload} alt="cloud" className={style.uploadImgStyle} />
                                        <p className={style.uploadTextStyle}>
                                        DRAG AND DROP, OR CLICK TO UPLOAD THE EXCEL TEMPLATE
                                        </p>
                                        </>
                                        ) : (
                                            <>
                                                <img src={UploadedImg} alt="done" className={style.uploadImgStyle} />
                                                <p className={style.uploadTextStyle}>
                                                 RECORDS SUCCESSFULLY UPLOADED
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    </section>
                                )}
                            </Dropzone>
                        </div>
                        {isUploaded && (
                            <div className={`${style.spaceBetween} ${style.reduceMarginTop}`}>
                                <div className={style.displayInRow}>
                                    <img src={Download} alt="download" className={style.downloadImageStyle} />
                                    <p className={style.failedTesxtColor}>5 RECORDS FAILED</p>
                                </div>
                                <p className={`${style.resetStyle} ${style.marginRight20}`}>RESET AND IMPORT AGAIN</p>
                            </div>
                        )}
                    </div>
                    <div className={`${style.uploadDescription} ${style.marginTop20}`}>
                        <p className={style.descriptionHeading}>INSTRUCTIONS FOR BULK UPLOAD</p>
                        <p className={style.uploadDescriptionText}>
                            Help lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            sed finibus quam nec tellus dictum, vitae ultrices urna porttitor.
                            donec commodo tellus dapibus semper mattis. aenean ut massa vitae
                            tortor consequat tristique. etiam eget condimentum sapien. morbi
                            est ante, sagittis ac rhoncus eget, faucibus ut felis. pellentesque
                            iaculis aliquam massa. lorem ipsum dolor sit amet, consectetur
                            adipiscing elit. sed finibus quam nec tellus dictum.
                        </p>
                        <CSVLink
                      data={[]}
                      headers={columns}
                      filename={`Site Users`}
                      target="_blank"
                      className={style.m10}>
                      <button className={style.downloadBulkButtonStyle}>
                        DOWNLOAD BULK USER UPLOAD EXCEL TEMPLATE FILE
                      </button>
                    </CSVLink>
                    </div>
                    <div>
                        <div className={`${style.floatRight} ${style.marginTop20}`}>
                            <button className={`${style.buttonStyle} ${style.marginLeft20}`}  onClick={() => setShowBulkUploadDialog(false)}>{isUploaded ? 'SAVE & CONTINUE' : 'CANCEL UPLOAD'}</button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default SiteUsers;
