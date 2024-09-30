import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cn from "classnames";
import {
  faPencil,
  faEraser,
  faRotateLeft,
  faRotateRight,
  faFileArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { MENU_ITEMS } from "../constant";
import { actionItemClick, menuItemClick } from "@/slice/menuSlice";
const symbols = [
  faPencil,
  faEraser,
  faRotateLeft,
  faRotateRight,
  faFileArrowDown,
];
const Menu = () => {
  const dispatch = useDispatch();
  const { activeMenuItem, actionMenuItem } = useSelector((state) => state.menu);

  const handleMenuClick = (index) => {
    if (index < 2) {
      dispatch(menuItemClick(Object.values(MENU_ITEMS)[index]));
      // console.log(Object.keys(MENU_ITEMS)[index])
    } else {
      //undo
      dispatch(actionItemClick(Object.values(MENU_ITEMS)[index]));
    }
  };
  return (
    <div className="absolute left-1/2 flex justify-between items-center w-fit gap-5 top-10 px-5 py-2  border-border1 border shadow-shadow1 bg-background1 rounded-md">
      {symbols.map((symbol, i) => (
        <div
          key={i}
          className={cn(
            "cursor-pointer h-10 w-10 flex justify-center items-center rounded-md flex-none  hover:bg-text2 active:bg-text2 transition-colors duration-150",
            activeMenuItem === Object.values(MENU_ITEMS)[i] &&
              i < 2 &&
              "bg-text2"
          )}
          onClick={() => handleMenuClick(i)}
        >
          <FontAwesomeIcon icon={symbol} className="text-text1 text-[20px]" />
        </div>
      ))}
    </div> 
  );
};

export default Menu;
