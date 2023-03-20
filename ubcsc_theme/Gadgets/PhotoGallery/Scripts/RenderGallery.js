(function ()
{
  if (!window.PhotoGalleryGadget)
  {
    window.PhotoGalleryGadget = {};
  }

  PhotoGalleryGadget.RenderGallery = RenderGallery;

  function RenderGallery(gadgetId, gallery, numberOfRows, columns, size, resolution)
  {
    var pThis = this;
    var gadgetContainer = document.getElementById('idPhotoGalleryGadget_Container_' + gadgetId),
        photoContainer = gadgetContainer.querySelector('DIV[class="containerPhotoInner"]'),
        innerContainer = gadgetContainer.querySelector('DIV[class="containerPhotoOuter"]'),
        photoGalleryGadgetScrollElement = gadgetContainer.querySelector('DIV[class="photoGalleryGadgetScrollElement"]');

    var numberOfColumns = null;
    var thumbnailsSizes = null;
    var marginHorizontal = 9,
        marginVertical = 9;
    var isThumbnailSizeFixed = false;
    var isThumbnailMarginFixed = true;
    var objThumbnails = [];
    var startTouchEventX,
        startTime;
    var quantityThumbnails,
        lightBox,
        scrollBar,
        focusGallery;
    var buttonLeft,
        buttonRight;
    var activeElementIndex = 0;
    var i = 0;

    numberOfRows = Number(numberOfRows);

    function init()
    {
      createGallery();

      if (focusGallery)
      {
        focusGallery.addEventListener('focus', pThis.onFocus);
        focusGallery.addEventListener('blur', pThis.onBlur);
      }

      innerContainer.addEventListener('scroll', scrollReverse);
      gadgetContainer.addEventListener('touchstart', eventSwipeTouchStart);
      gadgetContainer.addEventListener('touchend', eventSwipeTouchEnd);
      window.addEventListener('resize', resizeGalleryBasic);
    }


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


    pThis.resizeGallery = function ()
    {
      styleGallery();
      for (i = 0; i < objThumbnails.length; i++)
      {
        objThumbnails[i].resizeThumbnail(thumbnailsSizes, marginHorizontal, marginVertical);
      }

      innerContainer.style.height = (numberOfRows * thumbnailsSizes + numberOfRows * marginVertical) + 'px';
      scrollBar.resizeStyleScrollBar(quantityThumbnails);

      var thumbnailsByRow = numberOfColumns;

      if (thumbnailsByRow == null)
      {
        thumbnailsByRow = Math.floor(photoContainer.clientWidth / (thumbnailsSizes + marginHorizontal));
      }

      if (objThumbnails.length >= thumbnailsByRow * numberOfRows)
      {
        thumbnailsByRow = Math.ceil(objThumbnails.length / numberOfRows);
      }

      photoContainer.style.width = (thumbnailsByRow * (thumbnailsSizes + marginHorizontal))  + 'px';
      showVisible();
    };


    function styleGallery()
    {
      var widthInnerContainer = innerContainer.getBoundingClientRect().width;

      if (isThumbnailSizeFixed)
      {
        quantityThumbnails = Math.floor(widthInnerContainer / thumbnailsSizes);

        if (widthInnerContainer < thumbnailsSizes)
        {
          quantityThumbnails = 1;
        }

        if (quantityThumbnails === 1)
        {
          marginHorizontal = Math.floor(widthInnerContainer % thumbnailsSizes / quantityThumbnails);
        }
        else
        {
          marginHorizontal = Math.floor(widthInnerContainer % thumbnailsSizes / (quantityThumbnails - 1));
        }
      }

      if (isThumbnailMarginFixed)
      {
        quantityThumbnails = numberOfColumns;
        thumbnailsSizes = Math.floor((widthInnerContainer + marginHorizontal) / quantityThumbnails) - marginHorizontal;
      }
      innerContainer.style.height = (numberOfRows * thumbnailsSizes + numberOfRows * marginVertical) + 'px';
    }


    function createGallery()
    {
      var  str = '';
      focusGallery = gadgetContainer.querySelector('DIV[class="photoGalleryGadgetFocus"]');

      if(resolution === 'NumberOfThumbnails')
      {
        numberOfColumns = Number(columns);
        isThumbnailSizeFixed = false;
        isThumbnailMarginFixed = true;
      }
      else if(resolution === 'SizeOfThumbnails')
      {
        thumbnailsSizes = Number(size);
        isThumbnailSizeFixed = true;
        isThumbnailMarginFixed = false;
      }

      styleGallery();

      for (i = 0; i < gallery.length; i++)
      {
        objThumbnails.push(new PhotoGalleryGadget.Thumbnail(pThis, innerContainer, gallery[i], i));
      }

      for (i = 0; i < objThumbnails.length; i++)
      {
        str += objThumbnails[i].render(thumbnailsSizes, marginHorizontal, marginVertical);
      }
      photoContainer.innerHTML = str;

      for (i = 0; i < objThumbnails.length; i++)
      {
        objThumbnails[i].init(photoContainer);
      }

      buttonLeft = new PhotoGalleryGadget.FieldArrow(photoGalleryGadgetScrollElement, 'left', scrollLeftButton);
      buttonRight = new PhotoGalleryGadget.FieldArrow(photoGalleryGadgetScrollElement, 'right', scrollRightButton);
      lightBox = new PhotoGalleryGadget.LightBox(pThis, gadgetContainer, objThumbnails, focusGallery);

      scrollBar = new PhotoGalleryGadget.ScrollBar(pThis, gadgetContainer,  numberOfRows, quantityThumbnails, objThumbnails.length, buttonLeft, buttonRight);

      innerContainer.addEventListener('click', lightBox.draw);
      showVisible();
      setTimeout(pThis.resizeGallery, 250);
    }


    pThis.scrollGallery = function(direction, multiplier, resolution)
    {
      if (direction)
      {
        innerContainer.scrollLeft += (thumbnailsSizes + marginHorizontal) * multiplier;
      }
      else if(!direction)
      {
        innerContainer.scrollLeft -= (thumbnailsSizes + marginHorizontal) * multiplier;
      }
      if (resolution)
      {
        scrollBar.positionSlider(multiplier, direction);
      }
    };


    pThis.resizeScrollGallery = function(resizeScroll)
    {
      innerContainer.scrollLeft = (thumbnailsSizes + marginHorizontal) * resizeScroll;
    };


    function scrollLeftButton()
    {
      pThis.scrollGallery(false, quantityThumbnails, true)
    }


    function scrollRightButton()
    {
      pThis.scrollGallery(true, quantityThumbnails, true)
    }


    function showVisible()
    {
      for (var i = 0; i < objThumbnails.length; i++)
      {
        objThumbnails[i].checkVisibility();
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
          activeElementIndex < objThumbnails.length - 1)
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
        if (activeElementIndex < objThumbnails.length - numberOfRows)
        {
          setActiveThumbnail(event, activeElementIndex, activeElementIndex + numberOfRows, true);
        }
        else
        {
          setActiveThumbnail(event, activeElementIndex, objThumbnails.length - 1, true);
        }
      }
      else if (event.key === 'Enter')
      {
        gadgetContainer.querySelector('DIV[data-indeximg="' + Number(activeElementIndex) + '"]').click();
      }
    }


    function setActiveThumbnail(event, currentIndex, newIndex, isRightDirection)
    {
      objThumbnails[currentIndex].setViewState(false);
      objThumbnails[newIndex].setViewState(true, isRightDirection);
      activeElementIndex = newIndex;
      event.preventDefault();
      event.stopPropagation();
    }


    init();
  }

})();