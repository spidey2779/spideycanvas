/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MENU_ITEMS } from "../constant";
import { actionItemClick } from "@/slice/menuSlice";
import { socket } from "@/socket";
const Board = () => {
  const canvasRef = useRef();
  const dispatch = useDispatch();
  const { activeMenuItem, actionMenuItem } = useSelector((state) => state.menu);
  const { color, size } = useSelector((state) => state.toolbox[activeMenuItem]);
  const shouldDraw = useRef(false);
  const canBG = "white";
  const drawHistory = useRef([]);
  const historyPointer = useRef(0);
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d",{ willReadFrequently: true });
    if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
      const url = canvas.toDataURL();
      const a = document.createElement("a");
      a.href = url;
      a.download = "spideycanvas.jpg";
      a.click();
    } else if (actionMenuItem === MENU_ITEMS.UNDO) {
      console.log("undo triggered", drawHistory.current.length);
      if (historyPointer.current > 0) {
        historyPointer.current -= 1;
        const imageData = drawHistory.current[historyPointer.current];
        context.putImageData(imageData, 0, 0);
      } else {
        alert("cant undo further");
      }
    } else if (actionMenuItem === MENU_ITEMS.REDO) {
      console.log("redo triggered", drawHistory.current.length);
      if (historyPointer.current < drawHistory.current.length - 1) {
        historyPointer.current += 1;
        const imageData = drawHistory.current[historyPointer.current];
        context.putImageData(imageData, 0, 0);
      } else {
        alert("cant redo further");
      }
    }
    dispatch(actionItemClick(null));
  }, [actionMenuItem]);
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d",{ willReadFrequently: true });
    const changeConfig = (mycolor, mysize) => {
      context.strokeStyle = mycolor;
      context.lineWidth = mysize;
    };
    changeConfig(color, size);
    const handleChangeConfig = ({ color, size }) => {
      changeConfig(color, size);
    };
    socket.on("changeConfig", handleChangeConfig);
  }, [color, size]);
  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d",{ willReadFrequently: true });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.fillStyle = canBG; // Set solid background color
    context.fillRect(0, 0, canvas.width, canvas.height);
    const beginPath = (x, y) => {
      context.beginPath();
      context.moveTo(x, y);
    };
    const drawLine = (x, y) => {
      context.lineTo(x, y);
      context.stroke();
    };
    const handleMouseDown = (e) => {
      shouldDraw.current = true;
      beginPath(e.clientX, e.clientY);
      socket.emit("beginPath", { x: e.clientX, y: e.clientY });
    };
    const handleMouseUp = () => {
      if (!shouldDraw.current) return;
      shouldDraw.current = false;
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      drawHistory.current.push(imageData);
      historyPointer.current = drawHistory.current.length - 1;
    };
    const handleMouseMove = (e) => {
      if (!shouldDraw.current) return;
      drawLine(e.clientX, e.clientY);
      socket.emit("drawLine", { x: e.clientX, y: e.clientY });
    };
    const handleBeginPath = (path) => {
      beginPath(path.x, path.y);
    };
    const handleDrawLine = (draw) => {
      drawLine(draw.x, draw.y);
    };
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseUp);
    // socket.on('connect',()=>{
    //   console.log('socket connected : id', socket.id);
    // })
    socket.on("beginPath", handleBeginPath);
    socket.on("drawLine", handleDrawLine);
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseUp);
      socket.off("beginPath", handleBeginPath);
      socket.off("drawLine", handleDrawLine);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <canvas ref={canvasRef} className="cursor-crosshair bg-white" />;
};

export default Board;
