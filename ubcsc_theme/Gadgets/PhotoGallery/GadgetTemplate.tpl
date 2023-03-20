<$if (Model.IsImagesExist)$>
    <div class="camera_wrap camera_charcoal_skin" id="idPhotoGalleryGadget_Data_<$Model.ComponentId$>">
        <$Model.Images:Item()$>
    </div>

    <div id="idPhotoGalleryGadget_Container_<$Model.ComponentId$>" class="photoGalleryGadgetContainer">
        <div tabindex="1" class="photoGalleryGadgetFocus"></div>
        <div class="containerPhotoOuter">
            <div class="containerPhotoInner"></div>
        </div>
        <div class="photoGalleryGadgetScrollElement">
            <div class="photoGalleryGadgetScrollBar">
                <div class="photoGalleryGadgetSlider">
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
        new PhotoGalleryGadget.PhotoGallery('<$Model.ComponentId$>', '<$Model.Settings.NumberOfRows$>', '<$Model.Settings.NumberOfColumns$>', '<$Model.Settings.SizePx$>', '<$Model.Settings.Layout$>', 'Name');
    </script>

    <$else$>
        <div>&nbsp;</div>
        <p>No pictures to show</p>
        <div>&nbsp;</div>
    <$endif$>