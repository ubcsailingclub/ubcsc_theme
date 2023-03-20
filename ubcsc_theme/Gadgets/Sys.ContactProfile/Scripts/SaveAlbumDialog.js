(function(window, WA) {
  if (!WA) { return; }  

  if (!window.PhotoAlbumsDialog)
  {
    window.PhotoAlbumsDialog = {};
  }
    
  window.PhotoAlbumsDialog.saveAlbumDialog = new WA.topWindow.BonaDialogHandler({
    name: 'PhotoAlbumsDialog_SaveAlbumDialog', //DO NOT USE DOTS!!
    dialogParameters: 
    {
      clipContainerId: 'idPrimaryContentContainer',
      mainContainerId: 'idMainContainer',

      directURLTemplate: '/Content/Members/PhotoGallery/CreateAlbumDialog.aspx?frameMode=0{albumParam}&version=' + WA.version,
      reloadURLTemplate: '/Content/Members/PhotoGallery/CreateAlbumDialog.aspx?frameMode=1{albumParam}&version=' + WA.version,

      top: null,
      left: null,
      width: 500,
      height: 290,
      minWidth: 500,
      minHeight: 290,
      isMoveable: true,
      isResizeable: false,
      isModal: true,
      isScrollable: true,

      callBackParameters: {}
    }
  });
    
}) (window, window.WA);