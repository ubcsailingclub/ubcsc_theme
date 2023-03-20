(function (window, WA, undefined)
{
  'use strict';

  if (!window.WaMappingLocationServiceApiClient)
  {
    window.WaMappingLocationServiceApiClient = WaMappingLocationServiceApiClient;
  }

  function WaMappingLocationServiceApiClient(initModel, initArgs)
  {
    if (!WA) { return; }

    initArgs = initArgs || {};

    var pThis = this,
      typeName = 'WaMappingLocationServiceApiClient',
      viewModel = initModel,
      parentComponent = initArgs.parentComponent,
	  authorizationToken = viewModel.authorizationToken,
      endpoint = viewModel.endpoint;

    pThis.toString = function () { return typeName; };

    /*debug*/var logEnabled = false; function log(text) { if (logEnabled && WA.topWindow.console) { var txt = [typeName, viewModel && viewModel.id, text].join(' '); WA.topWindow.console.log(txt); } }
    /*debug*/if (!parentComponent) { throw new Error('parentComponent was not defined!'); }
    /*debug*/if (!viewModel.authorizationToken) { throw new Error('viewModel.authorizationToken was not defined.'); }
    /*debug*/if (!viewModel.endpoint) { throw new Error('viewModel.endpoint was not defined.'); }

    pThis.Dispose = WA.Tools.EventHandlers.createHandlers(pThis, { id: 'Dispose' });
	
	var isDisposed = false,
        serviceHttpClient;


    pThis.ContactInfo = ContactInfo;
    
    function ContactInfo()
    {
      /*debug*/log('ContactInfo');
	  
	  return serviceHttpClient.fetch(
        endpoint,
        WA.Ajax.appendRequestHeaders(
  		  {
            cache: false,
            global: false,
            type: 'GET',
            crossDomain: true
          },
		  additionalHeaders
		)
      );
    }

    function init()
    {
      /*debug*/log('init');

      parentComponent.Dispose.addHandler(dispose);
	  
	  additionalHeaders = viewModel.fastIntegrationEnabled && viewModel.environmentId ? [{ key: 'X-Api-EnvironmentId', value: viewModel.environmentId }] : [];
	  if (viewModel.environmentReference) { additionalHeaders.push({key: 'X-Api-EnvironmentReference', value: viewModel.environmentReference}); }

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