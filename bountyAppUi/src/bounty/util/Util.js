import { useState, useEffect } from "react";

export function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
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