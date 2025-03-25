
import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, POST,PUT } from "../../Screens/dataSaver";
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
import jsPDF from "jspdf";

const TaskStatusDialog = ({ getIsOpen,selectedTab }) => {
  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const [selectedOption, setSelectedOption] = useState({});
  const [task, setTask] = useState([]);
  const [formDetails, setFormDetails] = useState([]);
  // const applicationId = "66fe243d635f001b562ab97a";
  const id = sessionStorage.getItem("applicationId");
  const componentRef = useRef(null);
  const [name, setName] = useState();
  const [pdfBase64, setPdfBase64] = useState(null);
  const [privilege, setPrivilege] = useState('');
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState({});
  const workModeType = sessionStorage.getItem('workModeType')
  const base64String = pdfBase64?.split(',')[1]; // Remove prefix

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getPreApplication();
    // getApplication();
  }, []);

  useEffect(() => {
    if(pdfBase64 !== null) {
    const fixedBase64 = base64String?.replace(/-/g, '+')?.replace(/_/g, '/')
    setFile(base64ToFile(fixedBase64, "generated.pdf", "application/pdf"));
    }
  }, [pdfBase64]);

   useEffect(() => {
      const fetchData = async () => {
          if (id) {
              await getApplication();
          }
      };
  
      fetchData();
  }, [id]); 

  useEffect(() => {
      if (formDetails?.basicDetails?.applicant?.name) {
          const { firstName, lastName } = formDetails.basicDetails.applicant.name;
          const formattedName = `${lastName?.charAt(0).toUpperCase() + lastName?.slice(1).toLowerCase()}, ${
              firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase() : ""
          }`;

          setName(formattedName);
          setPrivilege(formDetails?.basicDetails?.applicant?.applicantType || "-");

      }
  }, [formDetails]);

   useEffect(() => {
      if (name && privilege) {
          generatePDF();
      }
  }, [name, privilege]);

  const onClose = () => {
    getIsOpen(false);
  };

  const getApplicationMoveToNext = async () => {
      let role;
      let title;
      let isDelegate = true;
  
      // Determine role based on selectedTab and applicationType
      if (selectedTab === 'level-2') {
        if (workModeType === "Department Head") {
          role = "Department Head";
          isDelegate = false;
          title = "Dept. Head / Chief Review"
        } else {
          role = "Department Head";
          title = "Dept. Head / Chief Review"
        }
      } else if (selectedTab === 'level-3') {
        if (workModeType === "Credentialing Committee") {
          role = "Credentialing Committee";
          title = "Credentialing Committee Review";
          isDelegate = false;
        } else if (workModeType === "Chief Of Staff") {
          role = "Credentialing Committee";
          isDelegate = true;
          title = "Credentialing Committee Review";
        }
      } else if (selectedTab === 'level-4') {
        role = "Advisory Committee";
        title = "MAC Review";
      } else if (selectedTab === 'level-5') {
        role = "Board";
        title = "BOD Approval";
      } else if (selectedTab === 'level-1') {
        role = "Staff Manager";
        title = "Staff Manager Verification";
      }

      let temp = {
        role: isDelegate ? role : "",
        approvedDate: new Date().toISOString(),
        title: title
      };
  
      await PUT(`application-management-service/application/${id}/workflow/move?workflowAction=APPROVED&isDelegate=${isDelegate}`, temp)
        .then(response => {
          console.log('successfull')
          onClose()
        })
        .catch((error) => {
          console.log(error)
        });
    }

  const handleChange = (taskId, event, label) => {
    const status = event.target.value;
    console.log("status"+ status);
    console.log("label"+ typeof label);
    
    setSelectedOption((prevState) => ({
      ...prevState,
      [taskId]: status,
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
    if (tasks?.length > 0 && tasks?.every(task => task?.taskStatus === "COMPLETED")) {
      await getApplicationMoveToNext();
      console.log("MovetoStaff")
    }
    console.log("taskstate",tasks)
  };

  const tasksendapplication = async (taskId) => {
    const formData = new FormData();
    formData.append('documents', file); 
    const fileData = { fileName: `generated.pdf` };
    formData.append('files', new Blob([JSON.stringify({ ...fileData })], {
      type: "application/json"
    }));

  //  formData.append('taskStatusLabel', new Blob([JSON.stringify({ status:'', label: ''})], {
  //     type: "application/json"
  //  }));
    console.log("taskId",taskId);

    await POST(`application-management-service/application/${id}/task/${taskId}/execute`, formData)
      .then(response => {
        SuccessToaster('Task Update Successfully');
        console.log(response?.data);
        // window.location.reload();
        getPreApplication();
      })
      .catch(error => {
        ErrorToaster('Task Update Failed');
      })
  }

  const generatePDF = () => {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("User Information", 20, 20);
      doc.text(`Name: ${name}`, 20, 40);
      doc.text(`Type: ${privilege}`, 20, 60);
      doc.text("Lorem ipsum dolor sit amet, consectetur adipiscing elit.", 20, 80);
      doc.text("Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", 20, 100);
      doc.text("Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.", 20, 120);

      const generatedFileName = "generated.pdf";
      setFileName(generatedFileName);
      
      // Generate PDF as base64 string
      const pdfBase64 = doc.output('datauristring');
      setPdfBase64(pdfBase64);

      console.log("Base64:", pdfBase64, "Filename:", generatedFileName , selectedTab);
  };

 const base64ToFile = (base64String, fileName, contentType) => {
  if(base64String !== null || base64String !== "" || base64String !== undefined ) {
    const byteCharacters = atob(base64String);
    const byteArrays = [];
  
    for (let i = 0; i < byteCharacters.length; i += 512) {
        const slice = byteCharacters.slice(i, i + 512);
        const byteNumbers = new Array(slice.length);
        for (let j = 0; j < slice.length; j++) {
            byteNumbers[j] = slice.charCodeAt(j);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
    }
  
    return new File(byteArrays, fileName, { type: contentType });
  }
}

// console.log("cleanBase64",cleanBase64)


  // const isTaskClickable = (taskData) => {
  //   const dependentTasks = taskData?.constraintDependedTasks;
  //   console.log("dependentTasks" + toString.dependentTasks);
    
    
  //   // If there are no dependent tasks, the task is clickable
  //   if (!dependentTasks || dependentTasks.length === 0) {
  //     return true;
  //   }
  
  //   // Check each dependent task's status
  //   for (let i = 0; i < dependentTasks.length; i++) {
  //     // const task = dependentTasks[i]?.id
  //     if (taskData?.taskStatus !== "COMPLETED") {
  //       return false; // If any task is not completed, make it non-clickable
  //     }
  //   }
  
  //   return true; // If all tasks are completed, make it clickable
  // };

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
                    color: isPrintClicked ? "#fff" : "#06617A",
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
              {/* {formDetails?.basicDetails?.applicant?.name?.firstName},{" "}
              {formDetails?.basicDetails?.applicant?.name?.lastName}{" "} */}
              {formDetails?.basicDetails?.applicant?.name?.firstName
                ? formDetails.basicDetails.applicant.name.firstName.charAt(0).toUpperCase() + 
                  formDetails.basicDetails.applicant.name.firstName.slice(1).toLowerCase()
                : ""}{", "}
              {formDetails?.basicDetails?.applicant?.name?.lastName?.toUpperCase()}{" "}
              <span className={`${style.fontstyleassociate}`}>
                {formDetails?.basicDetails?.applicant?.applicantType} |{" "}
                {
                  formDetails?.basicDetails?.credentialingPrivilegeCategory
                    ?.credentialingCategory
                }
              </span>
            </div>
            {/* <div className={`${style.referenceFont} ${style.marginRight30}`}>
              IT Reference info
              <ContentCopyIcon className={`${style.copyicon}`} />
            </div> */}
          </div>
          <div className={`${style.dialogBody}`}>
          {task?.map((taskData, index) => {
  const isNotCompleted = taskData?.taskStatus === "NOT_COMPLETED";
  const isInProgress = taskData?.taskStatus === "INPROGRESS";
  const showSelect =
    taskData?.taskAction === "TASK_STATUS_UPDATE_ONLY" ||
    taskData?.taskAction === "SEND_NON_CAPSMART_FORM_INTERNAL_SOURCE_URL";
  
  const formattedDate = format(
    new Date(taskData?.lastModifiedDate),
    "MMM dd, yyyy"
  );

  // Get dependent tasks array or empty array if none exist
  const dependentTasks = taskData?.constraintDependedTasks || [];
  
  // Function to check if a task is incomplete
  const isTaskIncomplete = (task) => {
    return task?.taskStatus === "INPROGRESS" || task?.taskStatus === "NOT_COMPLETED";
  };

  // Check if all dependent tasks are completed
  const isDependentTaskCompleted = dependentTasks.length === 0 ? true : 
    dependentTasks.every(dependentTask => {
      // Find the parent task data using the dependent task ID
      const parentTask = task.find(t => t?.id === dependentTask?.id);
      
      // Log for debugging
      console.log({
        dependentTaskId: dependentTask?.id,
        parentTaskFound: !!parentTask,
        parentTaskStatus: parentTask?.taskStatus,
        isIncomplete: parentTask ? isTaskIncomplete(parentTask) : false
      });

      // Return true if parent task is completed (not incomplete)
      return parentTask ? !isTaskIncomplete(parentTask) : false;
    });

  console.log('Task ID:', taskData?.id, 'Dependent tasks completed:', isDependentTaskCompleted);
                  // if (dependentTasks && dependentTasks.length > 0) {
                  //   isDependentTaskCompleted = dependentTasks.every(task => task?.id && task?.taskStatus === "COMPLETED");
                  // }

                  // const isDependentTaskCompleted = () => {
                  //   const dependentTasks = taskData?.constraintDependedTasks;
                    
                  //   // If no dependent tasks, allow interaction
                  //   if (!dependentTasks || dependentTasks.length === 0) {
                  //     return true;
                  //   }
                  
                  //   // Check if any dependent task is not completed
                  //   for (let i = 0; i < dependentTasks.length; i++) {
                  //     const task = dependentTasks[i];
                  //     if (task?.id && task?.taskUpdateStatus?.status !== "COMPLETED_OR_DONE") {
                  //       return true; // Found an incomplete dependent task
                  //     }
                  //   }
                    
                  //   return true; // All dependent tasks are completed
                  // };


              return (
                <div
                  key={index}
                  className={`${style.gridContainer} ${style.shadowdown} ${style.marginTop}`}
                  style={{ pointerEvents: isDependentTaskCompleted ? "auto" : "none", opacity: isDependentTaskCompleted  ? 1 : 0.5 }}
                >
               {isNotCompleted ? (
                      <WarningIcon className={style.warning} />
                    ) : isInProgress ? (
                      <WarningIcon className={style.progress} />
                    ) : (
                      <TaskAltIcon className={style.correcticon} />
                    )}
                  <div className={style.task}>{taskData?.taskName}
                  {taskData?.taskName === 'Logistics Form for IT' && <div className={style.requestForm} onClick={() => window.open(taskData?.formLink?.url, '_blank')}>{taskData?.formLink?.urlLabel?.text}</div>}
                  </div>
                  <div>
                    {showSelect ? (
                      <div className={style.sentstatus}>
                        Status
                        <div>
                        <CommonSelectField
                              value={selectedOption[taskData.id] || taskData?.taskUpdateStatus?.status}
                              onChange={(e) => handleChange(taskData.id, e ,taskData?.statusLabels?.filter((data) => e.target.value === data.status)?.map((statusLabel) => statusLabel?.label)?.[0])}
                              className={`${style.fullWidth}`}
                              valueList={taskData?.statusLabels.map((statusLabel) => `${statusLabel?.status}`)}
                              labelList={taskData?.statusLabels.map((statusLabel) => `${statusLabel?.label}`)}
                              disabledList={taskData?.statusLabels.map(() => false)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className={style.sentto}>
                        {isNotCompleted ? "Ready To Send" : `${taskData?.activityExecutionPromptLabel?.text} on ${formattedDate}`}
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
                        onClick={() => tasksendapplication(taskData?.id)}
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
