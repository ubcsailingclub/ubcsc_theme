<$control.StyledWrappers(GadgetBegin = "true", GadgetTitleBegin = "true", GadgetTitleText = Model.Appearance.Title, GadgetTitleEnd = "true",  GadgetBodyBegin = "true")$>

	<$if (Model.DataIsEmpty)$>
		<ul>
			<li class="last"><div class="title"><$Model.NoDataText$></div></li>
		</ul>
	<$else$>
		<ul>
			<$Model.Events:Item()$>
		</ul>
	<$endif$>
	
<$control.StyledWrappers(GadgetBodyEnd = "true", GadgetEnd = "true")$>
