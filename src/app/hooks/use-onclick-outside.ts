// useOnClickOutside;
import type { RefObject } from 'react';



import { useEventListener } from 'usehooks-ts';


type EventType =
  | 'mousedown'
  | 'mouseup'
  | 'touchstart'
  | 'touchend'
  | 'focusin'
  | 'focusout'

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T> | RefObject<T>[],
  handler: (event: MouseEvent | TouchEvent | FocusEvent) => void,
  eventType: EventType = 'mousedown',
  eventListenerOptions: AddEventListenerOptions = {},
): void {
  useEventListener(
    eventType,
    event => {
      const target = event.target as Node

      // Do nothing if the target is not connected element with document
      if (!target || !target.isConnected) {
        return
      }

      const isOutside = Array.isArray(ref)
        ? ref
            .filter(r => Boolean(r.current))
            .every(r => r.current && !r.current.contains(target))
        : ref.current && !ref.current.contains(target)

      if (isOutside) {
        handler(event)
      }
    },
    undefined,
    eventListenerOptions,
  )
}

//**********************************************************************
// Custom hook that handles clicks outside a specified element.
// Reference: https://usehooks-ts.com/introduction
// It takes a ref to the element, a handler function, an optional event type, and optional event listener options.
//**********************************************************************

// Usage example:
// import { useRef } from 'react'

// import { useOnClickOutside } from 'usehooks-ts'

// export default function Component() {
//   const ref = useRef(null)

//   const handleClickOutside = () => {
//     // Your custom logic here
//     console.log('clicked outside')
//   }

//   const handleClickInside = () => {
//     // Your custom logic here
//     console.log('clicked inside')
//   }

//   useOnClickOutside(ref, handleClickOutside)

//   return (
//     <button
//       ref={ref}
//       onClick={handleClickInside}
//       style={{ width: 200, height: 200, background: 'cyan' }}
//     />
//   )
// }



// API
// ▸ useOnClickOutside<T>(ref, handler, eventType?, eventListenerOptions?): void

// Custom hook that handles clicks outside a specified element.

// Type parameters
// Name	Type	Description
// T	extends HTMLElement = HTMLElement	The type of the element's reference.
// Parameters
// Name	Type	Default value	Description
// ref	RefObject<T> | RefObject<T>[]	undefined	The React ref object(s) representing the element(s) to watch for outside clicks.
// handler	(event: MouseEvent | FocusEvent | TouchEvent) => void	undefined	The callback function to be executed when a click outside the element occurs.
// eventType?	EventType	'mousedown'	The mouse event type to listen for (optional, default is 'mousedown').
// eventListenerOptions?	AddEventListenerOptions	{}	The options object to be passed to the addEventListener method (optional).
// Returns
// void

// Type aliases
// Ƭ EventType: "mousedown" | "mouseup" | "touchstart" | "touchend" | "focusin" | "focusout"

// Supported event types.