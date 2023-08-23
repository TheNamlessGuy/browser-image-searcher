const BackgroundPage = {
  _port: null,

  init: function() {
    BackgroundPage._port = browser.runtime.connect();
  },

  send: function(action, extras = {}) {
    return new Promise((resolve) => {
      const listener = (response) => {
        if (response.response === action) {
          BackgroundPage._port.onMessage.removeListener(listener);
          resolve(response);
        }
      };

      BackgroundPage._port.onMessage.addListener(listener);
      BackgroundPage._port.postMessage({action: action, ...JSON.parse(JSON.stringify(extras))});
    });
  },

  Opts: {
    get: async function() {
      return (await BackgroundPage.send('opts--get')).result;
    },

    set: async function(opts, extras = {}) {
      await BackgroundPage.send('opts--set', {opts, extras});
    },

    saveUsingBookmark: async function() {
      return (await BackgroundPage.send('opts--save-using-bookmark')).result;
    },
  }
};

async function save() {
  const opts = await BackgroundPage.Opts.get();
  const extras = {
    saveUsingBookmarkOverride: document.getElementById('save-using-bookmark').checked,
  };

  opts.engines = [];
  const engines = document.getElementsByTagName('engine-list-entry');
  for (const engine of engines) {
    opts.engines.push(engine.value);
  }

  await BackgroundPage.Opts.set(opts, extras);
}

function add() {
  const container = document.getElementById('engine-container');
  const element = document.createElement('engine-list-entry');
  element.setAttribute('title', '');
  element.setAttribute('url', '');
  element.setAttribute('image', 'custom');
  container.appendChild(element);
}

window.addEventListener('DOMContentLoaded', async () => {
  BackgroundPage.init();

  const container = document.getElementById('engine-container');
  const opts = await BackgroundPage.Opts.get();

  document.getElementById('save-using-bookmark').checked = await BackgroundPage.Opts.saveUsingBookmark();

  for (const engine of opts.engines) {
    const element = document.createElement('engine-list-entry');
    element.setAttribute('title', engine.display);
    element.setAttribute('url', engine.url);
    element.setAttribute('image', engine.icon);
    container.appendChild(element);
  }

  document.getElementById('save-btn').addEventListener('click', save);
  document.getElementById('add-btn').addEventListener('click', add);
});