<$if (Model.CustomHtmlContent != "")$>
  <$control.StyledWrappers(AlwaysShowArtBox = "true", GadgetBegin = "true", GadgetTitleBegin = "true", GadgetTitleText = Model.Appearance.Title, GadgetTitleEnd = "true",  GadgetBodyBegin = "true")$>
<$else$>
  <$control.StyledWrappers(AlwaysShowArtBox = "true", GadgetBegin = "true", GadgetTitleBegin = "true", GadgetTitleText = Model.Appearance.Title, GadgetTitleEnd = "true")$>
<$endif$>
<$Model.CustomHtmlContent$>
<$if (Model.CustomHtmlContent != "")$>
  <$control.StyledWrappers(AlwaysShowArtBox = "true", GadgetBodyEnd = "true", GadgetEnd = "true")$>
<$else$>
  <$control.StyledWrappers(AlwaysShowArtBox = "true", GadgetEnd = "true")$>
<$endif$>
