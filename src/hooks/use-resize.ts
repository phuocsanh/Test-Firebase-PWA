import { RefObject, useLayoutEffect, useState } from 'react';
/**
 * useResize
 * TODO: get width, height when resize window
 */
export const useResize = <T extends HTMLElement>(ref?: RefObject<T> | null) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const boundingClientHeight = ref?.current?.getBoundingClientRect().height;
  const boundingClientWidth = ref?.current?.getBoundingClientRect().width;

  useLayoutEffect(() => {
    function updateSize() {
      setSize({
        width: boundingClientWidth ?? window.innerWidth,
        height: boundingClientHeight ?? window.innerHeight,
      });
    }

    if (
      (size.width === 0 && size.height === 0) ||
      size.width !== boundingClientWidth ||
      size.height !== boundingClientHeight
    ) {
      updateSize();
    }

    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, [boundingClientHeight, boundingClientWidth, ref, size.height, size.width]);

  return size;
};
