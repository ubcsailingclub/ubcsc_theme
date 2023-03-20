(function ()
{
  if (!window.PhotoGalleryGadget)
  {
    window.PhotoGalleryGadget = {};
  }

  PhotoGalleryGadget.Thumbnail = Thumbnail;

  function Thumbnail (renderGallery, parentContainer, item, ind)
  {
    var pThis = this;

    var container,
       image,
       isVisible = false;


    pThis.render = function (thumbnailsSizes, marginHorizontal, marginVertical)
    {
      return '<div class="img_invisible"  style="height: ' + thumbnailsSizes + 'px; width: ' + thumbnailsSizes + 'px; margin: 0 ' + marginHorizontal + 'px ' + marginVertical + 'px 0;" data-indeximg="' + ind + '"><img src="" data-src="' + item.thumbnail + '" data-indeximg="' + ind + '" alt=""></div>';
    };


    pThis.renderFullPhoto = function ()
    {
      return item.origin
    };


    pThis.resizeThumbnail = function (resize, marginHorizontal, marginVertical)
    {
      container.style.width = resize + 'px';
      container.style.height = resize + 'px';
      container.style.margin = 0 + 'px ' + marginHorizontal + 'px ' + marginVertical + 'px ' + 0 + 'px';
    };


    pThis.init = function (parentContainer)
    {
      container = parentContainer.querySelector('DIV[data-indeximg="' + ind + '"]');
      image = parentContainer.querySelector('IMG[data-indeximg="' + ind + '"]');
    };


    pThis.checkVisibility = function ()
    {
      if (!isVisible && getIsVisible(false))
      {
        isVisible = true;
        image.setAttribute('src', image.getAttribute('data-src'));
        image.setAttribute('data-src', '');
        setClasses();
      }
    };


    function getIsVisible (isRightCorner)
    {
      var parentContainerCoords = parentContainer.getBoundingClientRect();
      var coords = container.getBoundingClientRect();

      return (isRightCorner ? coords.right : coords.left) < (parentContainerCoords.left + parentContainerCoords.width) && (isRightCorner ? coords.right : coords.left - parentContainerCoords.left) - container.scrollLeft >= 0;
    }


    function setClasses ()
    {
      if (image.naturalWidth && image.naturalHeight)
      {
        container.setAttribute('class', ((image.naturalHeight > image.naturalWidth) ? 'img_vertical' : 'img_horizontal'));
      }
      else
      {
        setTimeout(setClasses, 100);
      }
    }


    pThis.setViewState = function (isActive, isRightDirection)
    {
      container.style.border = (isActive ? '3px ridge rgba(255, 255, 255, 1)' : '');

      if (isActive && !getIsVisible(isRightDirection))
      {
        if (isRightDirection)
        {
          renderGallery.scrollGallery(true, 1, true)
        }
        else
        {
          renderGallery.scrollGallery(false, 1, true)
        }
      }
    };
  }

})();