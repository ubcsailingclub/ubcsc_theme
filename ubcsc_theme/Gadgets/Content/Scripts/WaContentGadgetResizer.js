(function (window, WA, undefined)
{
  'use strict';

  if (!window.WaContentGadgetResizer)
  {
    window.WaContentGadgetResizer = WaContentGadgetResizer;
  }

  function WaContentGadgetResizer(initModel)
  {
    var pThis = this,
        typeName = 'WaContentGadgetResizer',
        viewModel = initModel;

    pThis.toString = function () { return typeName; };

    /*debug*/var logEnabled = false; function log(text) { if (logEnabled) { WA.Log.add(typeName + (viewModel.id ? '#' + viewModel.id : ''), text); } }

    var isDisposed = false,
        container,
        editableContainer,
        editableAttribute = 'data-editableArea',
        setHeightTimeout = 50,
        editableHeightAttribute = 'data-areaHeight';


    function resetEditableContainerHeight()
    {
      /*debug*/log('resetEditableContainerHeight');

      WA.removeHandler(this, 'load', resetEditableContainerHeight);
      WA.throttle(setEditableContainerHeight, { timeout: setHeightTimeout });
    }


    function setEditableContainerHeight()
    {
      /*debug*/log('setEditableContainerHeight');

      if (isDisposed) { return; }

      var gadgetHeight = container.offsetHeight - WA.Style.getElementStyleInt(container, 'paddingBottom', window),
          gadgetPosition = container.style.position || '',
          heightMeter = document.createElement('waContentHeightMeter'),
          editableContainerHeight,
          height;

      heightMeter.style.display = 'block';
      heightMeter.style['float'] = 'none';
      heightMeter.style['clear'] = 'both';
      heightMeter.style.height = '0px';
      heightMeter.style.fontSize = '0px';

      container.style.position = 'relative';
      container.appendChild(heightMeter);

      editableContainerHeight = editableContainer.offsetHeight - WA.Style.getElementStyleInt(editableContainer, 'paddingTop', window) - WA.Style.getElementStyleInt(editableContainer, 'paddingBottom', window);
      height = Math.max(editableContainerHeight + gadgetHeight - heightMeter.offsetTop, 0);

      container.removeChild(heightMeter);
      heightMeter = null;
      container.style.position = gadgetPosition;

      editableContainer.style.height = height + 'px';
      editableContainer.setAttribute(editableHeightAttribute, height, 0);
    }


    function init()
    {
      /*debug*/log('init');

      var containerImages,
          i,
          len;

      container = WA.$(viewModel.id, window);

      if (!container) { return; }

      editableContainer = container.querySelector('[' + editableAttribute + ']');

      if (editableContainer)
      {
        editableContainer.style.height = '';

        containerImages = container.getElementsByTagName('img');

        for (i = 0, len = containerImages.length; i < len; i++)
        {
          if (!containerImages[i]['complete'])
          {
            WA.addHandler(containerImages[i], 'load', resetEditableContainerHeight);
          }
        }

        resetEditableContainerHeight();
      }
    }


    function dispose()
    {
      if (isDisposed) { return; }

      /*debug*/log('dispose');

      WA.clearThrottle(setEditableContainerHeight);

      viewModel = null;
      container = null;
      editableContainer = null;

      isDisposed = true;
    }

    BonaPage.addPageStateHandler(BonaPage.PAGE_PARSED, init, BonaPage.HANDLERTYPE_ALWAYS);
    BonaPage.addPageStateHandler(BonaPage.PAGE_UNLOADED, dispose, BonaPage.HANDLERTYPE_ALWAYS);
  }

})(window, window.WA);