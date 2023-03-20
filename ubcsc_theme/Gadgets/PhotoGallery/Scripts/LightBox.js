(function ()
{
  if (!window.PhotoGalleryGadget)
  {
    window.PhotoGalleryGadget = {};
  }

  PhotoGalleryGadget.LightBox = LightBox;

  function LightBox (renderGallery, gadgetContainer, objThumbnails, focusGallery)
  {
    var darkLayer,
        WaGadgetPhotoGalleryPhotoContainer,
        arrowLeft,
        arrowRight,
        indexPhoto;
    var currentPhoto;
    var containerImg,
        containerDivImg,
        containerImgNaturalHeight,
        containerImgNaturalWidth,
        containerDivImgHeight,
        containerDivImgWidth,
        widthDefaultScrollBar;
    var objThumbnailsLength = objThumbnails.length;
    var ratioContainerPlane;
    var fullScreenContainerQuantityPhotos;
    var plane,
        close_arrow;

    var pThis = this;


    function init ()
    {
      document.getElementById('close_arrowFullScreen').addEventListener('click', closeEventDark);

      document.getElementById('ContainerImageFullScreen').addEventListener('mousemove', photoContainerPlane);
      document.getElementById('ContainerImageFullScreen').addEventListener('click', ContainerImageFullScreenPlane);

      document.getElementById('WaGadgetPhotoGalleryPhotoContainer').addEventListener('mousemove', WaGadgetPhotoGalleryPhotoContainerPlane);

      document.addEventListener('keydown', addDocumentHandlers);
      window.addEventListener('resize', resizeFullPhoto);
    }


    function resizeFullPhoto ()
    {
      ratioContainerPlane = document.documentElement.clientWidth / document.documentElement.clientHeight;
      fullPhotoSizeCheck();
    }


    pThis.draw = function (e)
    {
      renderGallery.onBlur();
      if (!e.target.getAttribute('data-indeximg')) return;
      createDarkLayer();
      drawFullImage();

      indexPhoto = e.target.getAttribute('data-indeximg');
      arrowLeft = new PhotoGalleryGadget.FieldArrow(document.querySelector('DIV[class="containerLeftFullScreen"]'), 'buttonLeft', scrollLeft);
      arrowRight = new PhotoGalleryGadget.FieldArrow(document.querySelector('DIV[class="containerRightFullScreen"]'), 'buttonRight', scrollRight);
      arrowLeft.hide();
      arrowRight.hide();
      fullScreenContainerQuantityPhotos = document.getElementById('fullScreenContainerQuantityPhotos');
      currentPhoto = (Number(indexPhoto)+1);

      fullScreenContainerQuantityPhotos.innerHTML = 'Image ' + currentPhoto + ' / ' + objThumbnailsLength;
      ratioContainerPlane = document.documentElement.clientWidth / document.documentElement.clientHeight;

      styleElementControls();
      loadImage(indexPhoto);
      init();
    };


    function addDocumentHandlers (event)
    {
      if (event.key === 'ArrowRight' || event.key === 'Right')
      {
        scrollRight();
      }
      else if (event.key === 'ArrowLeft' || event.key === 'Left')
      {
        scrollLeft()
      }
      else if (event.key === 'Esc' || event.key === 'Escape')
      {
        closeEventDark();
      }
      else if (event.key === 'Enter' || event.key === 'Tab')
      {
        event.preventDefault();
        event.stopPropagation();
      }
    }


    function WaGadgetPhotoGalleryPhotoContainerPlane(event)
    {
      if (event.target ===  (document.querySelector('DIV[class="containerRightFullScreen"]')) || event.target ===  (document.querySelector('DIV[class="rightFullScreen"]')))
      {
        arrowRight.show();
        closeArrowHide();
        styleElementControlsRight();
      }
      else if (event.target ===  (document.querySelector('DIV[class="containerLeftFullScreen"]')) || event.target ===  (document.querySelector('DIV[class="leftFullScreen"]')))
      {
        arrowLeft.show();
        closeArrowHide();
        styleElementControlsLeft();
      }
    }


    function photoContainerPlane (event)
    {
      stylePlane();
      if (event.target ===  document.getElementById('photoGalleryImageFullScreen'))
      {
        closeArrowHide();
      }

      if (event.target ===  (document.querySelector('DIV[class="containerRightFullScreen"]')))
      {
        arrowRight.show();
        closeArrowHide();
        styleElementControlsRight();
      }
      else if (event.target ===  (document.getElementById('containerRightFullScreen')))
      {
        arrowLeft.show();
        closeArrowHide();
        styleElementControlsLeft();
      }
      ContainerPlane(event);
    }


    function stylePlane()
    {
      if(plane === 4 || plane === 2)
      {
        closeArrowShow();
        arrowLeft.hide();
        arrowRight.hide();
      }
      else if(plane === 1)
      {
        styleElementControlsLeft();
        closeArrowHide();
        arrowRight.hide();
      }
      else if(plane === 3)
      {
        styleElementControlsRight();
        closeArrowHide();
        arrowLeft.hide();
      }
    }


    function ContainerImageFullScreenPlane (event)
    {
      ContainerPlane(event);
      stylePlane();
      if(plane === 4 || plane === 2)
      {
        if (event.target ===  document.getElementById('photoGalleryImageFullScreen'))
        {
          closeArrowHide();
          return;
        }
        closeEventDark()
      }
      else if(plane === 1)
      {
        scrollLeft();
      }
      else if(plane === 3)
      {
        scrollRight();
      }
    }


    function closeArrowHide ()
    {
      close_arrow.setAttribute('class', 'close_arrowFullScreenHover');
    }


    function closeArrowShow ()
    {
      close_arrow.setAttribute('class', 'close_arrowFullScreen');
      close_arrow.style.cursor = 'pointer';
    }


    function styleElementControlsLeft()
    {
      if (indexPhoto <= 0)
      {
        arrowLeft.hide();
      }
      else
      {
        arrowLeft.show();
      }
    }


    function styleElementControlsRight()
    {
      if (indexPhoto >= objThumbnailsLength - 1)
      {
        arrowRight.hide();
      }
      else
      {
        arrowRight.show();
      }
    }


    function styleElementControls()
    {
      if (indexPhoto <= 0)
      {
        arrowLeft.displayHide();
      }
      else
      {
        arrowLeft.displayShow();
      }

      if (indexPhoto >= objThumbnailsLength - 1)
      {
        arrowRight.displayHide();
      }
      else
      {
        arrowRight.displayShow();
      }
    }


    function ContainerPlane (event)
    {
      var y1 = event.clientX / (-ratioContainerPlane) + document.documentElement.clientHeight;
      var y2 = event.clientX / ratioContainerPlane;

      if(y1 > event.clientY && y2 < event.clientY)
      {
        plane = 1;
      }
      else if(y1 < event.clientY && y2 < event.clientY)
      {
        plane = 2;
      }
      else if(y1 < event.clientY && y2 > event.clientY)
      {
        plane = 3;
      }
      else if(y1 > event.clientY && y2 > event.clientY)
      {
        plane = 4;
      }
    }


    function scrollLeft ()
    {
      if (indexPhoto > 0)
      {
        indexPhoto--;
        loadImage(indexPhoto);
      }
      styleElementControls();

      currentPhoto = (Number(indexPhoto)+1);
      fullScreenContainerQuantityPhotos.innerHTML = 'Image ' + currentPhoto + ' / ' + objThumbnailsLength;
    }


    function scrollRight ()
    {
      if (indexPhoto < objThumbnailsLength - 1)
      {
        indexPhoto++;
        loadImage(indexPhoto);
      }
      styleElementControls();
      currentPhoto = (Number(indexPhoto)+1);
      fullScreenContainerQuantityPhotos.innerHTML = 'Image ' + currentPhoto + ' / ' + objThumbnailsLength;
    }


    function createDarkLayer ()
    {
      widthDefaultScrollBar = window.innerWidth - document.querySelector('html').getBoundingClientRect().width;
      darkLayer = document.createElement('div');
      darkLayer.id = 'darkLayer';
      darkLayer.setAttribute('class', 'photoGalleryShadingWhite');
      setTimeout(function ()
      {
        darkLayer.setAttribute('class', 'photoGalleryShadingDark');
      }, 100);
      document.body.appendChild(darkLayer);
      renderGallery.resizeGallery();

      document.body.style.paddingRight = hiddenDefaultScrollBar(getComputedStyle(document.body).paddingRight, 10) + widthDefaultScrollBar + 'px';
      document.body.style.overflow = 'hidden';
    }


    function hiddenDefaultScrollBar (parsedPaddingRight, base)
    {
      var parsed = parseInt(parsedPaddingRight, base);
      if (isNaN(parsed))
      {
        return 0
      }
      return parsed;
    }


    function drawFullImage ()
    {
      WaGadgetPhotoGalleryPhotoContainer = document.createElement('div');
      WaGadgetPhotoGalleryPhotoContainer.id = 'WaGadgetPhotoGalleryPhotoContainer';
      WaGadgetPhotoGalleryPhotoContainer.setAttribute('class', 'photoGalleryPhotoContainer');
      WaGadgetPhotoGalleryPhotoContainer.innerHTML =
        '<div id="fullScreenContainerQuantityPhotos" class="fullScreenContainerQuantityPhotos">quantityPhotos</div>' +
        '<div class="containerLeftFullScreen"></div>' +
        '<div id="ContainerImageFullScreen"><img id="photoGalleryImageFullScreen" src="" alt=""></div>' +
        '<div class="containerRightFullScreen"><div class="close_arrowFullScreen" id="close_arrowFullScreen">' +
        '<svg width="45px" height="45px" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" >' + 
        '<g id="Artboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
            '<path d="M40.7109375,45 C41.0390618,45 41.2968757,44.9062493 41.484375,44.71875 L41.484375,44.71875 L44.71875,41.484375 C44.9062493,41.2968757 45,41.0390618 45,40.7109375 C45,40.3828132 44.9062493,40.1249993 44.71875,39.9375 L44.71875,39.9375 L27.28125,22.5 L41.765625,8.015625 L44.71875,5.0625 C44.9062493,4.87500072 45,4.61718678 45,4.2890625 C45,3.96093822 44.9062493,3.70312428 44.71875,3.515625 L44.71875,3.515625 L41.484375,0.28125 C41.2968757,0.0937507153 41.0390618,0 40.7109375,0 C40.3828132,0 40.1249993,0.0937507153 39.9375,0.28125 L39.9375,0.28125 L22.5,17.71875 L5.0625,0.28125 C4.87500072,0.0937507153 4.61718678,0 4.2890625,0 C3.96093822,0 3.70312428,0.0937507153 3.515625,0.28125 L3.515625,0.28125 L0.28125,3.515625 C0.0937507153,3.70312428 0,3.96093822 0,4.2890625 C0,4.61718678 0.0937507153,4.87500072 0.28125,5.0625 L0.28125,5.0625 L17.71875,22.5 L0.28125,39.9375 C0.0937507153,40.1249993 0,40.3828132 0,40.7109375 C0,41.0390618 0.0937507153,41.2968757 0.28125,41.484375 L0.28125,41.484375 L3.515625,44.71875 C3.70312428,44.9062493 3.96093822,45 4.2890625,45 C4.61718678,45 4.87500072,44.9062493 5.0625,44.71875 L5.0625,44.71875 L22.5,27.28125 L39.9375,44.71875 C40.1249993,44.9062493 40.3828132,45 40.7109375,45 Z" id="" fill="#FFFFFF" fill-rule="nonzero"></path>' +
        '</g></svg></div></div>';
      document.body.appendChild(WaGadgetPhotoGalleryPhotoContainer);
    }


    function checkSizeContainer ()
    {
      var sizeWidthArrow,
        containerLeft = document.querySelector('DIV[class="containerLeftFullScreen"]'),
        containerRight = document.querySelector('DIV[class="containerRightFullScreen"]');
      close_arrow = document.getElementById('close_arrowFullScreen');

      containerDivImg = document.getElementById('ContainerImageFullScreen');

      sizeWidthArrow = document.documentElement.clientWidth * 4 / 100;
      containerDivImgHeight = document.documentElement.clientHeight * 90 / 100;
      containerDivImgWidth = document.documentElement.clientWidth - sizeWidthArrow * 2;

      if (sizeWidthArrow > 76)
      {
        containerLeft.style.width = 76 + 'px';
        containerRight.style.width = 76 + 'px';
        close_arrow.style.height = 76 + 'px';
      }
      else
      {
        containerLeft.style.width = sizeWidthArrow + 'px';
        containerRight.style.width = sizeWidthArrow + 'px';
        close_arrow.style.height = sizeWidthArrow + 'px';
      }
      if (containerDivImgWidth > 1770 || containerDivImgHeight > 921)
      {
        containerDivImg.style.width = 1770 + 'px';
        containerDivImg.style.height = 921 + 'px';
      }
      else
      {
        containerDivImg.style.width = containerDivImgWidth + 'px';
        containerDivImg.style.height = containerDivImgHeight + 'px';
      }
    }


    function loadImage (ind)
    {
      containerImg = document.getElementById('photoGalleryImageFullScreen');

      containerImg.addEventListener('load', onLoad);
      containerImg.style.visibility = 'hidden';
      containerImg.setAttribute('src', objThumbnails[ind].renderFullPhoto());

      if (indexPhoto <= 0)
      {
        arrowLeft.hide();
      }
      else if (indexPhoto >= objThumbnailsLength - 1)
      {
        arrowRight.hide();
      }
    }


    function onLoad ()
    {
      fullPhotoSizeCheck();
    }


    function fullPhotoSizeCheck ()
    {
      checkSizeContainer();
      var ratioImgNatural;

      containerImgNaturalHeight = containerImg.naturalHeight;
      containerImgNaturalWidth = containerImg.naturalWidth;
      if (containerImgNaturalHeight < containerDivImgHeight && containerImgNaturalWidth < containerDivImgWidth)
      {
        containerImg.style.height = containerImgNaturalHeight + 'px';
        containerImg.style.width = containerImgNaturalWidth + 'px';
        containerDivImg.setAttribute('class', 'imageFullScreen_smallSize');
      }
      else
      {
        if (containerImgNaturalHeight >= containerImgNaturalWidth)
        {
          containerDivImg.setAttribute('class', 'imageFullScreen_vertical');
          ratioImgNatural = containerImgNaturalHeight / containerImgNaturalWidth;

          if (containerImgNaturalHeight > containerDivImgHeight)
          {
            containerImgNaturalHeight = containerDivImgHeight;
            containerImgNaturalWidth = containerDivImgHeight / ratioImgNatural;
          }

          if (containerImgNaturalWidth > containerDivImgWidth)
          {
            containerImgNaturalWidth = containerDivImgWidth;
            containerImgNaturalHeight = containerImgNaturalWidth * ratioImgNatural;
          }
        }
        else if (containerImgNaturalHeight < containerImgNaturalWidth)
        {
          containerDivImg.setAttribute('class', 'imageFullScreen_vertical');
          ratioImgNatural = containerImgNaturalWidth / containerImgNaturalHeight;

          if (containerImgNaturalWidth > containerDivImgWidth)
          {
            containerImgNaturalWidth = containerDivImgWidth;
            containerImgNaturalHeight = containerDivImgWidth / ratioImgNatural;
          }

          if (containerImgNaturalHeight > containerDivImgHeight)
          {
            containerImgNaturalHeight = containerDivImgHeight;
            containerImgNaturalWidth = containerDivImgHeight * ratioImgNatural;
          }
        }
      }

      containerImg.style.width = containerImgNaturalWidth + 'px';
      containerImg.style.height = containerImgNaturalHeight + 'px';
      containerImg.style.visibility = 'visible';
    }


    function closeEventDark ()
    {
      document.body.style.paddingRight = hiddenDefaultScrollBar(getComputedStyle(document.body).paddingRight, 10) - widthDefaultScrollBar + 'px';
      document.body.style.overflow = '';
      renderGallery.resizeGallery();

      document.getElementById('close_arrowFullScreen').removeEventListener('click', closeEventDark);
      document.getElementById('ContainerImageFullScreen').removeEventListener('mousemove', photoContainerPlane);
      document.getElementById('ContainerImageFullScreen').removeEventListener('click', ContainerImageFullScreenPlane);
      document.getElementById('WaGadgetPhotoGalleryPhotoContainer').removeEventListener('mousemove', WaGadgetPhotoGalleryPhotoContainerPlane);
      document.removeEventListener('keydown', addDocumentHandlers);
      window.removeEventListener('resize', resizeFullPhoto);

      document.getElementById('WaGadgetPhotoGalleryPhotoContainer').parentNode.removeChild(document.getElementById('WaGadgetPhotoGalleryPhotoContainer'));
      document.getElementById('darkLayer').parentNode.removeChild(document.getElementById('darkLayer'));


      if (document.activeElement === focusGallery)
      {
        renderGallery.onFocus();
      }
    }
  }

})();