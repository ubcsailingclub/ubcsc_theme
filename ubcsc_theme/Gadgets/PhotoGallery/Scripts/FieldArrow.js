(function ()
{
  if (!window.PhotoGalleryGadget)
  {
    window.PhotoGalleryGadget = {};
  }

  PhotoGalleryGadget.FieldArrow = FieldArrow;

  function FieldArrow (container, direction, callBackClick)
  {
    var pThis = this,
        arrowContainer;


    function draw ()
    {
      arrowContainer = document.createElement('div');

      if (direction === 'left')
      {
        arrowContainer.setAttribute('class', 'button_leftPhotoGallery');
        var svgContent =
        '<g id="Artboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path d="M0.666666667,10 C0.847222222,10 1.00347222,9.93815104 1.13541667,9.81445312 L1.13541667,9.81445312 L5.80208333,5.43945312 C5.93402778,5.31575521 6,5.16927083 6,5 C6,4.83072917 5.93402778,4.68424479 5.80208333,4.56054687 L5.80208333,4.56054687 L1.13541667,0.185546875 C1.00347222,0.0618489583 0.847222222,0 0.666666667,0 C0.486111111,0 0.329861111,0.0618489583 0.197916667,0.185546875 C0.0659722222,0.309244792 0,0.455729167 0,0.625 L0,0.625 L0,9.375 C0,9.54427083 0.0659722222,9.69075521 0.197916667,9.81445312 C0.329861111,9.93815104 0.486111111,10 0.666666667,10 Z" id="" fill="#000000" fill-rule="nonzero" transform="translate(3.000000, 5.000000) scale(-1, -1) translate(-3.000000, -5.000000) "></path></g>'
        var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute("width", "6px");
        svgElement.setAttribute("height", "10px");
        svgElement.setAttribute("viewBox", "0 0 6 10");
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgElement.innerHTML = svgContent;
        arrowContainer.appendChild(svgElement);

        container.appendChild(arrowContainer);
      }
      else if (direction === 'right')
      {
        arrowContainer.setAttribute('class', 'button_rightPhotoGallery');
        var svgContent =
        '<g id="Artboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path d="M0.666666667,10 C0.847222222,10 1.00347222,9.93815104 1.13541667,9.81445312 L1.13541667,9.81445312 L5.80208333,5.43945312 C5.93402778,5.31575521 6,5.16927083 6,5 C6,4.83072917 5.93402778,4.68424479 5.80208333,4.56054687 L5.80208333,4.56054687 L1.13541667,0.185546875 C1.00347222,0.0618489583 0.847222222,0 0.666666667,0 C0.486111111,0 0.329861111,0.0618489583 0.197916667,0.185546875 C0.0659722222,0.309244792 0,0.455729167 0,0.625 L0,0.625 L0,9.375 C0,9.54427083 0.0659722222,9.69075521 0.197916667,9.81445312 C0.329861111,9.93815104 0.486111111,10 0.666666667,10 Z" id="" fill="#000000" fill-rule="nonzero" transform="translate(3.000000, 5.000000) scale(1, -1) translate(-3.000000, -5.000000) "></path></g>'
        var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute("width", "6px");
        svgElement.setAttribute("height", "10px");
        svgElement.setAttribute("viewBox", "0 0 6 10");
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgElement.innerHTML = svgContent;
        arrowContainer.appendChild(svgElement);

        container.appendChild(arrowContainer);
      }
      else if (direction === 'buttonLeft')
      {
        arrowContainer.setAttribute('class', 'leftFullScreen');

        var svgContent =
          '<g id="Artboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path d="M31.3593002,62.7186005 C31.8280484,62.7186005 32.2030482,62.5779758 32.4842976,62.2967265 L32.4842976,62.2967265 L33.6092949,61.1717292 C33.8905442,60.8904798 34.0311689,60.51548 34.0311689,60.0467318 C34.0311689,59.5779837 33.8905442,59.1561097 33.6092949,58.7811099 L33.6092949,58.7811099 L6.04686058,31.3593002 L33.6092949,3.93749061 C33.8905442,3.56249079 34.0311689,3.1406168 34.0311689,2.67186863 C34.0311689,2.20312046 33.8905442,1.82812064 33.6092949,1.54687131 L33.6092949,1.54687131 L32.4842976,0.421873994 C32.2030482,0.140624665 31.8280484,0 31.3593002,0 C30.8905521,0 30.5155522,0.140624665 30.2343029,0.421873994 L30.2343029,0.421873994 L0.421873994,30.2343029 C0.140624665,30.5155522 0,30.8905521 0,31.3593002 C0,31.8280484 0.140624665,32.2030482 0.421873994,32.4842976 L0.421873994,32.4842976 L30.2343029,62.2967265 C30.5155522,62.5779758 30.8905521,62.7186005 31.3593002,62.7186005 Z" id="" fill="#FFFFFF" fill-rule="nonzero"></path></g>';
        var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute("width", "34px");
        svgElement.setAttribute("height", "63px");
        svgElement.setAttribute("viewBox", "0 0 34 63");
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgElement.innerHTML = svgContent;
        arrowContainer.appendChild(svgElement);

        container.appendChild(arrowContainer);
      }
      else if (direction === 'buttonRight')
      {
        arrowContainer.setAttribute('class', 'rightFullScreen');
        var svgContent =
        '<g id="Artboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path d="M2.67186863,62.7186005 C3.1406168,62.7186005 3.51561662,62.5779758 3.79686595,62.2967265 L3.79686595,62.2967265 L33.6092949,32.4842976 C33.8905442,32.2030482 34.0311689,31.8280484 34.0311689,31.3593002 C34.0311689,30.8905521 33.8905442,30.5155522 33.6092949,30.2343029 L33.6092949,30.2343029 L3.79686595,0.421873994 C3.51561662,0.140624665 3.1406168,0 2.67186863,0 C2.20312046,0 1.82812064,0.140624665 1.54687131,0.421873994 L1.54687131,0.421873994 L0.421873994,1.54687131 C0.140624665,1.82812064 0,2.20312046 0,2.67186863 C0,3.1406168 0.140624665,3.56249079 0.421873994,3.93749061 L0.421873994,3.93749061 L27.9843083,31.3593002 L0.421873994,58.7811099 C0.140624665,59.1561097 0,59.5779837 0,60.0467318 C0,60.51548 0.140624665,60.8904798 0.421873994,61.1717292 L0.421873994,61.1717292 L1.54687131,62.2967265 C1.82812064,62.5779758 2.20312046,62.7186005 2.67186863,62.7186005 Z" id="" fill="#FFFFFF" fill-rule="nonzero"></path></g>'
        var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute("width", "34px");
        svgElement.setAttribute("height", "63px");
        svgElement.setAttribute("viewBox", "0 0 34 63");
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgElement.innerHTML = svgContent;
        arrowContainer.appendChild(svgElement);

        container.appendChild(arrowContainer);
      }
    }


    pThis.show = function ()
    {
      arrowContainer.style.opacity = '0.9';
      arrowContainer.addEventListener('click', onClick);
    };


    pThis.hide = function ()
    {
      arrowContainer.style.opacity = '0.5';
      arrowContainer.removeEventListener('click', onClick);
    };


    pThis.enable = function ()
    {
      arrowContainer.className = arrowContainer.className.replace(/\s+disabled/g, '');
      arrowContainer.addEventListener('click', onClick);
    };


    pThis.disable = function ()
    {
      if (!(/\s+disabled/).test(arrowContainer.className))
      {
        arrowContainer.className += ' disabled';
      }

      arrowContainer.removeEventListener('click', onClick);
    };


    pThis.displayShow = function ()
    {
      arrowContainer.style.visibility = 'visible';
      arrowContainer.addEventListener('click', onClick);
    };


    pThis.displayHide = function ()
    {
      arrowContainer.style.visibility = 'hidden';
      arrowContainer.removeEventListener('click', onClick);
    };


    function onClick ()
    {
      if (typeof (callBackClick) === 'function')
      {
        callBackClick();
      }
    }

    draw();
  }

})();