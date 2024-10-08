import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, POST } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import WarningIcon from "@mui/icons-material/Warning";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import style from "./index.module.scss";
import { format } from "date-fns";
import CommonSelectField from "../CommonFields/CommonSelectField";

const TaskStatusDialog = ({ getIsOpen }) => {
  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [task, setTask] = useState([]);
  const [formDetails, setFormDetails] = useState([]);
  // const applicationId = "66fe243d635f001b562ab97a";
  const id = sessionStorage.getItem("applicationId");
  const componentRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getPreApplication();
    getApplication();
  }, []);

  const handleChange = (taskId, event) => {
    const { name, value } = event.target;
    let status = value.split('=')?.[0];
    let label = value.split('=')?.[1];
    setSelectedOption((prevState) => ({
      ...prevState,
      [taskId]: value,
    }));
    tasksendapplication(taskId, status, label);
  };
  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const handlePrintClick = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Staff Application",
    removeAfterPrint: true,
  });
  const getApplication = async () => {
    const { data: basicForm } = await GET(
      `application-management-service/application/${id}`
    );
    setFormDetails(basicForm);
  };

  const getPreApplication = async () => {
    const { data: tasks } = await GET(
      `application-management-service/application/${id}/tasks`
    );
    setTask(tasks);
  };

  const tasksendapplication = async (taskId, status, label) => {
    let data = {
      status: status,
      label: label
    };
    console.log(taskId, status, label);

    await POST(`application-management-service/application/${id}/task/${taskId}/execute`, data)
      .then(response => {
        SuccessToaster('Task Update Successfully');
        console.log(response?.data)
      })
      .catch(error => {
        ErrorToaster('Task Update Failed');
      })
  }

  return (
    <Dialog
      isOpen={getIsOpen}
      onClose={() => getIsOpen(false)}
      className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
    >
      <div>
        <div className={Classes.DIALOG_BODY}>
          <div className={style.spaceBetween}>
            <div className={style.heading}>
              Application Processing Tasks For:
            </div>
            <div className={style.displayInRow}>
              <div
                className={`${isPrintClicked && style.addStyle} ${style.alignCenter
                  } ${style.cursorPointer} ${style.marginRight}`}
              >
                <PrintOutlinedIcon
                  sx={{
                    fontSize: isPrintClicked ? 20 : 25,
                    color: isPrintClicked ? "#fff" : "#857AEF",
                  }}
                  onClick={handlePrintClick}
                />
              </div>
              <img
                src={CrossPink}
                alt="cross"
                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
                onClick={() => {
                  getIsOpen(false);
                }}
              />
            </div>
          </div>
          <div ref={componentRef} className={`${style.pagebreak}`}>
          <div className={`${style.spaceBetween}`}>
            <div className={`${style.fontstyle} ${style.marginTop10}`}>
              {formDetails?.basicDetails?.applicant?.name?.lastName}{" "}
              {formDetails?.basicDetails?.applicant?.name?.firstName},{" "}
              <span className={`${style.fontstyleassociate}`}>
                {formDetails?.basicDetails?.applicant?.applicantType} |{" "}
                {
                  formDetails?.basicDetails?.credentialingPrivilegeCategory
                    ?.credentialingCategory
                }
              </span>
            </div>
            <div className={`${style.referenceFont} ${style.marginRight30}`}>
              IT Reference info
              <ContentCopyIcon className={`${style.copyicon}`} />
            </div>
          </div>
          <div className={`${style.dialogBody}`}>
            {task?.map((taskData, index) => {
              const isNotCompleted = taskData?.taskStatus === "NOT_COMPLETED";
              const showSelect =
                taskData?.taskAction === "TASK_STATUS_UPDATE_ONLY" ||
                taskData?.taskAction === "SEND_NON_CAPSMART_FORM_INTERNAL_SOURCE_URL";
              const formattedDate = format(
                new Date(taskData?.lastModifiedDate),
                "MMM dd, yyyy"
              );
              return (
                <div
                  key={index}
                  className={`${style.gridContainer} ${style.shadowdown} ${style.marginTop}`}
                >
                  {isNotCompleted ? (
                    <WarningIcon className={style.warning} />
                  ) : (
                    <TaskAltIcon className={style.correcticon} />
                  )}
                  <div className={style.task}>{taskData?.taskName}
                  {taskData?.taskName === 'Logistics Form for IT' && <p className={style.requestForm}>Complete Request Form</p>}
                  </div>
                  <div>
                    {showSelect ? (
                      <div className={style.sentstatus}>
                        Status
                        <div>
                        <CommonSelectField
                              value={selectedOption[taskData.id] || ""}
                              onChange={(e) => handleChange(taskData.id, e)}
                              className={`${style.fullWidth}`}
                              valueList={taskData?.statusLabels
                                .filter((statusLabel) => statusLabel?.label !== taskData?.taskUpdateStatus?.label)
                                .map((statusLabel) => `${statusLabel?.status}=${statusLabel?.label}`)}
                              labelList={taskData?.statusLabels
                                .filter((statusLabel) => statusLabel?.label !== taskData?.taskUpdateStatus?.label)
                                .map((statusLabel) => `${statusLabel?.label}`)}
                              disabledList={taskData?.statusLabels
                                .filter((statusLabel) => statusLabel?.label !== taskData?.taskUpdateStatus?.label)
                                .map(() => false)}
                              firstOptionLabel={taskData?.taskUpdateStatus?.label}
                              firstOptionValue={""}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className={style.sentto}>
                        {isNotCompleted ? "Ready To Send" : taskData?.activityExecutionPromptLabel?.text} on{" "}
                        {formattedDate}
                      </div>
                    )}
                  </div>
                  <div>
                    {showSelect ? (
                      <div className={style.date}>
                        Last updated on
                        <div>{formattedDate}</div>
                      </div>
                    ) : (
                      <div
                        className={style.Resend}
                        onClick={() => tasksendapplication(taskData?.id, taskData?.statusLabels?.status, taskData?.statusLabels?.label)}
                      >
                        {isNotCompleted ? taskData?.activityExecutionPromptLabel?.text : "Resend"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default TaskStatusDialog;
