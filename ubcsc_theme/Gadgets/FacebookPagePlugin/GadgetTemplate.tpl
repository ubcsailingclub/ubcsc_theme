<$control.StyledWrappers(GadgetBegin = "true", GadgetTitleBegin = "true", GadgetTitleText = Model.Appearance.Title, GadgetTitleEnd = "true",  GadgetBodyBegin = "true")$>

<script type="text/javascript">
  (function ()
  {
    'use strict';

    function initializeGadget()
    {
	  if (window.WaFacebookPagePluginManager)
	  {
		WaFacebookPagePluginManager.createGadget({ id: '<$Model.ComponentId$>' }, 
		{ 
			facebookPagePluginContainerId: 'facebook_<$Model.ComponentId$>'
		});
	  }	  
	}

    if(window.BonaPage) { BonaPage.addPageStateHandler(BonaPage.PAGE_PARSED, initializeGadget, BonaPage.HANDLERTYPE_ALWAYS); }
  })();
</script>

<div id="facebook_<$Model.ComponentId$>">  
<div class="fb-page" style="width: 100%;" 
  data-href="<$Model.Settings.FacebookPageUrl$>"
  data-width="<$Model.Settings.FeedWidth$>"
  data-height="<$Model.Settings.FeedHeight$>"
  data-hide-cover="<$if(!Model.Settings.ShowCoverPhoto)$>true<$else$>false<$endif$>" 
  data-show-facepile="<$Model.Settings.ShowFacePile$>" 
  data-show-posts="<$Model.Settings.ShowPagePosts$>"></div>
</div>

<$control.StyledWrappers(GadgetBodyEnd = "true", GadgetEnd = "true")$>


