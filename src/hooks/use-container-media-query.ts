import React, { useEffect, useState } from 'react';

/**
 * Parses a media query string to extract `min-width` and `max-width` values in pixels
 *
 * @param query  - A media query string, e.g., `(min-width: 300px) and (max-width: 600px).
 * @returns  An object with `minWidth` and `maxWidth` in pixels, or `null` if not specified.
 */
const parseMediaQuery = (query: string): { minWidth: number | null; maxWidth: number | null } => {
  // Extract min-with value in pixels from the query, e.g., (min-width: 300px)
  const minWidthMatch = query.match(/\(min-width:\s*(\d+)px\)/);
  // Extract max-with value in pixels from the query, e.g., (min-width: 300px)
  const maxWidthMatch = query.match(/\(max-width:\s*(\d+)px\)/);

  return {
    // convert min-width to a number if found; otherwise, return null
    minWidth: minWidthMatch ? parseInt(minWidthMatch[1], 10) : null,
    // convert max-width to a number if found; otherwise, return null
    maxWidth: maxWidthMatch ? parseInt(maxWidthMatch[1], 10) : null,
  };
};

/**
 * A custom  React hook that checks if a specified container element matches a given media query.
 * It observes the container's width and updates the match state based on the provided query.
 *
 *
 * @param query  - A CSS media query string, e.g., `(max-width: 300px)` or `(min-width: 500px)`.
 * @param containerRef  - A React ref object pointing to the container element (`React.RefObject<HTMLElement>`).
 *
 * @returns  `boolean | undefined` - Returns `true` if the container matches the media query, `false` if it does not, and `undefined` if the ref is not yet attached
 */
export const useContainerMediaQuery = (
  query: string,
  containerRef: React.RefObject<HTMLElement>
) => {
  // State to store whether the container matches the media query
  const [matches, setMatches] = useState<boolean>();

  useEffect(() => {
    // If the ref is not attached to an element, do nothing
    if (!containerRef.current || typeof ResizeObserver === 'undefined') return;

    /**
     * Updates the `matches` state based on the container's current width.
     */
    const updateMatch = () => {
      if (containerRef.current) {
        // Get the current width of the container element
        const width = containerRef.current.offsetWidth;
        // Parse min-width and max-width values from the query
        const { minWidth, maxWidth } = parseMediaQuery(query);

        // Check if the container width satisfies min-width condition (if specified)
        const minWidthMatch = minWidth !== null ? width >= minWidth : true;
        // Check if the container width satisfies max-width condition (if specified)
        const maxWidthMatch = maxWidth !== null ? width <= maxWidth : true;

        // Update the matches state based on both conditions
        setMatches(minWidthMatch && maxWidthMatch);
      }
    };

    // Create a ResizeObserver to watch for changes in the container's size
    const resizeObserver = new ResizeObserver(() => {
      updateMatch();
    });

    requestAnimationFrame(updateMatch);

    // Start observing the container element for size changes
    resizeObserver.observe(containerRef.current);

    // Cleanup: stop observing on component unmount or when dependencies change
    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, query]);

  //  Return whether the container currently matches the media query
  return matches;
};
