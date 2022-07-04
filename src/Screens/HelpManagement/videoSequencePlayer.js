import React from 'react';
import { Icon, Intent, Dialog, Classes, TextArea } from "@blueprintjs/core";
import UserLogo from './../../images/userLogo.jpg';
import style from './index.module.scss';

const VideoSequencePlayerDialog = ({getShowVideoSequenceDialog}) => {
    return(
        <Dialog isOpen={getShowVideoSequenceDialog} onClose={() => getShowVideoSequenceDialog(false)} className={`${style.videoSequenceDialogBackground} ${style.videoSequenceDialog}`}>
            <div className={`${Classes.DIALOG_BODY} `}>
                <div className={style.spaceBetween}>
                    <p className={style.videoSequenceHeadingStyle}>Lorem Ipsum Dolor</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} color="#E9E9F0" className={`${style.crossStyle} ${style.marginLeft20}`} onClick={() => getShowVideoSequenceDialog(false)}  />
                </div>
                <div className={style.videoSequenceBorder}></div>
                <div className={`${style.grid4} ${style.marginTop20}`}>
                    <div>
                        <div className={style.videoPageLabel}>Uploaded Date & Time</div>
                        <div className={`${style.videoPageValue} ${style.marginTop10}`}>01-20-2022 14:03 IST</div>
                    </div>
                    <div>
                        <div className={style.videoPageLabel}>Uploaded By</div>
                        <div className={`${style.videoPageValue} ${style.marginTop10}`}>Lorem Ipsum</div>
                    </div>
                    <div>
                        <div className={style.videoPageLabel}>Type</div>
                        <div className={`${style.videoPageValue} ${style.marginTop10}`}>video</div>
                    </div>
                </div>
                <div className={`${style.grid211} ${style.marginTop20}`}>
                    <div>
                        <div className={style.videoPageLabel}>Title</div>
                        <div className={`${style.videoPageValue} ${style.marginTop10}`}>Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.</div>
                    </div>
                    <div>
                        <div className={style.videoPageLabel}>Owner/ Author</div>
                        <div className={`${style.videoPageValue} ${style.marginTop10}`}>Lorem Ipsum</div>
                    </div>
                    <div>
                        <div className={style.videoPageLabel}>Keyword</div>
                        <div className={`${style.videoPageValue} ${style.marginTop10}`}>Lorem Ipsum</div>
                    </div>
                </div>
                <div className={`${style.marginTop20}`}>
                    <div>
                        <div className={style.videoPageLabel}>Description</div>
                        <div className={`${style.videoPageValue} ${style.marginTop10}`}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus ac nisl tempor elementum. Aliquam a eros porttitor, commodo lacus eget, dapibus felis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus ac nisl tempor elementum. Aliquam a eros porttitor, commodo lacus eget, dapibus felis.</div>
                    </div>
                </div>
                <div className={`${style.lightColorBorder} ${style.marginTop40}`}></div>
                <div className={`${style.marginTop40} ${style.videoSequenceGrid}`}>
                    <div>
                        <div className={`${style.videoPageValue} ${style.marginTop10}`}>Lorem Ipsum</div>
                    </div>
                    <div>
                        <div className={style.videoPageLabel}>Video URL/Link</div>
                        <div className={`${style.videoPageValue} ${style.marginTop10}`}>https://www.youtube.com/watch?v=uyTXKK24bbY</div>
                        <div className={`${style.videoPageLabel} ${style.marginTop20}`}>0 Comments</div>
                        <div className={`${style.displayInRow} ${style.marginTop20}`}>
                            <img src={UserLogo} className={style.userLogoSmall} />
                            <div className={style.marginLeft20}>
                                <div className={`${style.videoPageValue} ${style.marginTop20}`}>Philipp Stevens</div>
                                <TextArea placeholder='Text type...' rows={4} className={`${style.fullWidth} ${style.marginTop10}`} />
                                <button className={`${style.commentButton} ${style.floatRight} ${style.marginTop10}`}>COMMENT</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default VideoSequencePlayerDialog;