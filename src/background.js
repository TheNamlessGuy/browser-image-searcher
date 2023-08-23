const Background = {
  main: async function() {
    await Communication.init();
    await Opts.init();

    await ContextMenu.init();
  },
};

Background.main();