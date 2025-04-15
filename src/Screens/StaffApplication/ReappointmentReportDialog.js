import React, { useState } from "react";
import { Dialog, Classes, Icon, Intent } from "@blueprintjs/core";
import style from "./index.module.scss";
import { formatFirstNameLastName } from "../../utils/formatting";
import TableTwo from "../../Components/TableDesignTwo";
import { format } from "date-fns";
import CrossPink from "../../images/crossPink.png";
import { Tooltip } from "@mui/material";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import { useNavigate } from "react-router-dom";

const ReappointmentReportDialog = ({
  open,
  onClose,
  tableData,
  applicantType,
}) => {
  const navigate = useNavigate();
  const [isPrintClicked, setIsPrintClicked] = useState(false);

  const handleNavigate = () => {
    navigate("/reportTypeOverview/staffbyTypes", {
      state: {tableData} ,
    });
  };

  const tableHeader = [
    "",
    "Staff for Reappointment",
    "Email ID",
    "Delivery Status",
    "Privilege Category",
    "Department / Division",
    "Date Sent",
    "Due Date",
  ];

  const getTableDataValues = () => {
    let No = [];
    let dotTooltipValues = [];
    let staffforReappointment = [];
    let emailId = [];
    let DeliveryStatus = [];
    let privilegeCategory = [];
    let deptDivision = [];
    let dateSent = [];
    let dueDate = [];

    tableData?.map((data) => {
      const now = new Date();
if (
  data.onGoingApplication.subStatus === "NOT_STARTED" &&
  data.onGoingApplication.completionPercentage === 0
) {
  No.push("grey");
  dotTooltipValues.push("Not Yet Started");
} else if (
  data.onGoingApplication.completionPercentage > 0 &&
  data.onGoingApplication.completionPercentage < 100
) {
  No.push("yellow");
  dotTooltipValues.push("In-Progress");
} else if (new Date(data.onGoingApplication.expiryDate) < now) {
  No.push("red");
  dotTooltipValues.push("Past Due");
} else if (
  data.onGoingApplication.subStatus === "STARTED" &&
  data.onGoingApplication.completionPercentage === 100
) {
  No.push("lightgreen");
  dotTooltipValues.push("Not Yet Submitted");
} else if (
  data.onGoingApplication.status === "COMPLETED" &&
  data.onGoingApplication.completionPercentage === 100
) {
  No.push("darkgreen");
 dotTooltipValues.push("Completed");
}
 else if (
    data.onGoingApplication.status === "DECLINED" &&
    data.onGoingApplication.completionPercentage === 100 && data.onGoingApplication.subStatus === "STARTED"
  ) {
    No.push("red");
    dotTooltipValues.push("Declined");
} 
else if (
  data.onGoingApplication.status === "REVIEW_INPROGRESS" &&
  data.onGoingApplication.completionPercentage === 100
) {
  No.push("purple");
  dotTooltipValues.push("Review In Progress");
}
else {
  No.push("grey");
  dotTooltipValues.push("Not Yet Started");
};
      staffforReappointment.push(
        `${formatFirstNameLastName(
          data?.applicant?.name?.firstName,
          data?.applicant?.name?.lastName
        )}` || " "
      );

      emailId.push(data?.applicant?.email?.officialEmail);
      const color = "darkgreen";
      DeliveryStatus.push(color);
      privilegeCategory.push(
        data?.basicDetailReferences?.credentialingAndPrivilegingCategory
          ?.name || "-"
      );
      deptDivision.push(
        `${data?.basicDetailReferences?.department?.name || ""}` +
          (data?.basicDetailReferences?.specialty?.name
            ? ` / ${data.basicDetailReferences.specialty.name}`
            : "")
      );
      dateSent.push(
        `${format(new Date(data?.reAppointmentSentDate), "MM/dd/yyyy")}`
      );
      dueDate.push(
        data?.onGoingApplication.expiryDate ? format(new Date(data?.onGoingApplication.expiryDate), "MM/dd/yyyy") : "-"
      );
    });
    return [
      { type: "dot", value: No ,tooltipValue: dotTooltipValues},
      { type: "text", value: staffforReappointment },
      { type: "text", value: emailId },
      { type: "dot", value: DeliveryStatus },
      { type: "text", value: privilegeCategory },
      { type: "text", value: deptDivision },
      { type: "text", value: dateSent },
      { type: "text", value: dueDate },
    ];
  };

  return (
    <>
      <Dialog
        isOpen={() => open()}
        onClose={() => onClose()}
        className={`${style.dialogStyle2} ${style.dialogPaddingBottom}`}
      >
        <div
          className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
        >
          <div className={style.spaceBetween}>
            <div className={`${style.heading1}`}>
              Staff Reappointments Application Status of {applicantType}
            </div>
            <div className={style.displayInRow1}>
              <div
                className={`${isPrintClicked && style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}
              >
                <Tooltip title="Print Report" arrow>
                  <PrintOutlinedIcon
                    sx={{
                      fontSize: isPrintClicked ? 20 : 25,
                      color: isPrintClicked ? "#fff" : "#06617A",
                    }}
                    onClick={handleNavigate}
                  />
                </Tooltip>
              </div>
              <Tooltip title={"Click to Close"} arrow>
                <img
                  src={CrossPink}
                  alt="cross"
                  className={`${style.crossStyle1} ${style.cursorPointer}`}
                  onClick={() => {
                    onClose();
                  }}
                />
              </Tooltip>
            </div>
          </div>

          <div>
            <TableTwo
              tableHeaderValues={tableHeader}
              tableDataValues={getTableDataValues()}
              tableData={tableData}
              gridStyle={style.applicantGrid3}
              scrollStyle={style.contractScrollStyle}
              tableSortValues={[]}
              heading={"There are no record to display"}
              onClickFunction={() => {}}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ReappointmentReportDialog;
