(function (window, WA, undefined)
{
  'use strict';

  if (!window.WaGoogleMap)
  {
    window.WaGoogleMap = GoogleMap;
  }

  function GoogleMap(initModel, initArgs)
  {
    if (!WA) { return; }

    initArgs = initArgs || {};

    var pThis = this,
      typeName = 'WaGoogleMap',
      viewModel = initModel,
      parentComponent = initArgs.parentComponent,
      address = initArgs.address || '',
      zoom = initArgs.zoom || 13,
      mapWindow = initArgs.mapWindow || window,
      mapContainerId = initArgs.mapContainerId;

    pThis.toString = function () { return typeName; };

    /*debug*/var logEnabled = false; function log(text) { if (logEnabled && WA.topWindow.console) { var txt = [typeName, viewModel && viewModel.id, text].join(' '); WA.topWindow.console.log(txt); } }
    /*debug*/if (!parentComponent) { throw new Error('parentComponent was not defined!'); }
    /*debug*/if (!viewModel.id) { throw new Error('Invalid model!'); }

    pThis.Dispose = WA.Tools.EventHandlers.createHandlers(pThis, { id: 'Dispose' });

    pThis.dispose = dispose;


    var isDisposed = false,
        api;


    function getCoordinates()
    {
      /*debug*/log('getCoordinates, address: ' + address);
      if (isDisposed) { return; }

      var geocoder = new api.Geocoder();

      geocoder.geocode
      (
        { address: address },
        function(locResult, status)
        {
          if (status == api.GeocoderStatus.OK)
          {
            setGoogleMap(locResult[0].geometry.location.lat(), locResult[0].geometry.location.lng());
          }
          else
          {
            /*debug*/log('geocoding has failed with status: ' + status);
          }
        }
      );
    }


    function setGoogleMap(x,y)
    {
      /*debug*/log('setGoogleMap');
      if (isDisposed) { return; }

      var mapContainer = mapContainerId && WA.$(mapContainerId, mapWindow),
          mapOptions,
          map,
          markerOptions,
          marker;

      /*debug*/if (!mapContainer) { throw new Error('Invalid mapContainerId'); }

      mapOptions = { center: new api.LatLng(x,y), zoom: zoom, mapTypeId: api.MapTypeId.ROADMAP };
      map = new api.Map(mapContainer, mapOptions);

      markerOptions = { map: map, position: new api.LatLng(x, y) };
      marker = new api.Marker(markerOptions);

      dispose();
    }


    function onGoogleMapsApiLoaded()
    {
      /*debug*/log('onGoogleMapsApiLoaded');

      api = google.maps;

      /*debug*/if (!api) { throw new Error('api was not defined.'); }

      if (address != "")
      {
        getCoordinates();
      }
      else
      {
        setGoogleMap(0,0)
      }
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
      parentComponent.GoogleMapsApiLoaded.addHandler(onGoogleMapsApiLoaded);
      WA.Gadgets.GadgetDeleted.addHandler(onGadgetDeleted);
    }


    function dispose()
    {
      /*debug*/log('dispose');
      isDisposed = true;

      pThis.Dispose.fireHandlers({ id: viewModel.id });

      parentComponent.GoogleMapsApiLoaded.removeHandler(onGoogleMapsApiLoaded);
      WA.Gadgets.GadgetDeleted.removeHandler(onGadgetDeleted);
      parentComponent.Dispose.removeHandler(dispose);

      viewModel = null;
      parentComponent = null;
      api = null;

      pThis.RenderComplete = null;
      pThis.Dispose = null;
    }

    init();
  }

})(window, window.WA);