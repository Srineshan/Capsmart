import React, { useEffect, useState } from "react";
import style from "./index.module.scss";
import { extractNumbersFromString } from "../../utils/formatting";

const Tile = ({
  selectedContract,
  getSelectedContract,
  tileLabel,
  bigNumber,
  bigText,
  bigNumber2,
  bigText2,
  smallNum1,
  smallNum2,
  smallNum3,
  smallText1,
  smallText2,
  smallText3,
  currentTile,
  topText,
  bottomText,
  bigNumberColor,
  bigNumber1Color,
  smallNum1Color,
  smallNum2Color,
  smallNum3Color,
  smallNum1SelectedColor,
  smallNum2SelectedColor,
  smallNum3SelectedColor,
  getTabFilter
}) => {


  const [bottomTextFilter, setBottomTextFilter] = useState((bottomText?.length === 0 || bottomText === '' || bottomText === undefined) ? '' : bottomText[0])
  const [smallTextSelected, setSmallTextSelected] = useState('')
  const [selectedBottomTextFilter, setSelectedBottomTextFilter] = useState('');

  console.log(smallTextSelected)

  useEffect(() => {
    if (typeof getTabFilter === 'function') {
      getTabFilter({ bottomTextFilter: String(extractNumbersFromString(selectedBottomTextFilter)[0]), smallTextSelected: smallTextSelected })
    }
  }, [bottomTextFilter, smallTextSelected])

  useEffect(() => {
    setSmallTextSelected('')
    console.log(bottomText, 'filter')
    setBottomTextFilter((bottomText?.length === 0 || bottomText === '' || bottomText === undefined) ? '' : bottomText[0])
    setSelectedBottomTextFilter('')
  }, [selectedContract])



  const handleGetBottomTextFilter = () => {
    let index = bottomText.findIndex(str => str === bottomTextFilter)
    if (bottomText?.length - 1 === index) {
      setBottomTextFilter(bottomText[0])
      setSelectedBottomTextFilter(bottomText[0])
      // if (bottomText?.length > 1) {
      //   getTabFilter({ bottomTextFilter: String(extractNumbersFromString(bottomText[0])[0]) })
      // }
    } else {
      setBottomTextFilter(bottomText[index + 1])
      setSelectedBottomTextFilter(bottomText[index + 1])
      // if (bottomText?.length > 1) {
      //   getTabFilter({ bottomTextFilter: String(extractNumbersFromString(bottomText[index + 1])[0]) })
      // }
    }
  }

  const handleSmallTextSelected = (value) => {
    setSmallTextSelected(value)
  }
  return (
    <div
      className={`${style.cardStyle} ${selectedContract === currentTile && style.selectedContractBackground
        }`}
      onClick={() => getSelectedContract(currentTile)}
    >
      {topText !== "" && <p className={style.next30Style}>{topText}</p>}
      <div className={style.spaceBetweenColumn}>
        <div>
          <div className={`${style.headingForContracts}`}>{tileLabel}</div>
          {bottomText !== "" && (
            <div className={style.bottomTextStyle} onClick={() => handleGetBottomTextFilter()}>{bottomTextFilter}</div>
          )}
        </div>

        <div className={`${style.spaceBetween} ${style.marginBottom5} `}>
          <div className={`${style.displayInColRev}  ${style.reduceTop10}  `}>
            {bigText2 !== "" && (
              <div className={` ${style.displayInGrid}  `}>
                <div
                  className={`${style.headingCountForContracts}  ${style.verticalAlignCenter
                    }  ${bigNumber2 !== "-" ? bigNumber1Color : ""
                    } ${style.alignLeft}`}
                >
                  {bigNumber2}
                </div>
                <div
                  className={`${style.descriptionText} ${style.verticalAlignCenter} ${style.marginLeft10}`}
                >
                  {bigText2}
                </div>
              </div>
            )}
            <div
              className={`${style.displayInGrid} ${style.counterHeight} ${style.alignRight}`}
            >
              <div
                className={`${style.headingCountForContracts} ${(window.location.pathname.includes("/entitySitePortal") && selectedContract === currentTile) ? style.purple : ''} ${bigNumber !== "-" ? bigNumberColor : ""
                  } ${style.alignLeft} ${style.verticalAlignCenter}`}
              >
                {bigNumber}
              </div>
              <div
                className={`${style.descriptionText} ${style.verticalAlignCenter} ${style.marginLeft10}`}
              >
                {bigText}
              </div>
            </div>
          </div>
          <div
            className={`${style.optionsStyle} ${style.displayInCol} ${style.reduceTop10} ${style.alignRight}`}
          >
            {smallNum3 !== "" && (
              <span
                className={`${style.verticalAlignCenter}  ${style.alignRight} `} onClick={() => handleSmallTextSelected(smallText3)}
              >
                <span className={(smallTextSelected === smallText3 && selectedContract === currentTile) ? style.smallTextSelected : ''}>{smallText3}</span>
                <span
                  className={`${smallNum3 !== "-"
                    ? selectedContract === currentTile
                      ? smallNum3SelectedColor
                      : smallNum3Color
                    : style.defaultSmallNumber
                    } ${style.countDesign}`}
                >
                  {smallNum3}
                </span>
              </span>
            )}
            {smallNum1 !== "" && (
              <span
                className={`${style.verticalAlignCenter} ${style.marginTop5} ${style.alignRight}`} onClick={() => handleSmallTextSelected(smallText1)}
              >
                <span className={(smallTextSelected === smallText1 && selectedContract === currentTile) ? style.smallTextSelected : ''}>{smallText1}</span>
                <span
                  className={`${smallNum1 !== "-"
                    ? selectedContract === currentTile
                      ? smallNum1SelectedColor
                      : smallNum1Color
                    : style.defaultSmallNumber
                    } ${style.countDesign}`}
                >
                  {smallNum1}
                </span>
              </span>
            )}
            {smallNum2 !== "" && (
              <span
                className={`${style.verticalAlignCenter} ${style.marginTop5} ${style.alignRight}`} onClick={() => handleSmallTextSelected(smallText2)}
              >
                <span className={(smallTextSelected === smallText2 && selectedContract === currentTile) ? style.smallTextSelected : ''}>{smallText2}</span>
                <span
                  className={`${smallNum2 !== "-"
                    ? selectedContract === currentTile
                      ? smallNum2SelectedColor
                      : smallNum2Color
                    : style.defaultSmallNumber
                    } ${style.countDesign}`}
                >
                  {smallNum2}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default Tile;
