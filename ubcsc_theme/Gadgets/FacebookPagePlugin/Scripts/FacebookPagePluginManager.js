(function (window, WA, undefined)
{
  'use strict';

  if (!window.WaFacebookPagePluginManager)
  {
    window.WaFacebookPagePluginManager = new FacebookPagePluginManager();
  }

  function FacebookPagePluginManager()
  {
    if (!WA) { return; }

    var pThis = this,
        typeName = 'WaFacebookPagePluginManager';

    pThis.toString = function () { return typeName; };

    /*debug*/var logEnabled = false; function log(text) { if (logEnabled && WA.topWindow.console) { WA.topWindow.console.log(typeName + ' ' + text); } }

    pThis.Dispose = WA.Tools.EventHandlers.createHandlers(pThis, { id: 'Dispose' });
    pThis.FacebookSdkLoaded = WA.Tools.EventHandlers.createHandlers(pThis, { id: 'FacebookSdkLoaded', type: WA.Tools.EventHandlers.Type.Long });

    pThis.createGadget = createGadget;

    var gadgets = {},
        sdkScriptSrc = '//connect.facebook.net/en_US/all.js#xfbml=1&status=0',
        sdkScriptId = 'facebook-jssdk',
        fbRootId = 'fb-root';


    function onFbSdkReady()
    {
      /*debug*/log('onFbSdkReady');

      FB.Event.subscribe('xfbml.render', onXfbmlRendered);
      pThis.FacebookSdkLoaded.fireHandlers({ sdk: FB });
    }


    function onGadgetDispose(sender, args)
    {
      /*debug*/log('onGadgetDispose');

      delete gadgets[args && args.id];
    }


    function createGadget(model, args)
    {
      /*debug*/log('createGadget');
      model = model || {};
      args = args || {};

      var gadgetId = model.id;

      /*debug*/if (!gadgetId) { throw new Error('Invalid model.'); }

      if (gadgets.hasOwnProperty(gadgetId) && gadgets[gadgetId].dispose)
      {
        /*debug*/log('gadget with id "' + gadgetId + '" already exists.');
        gadgets[gadgetId].dispose();
      }

      args.parentComponent = pThis;
      gadgets[gadgetId] = new WaFacebookPagePlugin(model, args);
      gadgets[gadgetId].Dispose.addHandler(onGadgetDispose);

      createFbRootElement();

      if (window.FB && FB.XFBML && FB.XFBML.parse)
      {
        onFbSdkReady();
        return;
      }

      if (!WA.$(sdkScriptId, window))
      {
        loadFacebookSdk();
      }
    }


    function onXfbmlRendered()
    {
      /*debug*/log('onXfbmlRendered');

      WA.Gadgets.notifyGadgetChanged();
    }


    function createFbInitCallback()
    {
      /*debug*/log('onSdkInitialized');
      var oldFbAsyncInit = window.fbAsyncInit;

      window.fbAsyncInit = function()
      {
        if (typeof oldFbAsyncInit == 'function')
        {
          oldFbAsyncInit();
        }

        onFbSdkReady();
      };
    }


    function loadFacebookSdk()
    {
      /*debug*/log('loadFacebookSdk');

      var sdkScript = document.createElement('script');

      sdkScript.id = sdkScriptId;
      sdkScript.async = true;
      sdkScript.src = sdkScriptSrc;

      document.getElementsByTagName('head')[0].appendChild(sdkScript);
    }


    function createFbRootElement()
    {
      /*debug*/log('createFbRootElement');
      var fbRoot = WA.$(fbRootId, window);

      if (fbRoot) { return; }

      fbRoot = document.createElement('div');
      fbRoot.id = fbRootId;
      document.body.appendChild(fbRoot);
    }


    function init()
    {
      /*debug*/log('init');

      if (window.FB && FB.XFBML && FB.XFBML.parse)
      {
        /*debug*/log('facebook sdk is already loaded.');
        onFbSdkReady();
        return;
      }

      createFbInitCallback();
    }


    function dispose()
    {
      /*debug*/log('dispose');
      if (window.FB && FB.XFBML && FB.XFBML.parse)
      {
        FB.Event.unsubscribe('xfbml.render', onXfbmlRendered);
      }

      pThis.Dispose.fireHandlers();

      window[typeName] = null;

      gadgets = null;

      pThis.Dispose = null;
      pThis.FacebookSdkLoaded = null;
    }

    BonaPage.addPageStateHandler(BonaPage.PAGE_PARSED, init, BonaPage.HANDLERTYPE_ALWAYS);
    BonaPage.addPageStateHandler(BonaPage.PAGE_UNLOADED, dispose, BonaPage.HANDLERTYPE_ALWAYS);
  }

})(window, window.WA);