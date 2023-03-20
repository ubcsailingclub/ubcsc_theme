(function ()
{
  if (!window.Bonasource)
  {
    window.Bonasource = new Object();
  }

  if (window.Bonasource.ControlTooltip)
  {
    return;
  }
  
  window.Bonasource.ControlTooltip = controlTooltip;

  function controlTooltip(elementId, tooltipCssClass, tooltipHTML)
  {
    var _tooltipShowDelegate = null;
    var _tooltipHideDelegate = null;  
    var _tooltipMoveDelegate = null;    
    var _tooltipDiv = null;
    var _tooltipHTML = tooltipHTML;
    var _tooltipCssClass = tooltipCssClass;
    var _element = WA.$(elementId, window);
    var _pThis = this;
  
    addStateHandlers(elementId);

    function addStateHandlers(elementId)
    {
      BonaPage.addHandler(_element, 'mouseover', element_OnMouseOver);
      BonaPage.addHandler(_element, 'mouseout', element_OnMouseOut);
      BonaPage.addHandler(_element, 'mousemove', element_OnMouseOver);
    }
    
    function getTooltipDiv()
    {
      if (!_tooltipDiv)
      {
        _tooltipDiv = document.createElement('div');
        _tooltipDiv.className = _tooltipCssClass; //_pThis.get_tooltipCssClass();
        _tooltipDiv.innerHTML = _tooltipHTML; //_pThis.get_tooltipHTML();
        _tooltipDiv.style.position = 'absolute';
        _tooltipDiv.style.zIndex = 1000;
        _tooltipDiv.style.display = 'none';
        document.body.appendChild(_tooltipDiv);
        BonaPage.addHandler(_tooltipDiv, 'mouseover', element_OnMouseOver);
        BonaPage.addHandler(_tooltipDiv, 'mouseout', element_OnMouseOut);
      }
    
      return _tooltipDiv;
    }
  
    var _tooltipX;
    var _tooltipY;
    var _mouseOverTimeout;
    var _mouseOutTimeout; 
    function element_OnMouseOver(evt)
    {
      if (_mouseOverTimeout)
      {
        clearTimeout(_mouseOverTimeout);
      }
    
      if (_mouseOutTimeout)
      {
        clearTimeout(_mouseOutTimeout);
      }
    
      var mouseXY = WA.getEventMouseCoords(evt);
      _tooltipY = mouseXY.top;
      _tooltipX = mouseXY.left;
      _mouseOverTimeout = setTimeout(showDiv, 10);
    }
    function element_OnMouseOut(evt)
    {
      if (_mouseOutTimeout)
      {
        clearTimeout(_mouseOutTimeout);    
      }
      _mouseOutTimeout = setTimeout(hideDiv, 10);    
    };
    function showDiv()
    {
      try
      {
        var div = getTooltipDiv();
    
        div.style.display = 'block';
        div.style.top = _tooltipY + 21 + 'px'; // real magic number
        div.style.left = _tooltipX + 11 + 'px';
      }
      catch(err) {}
    }
    function hideDiv()
    {
      var div = getTooltipDiv();
      div.style.display = 'none';
    }

    return _pThis;
  }
})();





