import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../constant";
import { changeBrushSize, changeColor } from "@/slice/toolboxSlice";
import cn from "classnames";
import { socket } from "@/socket";

const ToolBox = () => {
  const { activeMenuItem } = useSelector((state) => state.menu);
  const { size ,color } = useSelector((state) => state.toolbox[activeMenuItem]);
  const { color: pencilColor } = useSelector(
    (state) => state.toolbox["pencil"]
  );
  const dispatch = useDispatch();
  const updateBrushSize = (e) => {
    dispatch(changeBrushSize({ item: activeMenuItem, size: e.target.value }));
    socket.emit("changeConfig", { color, size: e.target.value });
  };
  const updateColor = (newColor) => {
    dispatch(changeColor({ item: activeMenuItem, color: newColor }));
    socket.emit("changeConfig", { color:newColor, size });
  };
  if (
    activeMenuItem === "undo" ||
    activeMenuItem === "redo" ||
    activeMenuItem === "download"
  ) {
    return null;
  }
  return (
    <div className="absolute p-5 top-1/4 left-5 w-64 rounded-md border shadow-shadow1 border-border1 bg-background1 ">
      {activeMenuItem === "pencil" && (
        <div className="mb-5">
          <h4 className="text-[11px] text-text1">Stroke Color</h4>
          <div className="flex mt-2 justify-between">
            {Object.values(COLORS).map((i) => (
              <div
                key={i}
                style={{ backgroundColor: i }}
                className={cn(
                  `h-5 w-5 mr-1  rounded-sm cursor-pointer  border
                  hover:border-[3px]   hover:shadow-shadow2 hover:border-border2`,
                  pencilColor === i
                    ? "border-[3px]   shadow-shadow2 border-border2"
                    : ""
                )}
                onClick={() => updateColor(i)}
              />
            ))}
          </div>
        </div>
      )}
      {(activeMenuItem === "pencil" || activeMenuItem === "eraser") && (
        <div className="mb-0">
          <h4 className="text-[11px] text-text1">
            {activeMenuItem === "eraser" ? "Eraser Size" : "Brush Size"} :{" "}
            {size}
          </h4>
          <div className="flex mt-2 justify-between relative">
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={size}
              onChange={updateBrushSize}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolBox;
