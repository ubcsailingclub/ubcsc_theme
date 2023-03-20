<$if (Model.IsEmpty)$>
<div>&nbsp;</div>
<p>No albums to show</p>
<div>&nbsp;</div>
<$else$>
<div class="camera_wrap camera_charcoal_skin" id="idPhotoAlbumSummaryGadget_Data_<$Model.ComponentId$>">
  <$Model.Albums:Item()$>
</div>
<div id="idPhotoAlbumSummaryGadget_Container_<$Model.ComponentId$>" class="PhotoAlbumSummaryGadgetContainer">
  <div tabindex="1" class="PhotoAlbumSummaryGadgetFocus"></div>
  <div class="containerPhotoOuter">
    <div class="containerPhotoInner"></div>
  </div>
  <div class="PhotoAlbumSummaryGadgetScrollElement">
    <div class="PhotoAlbumSummaryGadgetScrollBar">
      <div class="PhotoAlbumSummaryGadgetSlider">
        <svg width="8px" height="14px" viewBox="0 0 8 14" xmlns="http://www.w3.org/2000/svg" >
          <g id="Artboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square" stroke-opacity="0.3">
            <line x1="0.5" y1="0.5" x2="0.5" y2="13.5" id="Line-2" stroke="#FFFFFF"></line>
            <line x1="4" y1="0.5" x2="4" y2="13.5" id="Line-2" stroke="#FFFFFF"></line>
            <line x1="7.5" y1="0.5" x2="7.5" y2="13.5" id="Line-2" stroke="#FFFFFF"></line>
          </g>
        </svg>
      </div>
    </div>
  </div>
</div>
<script language="javascript">
  new PhotoAlbumSummaryGadget.RenderSummary('<$Model.ComponentId$>', '<$Model.Settings.NumberOfRows$>', '<$Model.Settings.NumberOfColumns$>', '<$Model.Settings.SizePx$>', '<$Model.Settings.Layout$>');
</script>
<$endif$>