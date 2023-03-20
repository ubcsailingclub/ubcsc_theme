<noscript><$control.MessageBox(Text=Model.Text.NoJsMessageText, Warning="True" , ShowHeader="True" , HeaderText=Model.Text.NoJsMessageHeader)$></noscript>
<script>  
  function actionUrl(action) {
    var baseUrl = '/Sys/Finances/MemberProfileAction/', query;
    
    if (WidgetMode) {
      baseUrl = '/widget' + baseUrl;
      query = document.location.search.substring(1);
    }

    return query ? baseUrl + action + '?' + query : baseUrl + action;
  }
  
  function render(template, options) {
    return template.replace(/\{\{\s?(\w+)\s?\}\}/g, function(match, variable) {
      return variable in options && options[variable] !== null ? options[variable] : '';
    });
  }

  function toggleDiv(id, visibility) {
    var div = document.getElementById(id);

    div.style.display = visibility ? "block" : "none";
  }

  function getTableRow(item) {
    var className = '';

    if (item.isPendingWizardOperation) {
      className += 'wizardOperation';
    } else {
      className += 'viewDetails';
    }
    
    if (item.isPast) {
      className += ' grayedOut';
    }

    return render(
      '<tr ' + (item.isPendingWizardOperation ? '' : 'title="<$Text.ViewEventRegistrationDetailsTooltip$>" ') +
	  'class="noLine ' + className + '" onClick="onRowClick(event, {{isPendingWizardOperation}}, \'{{registrationDetailsUrl}}\')">' +
      '<td class="firstTd">' + (item.isEventVisible
        ? '<div title="<$Text.ViewEventDetailsTooltip$>"><a href="{{eventDetailsUrl}}">{{eventTitle}}</a></div>'
        : '<div><span class="eventTitle">{{eventTitle}}</span></div>') +
        '<div>{{startDate}}</div>' +
      '</td>' +
      '<td><div>' + (!item.isPendingWizardOperation
        ? '{{registrationTypeTitle}}</div><div>{{registrationTypePrice}}'
        : '') +
      '</div></td>' +
      '<td class="rightAlign lastTd">' +
        '<div>{{status}}</div>' +
		'<div class="buttonContainer">' + getButtons(item.isPendingWizardOperation, item.isCompletableWaitlistRegistration) + '</div>' +
	  '</td>' +
    '</tr>', item);
  }

  function onRowClick(clickEvent, isPendingWizardOperation, url) {
    if (!isPendingWizardOperation && clickEvent.target.nodeName != 'A') {
        window.location = url;
    }
  }

  function getButtons(isPendingWizardOperation, isCompletableWaitlistRegistration) {
    var buttons = '';

    if (isPendingWizardOperation) {
      buttons = 
        '<input type="submit"' +
               'name="{{registrationId}}Cancel"' +
               'value="<$Text.CancelRegistrationButtonTitle$>"' +
               'onclick="cancelRegistration({{registrationId}});" />' +
        '<input type="submit"' +
               'name="{{registrationId}}Continue"' +
               'value="<$Text.ContinueRegistrationButtonTitle$>"' +
               'onclick="continueRegistration({{registrationId}});" />';

    } else if (isCompletableWaitlistRegistration) {
      buttons = 
        '<input type="submit"' +
               'name="{{registrationId}}Complete"' +
               'value="<$Text.CompleteRegistrationButtonTitle$>"' +
               'onclick="completeRegistration({{registrationId}});" />';
    }

    return buttons;
  }

  function continueRegistration(wizardDescriptorId) {
    WA.Ajax({
      url: actionUrl('ContinuePendingRegistration'),
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      global: false,
      type: 'POST',
      data: JSON.stringify({ 'wizardDescriptorId': wizardDescriptorId }),
      success: function (redirectUrl) { window.location = redirectUrl; },
      error: function() { console.log('Continue registration error'); }
    });
  }

  function cancelRegistration(wizardDescriptorId) {
    WA.Ajax({
      url: actionUrl('CancelPendingRegistration'),
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      global: false,
      type: 'POST',
      data: JSON.stringify({ 'wizardDescriptorId': wizardDescriptorId }),
      success: function (redirectUrl) { window.location.reload(true); },
      error: function() { console.log('Cancel registration error'); }
    });
  }

  function completeRegistration(registrationId) {
    WA.Ajax({
      url: actionUrl('CompleteRegistration'),
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      global: false,
      type: 'POST',
      data: JSON.stringify({ 'registrationId': registrationId }),
      success: function (redirectUrl) { window.location = redirectUrl; },
      error: function() { console.log('Complete registration error'); }
    });
  }

  function fetchRegistrations(filter, searchQuery, page) {
    WA.Ajax({
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({ filter: filter, searchQuery: searchQuery, page: page }),
      type: 'POST',
      url: actionUrl('GetEventRegistrations'),
      dataType: 'json',
      cache: false,
      beforeSend: function() { toggleDiv('loadingIndicator', true); },
      complete: function() { toggleDiv('loadingIndicator', false); },
      success: function (data) {
        var rows = document.createElement('tbody');

        rows.innerHTML = data.items.map(getTableRow).join('');

        var eventRegistrations = document.getElementById('tableItems');

        while (eventRegistrations.firstChild) {
          eventRegistrations.removeChild(eventRegistrations.firstChild);
        }

        while (rows.firstChild) {
          eventRegistrations.appendChild(rows.firstChild);
        }

        if (data.items.length > 0) {
          toggleDiv('itemsList', true);
          toggleDiv('noRecordsLabel', false);
        } else {
          toggleDiv('itemsList', false);
          toggleDiv('noRecordsLabel', true);
        }

        document.getElementById('idRecordsFound').innerHTML = data.totalRecords;
        renderPager(data.currentPage, data.totalPages);
      },
      error: function(data) { console.log('Fetch registrations error'); }
    });
  }

  function renderPager(currentPage, totalPages) {
    var pagesArea = 2;
    var displayedPagesCount = pagesArea * 2 + 1;
    var pagingContainer = document.getElementById('pagerBody');

    while (pagingContainer.firstChild) {
      pagingContainer.removeChild(pagingContainer.firstChild);
    }

    if (totalPages <= 1) {
      return;
    }

    if (totalPages <= displayedPagesCount) {
      renderPageUrls(pagingContainer, 1, totalPages, currentPage);
      return;
    }

    var firstPage = currentPage - pagesArea > 0 ? currentPage - pagesArea : 1;
    var lastPage = currentPage + pagesArea > totalPages ? totalPages : currentPage + pagesArea;
    var currentDisplayedPages = lastPage - firstPage + 1;
    
    if (currentDisplayedPages < displayedPagesCount) {
      var tmp = displayedPagesCount - currentDisplayedPages;

      if (firstPage <= pagesArea) {
        lastPage = lastPage + tmp > totalPages ? totalPages : lastPage + tmp;
      } else {
        firstPage = firstPage - tmp > 0 ? firstPage - tmp : 1;
      }
    }

    if (firstPage != 1) {
      pagingContainer.appendChild(renderPageUrl(1, '<$Text.FirstPageLink$>'))
    }

    renderPageUrls(pagingContainer, firstPage, lastPage, currentPage);

    if (totalPages != lastPage) {
      pagingContainer.appendChild(renderPageUrl(totalPages, '<$Text.LastPageLink$>'))
    }
  }

  function renderPageUrls(pagingContainer, firstPage, lastPage, currentPage) {
    for (var i = firstPage; i <= lastPage; i++) {
        if (i != currentPage) {
          var pageNode = renderPageUrl(i, i);
        } else {
          pageNode = document.createElement('span');
          pageNode.className = "linkCurrent";
          pageNode.appendChild(document.createTextNode(i));
        }

        pagingContainer.appendChild(pageNode);
    }
  }

  function renderPageUrl(page, title) {
    var pageNode = document.createElement('a');
    pageNode.href = '#';
    pageNode.onclick = function() {
      renderTable(page);
      return false;
    };

    pageNode.appendChild(document.createTextNode(title));

    return pageNode;
  }

  function renderTable(page) {
    WA.throttle(function () {
      fetchRegistrations(
        document.getElementById('eventRegistrationsFilter').value,
        document.getElementById('searchBox').value,
        page);
    }, 150)
  }
</script>
<div id="eventRegistrations" class="eventsRegistrationsMainContainer">
  <div class="genericList xcontainer">
    <div class="genericListHeaderContainer">
      <table>
        <tbody>
          <tr>
            <td class="filter">
              <div class="eventHeaderLabel"><span><$Text.FilterByLabel$></span></div>
              <div id="ctl00_content_filter_container" class="DropDownListContainer">
                <select id="eventRegistrationsFilter" class="typeDropDownList" onChange="renderTable()">
                  <option value="All" title="<$Text.FilterOptionAll$>"><$Text.FilterOptionAll$></option>
                  <option value="Upcoming" title="<$Text.FilterOptionUpcoming$>"><$Text.FilterOptionUpcoming$></option>
                  <option value="Past" title="{{filterOptionPast}}"><$Text.FilterOptionPast$></option>
                </select>
              </div>
            </td>
            <td class="searchBox eventSearch">
              <div class="eventHeaderLabel"><span><$Text.SearchLabel$></span></div>
              <div><input name="SearchBox" type="text" id="searchBox" class="typeTextBox searchBox" onkeyup="renderTable()"></div>
            </td>
            <td class="infoContainer">
              <div>
                <span class="typeTextContainer textGray textSmall" style="display: inline;"><$Text.RecordsFoundLabel$></span>
                <em id="idRecordsFound" style="display: inline;">0</em>
              </div>
            </td>
            <td class="messages">
              <div id="loadingIndicator" style="display: none;">
                <img src="/Admin/html_res/images/asyncLoadProgress.gif">
                <span><$Text.LoadingLabel$></span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div id="idListItemsContainer">
      <span style="display: none;" id="noRecordsLabel" class="typeTextLabelNoData"><$Text.NoRecordsLabel$></span>
      <div style="display: none;" id="itemsList">
        <table class="genericListTable" id="membersTable" cellpadding="0" cellspacing="0" width="100%">
          <thead>
            <th class="firstTh"><$Text.EventColumnHeader$></th>
            <th><$Text.RegistrationTypeColumnHeader$></th>
            <th class="lastTh rightAlign status"><span><$Text.StatusColumnHeader$></span></th>
          </thead>
          <tbody id="tableItems"></tbody>
        </table>
      </div>
    </div>
    <div class="pagerOuterContainer pagerIsNotEmpty" id="idBlogTopPagerContainer">
      <div class="blogPagerContainer">
        <div class="d1">
          <div class="d2">
            <div class="d3">
              <div class="d4">
                <div class="d5">
                  <div class="d6">
                    <div class="d7">
                      <div class="d8">
                        <div class="d9">
                          <div id="pagerBody" class="inner"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<script>renderTable();</script>