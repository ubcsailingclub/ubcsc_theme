(function ()
{
  if (!window.PhotoGalleryGadget)
  {
    window.PhotoGalleryGadget = {};
  }

  PhotoGalleryGadget.ScrollBar = ScrollBar;

  function ScrollBar (renderGallery, gadgetContainer, rows, numberOfColumns, lengthThumbnails, buttonLeft, buttonRight)
  {
    var slider = gadgetContainer.querySelector('DIV[class="photoGalleryGadgetSlider"]'),
      scrollBar = gadgetContainer.querySelector('DIV[class="photoGalleryGadgetScrollBar"]'),
      scrollElement = gadgetContainer.querySelector('DIV[class="photoGalleryGadgetScrollElement"]');

    var scrollBarWidth,
      quantityCell,
      lengthCell;

    var numberCell = 0,
      previousCell = 0;

    var shiftX,
      realPosition;

    var pThis = this;


    function init ()
    {
      slider.addEventListener('mousedown', mouseDown);
      scrollBar.addEventListener('mousedown', scrollBarMouseDown);
      styleScrollBar();
    }


    pThis.resizeStyleScroll = function ()
    {
      renderGallery.resizeScrollGallery(numberCell);
    };


    pThis.resizeStyleScrollBar = function (resizeColumns)
    {
      styleScrollBar(resizeColumns);
      realPositionSlider();
      renderGallery.resizeScrollGallery(numberCell);
    };


    function scrollBarMouseDown (event)
    {
      if (event.button === 2)
      {
        return
      }

      numberCell = Math.floor((event.clientX - scrollBar.getBoundingClientRect().left) / lengthCell);
      realPositionSlider();
      quantityCellScroll(numberCell);
    }


    function quantityCellScroll (scrollCel)
    {
      var rate = scrollCel - previousCell;
      previousCell = scrollCel;

      if (rate > 0)
      {
        renderGallery.scrollGallery(true, rate, false);
      }
      else if(rate < 0)
      {
        renderGallery.scrollGallery(false, -rate, false);
      }
    }


    function mouseDown (event)
    {
      event.stopPropagation();

      if (event.button === 2)
      {
        return
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('dragstart', dragDropStop);
      shiftX = event.clientX - slider.getBoundingClientRect().left;
    }


    function onMouseMove (event)
    {
      var limit = scrollBarWidth - slider.getBoundingClientRect().width;
      realPosition = event.clientX - shiftX - scrollBar.getBoundingClientRect().left;

      if (realPosition >= limit)
      {
        realPosition = limit;
      }
      else if (realPosition <= 0)
      {
        realPosition = 0;
      }

      numberCell = Math.floor((realPosition + lengthCell / 2) / lengthCell);

      quantityCellScroll(numberCell);
      slider.style.left = realPosition + 'px';
      slider.setAttribute('class', 'photoGalleryGadgetSliderPress')
    }


    function styleScrollBar (columns)
    {
      if (columns)
      {
        numberOfColumns = columns;
      }

      if(lengthThumbnails <= rows * numberOfColumns)
      {
        buttonLeft.displayHide();
        buttonRight.displayHide();
        scrollElement.style.position = 'absolute';
        scrollElement.style.left = '-4000px';
        scrollElement.style.top = '-4000px';
      }
      else
      {
        buttonLeft.displayShow();
        buttonRight.displayShow();
        scrollElement.style.position = '';
        scrollElement.style.left = '';
        scrollElement.style.top = '';
      }
      scrollBarWidth = scrollBar.getBoundingClientRect().width;
      quantityCell = Math.ceil(lengthThumbnails / rows) - numberOfColumns + 1;
      lengthCell = scrollBarWidth / quantityCell;
      slider.style.width = lengthCell + 'px';
    }


    function realPositionSlider ()
    {
      realPosition = Math.ceil(lengthCell * numberCell);
      slider.style.left = realPosition + 'px';

      if(numberCell === 0)
      {
        if(lengthThumbnails <= rows * numberOfColumns)
        {
          buttonLeft.disable();
          buttonRight.disable();
        }
        else
        {
          buttonLeft.disable();
          buttonRight.enable();
        }
      }
      else if(numberCell === (quantityCell - 1))
      {
        buttonRight.disable();
        buttonLeft.enable();
      }
      else
      {
        buttonLeft.enable();
        buttonRight.enable();
      }

      if (realPosition >= scrollBar.getBoundingClientRect().width)
      {
        realPosition = Math.ceil(lengthCell * (quantityCell - 1));
        slider.style.left = realPosition + 'px';
      }
    }


    pThis.positionSlider = function (shiftScroll, direction)
    {
      if (direction)
      {
        if (numberCell < quantityCell - 1)
        {
          shiftScroll >= quantityCell - numberCell ? numberCell = quantityCell - 1 : numberCell = numberCell + shiftScroll;
        }
      }
      else
      {
        if (numberCell > 0)
        {
          numberCell - shiftScroll <= 0 ? numberCell = 0 : numberCell = numberCell - shiftScroll;
        }
      }

      previousCell = numberCell;
      realPositionSlider();
    };


    function onMouseUp ()
    {
      realPositionSlider();
      slider.setAttribute('class', 'photoGalleryGadgetSlider');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('dragstart', dragDropStop);
    }


    function dragDropStop (e)
    {
      e.stopPropagation();
      e.preventDefault();
    }


    init();
  }

})();