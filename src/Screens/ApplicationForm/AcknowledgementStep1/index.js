import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import logo from "../../../images/cambridgeHospital.png";
import { GET } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';

import style from './index.module.scss';
import CommonCheckBox from '../../../Components/CommonFields/CommonCheckBox';
import ESign from '../../../Components/ESign';

const ApplicationAcknowledgementStep1 = () => {
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate()
    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 1'} dataType={'Forms'} title={'Applicant Ackowledgement'} timeNumber={32} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        <div className={style.marginTop}>
                            <img src={logo} alt="Hospital Logo" className={`${style.logo}`} />
                            <CommonDivider />
                        </div>
                        <div className={`${style.applicantNameGrid} ${style.marginTop}`}>
                            <div className={style.labelText}>Applicant Name:</div>
                            <div className={style.valueText}>{`{Applicant Name}`}</div>
                        </div>
                        <div className={`${style.applicantNameGrid}`}>
                            <div className={style.labelText}>Applying as:</div>
                            <div className={style.valueText}>{`{Applying as}`}</div>
                        </div>
                        <div className={`${style.labelText} ${style.marginTop}`}>My making of this application and signature below indicate my understanding of and consent to the following (please note that references to Public Hospitals Act are not applicable to Homewood):</div>
                        <CommonDivider />
                        {/* <div className={`${style.descriptionStyle} ${style.marginTop}`}>
                            1. I fully recognize and agree that any misstatements in, or omissions from, this Application constitutes cause for denial of my appointment and may, at the sole discretion of the Hospital, result in a recommendation being made that my privileges be revoked or suspended or otherwise dealt with in compliance with the Public Hospitals Act (Ontario).
                        </div>
                        <div className={`${style.descriptionStyle} ${style.marginTop}`}>
                            2. I undertake to govern myself in accordance with the Public Hospitals Act (Ontario), Regulation 965 “Hospital Management” passed under the Public Hospitals Act (Ontario), the Hospital’s By-laws, the rules and regulations, other Hospital policies and the Canadian Medical Association Code of Ethics, as they may be amended from time to time.
                        </div>
                        <div className={`${style.descriptionStyle} ${style.marginTop}`}>
                            3. If I have not provided any updated information in Part H, I declare that all of the information relating to clauses Part H sections A and B of the Hospital Professional Staff By-law on file at the Hospital from my most recent application is up-to-date, accurate and unamended as of the date of this application.
                        </div>
                        <div className={`${style.descriptionStyle} ${style.marginTop}`}>
                            4. I acknowledge that if I am appointed to the Professional Staff of the Hospital:
                        </div>
                        <div className={`${style.descriptionStyle} ${style.marginTop}`}>
                            (i) any failure on my part to provide services to the Hospital in accordance with the legislation, By-laws, rules and regulations referred to in paragraph (2) above will constitute a breach of my obligations, and the Hospital may, upon consideration of the individual circumstances, remove my access to any and all Hospital resources, including limiting or restricting of operating room time, or take such actions as is reasonable, in accordance with the Public Hospitals Act (Ontario), the Hospital By-laws and rules and regulations, the Hospital’s Standardized Credentialing Policy and other Hospital policies;
                        </div>
                        <div className={`${style.descriptionStyle} ${style.marginTop}`}>
                            (ii) any failure on my part to comply with the undertakings set out in paragraph (2) above may result in my privileges being restricted, suspended, revoked or in a denial of reappointment and may, depending on the circumstances, be a matter which is reportable to the College; and
                        </div>
                        <div className={`${style.descriptionStyle} ${style.marginTop}`}>
                            (iii) the Hospital may refuse to appoint an applicant to the Professional Staff where the applicant refuses to acknowledge his or her responsibility to abide by a commitment to provide services in accordance with the privileges granted by the Board, and in accordance with the Public Hospitals Act (Ontario), the Hospital By-laws and rules and regulations and other Hospital policies.
                        </div>
                        <div className={`${style.descriptionStyle} ${style.marginTop}`}>
                            5. I agree to appear for any meetings, hearings or interviews regarding my application at my own expense.
                        </div>
                        <div className={`${style.descriptionStyle} ${style.marginTop}`}>
                            6. I authorize the Hospital, its Chief Executive Officer, Chief of Staff and designated members of the Professional Staff and their representatives to contact and consult with administrators, members of professional staffs and other hospitals or institutions with which I have been associated or affiliated, including without limitation those persons listed on this Application as references, and with other individuals and institutions, including past and present malpractice carriers and the Canadian Medical Protective Association or equivalent associations for dentists/midwives/nurses, directors of post-graduate training programs, or licensing and/or regulatory bodies, who may have information bearing on my professional competence, character and overall qualifications for the privileges for which I am applying.
                        </div>
                        <div className={`${style.descriptionStyle} ${style.marginTop}`}>
                            7. I consent to the inspection by the Hospital, its Professional Staff and their representatives of all records and documents of any kind or nature, including records, at other hospitals, similar institutions or regulatory bodies that are material to an evaluation of my professional qualifications and competence to carry out the clinical privileges requested.
                        </div>
                        <div className={`${style.descriptionStyle} ${style.marginTop}`}>
                            8. I agree to sign the Authorization and Consent to the Release of Information which is attached as Schedule B to this Application, and to continue to assist the Hospital in any way required to secure information regarding my Application and my continuing exercise of clinical privileges and membership on the Professional Staff of the Hospital.
                        </div>
                        <div className={`${style.descriptionStyle} ${style.marginTop}`}>
                            9. I understand and agree that, as an Applicant for Professional Staff membership, I have the burden of producing adequate information for the proper evaluation of my professional competence, character, ethics, and other qualifications, and for resolving any doubts about such qualifications.
                        </div>
                        <div className={`${style.descriptionStyle} ${style.marginTop}`}>
                            10. I confirm that I have not requested privileges for any procedures for which I am not qualified. I realize that certification by a board does not necessarily qualify me to perform certain procedures. However, I believe and represent that I am qualified to perform all procedures for which I have requested privileges.
                        </div>
                        <div className={`${style.descriptionStyle} ${style.marginTop}`}>
                            11. If appointed to the Professional Staff of the Hospital, I undertake:
                        </div>
                        <div className={`${style.descriptionStyle} ${style.marginTop}`}>
                            (i) to accept, where appropriate, clinical, academic and administrative responsibilities as requested by the Board following consultation with the Chief of Staff and/or Department Chief;
                        </div>
                        <div className={`${style.descriptionStyle} ${style.marginTop}`}>
                            (ii) to serve on committees or subcommittees to which I am appointed by the Board or the Medical Advisory Committee;
                        </div>
                        <div className={`${style.descriptionStyle} ${style.marginTop}`}>
                            (iii) to abide by the Corporation’s Policies as related to confidentiality of patient information and Corporation matters. I will not make statements on behalf of the Corporation to the news media or public without the express authority of the Chief executive Officer or designate; and
                        </div>
                        <div className={`${style.descriptionStyle} ${style.marginTop}`}>
                            (iv) to provide the Hospital with three months’ prior written notice of my intention to resign or otherwise limit my exercise of privileges. A failure to provide the required notice will result in the Chief of Staff notifying the College that I have failed to comply with the Hospital’s By-laws and a notation of the breach of the By-laws in my file
                        </div> */}
                        <div
                            className={style.leftAlign}
                            dangerouslySetInnerHTML={{ __html: '<p><strong>1. I fully recognize and agree that any misstatements in, or omissions from, this Application constitutes cause for denial of my appointment and may, at the sole discretion of the Hospital, result in a recommendation being made that my privileges be revoked or suspended or otherwise dealt with in compliance with the Public Hospitals Act (Ontario).</strong></p><p><br></p><p><strong>2. I undertake to govern myself in accordance with the Public Hospitals Act (Ontario), Regulation 965 “Hospital Management” passed under the Public Hospitals Act (Ontario), the Hospital’s By-laws, the rules and regulations, other Hospital policies and the Canadian Medical Association Code of Ethics, as they may be amended from time to time.</strong></p><p><br></p><p><strong>3. If I have not provided any updated information in Part H, I declare that all of the information relating to clauses Part H sections A and B of the Hospital Professional Staff By-law on file at the Hospital from my most recent application is up-to-date, accurate and unamended as of the date of this application.</strong></p><p><br></p><p><strong>4. I acknowledge that if I am appointed to the Professional Staff of the Hospital:</strong></p><p><br></p><p><strong>(i) any failure on my part to provide services to the Hospital in accordance with the legislation, By-laws, rules and regulations referred to in paragraph (2) above will constitute a breach of my obligations, and the Hospital may, upon consideration of the individual circumstances, remove my access to any and all Hospital resources, including limiting or restricting of operating room time, or take such actions as is reasonable, in accordance with the Public Hospitals Act (Ontario), the Hospital By-laws and rules and regulations, the Hospital’s Standardized Credentialing Policy and other Hospital policies;</strong></p><p><br></p><p><strong>(ii) any failure on my part to comply with the undertakings set out in paragraph (2) above may result in my privileges being restricted, suspended, revoked or in a denial of reappointment and may, depending on the circumstances, be a matter which is reportable to the College; and</strong></p><p><br></p><p><strong>(iii) the Hospital may refuse to appoint an applicant to the Professional Staff where the applicant refuses to acknowledge his or her responsibility to abide by a commitment to provide services in accordance with the privileges granted by the Board, and in accordance with the Public Hospitals Act (Ontario), the Hospital By-laws and rules and regulations and other Hospital policies.</strong></p><p><br></p><p><strong>5. I agree to appear for any meetings, hearings or interviews regarding my application at my own expense.</strong></p><p><br></p><p><strong>6. I authorize the Hospital, its Chief Executive Officer, Chief of Staff and designated members of the Professional Staff and their representatives to contact and consult with administrators, members of professional staffs and other hospitals or institutions with which I have been associated or affiliated, including without limitation those persons listed on this Application as references, and with other individuals and institutions, including past and present malpractice carriers and the Canadian Medical Protective Association or equivalent associations for dentists/midwives/nurses, directors of post-graduate training programs, or licensing and/or regulatory bodies, who may have information bearing on my professional competence, character and overall qualifications for the privileges for which I am applying.</strong></p><p><br></p><p><strong>7. I consent to the inspection by the Hospital, its Professional Staff and their representatives of all records and documents of any kind or nature, including records, at other hospitals, similar institutions or regulatory bodies that are material to an evaluation of my professional qualifications and competence to carry out the clinical privileges requested.</strong></p><p><br></p><p><strong>8. I agree to sign the Authorization and Consent to the Release of Information which is attached as Schedule B to this Application, and to continue to assist the Hospital in any way required to secure information regarding my Application and my continuing exercise of clinical privileges and membership on the Professional Staff of the Hospital.</strong></p><p><br></p><p><strong>9. I understand and agree that, as an Applicant for Professional Staff membership, I have the burden of producing adequate information for the proper evaluation of my professional competence, character, ethics, and other qualifications, and for resolving any doubts about such qualifications.</strong></p><p><br></p><p><strong>10. I confirm that I have not requested privileges for any procedures for which I am not qualified. I realize that certification by a board does not necessarily qualify me to perform certain procedures. However, I believe and represent that I am qualified to perform all procedures for which I have requested privileges.</strong></p><p><br></p><p><strong>11. If appointed to the Professional Staff of the Hospital, I undertake:</strong></p><p><br></p><p><strong>(i) to accept, where appropriate, clinical, academic and administrative responsibilities as requested by the Board following consultation with the Chief of Staff and/or Department Chief;</strong></p><p><br></p><p><strong>(ii) to serve on committees or subcommittees to which I am appointed by the Board or the Medical Advisory Committee;</strong></p><p><br></p><p><strong>(iii) to abide by the Corporation’s Policies as related to confidentiality of patient information and Corporation matters. I will not make statements on behalf of the Corporation to the news media or public without the express authority of the Chief executive Officer or designate; and</strong></p><p><br></p><p><strong>(iv) to provide the Hospital with three months’ prior written notice of my intention to resign or otherwise limit my exercise of privileges. A failure to provide the required notice will result in the Chief of Staff notifying the College that I have failed to comply with the Hospital’s By-laws and a notation of the breach of the By-laws in my file</strong></p>' }}
                        // style={{ all: "inherit" }}
                        />
                        <div className={`${style.checkGrid} ${style.marginTop}`}>
                            <CommonCheckBox checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />
                            <div>
                                <div className={`${style.descriptionStyle} ${style.marginTop10}`}>I verify that the information provided by me in this Application is true and accurate to the best of my knowledge and belief. </div>
                                <div className={`${style.descriptionStyle} ${style.marginTop10}`}>I HAVE BEEN ADVISED OF, AND HEREBY ACKNOWLEDGE, MY OBLIGATION TO ADVISE THE HOSPITAL IN WRITING IMMEDIATELY OF ANY NEW, DIFFERENT OR ADDITIONAL INFORMATION RELEVANT TO ANY OF THE QUESTIONS OR ITEMS OF INFORMATION REQUESTED IN THIS APPLICATION WHICH AT ANY TIME COMES TO MY ATTENTION.</div>
                            </div>
                        </div>
                        <ESign />
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate('/applicationForm/section1/acknowledgementStep2')} >CONTINUE</div>
                    {/* <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default ApplicationAcknowledgementStep1;