(function ()
{
  if (!window.PhotoGallery)
  {
    window.PhotoGallery = {};
  }

  var albumParam = '';
  var processingText = 'Please wait...';
  var deleteConfirmation = 'Are you sure you want to delete?';
  var deletePhotoConfirmation = 'Are you sure you want to delete this photo?';
  var saveAction = false;
  var photosHolder = false;
  var photosHolderHeight = false;
  var titleTextBox = false;
  var descriptionTextBox = false;
  var saveButton = false;
  var altSaveButton = false;
  var saveLinkButton = false;
  var deleteButton = false;
  var cancelButton = false;
  var uploadButton = false;
  var uploadAction = false;
  var viewModeRadioContainer = false;
  var uploadButtonContainer = false;
  var descriptionContainer = false;
  var descriptionHeightUrlKey = false;
  var countPhotosPerRowUrlKey = false;
  var pagingKey = false;
  var saveAlbumDialogInited = false;
  var uploadPhotosDialogInited = false;
  var photoItemId = false;
  var photoItemTimeout = false;
  var actionIsRunning = false;
  var pendingSender = false;
  var pendingImageDivId = false;
  var pendingFullDescriptionDivId = false;
  var pendingSmallDescriptionDivId = false;

  PhotoGallery.InitPhotoGallery = initPhotoGallery;
  PhotoGallery.InitJsFunctions = initJsFunctions;
  PhotoGallery.Page_Parsed = pageParsed;
  PhotoGallery.Page_Unloading = pageUnloading;
  PhotoGallery.CloseSaveAlbumDialog = closeSaveAlbumDialog;
  PhotoGallery.CloseUploadPhotosDialog = closeUploadPhotosDialog;
  PhotoGallery.Get_SaveAction = getSaveAction;
  PhotoGallery.Get_SaveTitle = getSaveTitle;
  PhotoGallery.Get_SaveDescription = getSaveDescription;
  PhotoGallery.Get_SaveButton = getSaveButton;
  PhotoGallery.Get_DeleteButton = getDeleteButton;
  PhotoGallery.Get_UploadButton = getUploadButton;
  PhotoGallery.Get_UploadAction = getUploadAction;
  PhotoGallery.ProcessingButton_OnClick = processingButtonClick;
  PhotoGallery.DeleteButton_OnClick = deleteButtonClick;
  PhotoGallery.UploadButton_OnClick = uploadButtonClick;
  PhotoGallery.SaveButton_OnClick = saveButtonClick;
  PhotoGallery.ImageMenu_OnMouseOver = imageMenuMouseOver;
  PhotoGallery.ImageMenu_OnMouseOut = imageMenuMouseOut;
  PhotoGallery.MenuButton_OnMouseOver = menuButtonMouseOver;
  PhotoGallery.MenuButton_OnMouseOut = menuButtonMouseOut;
  PhotoGallery.MenuButton_OnClick = menuButtonClick;
  PhotoGallery.NavigateToList = navigateToList;
  PhotoGallery.CheckLength = checkLength;

  function initPhotoGallery(p)
  {
    if (p.albumParam) albumParam = p.albumParam;
    if (p.processingText) processingText = p.processingText;
    if (p.deleteConfirmation) deleteConfirmation = p.deleteConfirmation;
    if (p.deletePhotoConfirmation) deletePhotoConfirmation = p.deletePhotoConfirmation;
    if (p.photosHolderId) photosHolder = WA.$(p.photosHolderId, window);
    if (p.saveActionId) saveAction = WA.$(p.saveActionId, window);
    if (p.titleTextBoxId) titleTextBox = WA.$(p.titleTextBoxId, window);
    if (p.descriptionTextBoxId) descriptionTextBox = WA.$(p.descriptionTextBoxId, window);
    if (p.saveButtonId) saveButton = WA.$(p.saveButtonId, window);
    if (p.altSaveButtonId) altSaveButton = WA.$(p.altSaveButtonId, window);
    if (p.saveLinkButtonId) saveLinkButton = WA.$(p.saveLinkButtonId, window);
    if (p.deleteButtonId) deleteButton = WA.$(p.deleteButtonId, window);
    if (p.cancelButtonId) cancelButton = WA.$(p.cancelButtonId, window);
    if (p.uploadButtonId) uploadButton = WA.$(p.uploadButtonId, window);
    if (p.uploadActionId) uploadAction = WA.$(p.uploadActionId, window);
    if (p.viewModeRadioContainerId) viewModeRadioContainer = WA.$(p.viewModeRadioContainerId, window);
    if (p.uploadButtonContainerId) uploadButtonContainer = WA.$(p.uploadButtonContainerId, window);
    if (p.descriptionContainerId) descriptionContainer = WA.$(p.descriptionContainerId, window);
    if (p.descriptionHeightUrlKey) descriptionHeightUrlKey = p.descriptionHeightUrlKey;
    if (p.countPhotosPerRowUrlKey) countPhotosPerRowUrlKey = p.countPhotosPerRowUrlKey;
    if (p.pagingUrlKey) pagingKey = p.pagingUrlKey;
  }

  function initJsFunctions()
  {
    setDisplayInline(saveLinkButton);
    setDisplayInline(uploadButton);
    setDisplay(viewModeRadioContainer);
    setDisplay(uploadButtonContainer);
  }

  function pageParsed()
  {
    initJsFunctions();
  }

  function pageUnloading()
  {
    setDisabled(saveButton);
    setDisabled(uploadButton);
    setDisabled(deleteButton);

    if (saveLinkButton)
    {
      setDisabled(saveLinkButton);
      setDisabled(altSaveButton);
      setDisabled(cancelButton);
    }
  }

  function setDisplay(element)
  {
    if (element)
    {
      element.style.display = '';
    }
  }

  function setDisplayInline(element)
  {
    if (element)
    {
      element.style.display = 'inline';
    }
  }

  function setDisplayBlock(element)
  {
    if (element)
    {
      element.style.display = 'block';
    }
  }

  function setDisplayNone(element)
  {
    if (element)
    {
      element.style.display = 'none';
    }
  }

  function setDisabled(element)
  {
    if (element)
    {
      element.disabled = true;
    }
  }

  function closeSaveAlbumDialog()
  {
    PhotoAlbumsDialog.saveAlbumDialog.close();
  }

  function closeUploadPhotosDialog()
  {
    PhotoAlbumsDialog.uploadPhotosDialog.close();
  }

  function getSaveAction()
  {
    return saveAction;
  }

  function getSaveTitle()
  {
    return titleTextBox;
  }

  function getSaveDescription()
  {
    return descriptionTextBox;
  }

  function getSaveButton()
  {
    return saveButton;
  }

  function getDeleteButton()
  {
    return deleteButton;
  }

  function getUploadButton()
  {
    return uploadButton;
  }

  function getUploadAction()
  {
    return uploadAction;
  }

  function processingButtonClick(sender, otherIds)
  {
    if (sender)
    {
      sender.value = processingText;
    }

    if (otherIds && otherIds.length)
    {
      for (var i = 0; i < otherIds.length; i++)
      {
        var btn = WA.$(otherIds[i], window);

        if (btn && btn.id != sender.id)
        {
          btn.disabled = true;
        }
      }
    }
    return true;
  }

  function deleteButtonClick(sender, otherIds)
  {
    if (confirm(deleteConfirmation))
    {
      return processingButtonClick(sender, otherIds);
    }
    return false;
  }

  function uploadButtonClick()
  {
    if (!uploadPhotosDialogInited)
    {
      PhotoAlbumsDialog.uploadPhotosDialog.initialize({ albumParam: albumParam });
      uploadPhotosDialogInited = true;
    }

    if (uploadAction.value == '1')
    {
      uploadAction.value = '';

      if (uploadButton)
      {
        uploadButton.value = processingText;
      }

      WA.reloadCurrentPage(pagingKey, window);
      return;
    }

    PhotoAlbumsDialog.uploadPhotosDialog.open(null, { 'PhotoGallery': PhotoGallery });
  }

  function saveButtonClick()
  {
    if (!saveAlbumDialogInited)
    {
      PhotoAlbumsDialog.saveAlbumDialog.initialize({ albumParam: albumParam });
      saveAlbumDialogInited = true;
    }

    if (saveAction.value == '1')
    {
      saveAction.value = '';

      if (saveButton)
      {
        saveButton.value = processingText;
      }

      return true;
    }

    PhotoAlbumsDialog.saveAlbumDialog.open(null, { 'PhotoGallery': PhotoGallery });
    return false;
  }

  function imageMenuMouseOver(sender, imageDivId, fullDescriptionDivId, smallDescriptionDivId)
  {
    if (photoItemTimeout && photoItemId == imageDivId)
    {
      clearTimeout(photoItemTimeout);
      photoItemTimeout = false;
      return;
    }

    if (actionIsRunning)
    {
      return;
    }

    sender.parentNode.style.height = sender.offsetHeight + 'px';
    WA.$(imageDivId, window).className = 'photoAlbumItemThumbnailPhotoHover';
    sender.className = 'photoInnerContainerOver';
    sender.style.zIndex = sender.style.zIndex + 1;
    var fullDescriptionDiv = WA.$(fullDescriptionDivId, window);
    setDisplayBlock(fullDescriptionDiv);
    setDisplayNone(WA.$(smallDescriptionDivId, window));

    if (photosHolder)
    {
      photosHolderHeight = photosHolder.offsetHeight;
      if (!photosHolder.Y) WA.Dimensions.getXY(photosHolder);
      if (!fullDescriptionDiv.Y) WA.Dimensions.getXY(fullDescriptionDiv);
      var outHeigth = fullDescriptionDiv.Y + fullDescriptionDiv.offsetHeight - photosHolder.Y - photosHolderHeight;

      if (outHeigth > 0)
      {
        photosHolder.style.height = (photosHolderHeight + outHeigth + 10) + 'px';
      }
    }
  }

  function doImageMenuMouseOut(sender, imageDivId, fullDescriptionDivId, smallDescriptionDivId)
  {
    WA.$(imageDivId, window).className = 'photoAlbumItemThumbnailPhoto';
    sender.className = 'photoInnerContainer';
    sender.style.zIndex = sender.style.zIndex - 1;
    setDisplayNone(WA.$(fullDescriptionDivId, window));
    setDisplayBlock(WA.$(smallDescriptionDivId, window));

    if (photosHolderHeight && photosHolder.offsetHeight > photosHolderHeight)
    {
      photosHolder.style.height = photosHolderHeight + 'px';
    }

    photoItemId = false;
    photoItemTimeout = false;
  }

  function imageMenuMouseOut(sender, imageDivId, fullDescriptionDivId, smallDescriptionDivId)
  {
    if (actionIsRunning)
    {
      if (!pendingSender)
      {
        pendingSender = sender;
        pendingImageDivId = imageDivId;
        pendingFullDescriptionDivId = fullDescriptionDivId;
        pendingSmallDescriptionDivId = smallDescriptionDivId;
      }

      return;
    }

    if (photoItemTimeout && photoItemId == imageDivId)
    {
      return;
    }

    photoItemId = imageDivId;
    photoItemTimeout = setTimeout(function () { doImageMenuMouseOut(sender, imageDivId, fullDescriptionDivId, smallDescriptionDivId); }, 10);
  }

  function menuButtonMouseOver(sender)
  {
    sender.className = 'overButton';
  }

  function menuButtonMouseOut(sender)
  {
    sender.className = 'outButton';
  }

  function menuButtonClick(linkId, secondButtonId, processingContainerId, confirmVariableName)
  {
    var linkobj = WA.$(linkId, window);

    if (linkobj)
    {
      setDisplayNone(linkobj);

      var secondButton = WA.$(secondButtonId, window);
      var processingContainer = WA.$(processingContainerId, window);
      setDisplayNone(secondButton);
      setDisplayBlock(processingContainer);

      if (confirmVariableName)
      {
        actionIsRunning = true;

        if (!confirm(eval(confirmVariableName)))
        {
          actionIsRunning = false;

          setDisplayNone(processingContainer);
          setDisplay(secondButton);
          setDisplay(linkobj);

          if (pendingSender)
          {
            imageMenuMouseOut(pendingSender, pendingImageDivId, pendingFullDescriptionDivId, pendingSmallDescriptionDivId);
            pendingSender = false;
          }

          return;
        }
      }

      actionIsRunning = false;
      eval(linkobj.href.substr(11).replace(/\%20/g, ' ').replace(/\%22/g, '"'));
    }
  }

  function navigateToList(url)
  {
    var descriptionHeight = (descriptionContainer) ? descriptionContainer.offsetHeight : 0;
    var countPhotosPerRow = 0;

    if (photosHolder)
    {
      var y = 0;
      var bulets = photosHolder.getElementsByTagName('LI');
      for (var i = 0; i < bulets.length; i++)
      {
        WA.Dimensions.getXY(bulets[i]);
        if (i == 0)
        {
          y = bulets[i].Y;
        }
        else if (y < bulets[i].Y)
        {
          countPhotosPerRow = i;
          break;
        }
      }
    }

    if (descriptionHeightUrlKey && countPhotosPerRowUrlKey)
    {
      var index = url.indexOf('?', 0);
      url = index == -1 ? url + '?' : url + '&';
      url += descriptionHeightUrlKey + '=' + descriptionHeight + '&' + countPhotosPerRowUrlKey + '=' + countPhotosPerRow;
    }

    window.location = url;
  }

  function checkLength(e, oObject, maxLength)
  {
    if (oObject.value.length < maxLength)
    {
      return true;
    }
    else
    {
      var keyID = (window.event) ? event.keyCode : e.keyCode;
      if ((keyID >= 37 && keyID <= 40) || (keyID == 8) || (keyID == 46))
      {
        if (window.event) e.returnValue = true;
      }
      else
      {
        if (window.event) e.returnValue = false;
        else e.preventDefault();
      }
    }
  }
})();


