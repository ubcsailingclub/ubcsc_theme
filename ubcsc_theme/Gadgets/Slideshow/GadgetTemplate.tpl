<$control.StyledWrappers(GadgetBegin = "true", GadgetTitleBegin = "true", GadgetTitleText = Model.Appearance.Title, GadgetTitleEnd = "true",  GadgetBodyBegin = "true")$>

<$if (Model.IsImagesExist)$>
<script language="javascript">

	jq$(function(){

		var imgAmount = jq$('#camera_wrap_<$Model.ComponentId$> > div').size();
		var cameraNavigation = ( imgAmount <= 1 ) ? false : <$Model.Settings.AllowUserManuallyNavigate$>,
				cameraAutoAdvance = ( imgAmount <= 1 ) ? false : true;

		jq$('#camera_wrap_<$Model.ComponentId$>').camera
		(
		  {
			componentId: '<$Model.ComponentId$>',
			thumbnails: true,
			loader: <$if(Model.Settings.ShowCountdownBar)$>'bar'<$else$>'none'<$endif$>,
			fx: '<$(Model.Settings.TransitionEffect)$>',
			time: (<$Model.Settings.DisplayImage$>*1000),
			transPeriod: (<$Model.Settings.TransitionTime$>),
			portrait: <$if(Model.Settings.FitImage)$>false<$else$>true<$endif$>,
			randomSlide: <$if(Model.Settings.RandomSlide)$>true<$else$>false<$endif$>,
			playPause: false,
			pauseOnClick: false,
			thumbnails: cameraNavigation,
			pagination: cameraNavigation,
			navigation: cameraNavigation,
			autoAdvance: cameraAutoAdvance,
			mobileAutoAdvance: cameraAutoAdvance,
			height: <$if (Model.Settings.GalleryLayout=="Landscape")$>'56%'<$endif$>
					<$if (Model.Settings.GalleryLayout=="Portrait")$>'133.3%'<$endif$>
					<$if (Model.Settings.GalleryLayout=="Square")$>'100%'<$endif$>
					<$if (Model.Settings.GalleryLayout=="FixedHeight")$>'<$Model.Settings.LayoutFixedHeight$>px'<$endif$>
		  }
		);		
	});

</script>

	<div class="camera_wrap camera_charcoal_skin" id="camera_wrap_<$Model.ComponentId$>">
		<$Model.Images:Item()$>
	</div>
<$else$>
	<div>&nbsp;</div>
	<p>No pictures to show</p>
	<div>&nbsp;</div>
<$endif$>


<$control.StyledWrappers(GadgetBodyEnd = "true", GadgetEnd = "true")$>