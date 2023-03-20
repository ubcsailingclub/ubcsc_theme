<$control.StyledWrappers(GadgetBegin = "true", GadgetTitleBegin = "true", GadgetTitleText = Model.Appearance.Title, GadgetTitleEnd = "true", GadgetBodyBegin = "true")$>
<$if (Model.Settings.Mode == "Advanced")$>
    <$Model.Settings.CustomCode$>
<$endif$>

<$if (Model.Settings.MapType == "Static")$>  
  <img width="<$Model.Settings.Width$>" height="<$Model.Settings.Height$>" 
    src="http://maps.googleapis.com/maps/api/staticmap?center=<$Model.Settings.Address$>&zoom=<$Model.Settings.Zoom$>&maptype=roadmap&size=<$Model.Settings.Width$>x<$Model.Settings.Height$>&sensor=false&markers=size:mid%7Ccolor:red%7C<$Model.Settings.Address$>" />
<$else$>
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
		    WaGoogleMap,
		    { id: '<$Model.ComponentId$>' },
	        { address: '<$Model.Settings.Address$>', zoom: <$Model.Settings.Zoom$>, mapContainerId: 'idGoogleMapCanvas_<$Model.ComponentId$>', mapWindow: window }
	      );
	    }	  
	  }
  
      if(BonaPage) { BonaPage.addPageStateHandler(BonaPage.PAGE_PARSED, initializeGadget, BonaPage.HANDLERTYPE_ALWAYS); }
	  
	})();
  </script>

  <div id="idGoogleMapCanvas_<$Model.ComponentId$>" style="width:100%; height:<$Model.Settings.Height$>px;"></div>
<$endif$>
<$control.StyledWrappers(GadgetBodyEnd = "true", GadgetEnd = "true")$>

