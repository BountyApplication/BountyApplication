import { useState, useEffect, useRef } from "react";

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
    const callbackRef = useRef(callback);
    const pressedRef = useRef(false);

    useEffect(() => {
      callbackRef.current = callback;
    });

    useEffect(() => {
      function downHandler({key}) {
        if(key !== targetKey) return;
        if(pressedRef.current) return; // ignores auto repeat while key is held
        pressedRef.current = true;
        setKeyPressed(true);
        if(callbackRef.current != null) callbackRef.current();
      }

      function upHandler({key}) {
        if(key !== targetKey) return;
        pressedRef.current = false;
        setKeyPressed(false);
      }

      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);

      return () => {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      }
    }, [targetKey]);

    return keyPressed;
}