import { useState, useEffect } from "react";

export function arraysEqual(a1,a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1)===JSON.stringify(a2);
}

export function toCurrency(number) {
    if(isNaN(number)) return;
    if(number == null) return;
    return `${number.toFixed(2)}€`;
}

export function useKeyPress(targetKey, callback) {
    const [keyPressed, setKeyPressed] = useState(false);

    useEffect(() => {
      if(!keyPressed) return;
      if(callback == null) return;
      callback();
    }, [keyPressed]);


    function getHandler(isPressed) {
        return ({key}) => {
            if(key !== targetKey) return;
            setKeyPressed(isPressed);
        }
    }

    const downHandler = getHandler(true);
    const upHandler = getHandler(false);

    useEffect(() => {
      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);
    
      return () => {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      }
    }, []);
        
    return keyPressed;
}