(function (window, WA, undefined)
{
  'use strict';

  if (!window.WaGoogleMapsGadgetsManager)
  {
    window.WaGoogleMapsGadgetsManager = new GoogleMapsGadgetsManager();
  }

  function GoogleMapsGadgetsManager()
  {
    if (!WA) { return; }

    var pThis = this,
        typeName = 'WaGoogleMapsGadgetsManager';

    pThis.toString = function () { return typeName; };

    /*debug*/var logEnabled = false; function log(text) { if (logEnabled && WA.topWindow.console) { WA.topWindow.console.log(typeName + ' ' + text); } }

    pThis.Dispose = WA.Tools.EventHandlers.createHandlers(pThis, { id: 'Dispose' });
    pThis.GoogleMapsApiLoaded = WA.Tools.EventHandlers.createHandlers(pThis, { id: 'GoogleMapsApiLoaded', type: WA.Tools.EventHandlers.Type.Long });

    pThis.createGadget = createGadget;
    pThis.onGoogleMapsApiLoaded = onGoogleMapsApiLoaded;

    var gadgets = {},
        isDisposed = false,
        apiUrlTemplate = 'https://maps.googleapis.com/maps/api/js?' +
          'key={key}' +
          '&libraries={libraries}' +
          '&callback={callback}',
        apiLoadOptions = {
          key: '',
          callback: typeName + '.onGoogleMapsApiLoaded',
          libraries: []
        },
        apiScriptId = 'id_waGoogleApiScript';


    function onGadgetDispose(sender, args)
    {
      /*debug*/log('onGadgetDispose');

      delete gadgets[args && args.id];
    }


    function createGadget(gadgetConstructor, model, args)
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
      gadgets[gadgetId] = new gadgetConstructor(model, args);
      gadgets[gadgetId].Dispose.addHandler(onGadgetDispose);

      if (!(window.google && window.google.maps) && !WA.$(apiScriptId, window))
      {
        loadGoogleMapsApi(model);
      }
    }


    function loadGoogleMapsApi(model)
    {
      /*debug*/log('loadGoogleMapsApi');

      var apiScript = document.createElement('script');

      apiLoadOptions.key = model.apiKey || apiLoadOptions.key;
      apiLoadOptions.libraries = (model.libraries || apiLoadOptions.libraries).join(',');

      apiScript.id = apiScriptId;
      apiScript.src = WA.String.formatNamed(apiUrlTemplate, apiLoadOptions);
      document.getElementsByTagName('head')[0].appendChild(apiScript);
    }


    function onGoogleMapsApiLoaded()
    {
      /*debug*/log('onGoogleMapsApiLoaded');

      pThis.GoogleMapsApiLoaded.fireHandlers();
    }


    function init()
    {
      /*debug*/log('init');

      if (window.google && window.google.maps)
      {
        onGoogleMapsApiLoaded();
      }
    }


    function dispose()
    {
      /*debug*/log('dispose');
      if (isDisposed) { return; }

      isDisposed = true;

      pThis.Dispose.fireHandlers();

      window[typeName] = null;

      gadgets = null;

      pThis.Dispose = null;
      pThis.GoogleMapsApiLoaded = null;
    }

    BonaPage.addPageStateHandler(BonaPage.PAGE_PARSED, init, BonaPage.HANDLERTYPE_ALWAYS);
    BonaPage.addPageStateHandler(BonaPage.PAGE_UNLOADED, dispose, BonaPage.HANDLERTYPE_ALWAYS);
  }

})(window, window.WA);