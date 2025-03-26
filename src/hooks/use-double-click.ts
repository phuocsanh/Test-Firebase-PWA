import { useState, useCallback } from 'react';

/**
 * `useDoubleClick` is a custom React hook that detects double-click or double-tap events
 * with a specified delay. It is compatible with both desktop (mouse click) and mobile
 * (touch tap) environments.
 *
 * ### Parameters
 * - `onDoubleClick` (optional): A callback function that gets executed when a double-click
 *   or double-tap is detected. The function can receive any number of arguments (`...args`).
 * - `delay` (optional, default = 300): A number representing the maximum allowed time
 *   in milliseconds between two consecutive clicks/taps to be considered as a double-click.
 *
 * ### Returns
 * - `event`: A callback function to be used as an event handler for `onClick` or `onTouchStart`.
 *   It captures and handles click/tap events, checking the time interval between them.
 *
 * ### Usage
 *
 * ```tsx
 * import React from 'react';
 * import useDoubleClick from './utils/useDoubleClick';
 *
 * const MyComponent: React.FC = () => {
 *   const handleDoubleClick = (event: React.MouseEvent, item: any) => {
 *     alert('Double-click detected!');
 *     console.log('Double-clicked item:', item);
 *   };
 *
 *   const onDoubleClick = useDoubleClick(handleDoubleClick, 300);
 *
 *   return (
 *     <div
 *       onClick={(event) => onDoubleClick(event, { id: 1, name: 'Sample Item' })}
 *       className="p-4 border rounded cursor-pointer hover:bg-gray-100"
 *     >
 *       Double-click or double-tap on this box
 *     </div>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 *
 * ### Example
 * In the example above, `useDoubleClick` is used to detect a double-click event. If a user
 * double-clicks or double-taps on the `div`, the `handleDoubleClick` function will be invoked,
 * logging the item and showing an alert.
 *
 * ### Notes
 * - This hook is particularly useful when developing mobile-first web applications, where
 *   native double-click events may not work reliably for touch interactions.
 * - The hook uses `Date.now()` to measure time intervals between clicks/taps, making it
 *   performant and effective across different environments.
 */
function useDoubleClick(onDoubleClick?: (...args: any[]) => void, delay: number = 300) {
  const [lastClick, setLastClick] = useState<number>(0);

  const event = useCallback(
    (...args: any[]) => {
      const currentTime = Date.now();
      const tapGap = currentTime - lastClick;
      if (tapGap < delay) {
        onDoubleClick?.(...args);
      }
      setLastClick(currentTime);
    },
    [lastClick, onDoubleClick, delay]
  );

  return event;
}

export default useDoubleClick;
