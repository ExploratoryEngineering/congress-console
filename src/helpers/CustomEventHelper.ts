import { LogBuilder } from "Helpers/LogBuilder";

const Log = LogBuilder.create("Custom event");

export const CustomEventHelper = {
  /**
   * Simple helper for dispatchEvent when dealing with CustomEvent (and IE support)
   * @param element Element to dispatch event
   * @param typeArg Name of event
   * @param eventInitDict CustomEventInit dict
   */
  dispatchEvent(element: Element, typeArg: string, eventInitDict?: CustomEventInit) {
    if (!eventInitDict.bubbles) {
      Log.warn("Event is not bubbling. This is often not intended and will break Custom Event subscription");
    }

    if (typeof CustomEvent === "function") {
      element.dispatchEvent(new CustomEvent(typeArg, eventInitDict));
    } else {
      const e = document.createEvent("CustomEvent");
      const params = eventInitDict || { bubbles: false, cancelable: false, detail: undefined };
      e.initCustomEvent(typeArg, params.bubbles, params.cancelable, params.detail);
      element.dispatchEvent(e);
    }
  },
};
