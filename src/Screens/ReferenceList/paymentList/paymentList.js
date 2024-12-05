import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../../Components/Navbar";
import style from "./../index.module.scss";
import { TenantID, GET, DELETE } from "../../dataSaver";
import LevelTwoHeader from "../../../Components/LevelTwoHeader";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import PrivilegeSideBar from "../common/privilegeSideBar";
import { ReferenceListActionButton } from "../common/ReferenceListActionButton";
import Typography from "@mui/material/Typography";
import PaymentListDialog from "./paymentListDialog";
import DeleteHcFolder from "./../../../images/deleteHcFolder.png";
import EditHcFolder from "./../../../images/editHcRow.png";
import { SuccessToaster, ErrorToaster } from "../../../utils/toaster";

const PaymentList = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [entityId, setEntityId] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPrivilegeCategory, setSelectedPrivilegeCategory] =
    useState("");
  const [privilegeCategories, setPrivilegeCategories] = useState([]);
  const [applicantId, setApplicantId] = useState("");
  const [paymentListData, setPaymentListData] = useState([]);
  const [editData, setEditData] = useState();
  const [isRefetch, setIsRefetch] = useState(false);

  useEffect(() => {
    getPrivilegeCategories();
    getEntity();
    fetchPaymentListData();
    console.log(editData);
  }, []);

  useEffect(() => {
    if (privilegeCategories && privilegeCategories.length > 0) {
      setSelectedPrivilegeCategory(privilegeCategories[0]?.category || "");
    }
  }, [privilegeCategories]);

  useEffect(() => {
    if (entityId) {
      getLastModifiedDate();
    }
  }, [entityId]);

  const getEntity = async () => {
    const { data: entity } = await GET(`entity-service/entity`);
    setEntityId(entity?.[0]?.id);
  };

  const getLastModifiedDate = async () => {
    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/entity/${entityId}`
    );
    const date = new Date(lastModifiedDate.departments?.lastModified);
    setLastUpdatedDate(
      `${formatInTimeZone(
        date,
        siteTimeZone(),
        "MMM d, yyyy HH:mm"
      )} ${timeZoneAbbreviation()}`
    );
  };

  const getPrivilegeCategories = async () => {
    try {
      const response = await GET("entity-service/privilege");
      setPrivilegeCategories(
        response.data.map((item) => ({
          id: item.id,
          category: item.category,
        }))
      );
    } catch (error) {
      console.error("Error fetching privilege categories:", error);
    }
  };

  const fetchPaymentListData = async () => {
    try {
      const response = await GET("entity-service/paymentAndFeeDetails");
      setPaymentListData(response.data);
    } catch (error) {
      console.error("Error fetching payment list data:", error);
    }
  };

  const handleCloseDialog = (needRefetch = false) => {
    setIsDialogOpen(false);
    if (needRefetch) fetchPaymentListData();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await DELETE(`entity-service/paymentAndFeeDetails/${id}`);
        SuccessToaster("Entry deleted successfully.");
        fetchPaymentListData();
      } catch (error) {
        ErrorToaster("Failed to delete entry.");
        console.log(error);
      }
    }
  };

  return (
    <Fragment>
      <Navbar />
      <div className={` ${style.applicantTypeBackground}`}>
        <div className={style.padding20}>
          <LevelTwoHeader
            heading="Payment List Type"
            updatedTime={`UPDATED ON ${new Date().toLocaleDateString()}`}
            path="/Screens/ReferenceList/customerAdminDashboard"
            callingFrom="Customer Admin"
            needHeader={false}
            tileType="Applicant"
            onAddClick={() => setIsDialogOpen(true)}
            onCloseLevel2={() => setIsDialogOpen(false)}
          />
          <div className={style.bigCardGrid}>
            <PrivilegeSideBar
              privilegeCategories={privilegeCategories}
              selectedTile={(id) => setApplicantId(id)}
              onSelectSite={(category) =>
                setSelectedPrivilegeCategory(category)
              }
              tileType={"privilegeCategories"}
              sideBarList={privilegeCategories}
              siteDropdown={true}
            />
            <div className={style.applicantList}>
              <div className={`${style.Tabletitle} `}>
                <Typography className={style.tableTitleContent}>
                  {selectedPrivilegeCategory}
                </Typography>
                <Typography
                  className={`${style.tableTitleContentArrow} ${style.tableTitleContent}`}
                >
                  {">"}
                </Typography>
                <Typography className={style.tableTitleContent}>
                  Applicant Form
                </Typography>
              </div>
              <div className={`${style.applicantTableContainer} `}>
                <table className={`${style.applicantTable}`}>
                  <thead className={`${style.applicantHeader}`}>
                    <tr>
                      <th>Applicant Type</th>
                      <th>Application Type</th>
                      <th>Fee</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentListData.map((item) => (
                      <tr
                        className={`${style.applicantItem} ${style.sideNonActiveBackground}`}
                        key={item.id}
                      >
                        <td>{item.applicantType?.applicantType || "N/A"}</td>
                        {item.applicationCreationType === "NEW"
                          ? "Initial Appointment"
                          : item.applicationCreationType === "REAPPOINTMENT"
                          ? "Reappointment"
                          : "N/A"}
                        <td>CAD$ {item.fee || "N/A"}</td>
                        <td className={style.actions} height="100%">
                          <img
                            src={EditHcFolder}
                            alt="Edit"
                            className={style.actionIcon}
                            onClick={() => {
                              setEditData(item);
                              setIsEdit(true);
                              setIsDialogOpen(true);
                            }}
                          />
                          <img
                            src={DeleteHcFolder}
                            alt="Delete"
                            className={style.actionIcon}
                            onClick={() => handleDelete(item.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* <ReferenceListActionButton
                button1={"Save In-Progress"}
                button2={"Mark as Done"}
              /> */}
            </div>
          </div>
        </div>
      </div>
      {isDialogOpen && (
        <PaymentListDialog
          open={isDialogOpen}
          handleClose={handleCloseDialog}
          editData={editData}
          selectedPrivilegeCategory= {selectedPrivilegeCategory}
          isEdit={isEdit}
        />
      )}
    </Fragment>
  );
};

export default PaymentList;
