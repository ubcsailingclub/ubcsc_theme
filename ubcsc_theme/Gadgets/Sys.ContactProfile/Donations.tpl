<noscript>
    <$control.MessageBox(Text=Model.Text.NoJsMessageText, Warning="True" , ShowHeader="True" ,
    HeaderText=Model.Text.NoJsMessageHeader)$>
</noscript>

<script>
  if (!WA.DonationsRenderer)
  {
    WA.DonationsRenderer = DonationsRenderer;
  }

  function DonationsRenderer()
  {
    var pThis = this,
      resources =
        {
          donationUrlTemplate: '/Sys/FinDocument/{0}',
          frequencyList: {},
          labels:
            {
              donationInProgress: 'Donation is in progress',
              upcomingDonation: 'Upcoming donation',
              stopButton: 'Stop',
              continueButton: 'Continue',
              cancelButton: 'Cancel',
              creditCardLabels: 'Credit card ****',
			  stopSubscriptionConfirmation: 'If you stop this subscription, your next recurring donation will not take place.\n\nDo you want to proceed?',
			  stopSubscriptionErrorMessage: 'Unable to stop your subscription.<br> Please try again later.'
            }
        },
      maxPageItems = 50,
      searchCacheDonations = {},
      searchCacheSubscriptions = {},
      donationsNodeList,
      subscriptionsNodeList,
      fetchedItems = [],
      pages = {},
      donationsFoundNumber = 0,
      subscriptionsFoundNumber = 0,
      stopSubscriptionErrors = {};

    resources.frequencyList[0] = 'One time';
    resources.frequencyList[1] = 'Monthly';
    resources.frequencyList[2] = 'Quarterly';
    resources.frequencyList[4] = 'Semi Annually';
    resources.frequencyList[8] = 'Annually';

    pThis.stopSubscription = stopSubscription;
    pThis.continueDonation = continueDonation;
    pThis.cancelDonation = cancelDonation;
    pThis.search = search;
    pThis.switchPage = switchPage;
    pThis.onDonationRowClick = onDonationRowClick;


    function init()
    {
      renderSubscriptionsTable();
      renderDonationsTable();
    }

    function activateFirstPage()
    {
      switchPage(0);
    }

    function switchPage(page)
    {
      var activeItems = pages[page];
      activateTableItems(activeItems);
    }

    function activateTableItems(activeDonationItems, activeSubscriptionItems)
    {

      displayActiveNodes(donationsNodeList, activeDonationItems, 'data-donation-id');

      if (activeSubscriptionItems)
      {
        displayActiveNodes(subscriptionsNodeList, activeSubscriptionItems, 'data-subscription-id');
      }

      function displayActiveNodes(nodeList, activeItems, nodeAttribute)
      {
        var activeIds = activeItems.map( function(v) { return v.id} );

        for (var i = 0; i < nodeList.length; i++)
        {
          var node = nodeList[i],
            id = +node.getAttribute(nodeAttribute);

          node.style.display = (id && activeIds.indexOf(id) === -1) ? 'none' : '';
        }
      }
    }

    function setDonationsTableVisibility(isHidden)
    {
      toggleVisibility('donationItems', isHidden);
    }

    function setSubscriptionsTableVisibility(isHidden)
    {
      toggleVisibility('subscriptionItems', isHidden);
    }

    function search(searchValue)
    {
      searchValue = searchValue.toLowerCase();

      var activeDonationsItems = searchInCache(searchCacheDonations, searchValue),
          activeSubscriptionItems = searchInCache(searchCacheSubscriptions, searchValue);

      subscriptionsFoundNumber = activeSubscriptionItems.length;
      donationsFoundNumber = activeDonationsItems.length;

      document.getElementById('idRecordsFoundNumber').innerHTML = donationsFoundNumber + subscriptionsFoundNumber;
      toggleVisibility('noDonationsRecordsLabel', donationsFoundNumber + subscriptionsFoundNumber === 0);

      setDonationsTableVisibility(!!activeDonationsItems.length);
      setSubscriptionsTableVisibility(!!activeSubscriptionItems.length);
      populatePageStructure(activeDonationsItems);
      renderPager();
      activateTableItems(activeDonationsItems, activeSubscriptionItems);
    }

    function searchInCache(cache, searchValue)
    {
      var found = [];

      for (var id in cache)
      {
        if (cache[id].indexOf(searchValue) !== -1)
        {
          found.push(getItemById(+id));
        }
      }

      return found;
    }

    function getItemById(id)
    {
      for (var i = 0; i < fetchedItems.length; i++)
      {
        if (fetchedItems[i].id === id) return fetchedItems[i];
      }
    }

    function renderSubscriptionsTable()
    {
      WA.Ajax({
        url: '/Sys/Finances/MemberProfileAction/GetDonationSubscriptions',
        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        dataType: 'json',
        cache: false,
        success: processSubscriptionsData
      });
    }

	function processSubscriptionsData(items)
	{
      if (!items || !items.length)
      {
        items = [];
      }

      subscriptionsFoundNumber = items.length;
      document.getElementById('idRecordsFoundNumber').innerHTML = donationsFoundNumber + subscriptionsFoundNumber;
      toggleVisibility('noDonationsRecordsLabel', donationsFoundNumber + subscriptionsFoundNumber === 0);

      setSubscriptionsTableVisibility(!!items.length);

      var subscriptions = document.getElementById('subscriptionTbody');
      subscriptions.innerHTML = items.map(getSubscriptionTableRow).join('');

      subscriptionsNodeList = document.querySelectorAll('[data-subscription-id]');
	}

    function getSubscriptionTableRow(item)
    {
      item.upcomingDonation = resources.labels.upcomingDonation;
      item.creditCardLabels = resources.labels.creditCardLabel;
      item.frequency = resources.frequencyList[item.frequency];

      item.dateString = item.dateString || '';
      item.amountString = item.amountString || '';
      item.creditCardLast4Digits = item.creditCardLast4Digits || '';

      searchCacheSubscriptions[item.id] = [item.amountString, item.creditCardLast4Digits, item.dateString, item.frequency].join(' ').toLowerCase();

      return WA.String.formatNamed(
        [
          '<tr class="noLine" data-subscription-id="{id}">',
            '<td class="firstTd memberDirectoryColumn1">',
                (item.dateString ?
                '<span>{dateString}</span>' : ''
                ),
            '</td>',
            '<td class="memberDirectoryColumn2">',
                '<div>{upcomingDonation}</div>',
              (item.frequency ?
                '<div>{frequency}</div>' : ''
              ),
              (item.creditCardLast4Digits ?
                  '<div>{creditCardLabels}{creditCardLast4Digits}</div>' : ''
              ),
            '</td>',
            '<td class="lastTd rightAlign memberDirectoryColumn3">',
                '<div>{amountString}</div>',
                '<div class="buttonContainer">',
                   '<input type="submit" class="button" name="Stop" value="' + resources.labels.stopButton + '" onclick="donationsRenderer.stopSubscription({id});" />',
                   (stopSubscriptionErrors[item.id] && '<div class="alertThin" style="width:auto;margin:1em 0;">' + resources.labels.stopSubscriptionErrorMessage + '</div>') || '',
                '</div>',
            '</td>',
          '</tr>',
          '<tr class="hiddenRow" data-subscription-id="{id}"></tr>'
        ].join(''), item);
    }

    function stopSubscription(donationId)
    {
	  if (!confirm(resources.labels.stopSubscriptionConfirmation)) { return; }
	
      WA.Ajax({
        url: '/Sys/Finances/MemberProfileAction/StopRecurringDonation',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        global: false,
        type: 'POST',
        data: JSON.stringify({ donationId: donationId }),
        success: function ()
        {
          stopSubscriptionErrors[donationId] = false;
          renderSubscriptionsTable();
        },
        error: function ()
        {
          stopSubscriptionErrors[donationId] = true;
          renderSubscriptionsTable();
        }
      });
    }

    function continueDonation(donationId)
    {
      WA.Ajax({
        url: '/Sys/Finances/MemberProfileAction/ContinuePendingDonation',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        global: false,
        type: 'POST',
        data: JSON.stringify({ 'donationId': donationId }),
        success: function (redirectUrl)
        {
          window.location = redirectUrl;
        },
        error: function ()
        {
          console.log('Continue donation registration error');
        }
      });

    }

    function cancelDonation(donationId)
    {
      WA.Ajax({
        url: '/Sys/Finances/MemberProfileAction/CancelPendingDonation',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        global: false,
        type: 'POST',
        data: JSON.stringify({ 'donationId': donationId }),
        success: function ()
        {
          window.location.reload(true);
        },
        error: function ()
        {
          console.log('Cancel donation registration error');
        }
      });
    }

    function renderDonationsTable()
    {
      WA.Ajax({
        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        url: '/Sys/Finances/MemberProfileAction/GetDonationHistory',
        dataType: 'json',
        cache: false,
        beforeSend: function ()
        {
          toggleVisibility('loadingIndicator', true);
        },
        complete: function ()
        {
          toggleVisibility('loadingIndicator', false);
        },
        success: processDonationsData
      });
    }

    function processDonationsData(items)
    {
      if (!items || !items.length || items.length === 0) { return; }

      donationsFoundNumber = items.length;

      document.getElementById('idRecordsFoundNumber').innerHTML = donationsFoundNumber + subscriptionsFoundNumber;
      toggleVisibility('noDonationsRecordsLabel', donationsFoundNumber + subscriptionsFoundNumber === 0);

      setDonationsTableVisibility(!!items.length);

      items.sort(function (a, b)
      {
        if (a.isInProgress && !b.isInProgress) return -1;
        if (!a.isInProgress && b.isInProgress) return 1;

        return a.dateTicks < b.dateTicks ? 1 : -1;
      });

      fetchedItems = items;

      var donations = document.getElementById('donationsTbody');
      donations.innerHTML = fetchedItems.map(getDonationsTableRow).join('');

      donationsNodeList = document.querySelectorAll('[data-donation-id]');

      populatePageStructure(fetchedItems);
      renderPager();
      activateFirstPage();
    }


    function populatePageStructure(items)
    {
      pages = {};

      var i = 0, j = 0,
        copiedItems = items.slice();

      while (copiedItems.length)
      {
        if (j % maxPageItems === 0)
        {
          pages[i] = [];
          i++;
        }

        j++;
        pages[i-1].push(copiedItems.shift());
      }
    }

    function renderPager()
    {
      var pagesKeys = Object.keys(pages);

      if (pagesKeys.length <= 1)
      {
        toggleVisibility('idPagingContainerTitle', false);
        toggleVisibility('idPagingContainer', false);
        return;
      }

      toggleVisibility('idPagingContainerTitle', true);
      toggleVisibility('idPagingContainer', true);

      var pagingContainer = document.getElementById('idPagerSelect');

      while (pagingContainer.firstChild)
      {
        pagingContainer.removeChild(pagingContainer.firstChild);
      }

      for (var i = 0; i < pagesKeys.length; i++)
      {
        var optionNode = document.createElement('option');

        optionNode.value = i;
        optionNode.innerHTML = pages[i][0].dateString;

        pagingContainer.appendChild(optionNode);
      }
    }

    function getDonationsTableRow(item)
    {
      item.inProgressClass = item.isInProgress ? 'donationInProgress' : '';
      item.grayedOutClass = item.isInProgress ? '' : 'grayedOut';

      item.detailsUrl = WA.String.format(resources.donationUrlTemplate, item.paymentId);
      item.donationInProgressLabel = resources.labels.donationInProgress;
      item.displayName = item.number ? WA.String.format('Donation #{0}', item.number) : 'Donation';
      item.frequency = resources.frequencyList[item.frequency];

      item.amountString = item.amountString || '';
      item.dateString = item.dateString || '';
      item.tenderName = item.tenderName || '';

      searchCacheDonations[item.id] = [item.dateString, item.displayName, item.frequency, item.tenderName, item.amountString].join(' ').toLowerCase();

      return WA.String.formatNamed(
        [
          '<tr class="{grayedOutClass} noLine" data-donation-id="{id}" onclick="donationsRenderer.onDonationRowClick(event, {isInProgress}, \'{detailsUrl}\', {id})">',
          '<td class="firstTd memberDirectoryColumn1"><span class="{inProgressClass}">{dateString}</span></td>',
          '<td class="memberDirectoryColumn2">',

          (item.isInProgress ?
              '<div class="alert">{donationInProgressLabel}</div>' :
              '<div><a href="{detailsUrl}">{displayName}</a></div><div>{frequency}</div><div>{tenderName}</div>'
          ),
          '</td>',
          '<td class="lastTd rightAlign memberDirectoryColumn3">',
          '<div>{amountString}</div>',

          (item.isInProgress ?
              '<div class="buttonContainer">' +
                '<input type="submit" class="button" name="Continue" value="'+ resources.labels.continueButton +'" ' +
                'onclick="donationsRenderer.continueDonation({id});" />' +
                '<input type="submit" class="button" name="Cancel" value="'+ resources.labels.cancelButton +'"' +
                'onclick="donationsRenderer.cancelDonation({id});" />' +
              '</div>' :  ''
          ),

          '</td>',
          '</tr>',
          '<tr class="hiddenRow" data-donation-id="{id}" id="idDonationHiddenRow_{id}">',
          '</tr>'
        ].join(''), item);
    }

    function onDonationRowClick(clickEvent, isInProgress, url, id)
    {
      if (clickEvent.target.nodeName === 'A') return;

      if (isInProgress)
      {
        continueDonation(id);
      }
      else
      {
        window.location = url;
      }
    }

    function toggleVisibility(id, visible) {
      var element = document.getElementById(id);
      element.style.display = visible ? '' : 'none';
    }

    init();

  }
</script>

<div id="donations" class="donationsMainContainer">
    <div id="topMessageBoxDiv">
        <$if (Model.InvoiceAndPaymentList.DisplayPaymentInfoMessageBoxBool)$>
        <$if (Model.InvoiceAndPaymentList.DisplayPaymentSuccessMessageBool)$>
        <$control.MessageBox(Success="True", Text=Model.InvoiceAndPaymentList.PaymentInfoMessages:{<div><$it$></div>})$>
        <$else$>
        <$control.MessageBox(Error="True", Text=Model.InvoiceAndPaymentList.PaymentInfoMessages:{<div><$it$></div>})$>
        <$endif$>
        <$endif$>
    </div>
    <div class="genericList xcontainer">
        <div class="genericListHeaderContainer">
            <table>
                <tbody>
                <tr>
                    <td class="searchBox">
                        <span class="typeTextContainer textGray textSmall">Search</span>
                        <input name="SearchBox" type="text" id="idSearchBox" class="typeTextBox searchBox"
                               onkeyup="donationsRenderer.search(this.value)">
                    </td>
                    <td class="infoContainer">
                        <span class="typeTextContainer textGray textSmall"
                              id="idRecordsFoundLabel">Records found:</span>
                        <b id="idRecordsFoundNumber">0</b>
                    </td>
                    <td class="reloadContainer"></td>
                    <td class="messages">
                        <div id="loadingIndicator" style="display: none;">
                            <img src="/Admin/html_res/images/asyncLoadProgress.gif">
                            <span><$Text.LoadingLabel$></span>
                        </div>
                    </td>
                    <td style="display: none;" class="pagingContainerTitle" id="idPagingContainerTitle">
                        <span id="idPagerLabelContainer" class="typeTextContainer textGray textSmall">Paging</span>
                    </td>
                    <td style="display: none;" class="pagingContainer" id="idPagingContainer">
                        <div id="idPagingContainerTop">
                            <select id="idPagerSelect" onchange="donationsRenderer.switchPage(this.value)">
                            </select>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div id="subscriptionItemsContainer" class="donationTabItemsContainer">
            <div style="display: none;" id="subscriptionItems">
                <table class="genericListTable" cellpadding="0" cellspacing="0" width="100%">
                    <thead>
                    <tr>
                        <th class="firstTh">Next date</th>
                        <th>Subscription</th>
                        <th class="lastTh rightAlign"><span>Amount</span></th>
                    </tr>
                    </thead>
                    <tbody id="subscriptionTbody"></tbody>
                </table>
            </div>
        </div>
        <div id="donationsItemsContainer" class="donationTabItemsContainer">
            <span style="display: none;" id="noDonationsRecordsLabel"
                  class="typeTextLabelNoData">No records found</span>
            <div  style="display: none;" id="donationItems">
                <table class="genericListTable" cellpadding="0" cellspacing="0" width="100%">
                    <thead>
                    <tr>
                        <th class="firstTh">Date</th>
                        <th class="">Donation</th>
                        <th class="lastTh rightAlign"><span>Amount</span></th>
                    </tr>
                    </thead>
                    <tbody id="donationsTbody"></tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<script>
  var donationsRenderer = new WA.DonationsRenderer();
</script>