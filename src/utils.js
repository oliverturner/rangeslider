// @flow

import type { Props } from "@oliverturner/rangeslider";

import keyCode from "rc-util/lib/KeyCode";

export function keypressActions(event: SyntheticKeyboardEvent<*>) {
  switch (event.keyCode) {
    case keyCode.UP:
    case keyCode.RIGHT:
      return (value: number, props: Props) => value + props.step;

    case keyCode.DOWN:
    case keyCode.LEFT:
      return (value: number, props: Props) => value - props.step;

    case keyCode.END:
      return (value: number, props: Props) => props.max;

    case keyCode.HOME:
      return (value: number, props: Props) => props.min;

    case keyCode.PAGE_UP:
      return (value: number, props: Props) => value + props.step * 2;

    case keyCode.PAGE_DOWN:
      return (value: number, props: Props) => value - props.step * 2;

    default:
      return undefined;
  }
}

export const optimizedResize = (eventName: string) => {
  const callbacks = [];
  let running = false;

  // fired on resize event
  function onEvent() {
    if (!running) {
      running = true;

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(runCallbacks);
      } else {
        setTimeout(runCallbacks, 66);
      }
    }
  }

  // run the actual callbacks
  function runCallbacks() {
    callbacks.forEach(function(callback) {
      callback();
    });

    running = false;
  }

  // adds callback to loop
  function addCallback(callback) {
    if (callback) {
      callbacks.push(callback);
    }
  }

  return {
    // public method to add additional callback
    add: function(callback: Function) {
      if (!callbacks.length) {
        window.addEventListener(eventName, onEvent);
      }
      addCallback(callback);
    }
  };
};
