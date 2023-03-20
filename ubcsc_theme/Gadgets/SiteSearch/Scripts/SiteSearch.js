/*compiled*/

(function()
{
  if (!window.WASiteSearchGadget)
  {
    window.WASiteSearchGadget = WASiteSearchGadget;
  }
  
  function WASiteSearchGadget(args)
  {
	var pThis = this;
    
	pThis.init = init;
	pThis.doSearch = doSearch;
  
	var model, searchBox, resultDiv, selectedTypes, timer, delay = 600,
	items, searchInProgress, thereWasAnotherRequest,
	selectedSugestion = -1; 
	
	
	model = args || {};
  
	function init()
	{
	    if (!document.getElementById(model.searchBoxId))
		{
		  throw new Error("couldn't find searchBoxId");
		}
		
		searchInProgress = false;
		thereWasAnotherRequest = false;
		
	    searchBox = jq$('#' + model.searchBoxId);
		searchBox.bind('keypress', moveToSearchPage)
		selectedTypes = model.selectedTypes;
		
		if (model.autoSuggest)
		{
		    resultDiv = jq$('#' + model.resultDivId);

			searchBox.bind('input', search)
			searchBox.bind('keydown', handleKey)
		}
	}

	function moveToSearchPage(e)
	{
		if (e.keyCode == 13) // enter
		{
			var url;

			if (selectedSugestion >= 0 && selectedSugestion < items.length)
			{
				url = items[selectedSugestion].url;
			}
			else
			{
				url = WA.String.format(model.searchTemplate, 
					encodeURIComponent(searchBox.val()),
					selectedTypes, 1);
			}
			
			window.location = url;
			return false;
		}
	}
	function handleKey(e)
	{
		if (e.keyCode == 40)  // down
		{
			setSelectedDown();
			return false;
		}
		if (e.keyCode == 38)  // up
		{
			setSelectedUp();
			return false;
		}
	}
	  
	function search() 
	{
		if (timer)
		{
		  clearTimeout(timer);
		}

		timer = setTimeout(doSearch, delay);
	}

	function doSearch()
	{
        thereWasAnotherRequest = false;
		
		selectedSugestion = -1;
		if (searchBox.val().length == 0) 
		{
		  setEmptyResult();
		  return;
		} 

		var filter = selectedTypes;
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
		jq$.ajax({
		  type: 'POST',
		  url: model.searchActionUrl,
		  data: JSON.stringify({ 'q' : searchBox.val(), 'types': filter, 'pageNumber' : 1, 'noPaging' : 0 , 'pageSize' : 10, titlesOnly: 1}),
		  contentType: 'application/json; charset=utf-8',
		  dataType: 'text'
		}).done(function(data)
		{
			searchInProgress = false;
			if (thereWasAnotherRequest) { doSearch(); }
			else
			{
				selectedSugestion = -1;
				var jsonData = JSON.parse( data.replace("while(1); ","","i").trim() );		  
				renderResult(jsonData);
		    }
		})
		.fail(function()
		{
			searchInProgress = false;
			if (thereWasAnotherRequest) { doSearch(); }
		});
	}

	function setEmptyResult()
	{
		resultDiv.html('');
		resultDiv.hide();
	}

	function renderResult(data)
	{
		resultDiv.show();
		items = data.entities;
		var a = [];

		for (var i = 0; i < items.length; i++)
		{
		  var o = items[i];
		  a.push('<div id="' + getSuggestionDivId(i) + '" class="item">');
		  a.push('<a class="' + o.className + '" title="' + o.tooltip + '" href="' + o.url + '"><span>' + o.title + '</span></a>');
		  a.push('</div>');
		}

		  a.push('<div id="' + getSuggestionDivId(i) + '" class="item last">');
		  a.push('<a href="' + WA.String.format(model.searchTemplate, encodeURIComponent(searchBox.val()), selectedTypes, 1) +
			'"><span>' + WA.String.format(model.GoToSearchPageTextTemplate, $('<div/>').text(searchBox.val()).html()) + '</span></a>');
		  a.push('</div>');
		resultDiv.html(a.join(''));
	}
	
	function getSuggestionDivId(i)
	{
		return model.gadgetId + '_' + i + 'Suggestion';
	}
	
	function setSelectedDown()
	{
	   if (!items || selectedSugestion >= items.length)
	   {
		return;
	   }
	   
		clearCurrentSuggestion();
		selectedSugestion++;
		setCurrentSuggestion();
	}
	
	function setSelectedUp()
	{
	   if (!items || (selectedSugestion <= 0))
	   {
		return;
	   }
	   
		clearCurrentSuggestion();
		selectedSugestion--;
		setCurrentSuggestion();
	}

	function clearCurrentSuggestion()
	{
	   if (selectedSugestion < 0)
	   {
		return;
	   }
	   
	   var div  = jq$('#' + getSuggestionDivId(selectedSugestion)); 
	   div.removeClass('selectedSuggestions');
	}
	
	function setCurrentSuggestion()
	{
	   if (selectedSugestion < 0)
	   {
		return;
	   }
	   
	   var div  = jq$('#' +  getSuggestionDivId(selectedSugestion)); 
	   div.addClass('selectedSuggestions');
	}

	init();
	}
}) ();