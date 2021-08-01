var eventsAvailable = [];

/* const response = await window.top.fetch(`${ host }/v1/api/${ path }`, {
 *                 cache: 'no-cache',
 *                 credentials: 'include',
 *                 keepalive: true,
 *                 ...config,
 *                 headers: {
 *                     'Content-Type': 'application/json',
 *                     ...config?.headers
 *                 }
 *             }); */

function confirmedEvents(events) {
  console.log('omega23', events);
}

async function subscribeToEvents() {
  let eventsChecked = [];
  
  eventsAvailable.forEach(event => {
    let isChecked = document.getElementById(event.id).checked;
    if (isChecked) {
      eventsChecked.push(event);
    }
  });

  let executing = browser.tabs.executeScript(
    {code: `var events = ${JSON.stringify(eventsChecked)};`},
    () => {
      let executing = browser.tabs.executeScript({file: "/content_scripts/subscribe.js"})
      console.log('omega3')
      executing.then(confirmedEvents);
  });
}

function injectEvents(frameEvents) {
  let eventsList = document.querySelector('#notex_events')
  eventsList.innerHTML = '<h1>Subscribe to Notifications</h1>';

  // Loop over each frame's events.
  for (let i = 0; i < frameEvents.length; i++) {
    // Loop over each event.
    for (let k = 0; k < frameEvents[i].length; k++) {
      let event = frameEvents[i][k];
      let id = `notif_${i}_${k}`;
      event.id = id;
      // ids.push(id);
      eventsAvailable.push(event);
      eventsList.innerHTML += `<input type="checkbox" id="${id}" name="${id}" value="${id}">`;
      eventsList.innerHTML += `<label for="${id}">${event.name}</label><br>`;
    }
  }

  // TODO: Create the DOM element and attach onclick event to it.
  eventsList.innerHTML += `<br><button id="subscribe">Subscribe</button>`;
  // eventsList.innerHTML += `<br><button onclick="subscribeToEvents()">Subscribe</button>`;
  let subscribe = document.querySelector('#subscribe');
  subscribe.onclick = subscribeToEvents;
}

let executing = browser.tabs.executeScript({file: "/content_scripts/detect_events.js"})
executing.then(injectEvents);
