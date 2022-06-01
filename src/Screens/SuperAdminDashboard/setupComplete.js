import React, {useState} from 'react';
import { Icon, Intent, Dialog, Classes } from '@blueprintjs/core';
import {Link} from 'react-router-dom';
import SetupCompleteImg from './../../images/setupCompleteImg.png';
import Alert from './../../images/alert.png';
import style from './index.module.scss';

const SetupComplete = () => {
    const [alertDialog, setAlertDialog] = useState(false);
    return(
        <div className={style.welcomeBackground}>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} />
            <div className={style.completedContentMargin}>
                <div className={style.completedHeading}>
                Customer Setup Updated Successfully
                </div>
                <div className={style.alignCenter}>
                    <img src={SetupCompleteImg} alt="Welcome Img" className={style.setupCompleteImgStyle} />
                </div>
                <div className={style.thanksTextStyle}>Thankyou, Mr. Doel Joe</div> 

                <div className={`${style.welcomeDescription} ${style.marginTop30}`}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tristique, 
                lacus eget pulvinar aliquet, nibh turpis ultricies eros, nec scelerisque 
                ligula leo pharetra dui. Maecenas facilisis auctor sem, id eleifend mi 
                tristique vel. In vitae mattis magna. Donec faucibus lorem ac ligula elementum, 
                sit amet bibendum nisi viverra. Donec pharetra sodales nisl, sed tincidunt turpis 
                pulvinar et. Quisque sapien tortor, facilisis et efficitur in, ullamcorper non dolor. 
                Pellentesque odio magna, euismod eleifend massa nec, tincidunt consequat metus. 
                Phasellus luctus et metus nec dictum. Vivamus feugiat varius ex, dignissim gravida 
                dui accumsan sed. Proin a lorem a augue consectetur varius sit amet non sapien. 
                Nullam auctor lacus sit amet lectus efficitur bibendum. 
                </div>
                <div className={`${style.welcomeDescription} ${style.marginTop20}`}>
                Nullam mollis, urna vel pharetra tempor, sem quam condimentum tellus, consequat 
                vehicula purus urna ut turpis. Pellentesque sit amet vehicula sapien. Sed in interdum 
                quam, vitae dapibus massa. Sed condimentum pellentesque purus, pellentesque pharetra 
                nunc varius feugiat. Proin ornare tempus augue nec molestie. Nunc eu est dapibus, luctus 
                tortor sed, elementum quam. Duis convallis odio eu enim maximus ultricies in a massa. 
                Curabitur consectetur urna quam, ut tincidunt augue porttitor et. Praesent molestie 
                imperdiet augue quis facilisis. Fusce nulla eros, tempus in diam ac, porta tristique diam. 
                </div>
                <div className={`${style.welcomeDescription} ${style.marginTop20}`}>
                Praesent tristique purus mollis leo blandit, sed gravida nisi congue. Vivamus 
                suscipit lacinia tempus. Nam vitae luctus tortor, ac tempus magna. Aliquam erat
                 volutpat. In et vestibulum leo, sodales lobortis tortor. Nulla quis neque neque.
                  Aliquam erat volutpat.
                </div>
                <div className={style.marginTop50}>
                    <button className={`${style.setupCompleteButton} ${style.cursor}`}>CANCEL</button>
                    <button className={`${style.setupCompleteButton} ${style.marginLeft20} ${style.cursor}`} onClick={() => setAlertDialog(true)}>DONE & EXIT SETUP</button>
                </div>
            </div>
            <Dialog isOpen={alertDialog} onClose={() => setAlertDialog(false)} className={`${style.bulkUploadDialog}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.bulkUploadDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <div className={style.displayInRow}>
                            <img src={Alert} alt="alert" className={style.alertImgStyle} />
                            <p className={`${style.extensionStyle} ${style.marginTop10} ${style.marginLeft10}`}>SAVE IN-PROGRESS ALERT</p>
                        </div>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.alertCrossStyle} onClick={() => setAlertDialog(false)}  />
                    </div>
                    <div className={style.extensionBorder}></div>
                    <p className={`${style.descriptionHeading} ${style.marginTop30}`}>Following data are missing</p>
                    <p className={`${style.cloneContent} ${style.marginTop20} ${style.alertTextColor}`}>
                        Help lorem ipsum dolor sit amet, consectetur adipiscing elit. sed finibus quam nec 
                        tellus dictum, vitae ultrices urna porttitor. donec commodo tellus dapibus semper mattis. 
                        aenean ut massa vitae tortor consequat tristique. etiam eget condimentum sapien. morbi est 
                        ante, sagittis ac rhoncus eget, faucibus ut felis. pellentesque iaculis aliquam massa. 
                        lorem ipsum dolor sit amet, consectetur adipiscing elit. sed finibus quam nec tellus 
                        dictum.
                    </p>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <Link to={'/otpPage'}>
                            <button className={`${style.buttonStyle} ${style.marginLeft20} ${style.marginBottom20}`}>SAVE & QUIT</button>
                        </Link>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default SetupComplete;