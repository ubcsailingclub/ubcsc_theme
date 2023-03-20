<$control.StyledWrappers(GadgetBegin = "true", GadgetTitleBegin = "true", GadgetTitleText = Model.Appearance.Title, GadgetTitleEnd = "true",  GadgetBodyBegin = "true")$>

<$if (Model.Mode == Model.Modes.FillData)$>
<$Model.GadgetHtml$>
<$endif$>

<$if (Model.Mode == Model.Modes.Disabled)$>
<$Model.GadgetHtml$>
<$endif$>

<$if (Model.Mode == Model.Modes.Widget)$>
<$Model.GadgetHtml$>
<$endif$>

<$control.StyledWrappers(GadgetBodyEnd = "true", GadgetEnd = "true")$>
