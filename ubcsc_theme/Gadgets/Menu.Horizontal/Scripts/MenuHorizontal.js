(function (window, WA, undefined)
{
  'use strict';

  if (!window.WaMenuHorizontal)
  {
    window.WaMenuHorizontal = WaMenuHorizontal;
  }

  function WaMenuHorizontal(initModel, initArgs)
  {
    initArgs = initArgs || {};

    var pThis = this,
      typeName = 'window.WaMenuHorizontal',
      viewModel = initModel;

    pThis.toString = function () { return typeName; };



    /*debug*/var logEnabled = true; function log(text) { if (logEnabled) { console.log(typeName + (viewModel.id ? '#' + viewModel.id : ''), text); } }

    pThis.RenderComplete = WA.Tools.EventHandlers.createHandlers(pThis, { id: 'RenderComplete' });
    pThis.Dispose = WA.Tools.EventHandlers.createHandlers(pThis, { id: 'Dispose' });

    var isDisposed = false,
      gadgetHorMenu,
      gadgetHorMenuContainer,
      firstLevelMenu,
      holderInitialMenu,
      outsideItems = null,
      phantomElement = '<li class="phantom"><div class="item"><a href="#"><span>&#x2261;</span></a><ul class="secondLevel"></ul></div></li>',
      placeHolder,
      placeHolderId,
      mobileState = false,
      rsStateWidth2 = 617,
      supportTouch,
      stickyWrapper = jq$('.stickness');

      pThis.render = render;

    function render()
    {
      /*debug*/log('render');
      return window.WaMenuHorizontal.WaMenuHorizontalTemplate(viewModel);
    }


    function onRenderComplete(sender, args)
    {
      /*debug*/log('onRenderComplete');

      pThis.RenderComplete.fireHandlers();
    }

    function resizeMenu()
    {
      var i,
        len,
        fitMenuWidth = 0,
        menuItemPhantomWidth = 80;

        debugger;

      firstLevelMenu.html(holderInitialMenu).removeClass('adapted').css({ width: 'auto' }); // restore initial menu

      if( !gadgetHorMenuContainer.find('.menuButton').size() )
      {
        gadgetHorMenuContainer.prepend('<div class="menuButton"></div>');

        gadgetHorMenuContainer.find('.menuButton').on("click",function()
        {
          firstLevelMenu.toggle();
          return false;
        });
      }

      // for state 3
      var realWidth = Math.max( $(window).width(), window.innerWidth);

      if( realWidth < rsStateWidth2 && mobileState == false )
      {
        firstLevelMenu.attr('style','');
        gadgetHorMenuContainer.addClass('mobileView');
        mobileState = true;
      }

      if( realWidth >= rsStateWidth2 )
      {
        firstLevelMenu.attr('style','');
        gadgetHorMenuContainer.removeClass('mobileView');
        mobileState = false;
      }


      if( firstLevelMenu.width() > gadgetHorMenuContainer.width() ) // if menu oversize
      {
        menuItemPhantomWidth = firstLevelMenu.addClass('adapted').append( phantomElement).children('.phantom').width();

        for( i = 0, len = holderInitialMenu.size(); i <= len; i++ )
        {
          fitMenuWidth += jq$( holderInitialMenu.get(i) ).width();

          if( fitMenuWidth + menuItemPhantomWidth > gadgetHorMenuContainer.width() )
          {
            outsideItems = firstLevelMenu.children(':gt('+(i-1)+'):not(.phantom)').remove();
            firstLevelMenu.find('.phantom > .item > ul').append( outsideItems);
            break;
          }
        }
        gadgetHorMenu.find('.phantom > .item > a').click(function(){ return false; });
      }

      firstLevelMenu.css( 'width', '' ); // restore initial menu width
      firstLevelMenu.children().removeClass('last-child').eq(-1).addClass('last-child'); // add last-child mark
    }

    function onLayoutColumnResized(sender, args)
    {
      args = args || {};

      if (placeHolderId && (placeHolderId == args.leftColPlaceHolderId || placeHolderId == args.rightColPlaceHolderId))
      {
        resizeMenu();
      }
    }

    function onMenuLinkTouch(event)
    {
      if( !this.touchCounter )
      {
        this.touchCounter = 0;
      }

      if( this.touchCounter >= 1 )
      {
        this.touchCounter = 0;
        return true;
      }

      this.touchCounter++;

      if(!mobileState)
      {
        event.preventDefault();
      }
    }

    function onMenuLinkOut(event)
    {
      this.touchCounter = 0;
    }

    function init()
    {
      /*debug*/log('init');

      gadgetHorMenu = jq$('#' + viewModel.id);
      gadgetHorMenuContainer = gadgetHorMenu.find('.menuInner');
      firstLevelMenu = gadgetHorMenu.find('ul.firstLevel');
      holderInitialMenu = firstLevelMenu.children();
      placeHolder = gadgetHorMenu.parents('.WaLayoutPlaceHolder');
      placeHolderId = placeHolder && placeHolder.attr('data-componentId');
      supportTouch = WA.Browser.isTouchEventsSupported;

      resizeMenu();

      jq$(window).on('resize' , resizeMenu);


      WA.Gadgets.LayoutColumnResized.addHandler(onLayoutColumnResized);
      BonaPage.addPageStateHandler(BonaPage.PAGE_UNLOADED, dispose);

      if( supportTouch )
      {
        gadgetHorMenu.on('click', '.menuInner li.dir > .item > a', onMenuLinkTouch);
        gadgetHorMenu.on('mouseout', '.menuInner li.dir > .item > a', onMenuLinkOut);
      }
    }


    function dispose()
    {
      if (isDisposed) { return; }

      /*debug*/log('dispose');
      pThis.Dispose.fireHandlers();

      jq$(window).off('resize' , resizeMenu);
      WA.Gadgets.LayoutColumnResized.removeHandler(onLayoutColumnResized);
      gadgetHorMenu.off('click', '.menuInner li.dir > .item > a', onMenuLinkTouch);
      gadgetHorMenu.off('mouseout', '.menuInner li.dir > .item > a', onMenuLinkOut);

      viewModel = null;
      gadgetHorMenu = null;
      gadgetHorMenuContainer = null;
      firstLevelMenu = null;
      holderInitialMenu = null;
      placeHolder = null;
      placeHolderId = null;

      isDisposed = true;
    }

    BonaPage.addPageStateHandler(BonaPage.PAGE_PARSED, init, BonaPage.HANDLERTYPE_ALWAYS);
  }

})(window, WA);