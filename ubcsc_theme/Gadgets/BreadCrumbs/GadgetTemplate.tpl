<$control.StyledWrappers(GadgetBegin = "true", GadgetTitleBegin = "true", GadgetTitleText = Model.Appearance.Title, GadgetTitleEnd = "true",  GadgetBodyBegin = "true")$>
<ul>
	<$Model.Items:{
		<$if (!it.IsLastItem)$>
			<li><a href="<$it.Url$>"><$it.Title$></a></li>
		<$endif$>

		<$if (it.IsLastItem)$>
			<li class="last"><span><$it.Title$></span></li>
		<$endif$>
	}$>
</ul>
<$control.StyledWrappers(GadgetBodyEnd = "true", GadgetEnd = "true")$>