<$control.StyledWrappers(GadgetBegin = "true", GadgetTitleBegin = "true", GadgetTitleText = Model.Appearance.Title, GadgetTitleEnd = "true",  GadgetBodyBegin = "true")$>
<script type="text/javascript">
    (function ()
    {
      'use strict';
	
      function initializeGadget()
	  {
	    if (window.WaGoogleMapsGadgetsManager)
		{
		  WaGoogleMapsGadgetsManager.createGadget
		  (
		    WaMappingLocation,
		    {
			  id: '<$Model.ComponentId$>',
			  apiKey: '<$Model.Settings.JsKey$>',
			  libraries: ['places']
			},
	        {
			  mapContainerId: 'idGoogleMapCanvas_<$Model.ComponentId$>',
			  mapWindow: window,
			  clusterImgPath: '<$PageModel.BaseUrl$>/Gadgets/MappingLocation/Images/m',
			  markerUrl: '<$PageModel.BaseUrl$>/Gadgets/MappingLocation/Images/marker.png',
			  visitedMarkerUrl: '<$PageModel.BaseUrl$>/Gadgets/MappingLocation/Images/visited-marker.png',
			  settings: {
			    Duration: <$Model.Config.Duration$>,
				MaxDuration: <$Model.Config.MaxDuration$>,
				MaxRetries: <$Model.Config.MaxRetries$>,
				MinMarkersToShowOnStart: <$Model.Config.MinMarkersToShowOnStart$>,
				AddressSource: '<$Model.Config.AddressSource$>',
				ChunkSizeToStore: <$Model.Config.ChunkSizeToStore$>
			  },
			  resources: {
			    EmptyNameLabel: '<$Model.Text.EmptyNameLabel$>',
				SearchBoxEmptyLabel: '<$Model.Text.SearchBoxEmptyLabel$>',
				AdminInfoMessage: '<$Model.Text.AdminInfoMessage$>',
				AdminOverLimitMessageTitle: '<$Model.Text.AdminOverLimitMessageTitle$>',
				AdminOverLimitMessage: '<$Model.Text.AdminOverLimitMessage$>',
				UpdateMarkersLabel: '<$Model.Text.UpdateMarkersLabel$>',
				UpdatingMarkersLabel: '<$Model.Text.UpdatingMarkersLabel$>',
				ReadyToUpdateMarkersTemplate: '<$Model.Text.ReadyToUpdateMarkersTemplate$>',
				UpdatingFinishedLabel: '<$Model.Text.UpdatingFinishedLabel$>',
				MarkerOnTheMapLabel: '<$Model.Text.MarkerOnTheMapLabel$>',
				GeocodingFailedZeroResultsLabel: '<$Model.Text.GeocodingFailedZeroResultsLabel$>',
				GeocodingFailedInvalidRequestLabel: '<$Model.Text.GeocodingFailedInvalidRequestLabel$>',
				ProfileUrlTemplate: '<$Model.Urls.ProfileUrlTemplate$>',
                AuthorizationToken: '<$PageModel.AuthorizationToken$>',
		        MappingLocationServiceEndpointUrl: '<$Model.Urls.MemberLocationServiceGetContacts$>',
		        AddressServiceEndpointUrl: '<$Model.Urls.AddressServiceUpdate$>',
				FastIntegrationEnabled: <$PageModel.FastIntegrationEnabled$>,
				EnvironmentId: '<$PageModel.EnvironmentId$>',
				EnvironmentReference: '<$PageModel.EnvironmentReference$>'
			  }
			}
	      );
	    }	  
	  }
	  
	  jq$(initializeGadget);
	  
	})();
</script>

<div id="idGoogleMapCanvas_<$Model.ComponentId$>" style="width:100%; height:<$Model.Settings.Height$>px;"></div>
<$control.StyledWrappers(GadgetBodyEnd = "true", GadgetEnd = "true")$>