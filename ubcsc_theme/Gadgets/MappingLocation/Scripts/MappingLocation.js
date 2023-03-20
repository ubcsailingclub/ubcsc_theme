(function (window, WA, undefined)
{
  'use strict';

  if (!window.WaMappingLocation)
  {
    window.WaMappingLocation = WaMappingLocation;
  }

  function WaMappingLocation(initModel, initArgs)
  {
    if (!WA) { return; }

    initArgs = initArgs || {};

    var pThis = this,
      typeName = 'WaMappingLocation',
      viewModel = initModel,
      parentComponent = initArgs.parentComponent,
      zoom = initArgs.zoom || 1,
      mapWindow = initArgs.mapWindow || window,
      mapContainerId = initArgs.mapContainerId,
      clusterImgPath = initArgs.clusterImgPath,
      markerUrl = initArgs.markerUrl,
      visitedMarkerUrl = initArgs.visitedMarkerUrl,
      settings = initArgs.settings,
      resources = initArgs.resources;

    pThis.toString = function () { return typeName; };

    /*debug*/var logEnabled = false; function log(text) { if (logEnabled && WA.topWindow.console) { var txt = [typeName, viewModel && viewModel.id, text].join(' '); WA.topWindow.console.log(txt); } }
    /*debug*/if (!parentComponent) { throw new Error('parentComponent was not defined!'); }
    /*debug*/if (!viewModel.id) { throw new Error('Invalid model!'); }
    /*debug*/if (!mapContainerId) { throw new Error('mapContainerId was not defined.'); }
    /*debug*/if (!resources) { throw new Error('resources were not defined.'); }
    /*debug*/if (!resources.EmptyNameLabel) { throw new Error('resources.EmptyNameLabel was not defined.'); }
    /*debug*/if (!resources.SearchBoxEmptyLabel) { throw new Error('resources.SearchBoxEmptyLabel was not defined.'); }
    /*debug*/if (!resources.ProfileUrlTemplate) { throw new Error('resources.ProfileUrlTemplate was not defined.'); }
    /*debug*/if (!resources.AuthorizationToken) { throw new Error('resources.AuthorizationToken was not defined.'); }
    /*debug*/if (!resources.MappingLocationServiceEndpointUrl) { throw new Error('resources.MappingLocationServiceEndpointUrl was not defined.'); }
    /*debug*/if (!resources.AddressServiceEndpointUrl) { throw new Error('resources.AddressServiceEndpointUrl was not defined.'); }
    /*debug*/if (!clusterImgPath) { throw new Error('clusterImgPath was not defined.'); }
    /*debug*/if (!markerUrl) { throw new Error('markerUrl was not defined.'); }
    /*debug*/if (!visitedMarkerUrl) { throw new Error('visitedMarkerUrl was not defined.'); }

    pThis.Dispose = WA.Tools.EventHandlers.createHandlers(pThis, { id: 'Dispose' });

    pThis.dispose = dispose;

    var isDisposed = false,
      mapApi,
      map,
      bounds,
      searchBox,
      clusterer,
      zIndex = 0,
      markers = [],
      geocodeDuration = settings.Duration,
      maxGeocodeDuration = settings.MaxDuration,
      geocodeChunkSize = settings.ChunkSizeToStore,
      geocodeAddressSource = settings.AddressSource,
      geocodeFailures = {},
      maxGeocodingRetries = settings.MaxRetries,
      infoContainer = null,
      geocodedContacts = [],
      minMarkers = settings.MinMarkersToShowOnStart,
      contactsAmount = 0,
      markersInfo,
      adminMode = !!WA.AdminPanel,
      isFullScreenModeOn = false;

    function isAdminEditModeActive()
    {
      return adminMode && WA.AdminPanel.PageMode.Mode() === WA.AdminPanel.PageModeType.Edit;
    }

    function renderInfoItem(result, item, index)
    {
      /*debug*/log('renderInfoItem');

      return index
	    ? result + '<div><strong>' + item.FieldName + ':</strong> ' + item.FieldValue + '</div>'
		: result;
    }
    
    function getInfoTitle(memberInfo)
    {
      /*debug*/log('getInfoTitle');
	  return (
	    memberInfo.PopupInfo
		&& memberInfo.PopupInfo[0]
		&& memberInfo.PopupInfo[0].FieldValue
	  ) || resources.EmptyNameLabel;
    }

    function renderInfoWindowContent(memberInfo)
    {
      /*debug*/log('getInfoWindowContent');

      return memberInfo.PopupInfo.reduce(
        renderInfoItem,
        '<h5><a href="' + WA.String.format(resources.ProfileUrlTemplate, memberInfo.Id) + '" target="_blank">' + getInfoTitle(memberInfo) + '</a></h5>'
      );
    }

    function createBounds()
    {
      /*debug*/log('createBounds');
      bounds  = new mapApi.LatLngBounds();
    }

    function removeMarker(marker)
    {
      /*debug*/log('removeMarker');
      marker.setMap(null);
    }

    function removeAllMarkers()
    {
      /*debug*/log('removeAllMarkers');

      if (clusterer)
      {
        clusterer.clearMarkers();
      }

      markers.forEach(removeMarker);
      markers = [];
      zIndex = 0;
    }

    function addPlace(place)
    {
      /*debug*/log('addPlace');

      if (!place.geometry)
      {
        /*debug*/log('Returned place contains no geometry');
        return;
      }

      if (place.geometry.viewport)
      {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      }
      else
      {
        bounds.extend(place.geometry.location);
      }
    }

    function addMarker(contact)
    {
      /*debug*/log('addMarker');

      var infoWindow =  new mapApi.InfoWindow({
          content: renderInfoWindowContent(contact)
        }),
        position = new mapApi.LatLng(contact.Latitude, contact.Longitude),
        marker = new mapApi.Marker({
          position: position,
          map: map,
          icon: markerUrl,
          title: getInfoTitle(contact)
        });

      marker.addListener('click', function()
      {
        zIndex++;

        infoWindow.setZIndex(zIndex);
        infoWindow.open(map, marker);

        marker.setZIndex(zIndex);
        marker.setIcon(visitedMarkerUrl);
      });
      markers.push(marker);

      bounds.extend(position);
    }

    function drawMarkers(contacts)
    {
      /*debug*/log('drawMarkers');

      createBounds();
      contacts.forEach(addMarker);
      fitMapToBounds();
    }

    function fitMapToBounds()
    {
      /*debug*/log('fitToBounds');

      if (!markers.length)
      {
        map.setZoom(zoom);
        return;
      }

      map.fitBounds(bounds); // auto-zoom
      map.panToBounds(bounds); // auto-center
    }

    function createSearchBox()
    {
      /*debug*/log('createSearchBox');
      if (!mapApi.places) { return; }

      var input = document.createElement('input');

      input.id = viewModel.id + '-searchbox';
      input.type = 'text';
      input.style.cssText = 'margin-top: 10px;' +
        'font-family: Roboto, Arial, sans-serif;' +
        'border: 1px solid transparent; border-radius: 2px 0 0 2px;' +
        'box-sizing: border-box; -moz-box-sizing: border-box;' +
        'min-width: 185px;' +
        'height: 29px;' +
        'padding: 0 10px;' +
        'outline: none;' +
        'box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);' +
        'background-color: #fff;' +
        'font-size: 15px;' +
        'text-overflow: ellipsis;';

      input.placeholder = resources.SearchBoxEmptyLabel;

      searchBox = new mapApi.places.SearchBox(input);

      map.controls[mapApi.ControlPosition.TOP_LEFT].push(input);

      searchBox.addListener('places_changed', onPlacesChanged);
    }

    function onPlacesChanged()
    {
      /*debug*/log('onPlacesChanged');

      var places = searchBox.getPlaces();

      if (places && places.length)
      {
        createBounds();
        places.forEach(addPlace);
        fitMapToBounds();
      }
    }

    function drawMap(contacts)
    {
      /*debug*/log('drawMap');

      if (isDisposed || !contacts) { return; }

      var mapContainer = mapContainerId && WA.$(mapContainerId, mapWindow);

      /*debug*/if (!mapContainer) { throw new Error('Invalid mapContainerId'); }

      map = new mapApi.Map(mapContainer, {
        center: new mapApi.LatLng(0, 0),
        zoom: zoom,
        mapTypeId: mapApi.MapTypeId.ROADMAP
      });

      createSearchBox();
      drawMarkers(contacts);

      clusterer = new WaGoogleMapsMarkerClusterer(map, markers, { imagePath: clusterImgPath });

      markersInfo = new WaMappingLocationMarkersInfo({}, {
        map: map,
        updaterPosition: mapApi.ControlPosition.BOTTOM_CENTER,
        resources: {
          AdminInfoMessage: resources.AdminInfoMessage,
          AdminOverLimitMessageTitle: resources.AdminOverLimitMessageTitle,
          AdminOverLimitMessage: resources.AdminOverLimitMessage,
          UpdateMarkersLabel: resources.UpdateMarkersLabel,
          UpdatingMarkersLabel: resources.UpdatingMarkersLabel,
          ReadyToUpdateMarkersTemplate: resources.ReadyToUpdateMarkersTemplate,
          UpdatingFinishedLabel: resources.UpdatingFinishedLabel,
          MarkerOnTheMapLabel: resources.MarkerOnTheMapLabel,
          GeocodingFailedZeroResultsLabel: resources.GeocodingFailedZeroResultsLabel,
          GeocodingFailedInvalidRequestLabel: resources.GeocodingFailedInvalidRequestLabel
        },
        statuses: mapApi.GeocoderStatus,
        adminMode: adminMode,
        parentComponent: pThis
      });
      markersInfo.UpdateClick.addHandler(drawGeocodedContacts);

      mapApi.event.addListener(map, 'bounds_changed', onMapBoundsChanged);

      if (adminMode)
      {
        WA.AdminPanel.PageModeChanged.addHandler(onPageModeChanged);
      }
    }

    function fixSearchBoxFullScreen()
    {
      // Fix Google places suggestion dropdowns visibility in full screen mode
      document.querySelectorAll('.pac-container').forEach(function(container)
      {
        container.style.zIndex = container.style.zIndex || 10000000000;
      });
    }

    function onMapBoundsChanged()
    {
      var mapHolder = map.getDiv().firstChild,
        isPrevFullScreenModeOn = isFullScreenModeOn;

      isFullScreenModeOn = !!(
        mapHolder
        && mapHolder.offsetHeight === window.innerHeight
        && mapHolder.offsetWidth === window.innerWidth
      );

      if (isFullScreenModeOn && isPrevFullScreenModeOn !== isFullScreenModeOn)
      {
        fixSearchBoxFullScreen();
      }
    }

    function onPageModeChanged(sender, args)
    {
      if (args === WA.AdminPanel.PageModeType.Edit)
      {
        drawGeocodedContacts();
      }
    }

    function onGoogleMapsApiLoaded()
    {
      /*debug*/log('onGoogleMapsApiLoaded');

      if (isDisposed) { return; }

      mapApi = google.maps;

      if (!mapApi)
      {
        // TODO:Vladimir Handle api load errors?
        /*debug*/throw new Error('mapApi was not defined.');
        return;
      }

      var mappingLocationApiClient = new WaMappingLocationServiceApiClient(
        {
          authorizationToken: resources.AuthorizationToken,
          endpoint: resources.MappingLocationServiceEndpointUrl,
          fastIntegrationEnabled: resources.FastIntegrationEnabled,
          environmentId: resources.EnvironmentId,
          environmentReference: resources.EnvironmentReference
        },
        { parentComponent: pThis }
      );

      mappingLocationApiClient.ContactInfo()
        .done(onContactsInfoReceived)
        .fail(onContactsInfoRequestFailed);
    }


    function onGadgetDeleted(sender, args)
    {
      /*debug*/log('onGadgetDeleted');

      args = args || {};

      if (args.componentId == viewModel.id)
      {
        map = null;
        bounds = null;
        searchBox = null;
        dispose();
      }
    }


    function isGeocoded(contact)
    {
        return contact.AddressGeocoded;
    }

    function wasGeocodeFailed(contact)
    {
      return contact.GeocodeFailed;
    }

    function groupContactsByGeocoding(accumulator, contact)
    {
      // drop contacts which geocoding was unsuccessful
      !wasGeocodeFailed(contact) && accumulator[isGeocoded(contact) ? 'processed' : 'unprocessed'].push(contact);

      return accumulator;
    }

    function getContactAddress(contact)
    {
      return {
        GeocodeFailed: contact.GeocodeFailed,
        Address: contact.Address,
        FormattedAddress: contact.FormattedAddress,
        Source: geocodeAddressSource,
        Geometry: {
          Location: {
            Longitude: contact.Longitude,
            Latitude: contact.Latitude
          }
        },
        Token: contact.Token != null ? contact.Token : '',
        ContactId: contact.Id
      };
    }

    function drawGeocodedContacts()
    {
      if (geocodedContacts.length)
      {
        geocodedContacts.forEach(addMarker);
        clusterer.addMarkers(
          markers.slice(-1 * geocodedContacts.length)
        );
        fitMapToBounds();

        geocodedContacts = [];
      }

      showContactsProcessingInfo();
    }

    function getContactGeocode(geocoder, unprocessedContacts, addressesToUpdate, addressesUpdater)
    {
      if (isDisposed) { return; }

      var contact = unprocessedContacts.shift();

      if (!contact)
      {
        showContactsProcessingInfo();

        if (addressesToUpdate.length)
        {
          addressesUpdater(addressesToUpdate);
        }

        return;
      }

      if (!contact.Address)
      {
        // just drop contact with empty Address, and move on
        getContactGeocode(geocoder, unprocessedContacts, addressesToUpdate, addressesUpdater);
        return;
      }

      geocoder.geocode({ address: contact.Address },
        function(results, status)
        {
          if (isDisposed) { return; }

          var statuses = mapApi.GeocoderStatus;

          if (status === statuses.OK)
          {
            var info = results[0];

            contact.GeocodeFailed = false;
            contact.AddressGeocoded = true;
            contact.FormattedAddress = info.formatted_address;
            contact.Longitude = info.geometry.location.lng();
            contact.Latitude = info.geometry.location.lat();

            geocodedContacts.push(contact);

            if (markers.length < minMarkers || isAdminEditModeActive())
            {
              drawGeocodedContacts();
            }

            addressesToUpdate.push(getContactAddress(contact));

            if (addressesToUpdate.length === geocodeChunkSize)
            {
              addressesUpdater(addressesToUpdate);
              addressesToUpdate = [];
            }
          }
          else
          {
            contact.GeocodeFailed = true;
            geocodeFailures[status] = geocodeFailures[status] || [];

            if (status === statuses.OVER_QUERY_LIMIT || status === statuses.UNKNOWN_ERROR)
            {
              if (status === statuses.OVER_QUERY_LIMIT)
              {
                geocodeDuration = Math.min(2 * geocodeDuration, maxGeocodeDuration);
              }

              if (typeof contact.GeocodingRetries !== 'number')
              {
                contact.GeocodingRetries = 0;
              }
              else
              {
                contact.GeocodingRetries++;
              }

              if (contact.GeocodingRetries < maxGeocodingRetries)
              {
                unprocessedContacts.push(contact);
              }
              else
              {
                geocodeFailures[status].push(contact);
              }
            }
            else
            {
              if (status === statuses.ZERO_RESULTS)
              {
                /*
                  That condition means that address cannot be geocoded , like "6921 Maple Wood Point"
                  despite such a contact is marked with contact.GeocodeFailed === true, it should be
                  saved to Address service database to prevent subsequent Geocoding queries
                */

                addressesToUpdate.push(getContactAddress(contact));

                if (addressesToUpdate.length === geocodeChunkSize)
                {
                  addressesUpdater(addressesToUpdate);
                  addressesToUpdate = [];
                }
              }

              geocodeFailures[status].push(contact);
            }
          }

          showContactsProcessingInfo();

          WA.throttle(function()
          {
            getContactGeocode(geocoder, unprocessedContacts, addressesToUpdate, addressesUpdater);
          }, geocodeDuration);
        }
      );
    }

    function onContactsInfoReceived(info)
    {
      /*debug*/log('onContactsInfoReceived');

      if (WA.Object.getTypeString(info) !== 'array')
      {
        /*debug*/throw new Error('Data has wrong format.');
        return;
      }

      var contacts = info.reduce(groupContactsByGeocoding, { processed: [], unprocessed: [] }),
        addressesApiClient = new WaAddressServiceApiClient(
          {
            authorizationToken: resources.AuthorizationToken,
            endpoint: resources.AddressServiceEndpointUrl,
            fastIntegrationEnabled: resources.FastIntegrationEnabled,
            environmentId: resources.EnvironmentId
          },
          { parentComponent: pThis }
        );

      drawMap(contacts.processed);

      contactsAmount = info.length;
      minMarkers = Math.min(minMarkers, contactsAmount);

      showContactsProcessingInfo();

      getContactGeocode(
        new mapApi.Geocoder(),
        contacts.unprocessed,
        [],
        addressesApiClient.geocode
      );
    }

    function showContactsProcessingInfo()
    {
      var failures = {},
        failed = 0;

      for (var key in geocodeFailures)
      {
        if (geocodeFailures.hasOwnProperty(key))
        {
          failures[key] = geocodeFailures[key].length;
          failed += geocodeFailures[key].length;
        }
      }

      markersInfo.setState({
        total: contactsAmount,
        shown: markers.length,
        readyToShow: geocodedContacts.length,
        failed: failed,
        failures: failures,
        finished: markers.length === contactsAmount - failed
      });

      WA.Gadgets.notifyGadgetChanged();
    }


    function onContactsInfoRequestFailed(error)
    {
      /*debug*/log('onContactsInfoRequestFailed');
      // TODO:Vladimir Handle service errors
      /*debug*/alert('Location service error: ' + error.statusText);
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
      if (isDisposed) { return; }

      /*debug*/log('dispose');

      isDisposed = true;

      pThis.Dispose.fireHandlers({ id: viewModel.id });

      parentComponent.GoogleMapsApiLoaded.removeHandler(onGoogleMapsApiLoaded);
      WA.Gadgets.GadgetDeleted.removeHandler(onGadgetDeleted);
      parentComponent.Dispose.removeHandler(dispose);

      if (mapApi && map)
      {
        mapApi.event.clearInstanceListeners(map);
      }

      if (adminMode)
      {
        WA.AdminPanel.PageModeChanged.removeHandler(onPageModeChanged);
      }

      removeAllMarkers();

      viewModel = null;
      resources = null;
      parentComponent = null;
      mapApi = null;
      markers = null;
      clusterer = null;
      geocodeFailures = null;
      infoContainer = null;
      geocodedContacts = null;
      markersInfo = null;

      pThis.RenderComplete = null;
      pThis.Dispose = null;
    }

    init();
  }

})(window, window.WA);