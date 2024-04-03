import React, { useState, useEffect } from "react";
import { Icon, Intent } from "@blueprintjs/core";
import Doctor from "./../../images/doctor.png";
import DoctorTeam from "./../../images/doctorTeam.png";
import HighlightedDoctor from "./../../images/highlightedDoctor.png";
import HighlightedDoctorTeam from "./../../images/highlightedDoctorTeam.png";
import style from "./index.module.scss";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import { GET } from "./../dataSaver";
import CommonSelectField from "../../Components/CommonFields/CommonSelectField";
import IndividualSvg from "../../images/Individual.svg";
import MultipleSvg from "../../images/Multiple.svg";
import EmployeeSvg from "../../images/Employed_Staff_Agreement.svg";

const AddContract = ({
  getAddContract,
  getNewContract,
  getContractType,
  getSelectedContractType,
  getMethod,
}) => {
  const [selectedContract, setSelectedContract] = useState("0");
  const [selectedPriorContractId, setSelectedPriorContractId] = useState("0");
  const [contractTypeIfExisting, setContractTypeIfExisting] = useState({ id: '', value: '' });
  const [selectedContractOnClick, setSelectedContractOnClick] = useState("");
  const [contractType, setContractType] = useState({ id: '', value: '' });
  const [isEmployeeContractNeeded, setIsEmployeeContractNeeded] = useState(sessionStorage?.getItem('isEmployeeContractNeeded'))
  const [contractTypeList, setContractTypeList] = useState([]);
  const [activeContractList, setActiveContractList] = useState([]);
  const handleNext = () => {
    if (selectedContract === "0" || contractType === "") {
      ErrorToaster("Select a contract type to add");
    } else {
      getMethod("POST");
      getNewContract(true);
      getAddContract(false, true);
      getContractType(contractType?.id, contractType?.value);
      getSelectedContractType(selectedContract);
    }
  };

  useEffect(() => {
    getContractTypeList();
    getActiveContracts();
  }, [])

  const getContractTypeList = async () => {
    const { data: contractType } = await GET(
      `entity-service/contractType`
    );
    setContractTypeList(contractType);
  };

  const getActiveContracts = async () => {
    const { data: contracts } = await GET(`contract-managment-service/contracts?limit=200&tab=activecontracts`);
    setActiveContractList(contracts?.contractList);
  };

  const handleExistingContract = (id) => {
    setSelectedPriorContractId(id);
    let existingContract = activeContractList?.filter(data => data?.contractDetail?.contractId?.id === id)?.map(data => data)[0]
    setContractType({ id: existingContract?.contractTypeId?.id, value: existingContract?.contractType });
    sessionStorage.setItem('contractType', existingContract?.contractType)
    sessionStorage.setItem('existingContractId', existingContract?.id)
  }

  console.log('contract type', contractType)

  return (
    <div className={`${style.welcomePadding} ${style.addContractBody}`}>
      <div className={style.spaceBetween}>
        <p className={style.welcomeStyle}>Welcome to the Add Contract Wizard</p>
        <Icon
          icon="cross"
          size={25}
          intent={Intent.DANGER}
          className={style.crossStyle}
          onClick={() => getAddContract(false)}
        />
      </div>
      <div className={style.welcomeBorder}></div>
      <div className={style.welcomeMessage}>
        This wizard will guide you step by step for adding a new contract for
        your entity or site. Follow the prompts and make the necessary selection
        in order to proceed to the next steps.
      </div>
      <div className={style.flexCenter}>
        <div className={style.contractOptions}>
          <div className={`${style.positionCenter}`}>
            <p className={style.selectLable}>Select the Contract type to add</p>
            <CommonSelectField
              value={selectedContract || "0"}
              onChange={(e) => setSelectedContract(e.target.value)}
              className={`${style.addContractTextFieldWidth} ${style.marginLeft20}`}
              firstOptionLabel={"Select..."}
              firstOptionValue={"0"}
              valueList={[
                "New Contract",
                "Renewal Contract",
                "Existing Contract",
              ]}
              labelList={[
                "New Contract with No Prior Contract(s) with Entity",
                "Contracted Services Continuation Renewal Contract",
                "Existing Active Contract",
              ]}
              disabledList={[false, false, false]}
              widthValue={400}
            />
          </div>
          {selectedContract === "Existing Contract" ? (
            <div className={`${style.positionCenter} ${style.marginTop20}`}>
              <p className={style.selectLable}>Select the Prior Contract Id</p>
              <CommonSelectField
                value={selectedPriorContractId || "0"}
                onChange={(e) => handleExistingContract(e.target.value)}
                className={`${style.addContractTextFieldWidth} ${style.marginLeft20}`}
                firstOptionLabel={"Select..."}
                firstOptionValue={"0"}
                valueList={activeContractList?.map(data => data?.contractDetail?.contractId?.id)}
                labelList={activeContractList?.map(data => data?.contractDetail?.contractId?.id)}
                disabledList={activeContractList?.map(data => false)}
                widthValue={400}
              />
            </div>
          ) : (
            <>
              <div className={`${style.positionCenter} ${style.marginLeft20} `}>
                <div className={`${style.positionCenter} ${style.marginLeft20}`}>
                  {contractTypeList?.map(data => (
                    <div
                      className={`${style.contractCards} ${contractType?.value === data?.contractTypeTemplate && style.selectedContractCard
                        }`}
                      onClick={() => {
                        setSelectedContractOnClick(true);
                        setContractType({ id: data?.id, value: data?.contractTypeTemplate });
                        sessionStorage.setItem('contractType', data?.contractTypeTemplate)
                      }}
                    >
                      <div className={style.alignCenter}>
                        <div>
                          <img
                            // src={
                            //   selectedContractOnClick && contractType === data?.contractTypeTemplate
                            //     ? HighlightedDoctor
                            //     : Doctor
                            // }
                            src={(selectedContractOnClick && contractType?.value === data?.contractTypeTemplate) ? `https://app.timesmartai.com/cors/${data?.selectedIcon?.fileURL}` : `https://app.timesmartai.com/cors/${data?.icon?.fileURL}`}
                            alt="doctor"
                            className={`${style.contractCardImage} ${style.alignCenter
                              }`}
                          />
                          <div
                            className={`${style.contractCardData} ${selectedContract !== "0" ? style.activeContractText : ""
                              }`}
                          >
                            {data?.contractType}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* <div
                className={`${style.contractCards} ${contractType === "MULTIPLE" && style.selectedContractCard
                  }`}
                onClick={() => {
                  setSelectedContractOnClick(true);
                  setContractType("MULTIPLE");
                }}
              >
                <div className={style.alignCenter}>
                  <div>
                    <img
                      src={
                        contractType === "MULTIPLE" && selectedContractOnClick
                          ? HighlightedDoctorTeam
                          : DoctorTeam
                      }
                      alt="doctor"
                      className={`${style.contractCardImage} ${style.alignCenter
                        } ${selectedContract !== "0" ? "" : style.reducedOpacity
                        }`}
                    />
                    <div
                      className={`${style.contractCardData} ${selectedContract !== "0" ? style.activeContractText : ""
                        }`}
                    >
                      Multiple Contractors Contract
                    </div>
                  </div>
                </div>
              </div>
              {isEmployeeContractNeeded && <div
                className={`${style.contractCards} ${contractType === "EMPLOYEE" && style.selectedContractCard
                  }`}
                onClick={() => {
                  setSelectedContractOnClick(true);
                  setContractType("EMPLOYEE");
                }}
              >
                <div className={style.alignCenter}>
                  <div>
                    <img
                      src={
                        selectedContractOnClick && contractType === "EMPLOYEE"
                          ? HighlightedDoctor
                          : Doctor
                      }
                      alt="doctor"
                      className={`${style.contractCardImage} ${style.alignCenter
                        } ${selectedContract !== "0" ? "" : style.reducedOpacity
                        }`}
                    />
                    <div
                      className={`${style.contractCardData} ${selectedContract !== "0" ? style.activeContractText : ""
                        }`}
                    >
                      Employed Staff Agreement
                    </div>
                  </div>
                </div>
              </div>} */}
                </div>
              </div>
              {selectedContractOnClick && (
                <div
                  className={`${style.descriptionBoxStyle} ${contractType?.value === 'MULTIPLE' ? style.multipleSvgMarginLeft : ''}  ${contractType?.value === "INDIVIDUAL" ? style.individualSvgMarginLeft : ''}`}
                  style={{
                    backgroundImage: `url(${contractType?.value === 'EMPLOYEE' ? IndividualSvg : contractType?.value === 'MULTIPLE' ? MultipleSvg : EmployeeSvg})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                  }}
                >
                  <p className={style.descriptionStyle}>
                    After selecting one of the options above and clicking Next, you
                    will be guided through
                    <span className={`${style.blueColor} ${style.marginLeft20}`}>
                      the Contracts Manager wizard to help upload contracts and
                      assign the appropriate metadata.
                    </span>
                  </p>
                </div>
              )}
            </>
          )}
          {/* {selectedContractOnClick && (
            <div
              className={style.descriptionBoxStyle}
              style={{
                backgroundImage: `url(${contractType === "MULTIPLE" ? MultipleSvg : contractType === "EMPLOYEE" ? EmployeeSvg : IndividualSvg
                  })`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
              }}
            >
              <p className={style.descriptionStyle}>
                After selecting one of the options above and clicking Next, you
                will be guided through
                <span className={`${style.blueColor} ${style.marginLeft20}`}>
                  the Contracts Manager wizard to help upload contracts and
                  assign the appropriate metadata.
                </span>
              </p>
            </div>
          )} */}
        </div>
      </div>
      <div className={`${style.nextButtonPosition} ${style.marginTop20}`}>
        <button
          className={
            selectedContract !== "0" && contractType !== ""
              ? style.nextButton
              : style.nextButtonDisabled
          }
          disabled={
            selectedContract === "0" || contractType === "" ? true : false
          }
          onClick={() => {
            handleNext();
          }}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default AddContract;
