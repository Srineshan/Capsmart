import React from 'react'
import PhoneIcon from "../../images/phoneIcon.png";
import MailIcon from "../../images/mailIcon.png";
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

import style from './index.module.scss'

const ApplicationAssistanceCard = ({ user, designation, contactNumber, email }) => {
    return (
        <div className={style.applicationAssistanceCard}>
            <div className={style.forAssistance}>For Assistance Contact:</div>
            <div className={`${style.displayInRow} ${style.marginTop}`}><span className={style.nameStyle}> Nina Grealy</span></div>
            <div className={`${style.displayInRow} ${style.marginTop}`}><span className={style.contactStyle}> Administrative Assistant, Medical Affairs and Chief of Staff Office</span> </div>
            <div className={`${style.displayInRow} ${style.marginTop}`}><img src={PhoneIcon} alt="" className={style.iconStyle} /><span className={`${style.contactStyle} ${style.marginLeft}`}> +1 (519) 621-2333 EXT 2305</span> </div>
            <div className={`${style.displayInRow} ${style.marginTop} ${style.cursorPointer}`} onClick={() => window.location.href = "mailto:ngrealy@cmh.org"}><img src={MailIcon} alt="" className={style.iconStyle} /><span className={`${style.contactStyle} ${style.marginLeft} ${style.purpleText}`}> ngrealy@cmh.org</span> </div>

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
                        <ChatBubbleOutlineOutlinedIcon sx={{ color: '#7165E3', float: 'right' }} />
                    </div>
                </div>

                Nina Grealy
Administrative Assistant, Medical Affairs and Chief of Staff Office
Telephone: 519-621-2333 ext 2305
ngrealy@cmh.org
            </div> */}
        </div>
    )
}

export default ApplicationAssistanceCard;