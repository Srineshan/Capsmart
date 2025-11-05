import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../../Components/ProgressCard';
import ApplicationUserCard from '../../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../../Components/CommonFields/CommonDivider';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';
import CommonCheckBox from '../../../../Components/CommonFields/CommonCheckBox';
import DataStatusIcon from '../../../../images/dqStatus.png';
import DocumentIcon from '../../../../images/document.png';
import { GET, PUT } from '../../../dataSaver';
import { useNavigate } from 'react-router-dom';
import Pencil from "../../../../images/pencil.png";
import EditIcon from '@mui/icons-material/Edit';
import { ErrorToaster, SuccessToaster } from '../../../../utils/toaster';
import ApplicationHeader from '../../../../Components/ApplicationHeader';
import style from './index.module.scss';
import AIAssistantDialog from '../../../../Components/AIAssistantDialog';
import SaveInProgressDialog from '../../../../Components/SaveInProgressDialog';

const PODCheck = ({ basicForm, setBasicForm, applicationId }) => {
  const [form, setForm] = useState();
  const [form2, setForm2] = useState();
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true);
  const itemsToProcessConditionCheckCategories = ['Education', 'WorkExperience', 'References']
  const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
  const id = sessionStorage.getItem('applicationId');
  useEffect(() => {
    sessionStorage.setItem('fromSummary', false);
    getPreApplication();
  }, [])

  // useEffect(() => {
  //     getBasicForm()
  // }, [])

  const getIsOpen = (value) => {
    setIsOpen(value);
  }

  const getPreApplication = async () => {
    const { data: basicForm } = await GET(
      `application-management-service/application/${id}`
    );
    setForm(basicForm)
  }

  const handleContinue = () => {
    navigate(`/applicationForm/${applicationId}/${basicForm?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[0]?.formCategory}/${btoa(basicForm?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[0]?.schemaCategory)}`);
  }

  const getIsSaveInProgressOpen = (value) => {
    setIsSaveInProgressOpen(value);
  };

  console.log('form', form)

  return (
    <div>
      <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
        <div className={`${style.applicationCardStyle}  ${style.marginTop}`}>
          <div className={`${style.displayInRow}${style.marginTop20}`}>
            <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}>
              <span className={`${style.tableHeaderHeadingTextStyle}`}>Overall Status Of Data & Documents Required For This Application</span>
              <div className={`${style.greyDotStyle}`}></div>
            </div>
          </div>
          <div className={` ${style.marginTop10} ${style.tableHeaderGridStyle} `}>
            <div></div>
            <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
              <div className={form?.forms.every(item => item.acknowledged === true) ? style.greenDotStyle : style.yellowDotStyle}></div>
            </div>
            <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
              <div className={form?.forms.every(item => item.acknowledged === true) ? style.greenDotStyle : style.yellowDotStyle}></div>
            </div>
            <div></div>
          </div>
          <div className={`${style.tableHeaderStyle} ${style.marginTop10} ${style.tableHeaderGridStyle} `}>
            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
              <div className={`${style.tableHeaderTextStyle} ${style.marginLeft20}`}>POD Verification Check</div>
            </div>
            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
              <div className={`${style.tableHeaderTextStyle}`}
              >
                <img src={DataStatusIcon} alt="" style={{
                  width: "18px",
                  height: "20px"
                }} />

              </div>
            </div>
            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
              <div className={`${style.tableHeaderTextStyle}`}
              >
                <img src={DocumentIcon} alt=""
                  style={{
                    width: "18px",
                    height: "20px"
                  }} />

              </div>
            </div>
            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
              <div className={`${style.tableHeaderTextStyle}`}>Items To Address</div>
            </div>
          </div>
          <div className={`${style.tableDataStyle} ${style.marginTop5} ${style.tableValueGridStyle} `}>
            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
              <div className={`${style.marginLeft5} ${style.tableDataFontDisabledStyle1}}`}></div>
            </div>
            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
              <div className={`${style.tableDataFontStyle1}`}> Applicant Profile Information</div>
              <img src={Pencil} alt="" className={`${style.pencilImgStyle} ${style.justifyCenter} ${style.cursorPointer}`} onClick={() => { sessionStorage.setItem('fromSummary', true); navigate(`/applicationForm/${applicationId}/Form/${btoa('BasicInformation')}`); }} />
            </div>
            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
              <div className={`${style.greenDotStyle} `}></div>
            </div>
            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
              <div className={`${style.greenDotStyle} `}></div>
            </div>
            <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
            </div>
          </div>
          <div>

            {
              form?.formSchemas?.filter(data => data?.formCategory === 'Form')?.map((data, index) => (
                <div className={`${style.tableDataStyle} ${style.marginTop5} ${style.tableValueGridStyle} `}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    {index !== 0 && (
                      <div className={`${style.marginLeft5} ${style.tableDataFontDisabledStyle1}`}>{data?.description || ''}</div>
                    )}
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.tableDataFontStyle1}`}>{data?.title}</div>
                    <img src={Pencil} alt="" className={`${style.pencilImgStyle} ${style.justifyCenter} ${style.cursorPointer}`} onClick={() => { sessionStorage.setItem('fromSummary', true); navigate(`/applicationForm/${applicationId}/${data?.formCategory}/${btoa(data?.schemaCategory)}`) }} />
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    {/* <div className={`${style.greyDotStyle} `}></div> */}
                    <div className={`${form?.forms[index]?.acknowledged === true ? style.greenDotStyle : style.yellowDotStyle}`}></div>
                    {/* <div className={data?.acknowledged ? style.greenDotStyle : style.yellowDotStyle}></div> */}

                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    {/* <div className={`${style.greyDotStyle} `}></div> */}
                    <div className={`${form?.forms[index]?.acknowledged === true ? style.greenDotStyle : style.yellowDotStyle}`}></div>
                  </div>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                    <div className={`${style.marginLeft5} ${style.tableDataFontDisabledStyle1}`}>
                      {(itemsToProcessConditionCheckCategories?.includes(form?.forms?.filter(data => data?.formCategory === 'Form')[index]?.schemaCategory) && form?.forms[index]?.unFilledFields?.length !== 0) ? 'Missing mandatory fields.' : form?.forms[index]?.unFilledFields?.join(', ')}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>


        </div>
        <div className={style.marginTop}>
          <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
          <div className={style.marginTop10}>
            <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
          </div>
          <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
          <div className={style.twoColForButton}>
            <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
            <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleContinue()}>CONTINUE</div>
          </div>
          {/* <div className={style.marginTop}>
                            <ApplicationReferenceDocuments />
                        </div> */}
        </div>
        {/* {isOpen && (
                <AIAssistantDialog getIsOpen={getIsOpen} />
            )} */}
      </div>
      {isSaveInProgressOpen && (
        <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />
      )}
    </div>
  )
}

export default PODCheck;