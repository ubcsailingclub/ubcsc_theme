(function (window, WA)
{
  if (!WA) { return; }

  if (!window.PhotoAlbumsDialog)
  {
    window.PhotoAlbumsDialog = {};
  }

  PhotoAlbumsDialog.uploadPhotosDialog = new WA.topWindow.BonaDialogHandler({
    name: 'PhotoAlbumsDialog_UploadPhotosDialog', //DO NOT USE DOTS!!
    dialogParameters:
    {
      clipContainerId: 'idClipMainContainer',
      mainContainerId: 'contentDiv',

      directURLTemplate: '/Content/Members/PhotoGallery/UploadPhotosDialog.aspx?frameMode=0{albumParam}&version=' + WA.version,
      reloadURLTemplate: '/Content/Pictures/PhotoGallery/UploadPhotosInnerDialog.aspx?version=' + WA.version + '{albumParam}',

      top: null,
      left: null,
      width: 430,
      height: 355,
      minWidth: 430,
      minHeight: 355,
      isMoveable: true,
      isResizeable: false,
      isModal: true,
      isScrollable: false,

      callBackParameters: {}
    },
    onDialogClose: function ()
    {
      if (PhotoGallery.Get_UploadAction().value == '1')
      {
        PhotoGallery.Get_UploadButton().click();
      }
    }
  });

})(window, window.WA);