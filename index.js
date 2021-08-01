function handleMessage(request, sender, sendResponse) {
  console.log("Message from the content script: " +
	      request.greeting);
  sendResponse({response: "Response from background script"});
}

function openWebSocket() {
  socket = new WebSocket('ws://localhost:2468');
  socket.onmessage = (e) => callback(e.data);
  return socket;
}

(async () => {
  // browser.runtime.onMessage.addListener(handleMessage);
}
)();
