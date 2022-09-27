import React from 'react';
import style from './index.module.scss';

const Tile = ({selectedContract, getSelectedContract, tileLabel, bigNumber, smallNum1, smallNum2, smallText1, smallText2, currentTile, topText }) => {

  let bigNumberColor = currentTile === 'active contract' ? style.green : currentTile === 'expired or terminated' ? style.red : style.yellow;
  let selectedCountColor1 = currentTile === 'expired or terminated' ? style.selectedRedCountStyle : style.selectedOrangeCountStyle;
  let countColor1 = currentTile === 'expired or terminated' ? style.redCountStyle : style.orangeCountStyle;
  return(
    <div className={`${style.cardStyle} ${selectedContract === currentTile && style.selectedContractBackground}`} onClick={() => getSelectedContract(currentTile)}>
        {
          topText !== '' && <p className={style.next30Style}>{topText}</p>
        }
        <h5 className={`${style.headingForContracts}`}>{tileLabel}</h5>
        <div className={`${style.grid2} ${style.marginTop30}`}>
            <p className={`${style.headingCountForContracts} ${bigNumberColor}`}>{bigNumber}</p>
            <div className={`${style.optionsStyle} ${style.displayInCol} ${style.reduceTop20}`}>
                <span className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.reduceTop5}`}><span className={`${selectedContract === currentTile ? selectedCountColor1 : countColor1} ${style.countDesign}`}>{smallNum1}</span>{smallText1}</span>
                <span className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.reduceTop10}`}><span className={`${selectedContract === currentTile ? style.selectedRedCountStyle : style.redCountStyle} ${style.countDesign}`}>{smallNum2}</span>{smallText2}</span>
            </div>
        </div>
    </div>
  )
}

export default Tile;
