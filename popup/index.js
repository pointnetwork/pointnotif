var eventsAvailable = {};

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
      executing.then(confirmedEvents);
  });
}

function subscribeToEvent(eventId) {
  let executing = browser.tabs.executeScript(
    {code: `var events = ${JSON.stringify(eventsAvailable[eventId])};`},
    () => {
      let executing = browser.tabs.executeScript({file: "/content_scripts/subscribe.js"})
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
      const event = frameEvents[i][k];
      const id = `notif_${i}_${k}`;
      const checked = (event.isSub ? 'checked' : '');
      event.id = id;
      // eventsAvailable.push(event);
      
      eventsAvailable[id] = event
      
      /* eventsList.innerHTML += `<input type="checkbox" id="${id}" name="${id}" value="${id}" onclick="subscribeToEvent(${id})" ${checked}>`;
       * eventsList.innerHTML += `<label for="${id}">${event.name}</label><br>`; */

      const input = document.createElement('input');
      input.setAttribute('type', 'checkbox');
      input.setAttribute('id', id);
      input.setAttribute('value', id);
      input.checked = checked;
      input.onclick = (() => subscribeToEvent(id));

      const label = document.createElement('label');
      label.setAttribute('for', id)
      label.innerHTML = event.name;

      eventsList.appendChild(input);
      eventsList.appendChild(label);
      eventsList.appendChild(document.createElement('br'));
    }
  }

  // TODO: Create the DOM element and attach onclick event to it.
  // eventsList.innerHTML += `<br><button id="subscribe">Subscribe</button>`;
  // eventsList.innerHTML += `<br><button onclick="subscribeToEvents()">Subscribe</button>`;
  /* let subscribe = document.querySelector('#subscribe');
   * subscribe.onclick = subscribeToEvents; */
}

let executing = browser.tabs.executeScript({file: "/content_scripts/detect_events.js"})
executing.then(injectEvents);
