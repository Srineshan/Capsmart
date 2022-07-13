import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { InputGroup, Icon, Intent, TagInput, Dialog, Classes } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import DatalistInput from 'react-datalist-input';
import {Link} from 'react-router-dom';
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

    const [tags, setTags] = useState(VALUES);
    const [departmentSpecific, setDepartmentSpecific] = useState(true);
    const [showUserTable, setShowUserTable] = useState(false);
    const [selectDepartment, setSelectDepartment] = useState('');
    const [siteID, setSiteID] = useState('3578689');
    const [alertDialog, setAlertDialog] = useState(false);
    const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);
    const [showUploading, setShowUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [item, setItem] = useState();
    const [user,setUser] = useState([]);
    const accessToken = Auth();
    // const [userData,setUserData] = useState({firstName:'',lastName:'',suffix:'',title:'',email:'',phone:'',site:[],admin_access:false,roles:[]});
    const [userData,setUserData] = useState([]);
    const [userDataCSV,setUserDataCSV] = useState([]);

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

    // useEffect(()=>{
    //   getUserData();
    // },[])

    // const getUserData = () => {
    //   const user = {
    //     method: 'GET',
    //     headers: { 'Content-Type': 'application/json',
    //               'X-tenantID' : '6242845f95690b3822cb96a5',
    //               'Authorization': `Bearer ${accessToken}`}
    //     };
    //     fetch('http://ec2-54-210-154-191.compute-1.amazonaws.com/user-management-service/user', user)
    //     .then(response => response.json())
    //     .then(data => {
    //         setUser(data);
    //         console.log('data',data);
    //       return true;
    //     }
    //    )
    // }

    const options = [
        { name: 'Site 1' },
        { name: 'Site 2' },
        { name: 'Site 3' },
        { name: 'Site 4' },
        { name: 'Site 5' },
        { name: 'Site 6' },
      ];

      const onSelect = useCallback((selectedItem) => {
        setItem(selectedItem);
        setSelectDepartment('');
      }, []);

    const handleTagsAdd = values => {
        setTags([...tags, values]);
    };

    const getTagProps = (_v, index) => ({
        minimal: true,
    });

    const handleTagsRemove = (tags, index) => {
        const updatedTags = [tags];
        updatedTags.splice(index, 1);
        tags = updatedTags;
        setTags(tags);
      };

      const items = useMemo(
        () =>
          options.map((option) => ({
            id: option.name,
            value: option.name,
            ...option,
          })),
        [item],
      );

    const handleUserData = (name,value) => {
      setUserData({...userData, [name]:value});
    }

    const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event?.[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log(results.data)
        setUserDataCSV(results.data);
      },
    });
  };

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
                                            <option value="title1" >
                                            title1
                                            </option>
                                            <option value="title2" >
                                            title2
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
                                                    <Switch checked={departmentSpecific} className={` ${style.textAlignLeft}`} onChange={() => setDepartmentSpecific(!departmentSpecific)}  />
                                                }
                                                className={`${style.switchFontStyle}`}
                                                label={departmentSpecific ? 'YES' : "NO"}
                                            />
                                            {departmentSpecific && (
                                                <>
                                                    <DatalistInput items={items} placeholder="Select sites" onSelect={onSelect} onChange={(e) => {setSelectDepartment(e.target.value); setSiteID('XX689- 64768')} } className={`${style.fullWidth} ${style.marginLeft20} ${style.textAlignLeft}`} />
                                                    <div className={`${style.addSymbolStyle} ${style.marginLeft20}`}><span className={style.plusSymbolPosition}>+</span></div>
                                                </>
                                            )}
                                        </div>
                                        {selectDepartment.length !== 0 && (
                                            <div className={`${style.reqDeptCard} ${style.marginTop}`}>
                                                <div className={style.addBoxDescription}>
                                                The Department you are trying to add is not on the list.
                                                To add a new department enter the exact name below and click
                                                on the "REQUEST & ADD" button.
                                                </div>
                                                <div className={`${style.displayInRow} ${style.marginTop20}`}>
                                                    <InputGroup value="Department New" className={style.threeFieldWidth} />
                                                    <button className={`${style.reqButton} ${style.marginLeft20}`} onClick={() => {handleTagsAdd('Department New')}}>REQUEST & ADD</button>
                                                </div>
                                            </div>
                                        )}
                                        {departmentSpecific && (
                                            <TagInput
                                                placeholder="Enter tags/keywords relative to the post"
                                                values={tags}
                                                className={`${style.marginTop20} ${style.tagInputStyle}`    }
                                                onAdd={handleTagsAdd}
                                                onRemove={handleTagsRemove}
                                                separator={/[\s,]/}
                                                addOnBlur={true}
                                                addOnPaste={true}
                                                tagProps={getTagProps}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Sys admin access*</div>
                                        <FormControlLabel
                                            control={
                                                <Switch checked={true} className={` ${style.textAlignLeft}`}  />
                                            }
                                            className={`${style.switchFontStyle} ${style.fourFieldWidth}`}
                                            label={'YES'}
                                        />
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Other App Role*</div>
                                    <div className={`${style.leftAlign} `}>
                                        <select
                                            name="class"
                                            id="Class"
                                            className={style.fullWidth}
                                            value={userData.role}
                                            onChange={(e)=>handleUserData('roles',e.target.value)}>
                                                <option value="Select" >
                                                  Select
                                                </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className={style.spaceBetween}>
                                <div className={`${style.marginTop20} ${style.buttonPositionLeft}`}>
                                    <button className={style.outlinedButton}>BULK UPLOAD</button>
                                </div>
                                <div className={`${style.buttonPosition} ${style.floatRight} ${style.marginTop20}`}>
                                    <button className={style.outlinedButton}>SAVE IN-PROGRESS</button>
                                    <button className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE & ADD MORE</button>
                                    {/* <Link to={'/appSubscription'}> */}
                                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => getActiveStep('appSubscription')}>CONTINUE</button>
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
                                <p className={style.tableDataFontStyle}>{data.name.firstName}{' '}{data.name.lastName}</p>
                                <p className={style.tableDataFontStyle}>{data.name.suffix}</p>
                                <p className={style.tableDataFontStyle}>{data.title.title}</p>
                                <p className={style.tableDataFontStyle}>{data.sites?.sites?.length || 0}</p>
                                <p className={style.tableDataFontStyle}>{data.userType === "ADMIN"?'YES':'NO'}</p>
                                <p className={style.tableDataFontStyle}>{data.roles?.[0]?.roleName || ''}</p>
                                <p className={style.tableDataFontStyle}>Upload</p>
                            </div>
                          ))
                        }
                        </div>
                    </div>
                    <div className={` ${style.floatRight} ${style.marginTop20} ${style.marginRightForPositionButton}`}>
                        <button className={style.outlinedButton}>SAVE IN-PROGRESS</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => setAlertDialog(true)}>CONTINUE</button>
                    </div>
                </div>
            )}
            <Dialog isOpen={alertDialog} onClose={() => setAlertDialog(false)} className={`${style.cloneDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.cloneDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p className={style.extensionStyle}>SETUP ALERT</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.alertCrossStyle} onClick={() => setAlertDialog(false)}  />
                    </div>
                    <div className={style.extensionBorder}></div>
                    <p className={`${style.cloneContent} ${style.marginTop20}`}>Do you want to setup registered users for the different sites at this time?</p>
                    <div>
                        <div className={`${style.positionCenter} ${style.marginTop20}`}>
                            <button className={`${style.cloneOutlinedButton} ${style.cursorPointer} ${style.paddingTop5}`} onClick={() => setAlertDialog(false)}>NO</button>
                            <Link to={'/appSubscription'}>
                                <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer} ${style.paddingTop5}`}>YES</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Dialog>
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
