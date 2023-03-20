<$control.StyledWrappers(GadgetBegin = "true", GadgetTitleBegin = "true", GadgetTitleText = Model.Appearance.Title, GadgetTitleEnd = "true",  GadgetBodyBegin = "true")$>

<div class="orientation<$Model.Settings.Layout$>">

<$Model.Settings.SocialButtons:{
		
	        <$if (it == "FacebookValue")$>
			<div class="socialSharingButton">
				<$Model.Settings.FacebookCode$>
			</div>
		<$endif$>

		<$if (it == "TwitterValue")$>
			<div class="socialSharingButton">
				<$Model.Settings.TwitterCode$>
			</div>
		<$endif$>

		<$if (it == "LinkedInValue")$>
			<div class="socialSharingButton">
				<$Model.Settings.LinkedInCode$>
			</div>
		<$endif$>

}$>

</div>

<$control.StyledWrappers(GadgetBodyEnd = "true", GadgetEnd = "true")$>





