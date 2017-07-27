export const CustomEventHelper = {
  /**
   * Simple helper for dispatchEvent when dealing with CustomEvent (and IE support)
   * @param element Element to dispatch event
   * @param typeArg Name of event
   * @param eventInitDict CustomEventInit dict
   */
  dispatchEvent(element: Element, typeArg: string, eventInitDict?: CustomEventInit) {
    if (typeof CustomEvent === 'function') {
      element.dispatchEvent(new CustomEvent(typeArg, eventInitDict));
    } else {
      let e = document.createEvent('CustomEvent');
      let params = eventInitDict || { bubbles: false, cancelable: false, detail: undefined };
      e.initCustomEvent(typeArg, params.bubbles, params.cancelable, params.detail);
      element.dispatchEvent(e);
    }
  }
};
