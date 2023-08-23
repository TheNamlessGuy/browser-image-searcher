const Communication = {
  init: async function() {
    browser.runtime.onConnect.addListener(Communication._onConnect);
  },

  _onConnect: function(port) {
    port.onMessage.addListener(async (msg) => {
      if (!(msg.action in Communication._map)) {
        return; // What?
      }

      const response = (await Communication._map[msg.action](msg)) ?? {};
      port.postMessage({response: msg.action, ...JSON.parse(JSON.stringify(response))});
    });
  },

  _map: {
    'opts--get': async function() { return {result: await Opts.get()}; },
    'opts--set': async function(msg) { await Opts.set(msg.opts, msg.extras); },
    'opts--save-using-bookmark': async function() { return {result: BookmarkOpts._saveUsingBookmark}; },
  },
};