import React, { useEffect, useState } from "react";
import style from "./index.module.scss";
import { extractNumbersFromString } from "../../utils/formatting";
import { Tooltip } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';

const TileApplication = ({
  selectedContract,
  getSelectedContract,
  tileLabel,
  tileCount,
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
      sessionStorage.setItem('bottomFilter', String(extractNumbersFromString(selectedBottomTextFilter)[0]))
    } else {
      sessionStorage.removeItem('bottomFilter')
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
      className={`${style.applicationCardStyle} ${style.alignCenter} ${selectedContract === currentTile && style.selectedContractBackground}`}
      onClick={() => getSelectedContract(currentTile)}
    >
      {topText !== "" && <p className={style.next30Style}>{topText}</p>}
      <div className={`${style.spaceBetweenColumn} ${style.padding5}`}>
        <div>
          <div className={`${style.spaceBetween}  ${selectedContract === currentTile ? style.selectedApplicationText : style.headingForContracts}`}>{tileLabel}
            <span className={style.countDesign}>{tileCount}</span>
          </div>
        </div>
      </div>
    </div >
  );
};

export default TileApplication;
