import React, { useEffect, useState } from 'react'
import PhoneIcon from "../../images/phoneIcon.png";
import MailIcon from "../../images/mailIcon.png";
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

import style from './index.module.scss'
import { Tooltip } from '@mui/material';
import { GET } from '../../Screens/dataSaver';

const ApplicationAssistanceCard = ({ user, designation, contactNumber, email }) => {
    const [smDetails, setSMDetails] = useState();
    useEffect(() => {
        getSMDetails()
    }, [])
    const getSMDetails = async () => {
        const { data: smData } = await GET(`user-management-service/user/role?role=${['Staff Manager', 'Entity Sys Admin']}`);

        setSMDetails(smData?.[0]);
    }
    return (
        <div>
            {/* <div className={`${style.forAssistance} ${style.alignRight}`}><strong>* - Mandatory Data Fields</strong></div> */}
            <div className={`${style.applicationAssistanceCard} `}>
                <div className={style.forAssistance}>For Assistance Contact:</div>
                <div className={`${style.displayInRow} ${style.marginTop}`}><span className={style.nameStyle}> {`${smDetails?.name?.firstName ? `${smDetails?.name?.firstName}` : ''} ${smDetails?.name?.lastName ? `${smDetails?.name?.lastName}` : ''}`}</span></div>
                <div className={`${style.displayInRow} ${style.marginTop}`}><span className={style.contactStyle}> Admin Asst, Medical Affairs & Chief of Staff Office</span> </div>
                <div className={`${style.displayInRow} ${style.marginTop}`}><img src={PhoneIcon} alt="" className={style.iconStyle} /><span className={`${style.contactStyle} ${style.marginLeft}`}> {smDetails?.communication?.mobileNumber}</span> </div>
                <Tooltip title="Click to send an email" arrow>
                    <div className={`${style.displayInRow} ${style.marginTop} ${style.cursorPointer}`} onClick={() => window.location.href = `mailto:${smDetails?.email?.officialEmail}`}><img src={MailIcon} alt="" className={style.iconStyle} /><span className={`${style.contactStyle} ${style.marginLeft} ${style.purpleText}`}>{smDetails?.email?.officialEmail}</span> </div></Tooltip>
                {/* <div className={`${style.displayInRow} ${style.marginTop}`}><span className={style.nameStyle}>Jane Doe</span></div>
            <div className={`${style.displayInRow} ${style.marginTop}`}><span className={style.contactStyle}> Admin Asst, Medical Affairs & Chief of Staff Office</span> </div>
            <div className={`${style.displayInRow} ${style.marginTop}`}><img src={PhoneIcon} alt="" className={style.iconStyle} /><span className={`${style.contactStyle} ${style.marginLeft}`}> +1 (416) 555-5678</span> </div>
            <div className={`${style.displayInRow} ${style.marginTop} ${style.cursorPointer}`} onClick={() => window.location.href = "mailto:ngrealy@cmh.org"}><img src={MailIcon} alt="" className={style.iconStyle} /><span className={`${style.contactStyle} ${style.marginLeft} ${style.purpleText}`}> jane@test.cap</span> </div> */}
                {/* <div className={`${style.divider} ${style.marginTop}`}></div>
            <div className={`${style.spaceBetween} ${style.marginTop}`}>
                <div>
                    <div className={`${style.aiAssistanceText}`}>OUR AI ASSISTANT</div>
                    <div className={`${style.chatWithStyle} ${style.marginTop}`}>Chat With Poppy</div>
                </div>
                <div className={`${style.phoneIconBackground} ${style.verticalAlignCenter} ${style.justifyCenter} ${style.marginTop}`}>
                    <PhoneInTalkOutlinedIcon sx={{ color: '#fff' }} />
                </div>
            </div>
            <div className={`${style.chatBox} ${style.marginTop} ${style.verticalAlignCenter}`}>
                <div className={style.fullWidth}>
                    <div className={style.spaceBetween}>
                        <div className={style.doYouHaveAQuestionStyle}>Do You Have A Question For Me?</div>
                        <ChatBubbleOutlineOutlinedIcon sx={{ color: '#06617A', float: 'right' }} />
                    </div>
                </div>

                Nina Grealy
Administrative Assistant, Medical Affairs and Chief of Staff Office
Telephone: 519-621-2333 ext 2305
ngrealy@cmh.org
            </div> */}
            </div>
        </div>
    )
}

export default ApplicationAssistanceCard;