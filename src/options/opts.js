const Opts = {
  _default: {
    engines: [{
      display: 'Yandex',
      type: 'GET',
      url: 'https://yandex.com/images/search?rpt=imageview&url={{url.encoded}}',
      icon: 'yandex',
    }, {
      display: 'TinEye',
      type: 'GET',
      url: 'https://tineye.com/search/?url={{url.encoded}}',
      icon: 'tineye',
    }, {
      display: 'Google',
      type: 'GET',
      url: 'https://lens.google.com/uploadbyurl?url={{url.encoded}}',
      icon: 'google',
    }, {
      display: 'SauceNAO',
      type: 'GET',
      url: 'https://saucenao.com/search.php?url={{url.encoded}}',
      icon: 'saucenao',
    }],
  },

  init: async function() {
    let {opts, changed} = await BookmarkOpts.init(Opts._default);

    if (changed) {
      await Opts.set(opts);
    }
  },

  get: async function() {
    const opts = await BookmarkOpts.get();
    if (opts != null && Object.keys(opts).length > 0) {
      return opts;
    }

    await Opts.init();
    return await Opts.get();
  },

  set: async function(opts, extras = {}) {
    await BookmarkOpts.set(opts, extras);
    await ContextMenu.init();
  },
};