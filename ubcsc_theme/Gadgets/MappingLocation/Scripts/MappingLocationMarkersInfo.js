(function (window, WA, undefined)
{
  'use strict';

  if (!window.WaMappingLocationMarkersInfo)
  {
    window.WaMappingLocationMarkersInfo = WaMappingLocationMarkersInfo;
  }

  function WaMappingLocationMarkersInfo(initModel, initArgs)
  {
    if (!WA) { return; }

    initArgs = initArgs || {};

    var pThis = this,
      typeName = 'WaMappingLocationMarkersInfo',
      viewModel = initModel,
      parentComponent = initArgs.parentComponent,
      map = initArgs.map,
      updaterPosition = initArgs.updaterPosition,
      resources = initArgs.resources,
      statuses = initArgs.statuses,
      adminMode = initArgs.adminMode;

    pThis.toString = function () { return typeName; };

    /*debug*/var logEnabled = false; function log(text) { if (logEnabled && WA.topWindow.console) { var txt = [typeName, viewModel && viewModel.id, text].join(' '); WA.topWindow.console.log(txt); } }
    /*debug*/if (!parentComponent) { throw new Error('parentComponent was not defined!'); }
    /*debug*/if (!viewModel.id) { throw new Error('Invalid model!'); }
    /*debug*/if (!map) { throw new Error('map was not defined.'); }
    /*debug*/if (!updaterPosition) { throw new Error('updaterPosition was not defined.'); }
    /*debug*/if (!statuses) { throw new Error('statuses were not defined.'); }
    /*debug*/if (!resources) { throw new Error('resources were not defined.'); }
    /*debug*/if (!resources.AdminInfoMessage) { throw new Error('resources.AdminInfoMessage was not defined.'); }
    /*debug*/if (!resources.AdminOverLimitMessageTitle) { throw new Error('resources.AdminOverLimitMessageTitle was not defined.'); }
    /*debug*/if (!resources.AdminOverLimitMessage) { throw new Error('resources.AdminOverLimitMessage was not defined.'); }
    /*debug*/if (!resources.UpdateMarkersLabel) { throw new Error('resources.UpdateMarkersLabel was not defined.'); }
    /*debug*/if (!resources.UpdatingMarkersLabel) { throw new Error('resources.UpdatingMarkersLabel was not defined.'); }
    /*debug*/if (!resources.ReadyToUpdateMarkersTemplate) { throw new Error('resources.ReadyToUpdateMarkersTemplate was not defined.'); }
    /*debug*/if (!resources.UpdatingFinishedLabel) { throw new Error('resources.UpdatingFinishedLabel was not defined.'); }
    /*debug*/if (!resources.MarkerOnTheMapLabel) { throw new Error('resources.MarkerOnTheMapLabel was not defined.'); }
    /*debug*/if (!resources.GeocodingFailedZeroResultsLabel) { throw new Error('resources.GeocodingFailedZeroResultsLabel was not defined.'); }
    /*debug*/if (!resources.GeocodingFailedInvalidRequestLabel) { throw new Error('resources.GeocodingFailedInvalidRequestLabel was not defined.'); }

    pThis.Dispose = WA.Tools.EventHandlers.createHandlers(pThis, { id: 'Dispose' });
    pThis.UpdateClick = WA.Tools.EventHandlers.createHandlers(pThis, { id: 'UpdateClick' });

    pThis.dispose = dispose;
    pThis.setState = setState;

    var isDisposed = false,
      updateContainerId = 'wa-mapping-location-update-container',
      updateContainerMessageId = 'wa-mapping-location-update-container-message',
      updateContainerInfoId = 'wa-mapping-location-update-container-info',
      updateContainerHolder,
      updateContainer,
      updateContainerInfo,
      updateContainerMessage,
      hasMarkersToShow = false,
      overQueryLimitMessage;

    function showUpdateContainer()
    {
      if (!map.controls[updaterPosition].getLength())
      {
        map.controls[updaterPosition].push(updateContainerHolder);
      }
    }

    function hideUpdateContainer()
    {
      map.controls[updaterPosition].clear();
    }

    function setProcessedState(state)
    {
      var statusLabels = {};

      hideUpdateContainer();

      if (!adminMode || !state.finished) { return; }

      if (state.failures[statuses.OVER_QUERY_LIMIT])
      {
        overQueryLimitMessage.style.display = 'block';
      }

      updateContainer.style.cursor = '';
      updateContainer.style.textAlign = 'left';
      updateContainer.style.fontSize = '12px';
      updateContainer.style.alignItems = 'center';
      updateContainer.style.justifyContent = 'space-between';
      updateContainer.style.minWidth = '450px';

      statusLabels[statuses.ZERO_RESULTS] = resources.GeocodingFailedZeroResultsLabel;
      statusLabels[statuses.INVALID_REQUEST] = resources.GeocodingFailedInvalidRequestLabel;

      updateContainer.innerHTML = WaMappingLocationMarkersInfo.Template.geocodingResult({
        shown: state.shown,
        failed: state.failed,
        failures: state.failures,
        statuses: statuses,
        updatingFinishedLabel: resources.UpdatingFinishedLabel,
        markersOnTheMapLabel: resources.MarkerOnTheMapLabel,
        statusLabels: statusLabels
      });

      updateContainer.style.display = 'flex';
      showUpdateContainer();
    }

    function setProcessingState(state)
    {
      updateContainerInfo.innerHTML = WA.String.format(
        resources.ReadyToUpdateMarkersTemplate,
        state.total,
        state.shown,
        state.readyToShow,
        (state.total - state.shown - state.failed)
      );
      updateContainerMessage.innerHTML = WaMappingLocationMarkersInfo.Template.updateContainerMessage(resources.UpdateMarkersLabel);
      showUpdateContainer();
    }

    function setState(nextState)
    {
      nextState = nextState || {};

      if (!nextState.total)
      {
        hideUpdateContainer();
        return;
      }

      hasMarkersToShow = !!nextState.readyToShow;

      if (hasMarkersToShow)
      {
        setProcessingState(nextState);
      }
      else if (nextState.finished)
      {
        setProcessedState(nextState);
      }
      else
      {
        hideUpdateContainer();
      }
    }

    function createAdminInfoContainers()
    {
      var infoContainer = document.createElement('div'),
        mapContainer = map.getDiv();

      infoContainer.style.cssText = 'background:#d8e6f1;border:1px solid #3e5670;padding:8px;font-size:12px;';
      infoContainer.innerHTML = resources.AdminInfoMessage;

      mapContainer.parentNode.insertBefore(infoContainer, mapContainer);

      overQueryLimitMessage = document.createElement('div');

      overQueryLimitMessage.style.cssText = 'background:rgb(255, 229, 229);border:1px solid #FF0000;padding:8px;font-size:12px;display:none;';
      overQueryLimitMessage.innerHTML = WaMappingLocationMarkersInfo.Template.overQueryLimitMessage(resources.AdminOverLimitMessageTitle, resources.AdminOverLimitMessage);

      mapContainer.parentNode.insertBefore(overQueryLimitMessage, mapContainer);
    }

    function createUpdateContainer()
    {
      updateContainerHolder = document.createElement('div');

      updateContainerHolder.innerHTML = WaMappingLocationMarkersInfo.Template.updateContainer({
        updateContainerId: updateContainerId,
        updateContainerInfoId: updateContainerInfoId,
        updateContainerMessageId: updateContainerMessageId
      });

      updateContainer = updateContainerHolder.querySelector('#' + updateContainerId);
      updateContainerInfo = updateContainerHolder.querySelector('#' + updateContainerInfoId);
      updateContainerMessage = updateContainerHolder.querySelector('#' + updateContainerMessageId);

      WA.addHandler(updateContainer, 'click', onUpdateClick);
    }

    function setUpdatingState()
    {
      updateContainerInfo.innerHTML = '';
      updateContainerMessage.innerHTML = resources.UpdatingMarkersLabel;
      showUpdateContainer();
    }

    function onUpdateClick()
    {
      if (isDisposed || !hasMarkersToShow) { return; }

      setUpdatingState();

      pThis.UpdateClick.fireHandlers();
    }

    function init()
    {
      /*debug*/log('init');

      parentComponent.Dispose.addHandler(dispose);

      createUpdateContainer();

      if (adminMode)
      {
        createAdminInfoContainers();
      }
    }


    function dispose()
    {
      if (isDisposed) { return; }

      /*debug*/log('dispose');

      isDisposed = true;

      WA.removeHandler(updateContainer, 'click', onUpdateClick);

      pThis.Dispose.fireHandlers();
      parentComponent.Dispose.removeHandler(dispose);

      viewModel = null;
      resources = null;
      parentComponent = null;
      map = null;
      updateContainerHolder = null;
      updateContainer = null;
      updateContainerInfo = null;
      updateContainerMessage = null;
      statuses = null;
      overQueryLimitMessage = null;

      pThis.Dispose = null;
      pThis.UpdateClick = null;
    }

    init();
  }

})(window, window.WA);