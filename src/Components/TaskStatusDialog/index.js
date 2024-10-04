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

const TaskStatusDialog = ({ getIsOpen }) => {
  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [task, setTask] = useState([]);
  const [formDetails, setFormDetails] = useState([]);
  const applicationId = "66fe243d635f001b562ab97a";
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
      `application-management-service/application/${applicationId}/tasks`
    );
    setTask(tasks);
  };

  const tasksendapplication = async (taskId, status, label) => {
    let data = {
      status: status,
      label: label
    };
    console.log(taskId, status, label);

    await POST(`application-management-service/application/${applicationId}/task/${taskId}/execute`, data)
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
      ref={componentRef}
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
          {task?.map((taskData, index) => (
            <div
              key={index}
              className={`${style.gridContainer} ${style.shadowdown} ${style.marginTop}`}
            >
              {taskData?.taskStatus === "NOT_COMPLETED" ? (
                <>
                  <WarningIcon className={`${style.warning}`} />
                  <div className={`${style.task}`}>{taskData?.taskName}</div>
                  <div>
                    {taskData?.taskAction === "TASK_STATUS_UPDATE_ONLY" ||
                      taskData?.taskAction ===
                      "SEND_NON_CAPSMART_FORM_INTERNAL_SOURCE_URL" ? (
                      <div className={`${style.sentstatus}`}>
                        Status
                        <div>
                          <select
                            className={`${style.option}`}
                            name="status"
                            value={selectedOption[taskData.id] || ""}
                            onChange={(e) => handleChange(taskData.id, e)}
                          >
                            {taskData?.statusLabels.map((statusLabel, index) => (
                              <option
                                key={index}
                                value={`${statusLabel?.status}=${statusLabel?.label}`}
                                className={`${style.selectoption}`}
                              >
                                {statusLabel?.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={`${style.sentto}`}>Ready To Send</div>
                      </>
                    )}
                  </div>
                  <div>
                    {taskData?.taskAction === "TASK_STATUS_UPDATE_ONLY" ||
                      taskData?.taskAction ===
                      "SEND_NON_CAPSMART_FORM_INTERNAL_SOURCE_URL" ? (
                      <div className={`${style.date}`}>
                        Last updated on
                        <div>
                          {format(
                            new Date(taskData?.lastModifiedDate),
                            "MMM dd, yyyy"
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className={`${style.Resend}`} onClick={() => tasksendapplication(taskData?.id, taskData?.statusLabels?.status, taskData?.statusLabels?.label)}>
                        {taskData?.activityExecutionPromptLabel?.text}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <TaskAltIcon className={`${style.correcticon}`} />
                  <div className={`${style.task}`}>{taskData?.taskName}</div>
                  <div>
                    {taskData?.taskAction === "TASK_STATUS_UPDATE_ONLY" ||
                      taskData?.taskAction ===
                      "SEND_NON_CAPSMART_FORM_INTERNAL_SOURCE_URL" ? (
                      <div className={`${style.sentstatus}`}>
                        Status
                        <div>
                          <select
                            className={`${style.option}`}
                            name="status"
                            value={selectedOption[taskData.id] || ""}
                            onChange={(e) => handleChange(taskData.id, e)}
                          >
                            {taskData?.statusLabels.map((statusLabel, index) => (
                              <option
                                key={index}
                                value={`${statusLabel?.status}=${statusLabel?.label}`}
                                className={`${style.selectoption}`}
                              >
                                {statusLabel?.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className={`${style.sentto}`}>
                        {taskData?.activityExecutionPromptLabel?.text} on{" "}
                        {format(
                          new Date(taskData?.lastModifiedDate),
                          "MMM dd, yyyy"
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    {taskData?.taskAction === "TASK_STATUS_UPDATE_ONLY" ||
                      taskData?.taskAction ===
                      "SEND_NON_CAPSMART_FORM_INTERNAL_SOURCE_URL" ? (
                      <div className={`${style.date}`}>
                        Last updated on
                        <div>
                          {format(
                            new Date(taskData?.lastModifiedDate),
                            "MMM dd, yyyy"
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className={`${style.Resend}`}
                        onClick={() => {
                          console.log("Task Dataaaaaaaa" + JSON.stringify(taskData));
                          tasksendapplication(taskData?.id, taskData?.statusLabels?.status, taskData?.statusLabels?.label)
                        }}>Resend</div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  );
};

export default TaskStatusDialog;
