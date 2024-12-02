import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';

import style from './index.module.scss';


const ValidationHeader = ({ heading, result }) => {
    return (
        <div>
            <div className={`${style.validationBoxHeader} ${style.spaceBetween} ${style.verticalAlignCenter} ${result === 'FAIL' && style.redBorder}`}>
                <div className={style.validationHeaderText}>{heading}</div>
                {result === 'PASS' ? (
                    <TaskAltOutlinedIcon style={{ color: "#14B15A" }} />
                ) : (
                    <div className={style.displayInRow}>
                        <DraftsOutlinedIcon style={{ color: "#2C2C2C" }} />
                        <div className={style.marginLeft20}>
                            <EditOutlinedIcon style={{ color: "#F94848" }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ValidationHeader;