<$if (Model.Text != "")$>
  <$control.StyledWrappers(GadgetBegin = "true", GadgetTitleBegin = "true", GadgetTitleText = Model.Appearance.Title, GadgetTitleEnd = "true",  GadgetBodyBegin = "true", GadgetContent = "true")$>
<$else$>
  <$control.StyledWrappers(GadgetBegin = "true", GadgetTitleBegin = "true", GadgetTitleText = Model.Appearance.Title, GadgetTitleEnd = "true",  GadgetBodyBegin = "true", GadgetContent = "true")$>
<$endif$>

<$Model.Text$>

<$if (Model.Text != "")$>
  <$control.StyledWrappers(GadgetBodyEnd = "true", GadgetEnd = "true")$>
<$else$>
  <$control.StyledWrappers(GadgetBodyEnd = "true", GadgetEnd = "true")$>
<$endif$>

<$if (Model.CssStyle.Height != "")$>
<script type="text/javascript">if (window.WA) { new WaContentGadgetResizer({ id: '<$Model.Id$>' }); }</script>
<$endif$>

<$if (Model.Settings.HidePicturesInMobileView)$>
<script type="text/javascript">
    jq$('#<$Model.Id$>').addClass("hideMobilePictures");
</script>
<$endif$>

