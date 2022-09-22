import React from 'react';
import style from './index.module.scss';

const Tile = ({selectedContract, getSelectedContract, tileLabel, bigNumber, smallNum1, smallNum2, smallText1, smallText2, currentTile, topText }) => {
  console.log('current Tile',currentTile, selectedContract);
  let bigNumberColor = currentTile === 'active contract' ? style.green : currentTile === 'expired or terminated' ? style.red : style.yellow;
  return(
    <div className={`${style.cardStyle} ${selectedContract === currentTile && style.selectedContractBackground}`} onClick={() => getSelectedContract(currentTile)}>
        {
          topText !== '' && <p className={style.next30Style}>{topText}</p>
        }
        <h5 className={`${style.headingForContracts}`}>{tileLabel}</h5>
        <div className={`${style.spaceBetween} ${style.marginTop30}`}>
            <p className={`${style.headingCountForContracts} ${currentTile === 'active contract' ? style.green : currentTile === 'expired or terminated' ? style.red : style.yellow}`}>{bigNumber}</p>
            <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                <span><span className={style.orange}>{smallNum1}</span>{smallText1}</span>
                <span><span className={style.red}>{smallNum2}</span>{smallText2}</span>
            </div>
        </div>
    </div>
  )
}

export default Tile;
