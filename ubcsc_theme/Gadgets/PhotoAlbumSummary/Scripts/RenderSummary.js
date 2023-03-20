(function ()
{
  if (!window.PhotoAlbumSummaryGadget)
  {
    window.PhotoAlbumSummaryGadget = {};
  }

  PhotoAlbumSummaryGadget.RenderSummary = RenderAlbumSummary;

  function RenderAlbumSummary(gadgetId, numberOfRows, columns, size, resolution)
  {
    var gallery, pThis = this;
    var gadgetContainer = document.getElementById('idPhotoAlbumSummaryGadget_Container_' + gadgetId),
        gadgetScrollbar = gadgetContainer.querySelector('DIV[class="PhotoAlbumSummaryGadgetScrollElement"]'),
        innerContainer = gadgetContainer.querySelector('DIV[class="containerPhotoInner"]'),
        outerContainer = gadgetContainer.querySelector('DIV[class="containerPhotoOuter"]');

    var numberOfColumns = null;
    var marginHorizontal = 9,
        marginVertical = 9;
    var isThumbnailSizeFixed = false;
    var isThumbnailMarginFixed = true;
    var startTouchEventX,
        startTime;
    var focusGallery, scrollBar,
        thumbnailQuantity, thumbnailSize = null, thumbnails = [];
    var buttonLeft, buttonRight;
    var activeElementIndex = 0;
    var i = 0;

    numberOfRows = Number(numberOfRows);

    function getAlbums()
    {
      var albums = [],
          container = document.querySelector('DIV[data-componentId="' + gadgetId + '"]'),
          element, elements, i;

      if (!container)
      {
        return null;
      }

      elements = container.querySelectorAll('DIV[data-thumb]');

      for (i = 0; i < elements.length; i++)
      {
        element = elements[i];
        albums.push(
          {
            'albumId': element.getAttribute('data-target'),
            'count': element.getAttribute('data-count'),
            'name': element.getAttribute('data-title'),
            'origin': element.getAttribute('data-src'),
            'thumbnail': element.getAttribute('data-thumb')
          });
      }

      return albums;
    }

    this.init = function()
    {
      gallery = getAlbums();

      createAlbumGallery();

      if (focusGallery)
      {
        focusGallery.addEventListener('focus', pThis.onFocus);
        focusGallery.addEventListener('blur', pThis.onBlur);
      }

      outerContainer.addEventListener('scroll', scrollReverse);
      gadgetContainer.addEventListener('touchstart', eventSwipeTouchStart);
      gadgetContainer.addEventListener('touchend', eventSwipeTouchEnd);
      window.addEventListener('resize', resizeGalleryBasic);
    };


    function eventSwipeTouchStart(e)
    {
      startTouchEventX = e.changedTouches[0].screenX;
      startTime = new Date().getTime()
    }


    function eventSwipeTouchEnd(e)
    {
      if(new Date().getTime() - startTime > 100)
      {
        if(e.changedTouches[0].screenX - startTouchEventX > 50)
        {
          scrollLeftButton();
        }
        else if(e.changedTouches[0].screenX - startTouchEventX < -50)
        {
          scrollRightButton();
        }
      }
    }


    function scrollReverse()
    {
      showVisible();
      scrollBar.resizeStyleScroll();
    }


    function resizeGalleryBasic()
    {
      pThis.resizeGallery();
      resizeGalleryReserve();
    }


    function resizeGalleryReserve()
    {
      setTimeout(pThis.resizeGallery, 100)
    }


    pThis.resizeGallery = function()
    {
      styleAlbumsGallery();

      var newHeight = 0;

      for (i = 0; i < thumbnails.length; i++)
      {
        var height= thumbnails[i].resizeThumbnail(thumbnailSize, marginHorizontal, marginVertical);

        if (height > newHeight)
        {
          newHeight = height;
        }
      }

      scrollBar.resizeStyleScrollBar(thumbnailQuantity);

      var thumbnailsByRow = numberOfColumns;

      if (thumbnailsByRow == null)
      {
        thumbnailsByRow = Math.floor(innerContainer.clientWidth / (thumbnailSize + marginHorizontal));
      }

      if (thumbnails.length >= thumbnailsByRow * numberOfRows)
      {
        thumbnailsByRow = Math.ceil(thumbnails.length / numberOfRows);
      }

      innerContainer.style.height = (numberOfRows * newHeight + numberOfRows * marginVertical) + 'px';
      innerContainer.style.width = (thumbnailsByRow * (thumbnailSize + marginHorizontal))  + 'px';
      showVisible();
    };


    function styleAlbumsGallery()
    {
      var outerContainerWidth = outerContainer.getBoundingClientRect().width;

      if (isThumbnailSizeFixed)
      {
        thumbnailQuantity = Math.floor(outerContainerWidth / thumbnailSize);

        if (outerContainerWidth < thumbnailSize)
        {
          thumbnailQuantity = 1;
        }

        if (thumbnailQuantity === 1)
        {
          marginHorizontal = Math.floor(outerContainerWidth % thumbnailSize / thumbnailQuantity);
        }
        else
        {
          marginHorizontal = Math.floor(outerContainerWidth % thumbnailSize / (thumbnailQuantity - 1));
        }
      }

      if (isThumbnailMarginFixed)
      {
        thumbnailQuantity = numberOfColumns;
        thumbnailSize = Math.floor((outerContainerWidth + marginHorizontal) / thumbnailQuantity) - marginHorizontal;
      }

      innerContainer.style.height = (numberOfRows * thumbnailSize + numberOfRows * marginVertical) + 'px';
    }


    function createAlbumGallery()
    {
      var str = '';
      focusGallery = gadgetContainer.querySelector('DIV[class="PhotoAlbumSummaryGadgetFocus"]');

      if(resolution === 'NumberOfThumbnails')
      {
        numberOfColumns = Number(columns);
        isThumbnailSizeFixed = false;
        isThumbnailMarginFixed = true;
      }
      else if(resolution === 'SizeOfThumbnails')
      {
        thumbnailSize = Number(size);
        isThumbnailSizeFixed = true;
        isThumbnailMarginFixed = false;
      }

      styleAlbumsGallery();

      for (i = 0; i < gallery.length; i++)
      {
        thumbnails.push(new PhotoAlbumSummaryGadget.Thumbnail(pThis, innerContainer, gallery[i], i));
      }

      for (i = 0; i < thumbnails.length; i++)
      {
        str += thumbnails[i].render(thumbnailSize, marginHorizontal, marginVertical);
      }

      innerContainer.innerHTML = str;

      for (i = 0; i < thumbnails.length; i++)
      {
        thumbnails[i].init(innerContainer);
      }

      if(buttonLeft == null)
        buttonLeft = new PhotoAlbumSummaryGadget.FieldArrow(gadgetScrollbar, 'left', scrollLeftButton);
 
      if(buttonRight == null)
        buttonRight = new PhotoAlbumSummaryGadget.FieldArrow(gadgetScrollbar, 'right', scrollRightButton);
      
      if(scrollBar == null)
        scrollBar = new PhotoAlbumSummaryGadget.ScrollBar(pThis, gadgetContainer,  numberOfRows, thumbnailQuantity, thumbnails.length, buttonLeft, buttonRight);
      else
        scrollBar.setImages(thumbnails.length);
      
      showVisible();
      setTimeout(pThis.resizeGallery, 250);
    }


    pThis.scrollGallery = function(direction, multiplier, resolution)
    {
      if (direction)
      {
        outerContainer.scrollLeft += (thumbnailSize + marginHorizontal) * multiplier;
      }
      else if(!direction)
      {
        outerContainer.scrollLeft -= (thumbnailSize + marginHorizontal) * multiplier;
      }
      if (resolution)
      {
        scrollBar.positionSlider(multiplier, direction);
      }
    };


    pThis.resizeScrollGallery = function(resizeScroll)
    {
      outerContainer.scrollLeft = (thumbnailSize + marginHorizontal) * resizeScroll;
    };


    function scrollLeftButton()
    {
      pThis.scrollGallery(false, thumbnailQuantity, true)
    }


    function scrollRightButton()
    {
      pThis.scrollGallery(true, thumbnailQuantity, true)
    }


    function showVisible()
    {
      for (var i = 0; i < thumbnails.length; i++)
      {
        thumbnails[i].checkVisibility();
      }
    }


    pThis.onFocus = function()
    {
      gadgetContainer.addEventListener('keydown', addDocumentEventFocus);
      var activeElement = gadgetContainer.querySelector('DIV[data-indeximg="' + activeElementIndex + '"]');
      activeElement.style.border = '3px ridge rgba(255, 255, 255, 1)';
    };


    pThis.onBlur = function()
    {
      gadgetContainer.querySelector('DIV[data-indeximg="' + (activeElementIndex) + '"]').style.border = '';
      gadgetContainer.removeEventListener('keydown', addDocumentEventFocus);
    };


    function addDocumentEventFocus(event)
    {
      if (event.key === 'ArrowUp' || event.key === 'Up')
      {
        if (activeElementIndex % numberOfRows !== 0)
        {
          setActiveThumbnail(event, activeElementIndex, (activeElementIndex - 1));
        }
      }
      else if (event.key === 'ArrowDown' || event.key === 'Down')
      {
        if (activeElementIndex % numberOfRows !== (numberOfRows - 1) &&
          activeElementIndex < thumbnails.length - 1)
        {
          setActiveThumbnail(event, activeElementIndex, (activeElementIndex + 1));
        }
      }
      else if ((event.key === 'ArrowLeft' || event.key === 'Left'))
      {
        if (activeElementIndex >= numberOfRows)
        {
          setActiveThumbnail(event, activeElementIndex, activeElementIndex - numberOfRows, false);
        }
      }
      else if ((event.key === 'ArrowRight' || event.key === 'Right'))
      {
        if (activeElementIndex < thumbnails.length - numberOfRows)
        {
          setActiveThumbnail(event, activeElementIndex, activeElementIndex + numberOfRows, true);
        }
        else
        {
          setActiveThumbnail(event, activeElementIndex, thumbnails.length - 1, true);
        }
      }
      else if (event.key === 'Enter')
      {
        gadgetContainer.querySelector('DIV[data-indeximg="' + Number(activeElementIndex) + '"]').click();
      }
    }


    function setActiveThumbnail(event, currentIndex, newIndex, isRightDirection)
    {
      thumbnails[currentIndex].setViewState(false);
      thumbnails[newIndex].setViewState(true, isRightDirection);
      activeElementIndex = newIndex;
      event.preventDefault();
      event.stopPropagation();
    }

    pThis.init();
  }
})();