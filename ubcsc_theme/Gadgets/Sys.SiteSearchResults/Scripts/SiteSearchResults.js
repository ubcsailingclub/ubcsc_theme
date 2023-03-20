(function()
{
  if (!window.WASearchResultsGadget)
  {
    window.WASearchResultsGadget = WASearchResultsGadget;
  }
  
  function WASearchResultsGadget(args)
  {
    var pThis = this;
    pThis.init = init;
    pThis.doSearch = doSearch;
    
    var model, foundLabel, searchBox, resultDiv, foundRecordsSpan, recordsFoundMessage, pager, selectedTypesCaption, searchInProgress,
	thereWasAnotherRequest;
       
    model = args || {};
    
    function init()
    {
      if (model.searchUnavailable == true)
      {
        return;
      }
      
      var prefix = '#' + model.modelId;

      searchInProgress = false;
	  thereWasAnotherRequest = false;
	  
      searchBox = jq$(prefix + '_searchBox');
      resultDiv = jq$(prefix + '_resultDiv');
      foundLabel = jq$(prefix +'_foundLabel');
      foundRecordsSpan = jq$(prefix +'_foundRecords');
      recordsFoundMessage = jq$(prefix + '_recordsFoundMessage');
      selectedTypesCaption = jq$(prefix + '_selectedTypesCaption');
      pager = jq$(prefix + '_pager');
      $('input[name=' + model.modelId + '_type]').on("click", checkedChanged);

      $(prefix + '_togglePanelLink').on("click", function() 
      { 
        jq$(prefix + '_contentTypesPanel').slideToggle(100);
        jq$(this).toggleClass('fa-caret-down', 'fa-caret-right');
      });
      
      var timer;
      var delay = 600; 

      searchBox.bind('input', function() {
        window.clearTimeout(timer);
        timer = window.setTimeout(function(){ doSearch(1); }, delay);
      })
        
      searchBox.focus();
      
      if (searchBox.val().length > 0)
      {
        doSearch(model.pageNumber);
      }
    }
    
    function doSearch(pageNum)
    {
      if (!pageNum)
      {
        return;
      }
	  
      thereWasAnotherRequest = false;
	  
      if (searchBox.val().length == 0) 
      {
        setEmptyResult();
        return;
      } 

      var filter = getSelectedTypes();
      if (filter == 0)
      {
        setEmptyResult();
        return;
      }
        
      if (searchInProgress)
      {
		  thereWasAnotherRequest = true;
          return;
      }

      searchInProgress = true;
      foundRecordsSpan.html(model.text.searchInProgress);
        
      jq$.ajax({
        type: 'POST',
        url: model.searchActionUrl,
        data: JSON.stringify({ 'q' : searchBox.val(), 'types': filter, 'pageNumber' : pageNum, 'noPaging' : model.noPaging }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'text'
      }).done(function(data)
      {
		searchInProgress = false;
		if (thereWasAnotherRequest) { doSearch(1); }
		else
		{
			foundLabel.show();
			var jsonData = JSON.parse( data.replace("while(1); ","","i").trim() );
			
			if (jsonData.entities.length > 0)
			{
			  renderResult(jsonData);
			}
			else 
			{
			  setEmptyResult();
			}
			
			var url = WA.String.format(model.getUrlTemplate, encodeURIComponent(searchBox.val()), filter, pageNum);
			
			if (model.noPaging == true)
			{
			  url = url + '&nopaging=true';
			}
			
			window.history.replaceState({}, '', url);
		}
      })
      .fail(function()
      {
		searchInProgress = false;
		if (thereWasAnotherRequest) { doSearch(1); }
		else
		{
			recordsFoundMessage.html('Search is not available now.');
		}
      });
    }
    
    function checkedChanged()
    {
      refreshSelectedTypesCaption();
      doSearch(1);
    }
    
    function refreshSelectedTypesCaption()
    {
      var all = true;
      var captions = new Array();
      
      $('input[name=' + model.modelId + '_type]').each(function()
      {
        if ($(this).attr("checked") == "checked")
        {
          captions.push($('label[for=' + $(this).attr("id") + ']:first').text());
        }
        else
        {
          all = false;
        }
      });
      
      var text = '';
        
      if (all)
      {
        text = 'all';
      }
      else if (captions.length == 0)
      {
        text = 'none';
      }
      else
      {
        text = captions.join(', ');
      }
      
      selectedTypesCaption.html(WA.String.format(model.text.contentTypeTemplate, text));
    }
    
    function getSelectedTypes()
    {
      var filter = 0;
    
      $('input[name=' + model.modelId + '_type]:checked').each(function(){
        filter = filter | $(this).attr("value");
      });
    
      return filter;
    }
    
    function setEmptyResult()
    {
      setFoundRecords(0, model.text.noResultsFound);
      resultDiv.html('');
      pager.html('');
    }
    
    function renderResult(data)
    {
      var items = data.entities;
      var a = new Array();
    
      for (var i = 0; i < items.length; i++)
      {
        var o = items[i];
        var text = o.text;
        
        a.push('<div class="row">');
        a.push('<div class="title"><a class="' + o.className + '" title="' + o.tooltip + '" href="' + o.url + '"><span>' + o.title + '</span></a></div>');
        a.push('<div class="text">' + o.text + '</div>');
        
        if (o.additionalInfo != '')
        {
          a.push('<div class="additionalInfo">' + o.additionalInfo + '</div>');
        }
        
        a.push('</div>');
      }
    
      resultDiv.html(a.join(''));
      setFoundRecords(data.recordsFound, data.recordsFoundMessage);
      
      renderPager(parseInt(data.pagesFound), parseInt(data.currentPage), 9);
    }
    
    function setFoundRecords(recordsFound, message)
    {
      foundRecordsSpan.html('' + recordsFound + '');
      recordsFoundMessage.html(message);
    }
    
    function renderPager(pagesCount, currentPage, pagesToDisplay)
    {
      if (pagesCount == 1)
      {
        pager.html('');
        return;
      }
      
      var pagerItems = [];
      pagerItems.push({text: model.text.first, page: currentPage == 1 ? null : 1 });
      pagerItems.push({text: model.text.previous, page: currentPage == 1 ? null : currentPage - 1 });
      
      var firstPage, lastPage;
      
      if (pagesCount < pagesToDisplay)
      {
        firstPage = 1; 
        lastPage = pagesCount;
      }
      else
      {
        firstPage = Math.min(currentPage - Math.floor(pagesToDisplay / 2), pagesCount - pagesToDisplay + 1);     
        
        if (firstPage < 1)
        {
          firstPage = 1;
        }
        
        lastPage = firstPage + pagesToDisplay - 1;
      }
      
      for (var i = firstPage; i <= lastPage; i++)
      {
        pagerItems.push({text: i, page: currentPage == i ? null : i });
      }
      
      pagerItems.push({text: model.text.next, page: currentPage == pagesCount ? null : currentPage + 1 });
      pagerItems.push({text: model.text.last, page: currentPage == pagesCount ? null : pagesCount });
      
      var arr = renderPagerItems(pagerItems);
    }
    
    function renderPagerItems(jsonArr)
    {
      var i, 
          linkElements,
          a = new Array();
      
      WA.Array.foreach(jsonArr, function(item) 
      { 
        if (item.page)
        {
          a.push('<a style="cursor: pointer;" data-page="' + item.page + '">' + item.text + '</a>');
        }
        else
        {
          a.push('<span>' + item.text + '</span>');
        }
      });
        
      pager.html(a.join('&nbsp;&nbsp;'));
      
      linkElements = document.body.querySelectorAll("A[data-page]");
      
      for (i = 0; i < linkElements.length; i++)
      {
        WA.addHandler(linkElements[i], "click", gotoPage);
      }
    }
    
    function gotoPage (e)
    {
      var targetElement;
      
      if (!e && event)
      {
        e = event;
      }
      
      if (e)
      {
        targetElement = e.target || e.srcElement;
        
        if (targetElement)
        {
          doSearch(targetElement.getAttribute("data-page"));
        }
      }
    }
    
    init();
  }
    
}) ();