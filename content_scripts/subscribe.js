function handleResponse(message) {
  console.log(`Message from the background script:  ${message.response}`);
}

function handleError(error) {
  console.log(`Error: ${error}`);
}

(async () => {
  let sending = browser.runtime.sendMessage({
    greeting: "Greeting from the content script."
  });
  sending.then(handleResponse, handleError);
  let point = window.wrappedJSObject.point;
  let ping = await point.status.ping();

  let url = `${window.location.origin}/v1/api/subscription/save`;
  let resp = await fetch(url, {
    method: 'POST',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify(events)
  });
  let confirmedEvents = await resp.json();

  // point.contract.call({contract: 'Notifications', method: 'notify'})
  return await confirmedEvents;
}
)();
