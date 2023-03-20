(function (window, WA, undefined)
{
  'use strict';

  if (!window.WaAddressServiceApiClient)
  {
    window.WaAddressServiceApiClient = WaAddressServiceApiClient;
  }

  function WaAddressServiceApiClient(initModel, initArgs)
  {
    if (!WA) { return; }

    initArgs = initArgs || {};

    var pThis = this,
      typeName = 'WaAddressServiceApiClient',
      viewModel = initModel,
      parentComponent = initArgs.parentComponent,
      authorizationToken = viewModel.authorizationToken,
      endpoint = viewModel.endpoint,
	  fastIntegrationEnabled;

    pThis.toString = function () { return typeName; };

    /*debug*/var logEnabled = false; function log(text) { if (logEnabled && WA.topWindow.console) { var txt = [typeName, viewModel && viewModel.id, text].join(' '); WA.topWindow.console.log(txt); } }
    /*debug*/if (!parentComponent) { throw new Error('parentComponent was not defined!'); }
    /*debug*/if (!viewModel.authorizationToken) { throw new Error('viewModel.authorizationToken was not defined.'); }
    /*debug*/if (!viewModel.endpoint) { throw new Error('viewModel.endpoint was not defined.'); }

    pThis.Dispose = WA.Tools.EventHandlers.createHandlers(pThis, { id: 'Dispose' });
	
	var isDisposed = false,
      serviceHttpClient;


    pThis.geocode = geocode;

    function geocode(addresses)
    {
	  /*debug*/log('Geocode');
	  
	  return serviceHttpClient.fetch(
        endpoint,
        WA.Ajax.appendRequestHeaders(
  		  {
            cache: false,
            global: false,
            type: 'POST',
            crossDomain: true,
			contentType: 'application/json',
			data: JSON.stringify(addresses)
          },
		  additionalHeaders
		)
      );
    }

    function init()
    {
      /*debug*/log('init');
	  
	  additionalHeaders = viewModel.fastIntegrationEnabled && viewModel.environmentId ? [{ key: 'X-Api-EnvironmentId', value: viewModel.environmentId }] : [];
	  
      parentComponent.Dispose.addHandler(dispose);

      serviceHttpClient = new WA.ServiceHttpClient({ authorizationToken: viewModel.authorizationToken }, { parentComponent: pThis });
    }


    function dispose()
    {
      if (isDisposed) { return; }

      /*debug*/log('dispose');

      isDisposed = true;

      pThis.Dispose.fireHandlers();

      viewModel = null;
      parentComponent = null;

      pThis.Dispose = null;
    }

    init();
  }

})(window, window.WA);