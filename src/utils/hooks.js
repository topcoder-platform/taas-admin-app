import { useEffect, useRef } from "react";

/**
 * By "click" it is implied "mousedown" or "touchstart"
 *
 * @param {Object} element HTML element
 * @param {function} listener function with stable identity
 * that will be executed on click outside
 * @param {Array} deps dependencies
 * when click happens outside the element referred by ref
 */
export const useClickOutside = (element, listener, deps) => {
  useEffect(() => {
    let onClick = null;
    if (element && listener) {
      onClick = (event) => {
        if (
          document.contains(event.target) &&
          !element.contains(event.target)
        ) {
          listener();
        }
      };
      document.addEventListener("click", onClick);
    }
    return () => {
      if (onClick) {
        document.removeEventListener("click", onClick);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element, listener, ...deps]);
};

/**
 * A hook that calls effect only if dependencies or effect itself change.
 *
 * @param {function} effect function to be called
 * @param {Array} deps dependencies
 */
export const useUpdateEffect = (effect, deps) => {
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (isMountedRef.current) {
      return effect();
    } else {
      isMountedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
