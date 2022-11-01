import React from 'react';
import style from './index.module.scss';

const Tile = ({selectedContract, getSelectedContract, tileLabel, bigNumber, bigText, bigNumber2, bigText2, smallNum1, smallNum2, smallText1, smallText2, currentTile, topText }) => {

  let bigNumberColor = currentTile === 'active contract' ? style.green : (currentTile === 'expired or terminated' || currentTile === "DEACTIVATED USERS" || currentTile === "INVITED USERS") ? style.red : style.purple;
  let selectedCountColor1 = currentTile === 'expired or terminated' ? style.selectedRedCountStyle : style.selectedGreenCountStyle;
  let countColor1 = currentTile === 'expired or terminated' ? style.redCountStyle : style.greenCountStyle;
  return(
    <div className={`${style.cardStyle} ${selectedContract === currentTile && style.selectedContractBackground}`} onClick={() => getSelectedContract(currentTile)}>
        {
          topText !== '' && <p className={style.next30Style}>{topText}</p>
        }
        <div className={style.spaceBetweenColumn}>
          <h5 className={`${style.headingForContracts}`}>{tileLabel}</h5>
          <div className={`${style.spaceBetween}`}>
              <div className={style.displayInColRev}>
                {bigNumber2 && (
                  <div className={style.displayInRow}>
                    <span className={`${style.headingCountForContracts} ${selectedContract === currentTile && bigNumberColor}`}>{bigNumber2}</span>
                    <span className={`${style.descriptionText} ${style.verticalAlignCenter} ${style.marginLeft10}`}>{bigText2}</span>
                  </div>
                )}
                <div className={style.displayInRow}>
                  <p className={`${style.headingCountForContracts} ${selectedContract === currentTile && bigNumberColor}`}>{bigNumber}</p>
                  <span className={`${style.descriptionText} ${style.verticalAlignCenter} ${style.marginLeft10}`}>{bigText}</span>
                </div>
              </div>
              <div className={`${style.optionsStyle} ${style.displayInCol} ${style.reduceTop20}`}>
                  {smallNum1 !== '' && (
                    <span className={`${style.displayInRow} ${style.verticalAlignCenter}`}><span className={`${selectedContract === currentTile ? selectedCountColor1 : countColor1} ${style.countDesign}`}>{smallNum1}</span>{smallText1}</span>
                  )}
                  {smallNum2 !== '' && (
                    <span className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop5}`}><span className={`${selectedContract === currentTile ? style.selectedRedCountStyle : style.redCountStyle} ${style.countDesign}`}>{smallNum2}</span>{smallText2}</span>
                  )}
              </div>
          </div>
        </div>
    </div>
  )
}

export default Tile;
