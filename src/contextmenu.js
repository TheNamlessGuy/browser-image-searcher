const ContextMenu = {
  _ids: {
    root: 'image-searcher-root',
    enginePrefix: 'image-searcher-engine--',
    engine: (engine) => `${ContextMenu._ids.enginePrefix}${engine}`,
  },

  init: async function() {
    browser.menus.removeAll();

    const opts = await Opts.get();

    browser.menus.create({
      id: ContextMenu._ids.root,
      title: 'Image Search',
      contexts: ['image'],
      icons: {
        16: 'res/icons/plugin/16.png',
        32: 'res/icons/plugin/32.png',
      },
    });

    for (const engine of opts.engines) {
      browser.menus.create({
        id: ContextMenu._ids.engine(engine.display),
        parentId: ContextMenu._ids.root,
        title: engine.display,
        icons: {
          16: `/res/icons/engines/${engine.icon}/16.png`,
          32: `/res/icons/engines/${engine.icon}/32.png`,
        }
      });
    }

    if (!browser.menus.onClicked.hasListener(ContextMenu._onClicked)) {
      browser.menus.onClicked.addListener(ContextMenu._onClicked);
    }
  },

  _onClicked: async function(info, tab) {
    if (info.menuItemId.startsWith(ContextMenu._ids.enginePrefix)) {
      const opts = await Opts.get();
      const display = info.menuItemId.substring(ContextMenu._ids.enginePrefix.length);
      const engine = opts.engines.find(x => x.display === display);

      const img = {
        url: {
          encoded: encodeURIComponent(info.srcUrl),
          decoded: decodeURIComponent(info.srcUrl),
        },
      };

      await browser.tabs.create({
        active: info.button === 0 && info.modifiers.length === 0,
        openerTabId: tab.id,
        windowId: tab.windowId,
        url: engine.url.replaceAll('{{url.encoded}}', img.url.encoded)
                       .replaceAll('{{url.decoded}}', img.url.decoded),
      });
    }
  },
};