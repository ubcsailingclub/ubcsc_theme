(function (window, WA, undefined)
{
  'use strict';

  if (!window.WaFacebookPagePlugin)
  {
    window.WaFacebookPagePlugin = FacebookPagePlugin;
  }

  function FacebookPagePlugin(initModel, initArgs)
  {
    if (!WA) { return; }

    initArgs = initArgs || {};

    var pThis = this,
      typeName = 'WaFacebookPagePlugin',
      viewModel = initModel,
      parentComponent = initArgs.parentComponent,
      facebookPagePluginContainerId = initArgs.facebookPagePluginContainerId;

    pThis.toString = function () { return typeName; };

    /*debug*/var logEnabled = false; function log(text) { if (logEnabled && WA.topWindow.console) { var txt = [typeName, viewModel && viewModel.id, text].join(' '); WA.topWindow.console.log(txt); } }
    /*debug*/if (!parentComponent) { throw new Error('parentComponent was not defined!'); }
    /*debug*/if (!viewModel.id) { throw new Error('Invalid model!'); }

    pThis.Dispose = WA.Tools.EventHandlers.createHandlers(pThis, { id: 'Dispose' });

    pThis.dispose = dispose;


    function onFacebookSdkLoaded(sender, args)
    {
      /*debug*/log('onFacebookSdkLoaded');

      var sdk = args && args.sdk,
          facebookPagePluginContainer = WA.$(facebookPagePluginContainerId, window);

      /*debug*/if (!sdk) { throw new Error('sdk was not defined.'); }
      /*debug*/if (!facebookPagePluginContainer) { throw new Error('facebookPagePluginContainer was not found.'); }

      sdk.XFBML.parse(facebookPagePluginContainer);
    }


    function onGadgetDeleted(sender, args)
    {
      /*debug*/log('onGadgetDeleted');

      args = args || {};

      if (args.componentId == viewModel.id)
      {
        dispose();
      }
    }


    function init()
    {
      /*debug*/log('init');

      parentComponent.Dispose.addHandler(dispose);
      parentComponent.FacebookSdkLoaded.addHandler(onFacebookSdkLoaded, {period: 'once'});
      WA.Gadgets.GadgetDeleted.addHandler(onGadgetDeleted);
    }


    function dispose()
    {
      /*debug*/log('dispose');

      pThis.Dispose.fireHandlers({ id: viewModel.id });

      parentComponent.FacebookSdkLoaded.removeHandler(onFacebookSdkLoaded);
      WA.Gadgets.GadgetDeleted.removeHandler(onGadgetDeleted);
      parentComponent.Dispose.removeHandler(dispose);

      viewModel = null;
      parentComponent = null;

      pThis.RenderComplete = null;
      pThis.Dispose = null;
    }

    init();
  }

})(window, window.WA);