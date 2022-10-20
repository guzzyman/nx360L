import React from "react";
import AsyncUIContext, { AsyncUI } from "./AsyncUIContext";

function AsyncUIProvider(props) {
  const { children } = props;
  const [queuedUIs, setQueuedUIs] = React.useState({});

  function enqueueUI(render = () => null, options) {
    const { key, manualRender } = options || { manualRender: false };
    const ui = new AsyncUI(
      null,
      render,
      key,
      (_, value, key) => resolveUI(key, value),
      (_, value, key) => rejectUI(key, value)
    );
    setQueuedUIs((p) =>
      Object.assign({}, p, { [ui.key]: { ui, manualRender } })
    );
    return ui;
  }

  function resolveUI(key, value) {
    setQueuedUIs((p) => {
      const queuedUIs = Object.assign({}, p);
      const queuedUI = queuedUIs[key];
      if (queuedUI) {
        queuedUI.ui.baseResolve(value);
        delete queuedUIs[key];
        return queuedUIs;
      }
      return p;
    });
  }

  function rejectUI(key, value) {
    setQueuedUIs((p) => {
      const queuedUIs = Object.assign({}, p);
      const queuedUI = queuedUIs[key];
      if (queuedUI) {
        queuedUI.ui.baseReject(value);
        delete queuedUIs[key];
        return queuedUIs;
      }
      return p;
    });
  }

  function renderUI(key) {
    const queuedUI = queuedUIs[key];
    return queuedUI.ui.render();
  }

  return (
    <AsyncUIContext.Provider
      value={{ enqueueUI, resolveUI, rejectUI, renderUI }}
    >
      {children}
      {Object.entries(queuedUIs).map(([key, queuedUI]) => (
        <React.Fragment key={key}>
          {!queuedUI.manualRender ? queuedUI.ui.render() : null}
        </React.Fragment>
      ))}
    </AsyncUIContext.Provider>
  );
}

export default AsyncUIProvider;
