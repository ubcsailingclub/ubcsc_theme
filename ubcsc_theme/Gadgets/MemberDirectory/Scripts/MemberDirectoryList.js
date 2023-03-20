/*compiled*/
var MemberDirectoryListRenderer;

(function() {
// start of MemberDirectoryListRenderer singleton

  var $ = function (id) { return document.getElementById(id); };

  if(MemberDirectoryListRenderer == null) 
  {
    MemberDirectoryListRenderer = new Object();

    /*debug*/var logEnabled = false; function log(text) { if (logEnabled && WA.Log) { WA.Log.add('MemberDirectoryListRenderer', text); } }

    MemberDirectoryListRenderer.FormId = 0;
    MemberDirectoryListRenderer.DataSourceId = 0;

    MemberDirectoryListRenderer.outputBlockId = 'memberDirectory';
    MemberDirectoryListRenderer.foundBlockId = 'membersFound';
    MemberDirectoryListRenderer.pagingBlockId = 'idPagingData';
    MemberDirectoryListRenderer.pagingBlock2Id = 'idPagingData2';
    MemberDirectoryListRenderer.waitMessagesBlockId = 'idWaitMessages';
    MemberDirectoryListRenderer.reloadLinkId = 'idReloadData';
    MemberDirectoryListRenderer.selectedMembersFieldId = '';
    MemberDirectoryListRenderer.titleLabelId = '';
    MemberDirectoryListRenderer.titleTemplate = '';
    MemberDirectoryListRenderer.imgTemplateRelativePath = '';
    MemberDirectoryListRenderer.MemberDirectoryListWebServiceUrl_LoadMembers = '';
    MemberDirectoryListRenderer.notifyGadgetChangedTimeout = 27;

    MemberDirectoryListRenderer.labels = 
    {
      serverLoadingStarted    :  '<img src="/Admin/html_res/images/asyncloadprogress.gif">Loading...'
     ,serverLoadingError      : 'Loading error&nbsp;'
     ,serverLoadingErrorAlert : 'Server error while loading data.<br>Please contact us at support@wildapricot.com and let us know what led to this error.<br><br>Sorry for inconvenience.'
     ,processingServerData    : 'Processing data, please wait...'
     ,processingCachedData    : 'Processing cache...'
     ,searchingKeywords       : 'searching...'
     ,searchingEmpty          : 'loading...'
     ,displayingFound         : 'displaying...'
     ,pagingTemplate          : 'Show:{0}'
     ,noMembersInDatabase     : 'No members in your database.'
     ,noMembersFound          : 'No members found. Edit your search text or clear search box to show all members.'
     ,detailsUrlTitle         : 'Go to member details'
     ,viewDetails             : 'View details'
     ,headers                 : { column1: '', column2: '', column3: '', column4: '' }
    };

    // public methods
    MemberDirectoryListRenderer.init = init;
    MemberDirectoryListRenderer.highlightRowAndNext = highlightRowAndNext;
    MemberDirectoryListRenderer.normlightRowAndNext = normlightRowAndNext;
    MemberDirectoryListRenderer.highlightRowAndPrev = highlightRowAndPrev;
    MemberDirectoryListRenderer.normlightRowAndPrev = normlightRowAndPrev;
    MemberDirectoryListRenderer.redirectToMemberDetails = redirectToMemberDetails;
    MemberDirectoryListRenderer.pagerChanged = pagerChanged;
  }

  // state vars
  var isInited = false;
  var directoryData;
  var searchAsyncData;
  var forceNextAskSearch = false;
  var lastSeachBoxAskValue = '';
  var isCached = false;
  var cache;

  // timeouts and intervals
  var searchBoxAskTimeout;
  var processSearchTimeout;
  var searchAsyncTimeout;
  var notifyGadgetChangedTimeout = MemberDirectoryListRenderer.notifyGadgetChangedTimeout;
  
  // consts
  var pagerRangeNameLength = 4;
  var pagerRangeLevelLength = 5;
  var maxDisplayRecords = 50;
  var searchBoxAskIntervalMs = 50;
  var processSearchTimeoutMs = 250;
  var searchAsyncTimeoutMs = 10;
  var searchAsyncMaxRecords = 1000;

  //filter
  var maxFilterQty = 4;
  var filterValues = new Array (null, null, null, null);
  var filterOptionCounters = new Array (null, null, null, null);
  var filterOptionNames = new Array (null, null, null, null);
  
  // templates

  var footerTemplate = '</table>';
  var pagerTemplate = [
    '<select onchange="MemberDirectoryListRenderer.pagerChanged(this);">'
  , '</select>'];
  var pagerOptionTemplate = [
    '<option value="'
  , '">'
  , '-'
  , '</option>'];
  var tableStart = '<table id="membersTable" class="membersTable" cellspacing="0"><thead><tr>';
  var thTemplate = [
    '<th width="'
  , '%">'
  , '</th>'];
  var headerEnd = "</tr></thead>"
  var tdTemplate = [
    '<td class="'
  , '" width="'
  , '%">'
  , '</td>'];
  var linkTemplate = [
    '<h5><a title="'
  , '" onclick="globalUtils.stopEventPropogation(event)" href="'
  , '">'
  , '</a></h5>'];
  var bottomRowTemplate = [
    '</tr><tr class="normal" bottomrow=\'true\' onclick="MemberDirectoryListRenderer.redirectToMemberDetails(\''
  , '\')" onmouseover="MemberDirectoryListRenderer.highlightRowAndPrev(this)" onmouseout="MemberDirectoryListRenderer.normlightRowAndPrev(this)"><td class=\'memberDirectoryBottomRow\' colspan=\''
  , '\'><div class=\'mainDiv\'>'
  , '</div></td>'];
  var memberTemplate = [
    '<tr class="normal" onclick="MemberDirectoryListRenderer.redirectToMemberDetails(\''
  , '\')" onmouseover="MemberDirectoryListRenderer.highlightRowAndNext(this)" onmouseout="MemberDirectoryListRenderer.normlightRowAndNext(this)">'
  , '</tr>'];
  var imgTemplate = [
    '<img src=\''
  , '?memberId='
  , '&id='
  , '&t='
  , '\'></img>'];
  var emailTemplate = [
    '<a href="mailto:'
  , '" onclick="window.location=this.href;BonaPage.stopEvent(event);">'
  , '</a>'];

  var emailReplaceTemplate = '<a href="mailto:$1" onclick="window.location=this.href;BonaPage.stopEvent(event);">$1</a>';

  // reexp
  var emailReplace1 = /([\w#%\"\*\.!\$\+\-\=\?\^\'\{\}\|\~\&]+@(?:[a-zA-Z0-9_-]+\.)+[a-zA-Z]{1,20})/gim;

  /*****************************************************/
  /***   INITIALIZATION AND DISPOSING                ***/
  /*****************************************************/

  function init()
  {
    /*debug*/log('init');

    disableSearch();
    initDisposeEvents();    
    loadRecordsAsync();
    initCache();
    initFilter();

    WA.Gadgets.GadgetDeleted.addHandler(onGadgetDeleted);

    isInited = true;
  }  
  
  function initDisposeEvents()
  {
    /*debug*/log('initDisposeEvents');

    if (document.all)
      window.attachEvent('onunload', dispose);
    else
      window.addEventListener('unload', dispose, false);
  }
  
  function dispose()
  {
    /*debug*/log('dispose');

    isInited = false;

    WA.Gadgets.GadgetDeleted.removeHandler(onGadgetDeleted);

    disposeAllTimeouts();
    disposeSearchData();
    directoryData = null;
  }


  function onGadgetDeleted(sender, args)
  {
    /*debug*/log('onGadgetDeleted');
    args = args || {};

    var versionData = MemberDirectoryListRenderer.VersionData;

    if (versionData && args.componentId && args.componentId == versionData.componentId)
    {
      dispose();
    }
  }

  
  function disposeAllTimeouts()
  {
    /*debug*/log('disposeAllTimeouts');

    WA.clearThrottle(doNotifyGadgetChanged);

    if (searchBoxAskTimeout)
      clearTimeout(searchBoxAskTimeout);
  
    if (processSearchTimeout)
      clearTimeout(processSearchTimeout);

    terminateAsyncSearch();
  }
  
  function disposeSearchData()
  {
    /*debug*/log('disposeSearchData');

    searchData = null;
  }

  /*****************************************************/
  /***   CACHE HELPERS                               ***/
  /*****************************************************/
  
  function initCache()
  {
    /*debug*/log('initCache');

    if (!cache)
    {
      cache = new Object();
    }
  
    try
    {
      top.cache = cache;
    }
    catch(e){}
          
    if (!cache.memberDirectory)
    {
      cache.memberDirectory = {
        isReady : false,
        serverResponse : null,
        totalCount : null,
        colTitlesData : null,
        membersData : null,
        searchData : null,
        safeData : null,
        foundCount: null
      };     
    }
  }
  
  function clearCache()
  {
    /*debug*/log('clearCache');

    if (cache && cache.memberDirectory)
    {
      cache.memberDirectory = null;
    }
    
    initCache();
  }

  function getCachedDirectoryData()
  {
    /*debug*/log('getCachedDirectoryData');

    initCache();
    return cache.memberDirectory;
  }

  /*****************************************************/
  /***   DISPLAY MESSAGES HELPERS                    ***/
  /*****************************************************/
  
  function setMessage(message)
  {
    /*debug*/log('setMessage');

    var messageBlock = $(MemberDirectoryListRenderer.waitMessagesBlockId);
    if (messageBlock)
    {
      messageBlock.innerHTML = message;
      messageBlock.style.display = message ? 'inline' : 'none';
    }
  }

  function setFound(found)
  {
    /*debug*/log('setFound');

    var foundBlock = $(MemberDirectoryListRenderer.foundBlockId);

    if (foundBlock)
    {
      if (found != 0 && (found == null || found == ''))
      {
        foundBlock.innerHTML = '';
        foundBlock.style.display = 'none';
        hideReload()
        hidePaging();
      }
      else
      {
        foundBlock.innerHTML = found;
        foundBlock.style.display = 'inline';
      }
    }
  }
  
  function hideReload()
  {
    /*debug*/log('hideReload');

    $(MemberDirectoryListRenderer.reloadLinkId).style.display = 'none';
  }
  
  function showReload()
  {
    /*debug*/log('showReload');

    var reloadLink = $(MemberDirectoryListRenderer.reloadLinkId);
    reloadLink.style.display = 'inline';
    reloadLink.onclick = null;
    reloadLink.onclick = reloadData;
  }
  
  function setPaging(selectHTML, seletedValue)
  {
    /*debug*/log('setPaging');

    var pagers = [
      $(MemberDirectoryListRenderer.pagingBlockId),
      $(MemberDirectoryListRenderer.pagingBlock2Id)
    ]
    var i;
    var oi;
    
    for (i = 0; i < pagers.length; i++)
    {
      pagers[i].innerHTML = MemberDirectoryListRenderer.labels.pagingTemplate.replace(/\{0\}/g, selectHTML); 
      pagers[i].style.display = 'inline';

      var pagerSelect = pagers[i].getElementsByTagName('SELECT')[0];
      for (oi = 0; oi < pagerSelect.options.length; oi++)
      {
        if (pagerSelect.options[oi].value == seletedValue)
        {
          pagerSelect.options[oi].selected = true;
          break;
        }
      }
    }
  }
  
  function hidePaging()
  {
    /*debug*/log('hidePaging');

    var pagingBlock = $(MemberDirectoryListRenderer.pagingBlockId);
    if (pagingBlock)
    {
      pagingBlock.style.display = 'none';
    }
    var pagingBlock2 = $(MemberDirectoryListRenderer.pagingBlock2Id);
    if(pagingBlock2)
    {
      pagingBlock2.style.display = 'none';
    }
  }
  
  function isPagerHidden()
  {
    /*debug*/log('isPagerHidden');

    return $(MemberDirectoryListRenderer.pagingBlockId) && ($(MemberDirectoryListRenderer.pagingBlockId).style.dysplay != 'inline');
  }
  function setDirectoryOutput(html, encodeHtml)
  {
    /*debug*/log('setDirectoryOutput');

    var outputBlock = $(MemberDirectoryListRenderer.outputBlockId);
    
    if (!outputBlock)
    {
      return;
    }
    
    if (encodeHtml == true) //encodeHtml may not be bool
    {
      outputBlock[document.all ? "innerText" : "textContent"] = html ? html : '';
    }
    else
    {
      outputBlock.innerHTML = html ? html : '';
    }
  }

  /*****************************************************/
  /***   SEARCHBOX                                   ***/
  /*****************************************************/

  function getSearchKeywords()
  {
    /*debug*///log('getSearchKeywords');

    var searchBoxElem = $(MemberDirectoryListRenderer.searchBoxId);
    
    if (!searchBoxElem)
    {
      dispose();
      return false;
    }
    
    var normalizedSearchPhrase = searchBoxElem.value.replace(/\s+/g, ' ');
    normalizedSearchPhrase = normalizedSearchPhrase.replace(/^\s*(.*?)\s*$/, '$1');
    return normalizedSearchPhrase;
  }

  function convertKeywordsToArray(keywords)
  {
    /*debug*/log('convertKeywordsToArray');

    if (!keywords)
      return new Array();
    
    var keywordsBeforeEncode = keywords.toLowerCase().split(' ');
    var result = new Array();
    
    for (var i = 0; i < keywordsBeforeEncode.length; i++)
    {
      result[i] = BonaPage.encodeHtml(keywordsBeforeEncode[i]);
    }
    
    return result;
  }

  function enableSearch(searchValue, autofocus)
  {
    /*debug*/log('enableSearch');

    var searchBox;

    autofocus = autofocus === undefined ? true : autofocus;

    if (!WA.AdminPanel || !WA.AdminPanel.PageMode || WA.AdminPanel.PageMode.Mode() != WA.AdminPanel.PageModeType.Edit)
    {
      searchBox = $(MemberDirectoryListRenderer.searchBoxId);

      if (searchValue)
        searchBox.value = searchValue;

      searchBox.onkeypress = searchBoxIgnoreEnter;
      searchBox.disabled = false;
      try 
      {
        if(autofocus)
        {
          searchBox.focus();
        }
     } catch (e) {}
    }
    
    if (searchBoxAskTimeout)
      clearTimeout(searchBoxAskTimeout);
      
    searchBoxAskTimeout = setTimeout(searchBoxAsk, searchBoxAskIntervalMs);
  }
  
  function disableSearch()
  {
    /*debug*/log('disableSearch');

    if (searchBoxAskTimeout)
      clearTimeout(searchBoxAskTimeout);

    var searchBox = $(MemberDirectoryListRenderer.searchBoxId);
    //searchBox.disabled = true;
  }
  
  function stopAskSearchBox()
  {
    /*debug*/log('stopAskSearchBox');

    if (searchBoxAskTimeout)
      clearTimeout(searchBoxAskTimeout);
  }
  
  function searchBoxIgnoreEnter(e)
  {
    /*debug*/log('searchBoxIgnoreEnter');

    if (!isInited) 
      return false;

    if (!e) 
      e = event;

    if (e.keyCode == 13)
    {
      forceNextAskSearch = true;
      return false;
    }
  }

  function searchBoxAsk()
  {
    if (searchBoxAskTimeout)
      clearTimeout(searchBoxAskTimeout);

    if (!isInited) { return; }

    /*debug*///log('searchBoxAsk');

    var searchKeywords = getSearchKeywords();
    
    if (searchKeywords == lastSeachBoxAskValue && !forceNextAskSearch)
    {
      searchBoxAskTimeout = setTimeout(searchBoxAsk, searchBoxAskIntervalMs);
      return;
    }

    forceNextAskSearch = false;      
    lastSeachBoxAskValue = searchKeywords;

    if (processSearchTimeout) 
      clearTimeout(processSearchTimeout);

    terminateAsyncSearch();

    var searchMessage = searchKeywords ? 
      MemberDirectoryListRenderer.labels.searchingKeywords :
      MemberDirectoryListRenderer.labels.searchingEmpty;
    
    setFound();
    setMessage(searchMessage);

    notifyGadgetChanged();

    processSearchTimeout = setTimeout(function() { searchAndRenderAsync(searchKeywords); }, processSearchTimeoutMs);
    searchBoxAskTimeout = setTimeout(searchBoxAsk, searchBoxAskIntervalMs);
  }
  function setTitle(count)
  {
    /*debug*/log('setTitle');

    return;
    var titleLabel = $(MemberDirectoryListRenderer.titleLabelId);
    titleLabel.innerHTML = MemberDirectoryListRenderer.titleTemplate.replace(/\{0\}/g, count); 
    titleLabel.style.visibility = 'visible';
  }
  /*****************************************************/
  /***   DATA LOADING AND PROCESSING                 ***/
  /*****************************************************/

  function loadRecordsAsync()
  {
    /*debug*/log('loadRecordsAsync');

    directoryData = getCachedDirectoryData();

    isCached = false;
    setFound(MemberDirectoryListRenderer.labels.serverLoadingStarted);

    notifyGadgetChanged();
    
    /*
    var match = document.body.id.match(/pageid_(\d+)/i);
    
    if (match != null) 
    {
	    var pageId = match[1];
    } 
    */

    var formData = { 'formId' : MemberDirectoryListRenderer.FormId };

    if (MemberDirectoryListRenderer.VersionData)
    {
      formData.pageId = MemberDirectoryListRenderer.VersionData.pageId;
      formData.versionId = MemberDirectoryListRenderer.VersionData.versionId;
      formData.componentId = MemberDirectoryListRenderer.VersionData.componentId;
    }

    // AJAX call
    WA.Ajax({
      url : MemberDirectoryListRenderer.MemberDirectoryListWebServiceUrl_LoadMembers,
      data : formData,
      type : 'POST',
      success : loadRecordsCallback,
      error : loadRecordsErrorCallback
    });
  }
  
  function loadRecordsErrorCallback(result)
  {
    /*debug*/log('loadRecordsErrorCallback');

    setFound(MemberDirectoryListRenderer.labels.serverLoadingError);
    setMessage();    
    showReload();
    setDirectoryOutput(MemberDirectoryListRenderer.labels.serverLoadingErrorAlert);
    notifyGadgetChanged();
  }
  
  function loadRecordsCallback(result)
  {
    /*debug*/log('loadRecordsCallback');

    setFound(result.TotalCount);
    setMessage(MemberDirectoryListRenderer.labels.processingServerData);
    directoryData.serverResponse = result;
    notifyGadgetChanged();
    setTimeout(processServerData, 10);
  }

  function processCachedData()
  {
    /*debug*/log('processCachedData');

    lastSeachBoxAskValue = directoryData.lastKeywords;
    forceNextAskSearch = false;
    enableSearch(lastSeachBoxAskValue);
    searchAndRenderAsync(directoryData.lastKeywords, directoryData.lastRenderIndex);
  }
 



  function processServerData()
  {
    /*debug*/log('processServerData');

    var jsonStructure;
    eval('jsonStructure = ' + directoryData.serverResponse.JsonStructure + ';');
	
	//directoryData.serverResponse = createMembers(20000);
	//jsonStructure=directoryData.serverResponse.JsonStructure;

    directoryData.totalCount = directoryData.serverResponse.TotalCount;
    directoryData.serverResponse = null;
    directoryData.layout = jsonStructure.layout;
    directoryData.membersData = jsonStructure.members;

    prepareSearchData();
    setTitle(directoryData.totalCount);    
    jsonStructure = null;
    directoryData.statuses = null;

    directoryData.isReady = true;
    forceNextAskSearch = true;
    enableSearch(undefined, false);
  }




  function prepareSearchData()
  {
    /*debug*/log('prepareSearchData');

    directoryData.searchData = new Array();
    directoryData.safeData = new Array();
    directoryData.counterData = new Array();
    var searchData = directoryData.searchData;
    var safeData = directoryData.safeData;
    var counterData = directoryData.counterData;
    var totalCount = directoryData.totalCount;
    var searchableMembersData = directoryData.membersData[0];
    var searchDataForMember = new Array();
    
    for (i = 0; i < totalCount; i++)
    {
      pushColumnToSearchableData(searchDataForMember, searchableMembersData[i].c1);
      pushColumnToSearchableData(searchDataForMember, searchableMembersData[i].c2);
      pushColumnToSearchableData(searchDataForMember, searchableMembersData[i].c3);
      pushColumnToSearchableData(searchDataForMember, searchableMembersData[i].c4);
      pushColumnToSearchableData(searchDataForMember, searchableMembersData[i].c5);
      
      searchData.push(searchDataForMember.join(' '));
      safeData.push(searchDataForMember.join(' '));


      searchDataForMember = new Array();
    }
  }
  function pushColumnToSearchableData(searchData, column)
  {
    /*debug*///log('pushColumnToSearchableData');

    if (!column)
      {
        return;
      }
      
      for (var j = 0; j < column.length; j++)
      {
        if (column[j].fft != 12)// picture
        {
          searchData.push(column[j].v.toLowerCase());          
        }
      }
  }


  function reloadData()
  {
    /*debug*/log('reloadData');

    disposeAllTimeouts();
    hideReload();
    hidePaging();
    setFound();
    disableSearch();
    lastSeachBoxAskValue = '';
    clearCache();
    setDirectoryOutput();
    notifyGadgetChanged();

    setTimeout(loadRecordsAsync, 10);
  }
//------------
//filter stuff
//------------
	function isFilterEnabled()
	{
    /*debug*/log('isFilterEnabled');

    return $("idFilterColumns");
	}

	function initFilter()
	{
    /*debug*/log('initFilter');

    var i, j;
	var optColumn;
	var options;

	for (i = 1; i <= maxFilterQty; i++)
	{
		optColumn = $("idF"+i+"Options");

		if (optColumn)
		{
			$("idF"+i+"Change").onclick=changeClick;
			filterOptionCounters[i-1]=new Array();
			filterOptionNames[i-1]=new Array();
	 		options=WA.$$('.optionLink', optColumn);

      if (options)
      {
        for (j = 0; j < options.length; j++)
        {
          options[j].onclick = optionClick;
          filterOptionCounters[i - 1]['opt' + options[j].getAttribute("fId", 0)] = 0;
          filterOptionNames[i - 1]['opt' + options[j].getAttribute("fId", 0)] = options[j].innerHTML;
        }
      }
		}
 	}
  }


  function optionClick()
  {
    /*debug*/log('optionClick');

    var curRow = this.parentNode.parentNode.parentNode.id.substr(3,1);
  	  $("idF"+curRow+"Options").style.display = "none";
  	  $("idF"+curRow+"Selected").style.display = "block";
  	  $("idF"+curRow+"SelName").innerHTML = '&raquo; ' + filterOptionNames[curRow - 1]['opt'+this.getAttribute("fId", 0)];
  	  filterValues[curRow-1] = this.getAttribute("fId", 0);
  	  applyFilters();
  	  return false;
  }

  function changeClick()
  {
    /*debug*/log('changeClick');

    var curRow = this.id.substr(3,1);
  	  $("idF"+curRow+"Options").style.display = "block";
  	  $("idF"+curRow+"Selected").style.display = "none";
  	  $("idF"+curRow+"SelName").innerHTML = "";
  	  filterValues[curRow-1] = null;
  	  applyFilters();
  	  return false;
  }

	function filterIsOn()
	{
    /*debug*/log('filterIsOn');

    var i;
		var l = filterValues.length;
		var cnt = 0;

		for (i = 0; i < l; i++)
		{
			if (filterValues[i] != null)
			{
				cnt++;
			}
		}
		return cnt;
	}

	function applyFilters()
	{
    /*debug*/log('applyFilters');

    var i, j, l;
		var matchCount = 0;
		var totalCount = directoryData.totalCount;
		var filterVal = filterIsOn();

		//preparing
		setFound();
	    setMessage(MemberDirectoryListRenderer.labels.searchingKeywords);

		for (i = 0; i < totalCount; i++)
		{
			directoryData.searchData[i]=directoryData.safeData[i];
		}

		if (filterVal)
		{
			for (i = 0; i < totalCount; i++)
			{
				matchCount = 0;

				for (l = 1; l < maxFilterQty+1; l++)
				{
					if (filterValues[l-1] == null) //no filter is set for column
					{
						matchCount++;
						continue;
					}

					var memberFilterValue = directoryData.membersData[0][i]['f' + l];

					if (!memberFilterValue)
					{
						continue;
					}

					for (j = 0; j < memberFilterValue.length; j++)  
					{
						if (memberFilterValue[j] == filterValues[l-1])
						{
							matchCount++;
							break;
						}
					}
				}

				if (matchCount != maxFilterQty)
				{
					directoryData.searchData[i] = '';
				}
			}
		}


		searchAndRenderAsync(getSearchKeywords());
    notifyGadgetChanged();
	}


	function updateCounters(searchInResults)
	{
    /*debug*/log('updateCounters');

    var i, l, m;
		var memberFilterValue;

		if (!isFilterEnabled) return;

		var finalIndex = searchInResults ? searchAsyncData.foundIndexes.length : directoryData.totalCount;
		
		resetCounters();

		for (i = 0; i < finalIndex; i++)
		{
			for (l = 1; l < maxFilterQty+1; l++)
			{
				if (filterValues[l-1]) //filter is set, why bother updating invisible numbers?
				{
					continue;
				}
				memberFilterValue = searchInResults ? directoryData.membersData[0][searchAsyncData.foundIndexes[i]]['f' + l] : directoryData.membersData[0][i]['f' + l];

				if (memberFilterValue)
				{
					for (m = 0; m < memberFilterValue.length; m++)
					{
					    if (filterOptionCounters[l-1])
					    {
						    filterOptionCounters[l-1]['opt'+memberFilterValue[m]]++;
						}
					}
				}

			}
		}

		drawCounters();
	}


	function resetCounters()
	{
    /*debug*/log('resetCounters');

    var l, m;

		for (l = 0; l < filterOptionCounters.length; l++)
		{
			if (filterOptionCounters[l])
			{
				for (m in filterOptionCounters[l])
				{
					if (typeof(filterOptionCounters[l][m]) == "number")
					{
						filterOptionCounters[l][m] = 0;
					}
				}
			}
		}
	}

	function drawCounters()
	{
    /*debug*/log('drawCounters');

    var i, j;
		var optColumn;
		var options;
		var qty, name;
		var whereIsSpace;

	    for (i = 1; i <= maxFilterQty; i++)
	    {
	    	optColumn=jq$("#idF"+i+"Options");


		 	if (optColumn)
		 	{
		 		options = jq$("#idF"+i+"Options .optionLink");

        if (options)
        {
          for (j = 0; j < options.length; j++)
          {
            qty = filterOptionCounters[i - 1]['opt' + options[j].getAttribute("fId", 0)] * 1;
            name = WA.String.gtrim(filterOptionNames[i - 1]['opt' + options[j].getAttribute("fId", 0)]);


            whereIsSpace = name.lastIndexOf(' ');

            if (whereIsSpace >= 0)
            {
              name = name.slice(0, whereIsSpace) + ' <nobr>' + name.slice(whereIsSpace + 1);
            } else
            {
              name = '<nobr>' + name;
            }

            options[j].innerHTML = name + ' ' + '<span class="optionCounter">(' + qty + ')</span></nobr>';
            options[j].className = (qty && qty > 0) ? "optionLink" : "optionLink emptyName";
          }
        }
		 	}
		}
	}

  /*****************************************************/
  /***   SEARHCING                                   ***/
  /*****************************************************/

  function searchAndRenderAsync(keywords, renderStartIndex)
  {
    /*debug*/log('searchAndRenderAsync');

    terminateAsyncSearch();

    directoryData.lastKeywords = keywords;

    if (!searchAsyncData)
    {
      searchAsyncData = new Object();
      searchAsyncData.sessionId = 0;
    }

    var sessionId = searchAsyncData.sessionId + 1;
    searchAsyncData.sessionId = sessionId;
    searchAsyncData.inProgress = true;
    searchAsyncData.foundCount = 0;
    searchAsyncData.nextIndex = 0;
    searchAsyncData.sourceKeywords = keywords;
    searchAsyncData.keywordsArray = convertKeywordsToArray(keywords);
    searchAsyncData.foundIndexes = new Array();
    searchAsyncData.pagerHtml = null;
    
    if (searchAsyncData.keywordsArray.length > 0 || filterIsOn())
    {
      searchAsyncTimeout = setTimeout(function() { searchAsync(sessionId, renderStartIndex); }, 5);
    }
    else
    {
      searchAsyncData.foundCount = directoryData.totalCount;      
      searchAsyncData.nextIndex = searchAsyncData.foundCount;
      searchAsyncData.inProgress = false;
      renderAsync(renderStartIndex);
      updateCounters(false);
    }
  }




  function searchAsync(sessionId, renderStartIndex)
  {
    /*debug*/log('searchAsync');

    if (searchAsyncTimeout)
      clearTimeout(searchAsyncTimeout);
  
    if (!searchAsyncData || sessionId != searchAsyncData.sessionId)
    {
      terminateAsyncSearch();
      return;
    }
    
    if (searchAsyncData.nextIndex >= directoryData.totalCount)
    {
      terminateAsyncSearch();
      searchAsyncData.inProgress = false;
      //search is over
      updateCounters(true);
      renderAsync(renderStartIndex);
      return;
    }

    var keywordsArray = searchAsyncData.keywordsArray;
    var searchIndexData = directoryData.searchData;
    var stopCycleIndex = Math.min(directoryData.totalCount, searchAsyncData.nextIndex + searchAsyncMaxRecords);

    var keywordsArrayLength = keywordsArray.length;


    for (i = searchAsyncData.nextIndex; i < stopCycleIndex; i++)
    {

      var searchIndexDataLength = searchIndexData[i].length;

      if (searchIndexDataLength == 0)
      {
      	  continue;
      }

      for (j = 0; j < keywordsArrayLength; j++)
      {
        if (searchIndexData[i].indexOf(keywordsArray[j]) == -1)
          break;
      }
      
      if (j == keywordsArrayLength)
      {
        searchAsyncData.foundCount++;
        searchAsyncData.foundIndexes.push(i);
      }
    }

    searchAsyncData.nextIndex = stopCycleIndex;

    searchAsyncTimeout = setTimeout(function() { searchAsync(sessionId, renderStartIndex); }, searchAsyncTimeoutMs);
  }
  
  



  function terminateAsyncSearch()
  {
    /*debug*/log('terminateAsyncSearch');

    if (searchAsyncTimeout)
      clearTimeout(searchAsyncTimeout);
  }
  
  /*****************************************************/
  /***   RENDERING                                   ***/
  /*****************************************************/

  function renderAsync(startIndex)
  {
    /*debug*/log('renderAsync');

    if (!searchAsyncData || searchAsyncData.inProgress)
      return;
    
    hidePaging();
    //setMessage(MemberDirectoryListRenderer.labels.displayingFound);

    startIndex = parseInt(startIndex);
    if (!startIndex)
      startIndex = 0;

    setTimeout(function() { render(startIndex); }, 10);
  }
  function prepareHeader()
  {
    /*debug*/log('prepareHeader');

    var layout = directoryData.layout;
    var headerTemplate = new Array();
    
    headerTemplate.push(tableStart);
    addHeaderIfReq(headerTemplate, layout.c1);
    addHeaderIfReq(headerTemplate, layout.c2);
    addHeaderIfReq(headerTemplate, layout.c3);
    addHeaderIfReq(headerTemplate, layout.c4); 
    headerTemplate.push(headerEnd);
    
    return headerTemplate.join('');
  }
  function addHeaderIfReq(headerTemplate, column)
  {
    /*debug*/log('addHeaderIfReq');

    if (column.v == true) // visible
    {
      headerTemplate.splice(headerTemplate.length, 0,
        thTemplate[0], column.w, // width
        thTemplate[1], column.h, // header
        thTemplate[2]);
    }
  }  
  function render(startIndex)
  {
    /*debug*/log('render');

    if (!searchAsyncData || searchAsyncData.inProgress)
    {
      notifyGadgetChanged();
      return;
    }
    
    directoryData.lastRenderIndex = startIndex;

    var keywordsDefined = searchAsyncData.keywordsArray.length > 0 || filterIsOn();
    
    if (searchAsyncData.foundCount > 0)
    {
      var i;  
      var a = new Array();
      
      a.splice(a.length, 0, prepareHeader());

      stopRenderIndex = Math.min(startIndex + maxDisplayRecords, searchAsyncData.foundCount);

      var realIndex,
          detailsUrlTooltip = MemberDirectoryListRenderer.labels.detailsUrlTitle,
          searchableMembersData = directoryData.membersData[0],
          otherMembersData = directoryData.membersData[1],
          detailsUrlPrefix = MemberDirectoryListRenderer.detailsUrlTemplate,
          formId = MemberDirectoryListRenderer.FormId;
     
      for (i = startIndex; i < stopRenderIndex; i++)
      {
        realIndex = keywordsDefined ? searchAsyncData.foundIndexes[i] : i;
        a.splice(a.length, 0, 
          memberTemplate[0], createDetailsUrl(detailsUrlPrefix, otherMembersData[realIndex], formId),
          memberTemplate[1], prepareColumn(searchableMembersData[realIndex], otherMembersData[realIndex]),
          memberTemplate[2]
        );
      }

      a.push(footerTemplate);
      
      setDirectoryOutput(a.join(''));
      a = null;
    }
    else
    {
      // no records
      setDirectoryOutput(keywordsDefined ?
        MemberDirectoryListRenderer.labels.noMembersFound.replace(/\{0\}/g, searchAsyncData.sourceKeywords) :
        MemberDirectoryListRenderer.labels.noMembersInDatabase, true);
    }

    setMessage();
    setFound(searchAsyncData.foundCount);
    
    if (isCached)
      showReload();
    
    renderPager(startIndex);
    notifyGadgetChanged();
  }


  function notifyGadgetChanged()
  {
    /*debug*/log('notifyGadgetChanged');

    WA.throttle(doNotifyGadgetChanged, notifyGadgetChangedTimeout);
  }


  function doNotifyGadgetChanged()
  {
    /*debug*/log('doNotifyGadgetChanged');

    WA.Gadgets.notifyGadgetChanged();
  }


  function createDetailsUrl(detailsUrlPrefix, memberId, formId)
  {
    /*debug*///log('createDetailsUrl');

    var url;

    if (formId == 0)
    {
      url = detailsUrlPrefix + memberId;
    } 
    else
    {
      url = detailsUrlPrefix + memberId + '/' + formId; 
    }

    return url;
  }
  function prepareColumn(memberData, memberId)
  {
    /*debug*/log('prepareColumn');

    var layout = directoryData.layout; 
    var memberTdTemplate = new Array();
    var detailsUrlTooltip = MemberDirectoryListRenderer.labels.detailsUrlTitle;    
    
    var columnsCount = new Object();
    columnsCount.value = 0;
    addColumnIfReq(layout.c1, memberData.c1, memberTdTemplate, columnsCount, memberId, true);
    addColumnIfReq(layout.c2, memberData.c2, memberTdTemplate, columnsCount, memberId, false);
    addColumnIfReq(layout.c3, memberData.c3, memberTdTemplate, columnsCount, memberId, false);
    addColumnIfReq(layout.c4, memberData.c4, memberTdTemplate, columnsCount, memberId, false);
    addBottomRowIfReq(layout.c5, memberData.c5, memberTdTemplate, columnsCount, memberId, false);

    return memberTdTemplate.join('');
  }
  function addColumnIfReq(layoutColumn, memberColumn, memberTdTemplate, columnsCount, memberId, makeLink)
  {
    /*debug*///log('addColumnIfReq');

    if (layoutColumn.v != true) 
    {
      return;
    }
    
    ++columnsCount.value;
  
    memberTdTemplate.splice(memberTdTemplate.length, 0, 
      tdTemplate[0], 'memberDirectoryColumn' + columnsCount.value,
      tdTemplate[1], layoutColumn.w,
      tdTemplate[2], getValueFromColumn(memberColumn, memberId, makeLink),
      tdTemplate[3]);
  }    
  function addBottomRowIfReq(bottomRow, memberColumn, memberTdTemplate, columnsCount, memberId)
  {
    /*debug*///log('addBottomRowIfReq');

    var url = MemberDirectoryListRenderer.detailsUrlTemplate + memberId;
    
    if (bottomRow.v != true) // visible
    {
      return;
    }
    
    memberTdTemplate.splice(memberTdTemplate.length, 0, 
      bottomRowTemplate[0], url,
      bottomRowTemplate[1], columnsCount.value,
      bottomRowTemplate[2], getValueFromColumn(memberColumn, memberId, false),
      bottomRowTemplate[3]);
  }    
  
  function getValueFromColumn(memberColumn, memberId, makeLink)
  {
    /*debug*///log('getValueFromColumn');

    var inner = '';
      
    if (!memberColumn)
    {
      return inner;
    }

    for (var i = 0; i < memberColumn.length; i++)
    {
      var ar;
      var value = memberColumn[i].v;
      var imgValue = value;

      if (i == 0)
      {
        var ix = imgValue.lastIndexOf(' (');

        if (ix >= 0)
        {
          imgValue = imgValue.substr(0, ix);
        }
      }

      var fieldType = memberColumn[i].fft;
      
      // check for email
      if(fieldType != 5 && emailReplace1.test(BonaPage.decodeHtml(value))) 
      {
        value = BonaPage.decodeHtml(value).replace(emailReplace1, emailReplaceTemplate);
      }
      
      if (fieldType == 12) //Picture
      {
        if (value != '')
        {
          ar = new Array();
          ar.splice(ar.length, 0,
            imgTemplate[0], MemberDirectoryListRenderer.imgTemplateRelativePath,
            imgTemplate[1], memberId,
            imgTemplate[2], imgValue,
            imgTemplate[3], (new Date()).getTime(),
            imgTemplate[4]);
          value = ar.join('');
        }
      }
      else if (fieldType == 5 && !(makeLink == true && i == 0)) // Email
      {
        if (value != '')
        {
          ar = new Array();
          ar.splice(ar.length, 0,
            emailTemplate[0], value,
            emailTemplate[1], value,
            emailTemplate[2]);
          value = ar.join('');
          ar = new Array();
        }
      }
      else if (value != '' && !(makeLink == true && i == 0))
      {
        var reLinkReplace1 = new RegExp("(\\s|^|\\>|\\<|\\}|\\]|\\[|\\{)((http|https|ftp)://[^\\n\\s\\<\\>\\[\\{\\]\\}]+)", "gi");
        var reLinkReplace2 = new RegExp("(\\s|^|\\>|\\<|\\}|\\]|\\[|\\{)(([io]?www\.|ftp\.)[^\\n\\s\\<\\>\\[\\{\\]\\}]+)", "gi");
        var processedValue = 
        value = (reLinkReplace1.test(value))
          ? value.replace(reLinkReplace1, '$1<a onclick="window.open(\'$2\');BonaPage.stopEvent(event);" href="$2" target=_blank>$2</a>')
          : value.replace(reLinkReplace2, '$1<a onclick="window.open(\'http://$2\');BonaPage.stopEvent(event);" href="http://$2" target=_blank>$2</a>');
      }

      if (i === 0 && makeLink === true)
      {
        var ar = new Array();
        ar.splice(ar.length, 0,
          linkTemplate[0], MemberDirectoryListRenderer.labels.detailsUrlTitle,
          linkTemplate[1], createDetailsUrl(MemberDirectoryListRenderer.detailsUrlTemplate, memberId, MemberDirectoryListRenderer.FormId),
          linkTemplate[2], value == '' ? MemberDirectoryListRenderer.labels.viewDetails : value,
          linkTemplate[3]);
        value = ar.join('');
      }

      if (value != '')
      {
        inner += '<div class=\'memberValue\'>' + value + '</div>';
      }
    }
    
    return inner;
  }
  function renderPager(startIndex)
  {
    /*debug*/log('renderPager');

    if (!searchAsyncData || searchAsyncData.inProgress || searchAsyncData.foundCount <= maxDisplayRecords)
    {
      hidePaging();
      return;
    }

    if (!searchAsyncData.pagerHtml)
    {
      var i;
      var a = new Array();
      var useSearchData = (searchAsyncData.keywordsArray.length > 0) || filterIsOn();
      var value;
      var firstIndex;
      var lastIndex;
      var recordsFirstIndex;
      var recordsLastIndex;

      a.push(pagerTemplate[0]);
      
      for (i = 0; i < searchAsyncData.foundCount; i = i + maxDisplayRecords)
      {
        value = i;
        firstIndex = i;
        lastIndex = Math.min(searchAsyncData.foundCount - 1, i + maxDisplayRecords - 1);
        recordsFirstIndex = firstIndex + 1;
        recordsLastIndex = lastIndex + 1;

        if (useSearchData)
        {
          firstIndex = searchAsyncData.foundIndexes[firstIndex];
          lastIndex = searchAsyncData.foundIndexes[lastIndex];
        }

        a.splice(a.length, 0, 
          pagerOptionTemplate[0], value,
/*
          pagerOptionTemplate[1], preparePagerRangeWord(firstIndex, true),
          pagerOptionTemplate[2], preparePagerRangeWord(lastIndex, false),
          pagerOptionTemplate[3], recordsFirstIndex,
          pagerOptionTemplate[4], recordsLastIndex,
*/
          pagerOptionTemplate[1], recordsFirstIndex,
          pagerOptionTemplate[2], recordsLastIndex,
          pagerOptionTemplate[3]);
      }
      
      a.push(pagerTemplate[1]);
      searchAsyncData.pagerHtml = a.join('');

    }


    if (isPagerHidden())
    {
      setPaging(searchAsyncData.pagerHtml, startIndex);
    }
  }
  
  function preparePagerRangeWord(index, appendSpacesBefore)
  {
    /*debug*/log('preparePagerRangeWord');

    var v = directoryData.membersData[0][index].c1[0].v;
    var value = v == '' ? 'View details' : v;
    var word = value.split(',')[0].substr(0, pagerRangeNameLength);
    word = word.replace(/\s/g, "&nbsp;");
    return word;
  }
  
  function pagerChanged(pagerSelect)
  {
    /*debug*/log('pagerChanged');

    try { $(MemberDirectoryListRenderer.searchBoxId).focus(); } catch (e) {}
    var startIndex = pagerSelect.options[pagerSelect.selectedIndex].value;
    render(parseInt(startIndex));
  }
  
  /*****************************************************/
  /***   MEMBER RECORD EVENTS                        ***/
  /*****************************************************/

  function highlightRowAndNext(memberTr)
  {
    /*debug*/log('highlightRowAndNext');

    SetClassToRowAndNext(memberTr, 'hover');
  }
  function normlightRowAndNext(memberTr)
  {
    /*debug*/log('normlightRowAndNext');

    SetClassToRowAndNext(memberTr, 'normal');
  }
  function SetClassToRowAndNext(memberTr, className)
  {
    /*debug*/log('SetClassToRowAndNext');

    memberTr.className = className;
    
    var nextSibling = memberTr.nextSibling;
    
    if (!nextSibling)
    {
      return;
    }
    
    while (nextSibling.nodeType != 1)
    {
      nextSibling = nextSibling.nextSibling;
        
      if (!nextSibling)
      {
        return;
      }
    }
    
    if (nextSibling.getAttribute('bottomrow', 0) == 'true')
    {
        nextSibling.className = className;
    }
  }  
  function highlightRowAndPrev(memberTr)
  {
    /*debug*/log('highlightRowAndPrev');

    SetClassToRowAndPrev(memberTr, 'hover');
  }

  function normlightRowAndPrev(memberTr)
  {
    /*debug*/log('normlightRowAndPrev');

    SetClassToRowAndPrev(memberTr, 'normal');
  }
  
  function SetClassToRowAndPrev(memberTr, className)
  {
    /*debug*/log('SetClassToRowAndPrev');

    memberTr.className = className;
    
    var previousSibling = memberTr.previousSibling;
    
    if (!previousSibling)
    {
      return;
    }
    
    while (previousSibling.nodeType != 1)
    {
      previousSibling = previousSibling.previousSibling;
        
      if (!previousSibling)
      {
        return;
      }
    }
    
    previousSibling.className = className;
  }  

  function redirectToMemberDetails(url)
  {
    /*debug*/log('redirectToMemberDetails');

    window.location = url;
    return false;
  }
  
  MemberDirectoryListRenderer.GetSelectedMembersId  = function()
  {
    /*debug*/log('GetSelectedMembersId');

    if (!searchBoxAskTimeout) {
      return false;
    }
    var element = document.getElementById(MemberDirectoryListRenderer.selectedMembersFieldId);
    if (element == null) {
      return false;
    }
    try {
      element.value = GetCurrentMembersSelectionIdStr();
      if (element.value == '') {
        return false;
      }
    } catch (error) {
    }
  }
  
  MemberDirectoryListRenderer.ValidateEmailMembersList = function(sender, args) {
    /*debug*/log('ValidateEmailMembersList');

    var element = document.getElementById(MemberDirectoryListRenderer.selectedMembersFieldId);
      if (element == null || element.value == '') {
         args.IsValid = false;
      }
  }
  
  function GetCurrentMembersSelectionIdStr()
  {
    /*debug*/log('GetCurrentMembersSelectionIdStr');

    if (!searchAsyncData || searchAsyncData.inProgress)
          return;
      var otherMembersData = directoryData.membersData[1];
      if (searchAsyncData.foundCount == 0) {
        return '';
      }
      var realIndex;
      var keywordsDefined = searchAsyncData.keywordsArray.length > 0;
      var result = '';
      var foundCount = searchAsyncData.foundCount;
      for (var i = 0; i < foundCount; i++) {
        realIndex = keywordsDefined ? searchAsyncData.foundIndexes[i] : i;
        if (otherMembersData[realIndex][1] != 0) {
          result += otherMembersData[realIndex][0];
          if (foundCount - i > 1)
           result += ',';
        }
      }
      return result;
  }

// end of MemberDirectoryListRenderer singleton
}) ();
