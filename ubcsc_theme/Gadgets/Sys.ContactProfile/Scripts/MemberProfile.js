var memberProfileHelper;

(function()
{
  if (window.memberProfileHelper == null)
  {
    window.memberProfileHelper = new Object();
  }

  memberProfileHelper.setFilter = function()
  {
    var shadingFieldset = document.getElementById('shadingFieldset');
    if (shadingFieldset == null)
    {
      return;
    }
    if (document.all)
      shadingFieldset.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=40)';
    else
      shadingFieldset.style.MozOpacity = 0.40;
  }

  memberProfileHelper.disableAllInputs = function()
  {
    var shadingFieldset = document.getElementById('shadingFieldset');
    var i;
    if (shadingFieldset == null)
    {
      return;
    }
    var inputs = shadingFieldset.getElementsByTagName('INPUT');
    if (inputs.length > 0)
    {
      for (i = 0; i < inputs.length; i++)
      {
        inputs[i].disabled = 'true';
      }
    }
    inputs = shadingFieldset.getElementsByTagName('TEXTAREA');
    if (inputs.length > 0)
    {
      for (i = 0; i < inputs.length; i++)
      {
        inputs[i].disabled = 'true';
      }
    }
    inputs = shadingFieldset.getElementsByTagName('SELECT');
    if (inputs.length > 0)
    {
      for (i = 0; i < inputs.length; i++)
      {
        inputs[i].disabled = 'true';
      }
    }

  }

  memberProfileHelper.checkMemberReceiveRemindersFieldChanged = function(sender, args)
  {
    var receiveRemindersCheckbox = document.getElementById(receiveRemindersCheckBoxId);
    var state = receiveRemindersCheckbox.checked ? "checked" : "nonChecked";
    DataChangeWatcher.changeValidatorCustom('ReceiveRemindersEnabledDisabled', state, args);
  }

  memberProfileHelper.checkMemberReceiveNewsLettersFieldChanged = function(sender, args)
  {
    var receiveNewslettersCheckbox = document.getElementById(receiveNewsLettersCheckBoxId);
    var state = receiveNewslettersCheckbox.checked ? "checked" : "nonChecked";
    DataChangeWatcher.changeValidatorCustom('ReceiveNewsLettersEnabledDisabled', state, args);
  }

  memberProfileHelper.stopWatchDataChanging = function()
  {
    if (typeof (DataChangeWatcher) == "undefined")
      return;
    DataChangeWatcher.setNotChanged();
    DataChangeWatcher.pauseWatching();
  }

  memberProfileHelper.makeButtonWatchDataChanging = function(btnId, sourceAction, causesValidation, checkIfDataChanged, awayMessage)
  {
    var btn = document.getElementById(btnId);
    if (!btn)
    {
      return;
    }
    btn.onclick = function()
    {
      var dcw = DataChangeWatcher;
      if (!causesValidation)
      {
        if (dcw)
        {
          dcw.resumeWatching();
          if (checkIfDataChanged)
          {
            if (!dcw.confirmIfDataChanged()) return;
          }
        }
        Page_ValidationActive = false;
      }
      else if (!checkIfDataChanged)
      {
        if (dcw) dcw.pauseWatching();
      }
      var actionResult = sourceAction();
      if (causesValidation)
      {
        if (Page_IsValid && !Page_BlockSubmit)
        {
          if (checkIfDataChanged)
          {
            if (dcw && !dcw.confirmIfDataChanged())
            {
              Page_BlockSubmit = true;
              return;
            }
          }
        }
        else if (!checkIfDataChanged)
        {
          if (dcw) dcw.resumeWatching();
        }
      }
    }

    memberProfileHelper.TransferToPaymentSystem = function(paymentUrl)
    {
      if (paymentUrl == null || paymentUrl == '')
      {
        return false;
      }
      DataChangeWatcher.pauseWatching();
      location.href = paymentUrl;
    }
  }
  memberProfileHelper.EmailChangedNotfication = function()
  {
    var hiddenEmail = document.getElementById(hiddenEmailId);
    var textboxEmail = document.getElementById(textboxEmailId);
    if (memberProfileHelper.trim(hiddenEmail.value) != memberProfileHelper.trim(textboxEmail.value))
    {
      return confirm(this.changingEmailMessageText);
    }
    else
    {
      return true;
    }
  }
  memberProfileHelper.trim = function(str)
  {
    return str.replace(/^\s*(.*)\s*$/, "$1");
  }

  function $(id)
  {
    return document.getElementById(id);
  }

  memberProfileHelper.setTabHidden = function setTabHidden(tabModeName)
  {
    var tabModeHidden = $(this.tabModeHiddenID);
    tabModeHidden.value = tabModeName;
  }

  memberProfileHelper.showProfile = function showProfile()
  {

    var mandatoryLink = $(this.editMandatoryFieldTopMessageID);
    if (mandatoryLink)
    {
      mandatoryLink.style.display = 'block';
    }

    var profileLink = $(this.profileTabLinkID);
    var profileLabel = $(this.profileTabLabelID);
    var fieldsLink = $(this.accessTabLinkID);
    var fieldsLabel = $(this.accessTabLabelID);
    var subscriptionsLink = $(this.subscriptionsTabLinkID);
    var subscriptionsLabel = $(this.subscriptionsTabLabelID);

    profileLink.style.display = 'none';
    profileLabel.style.display = 'inline';
    subscriptionsLink.style.display = 'inline';
    subscriptionsLabel.style.display = 'none';

    if (fieldsLink)
    {
      fieldsLink.style.display = 'inline';
      fieldsLabel.style.display = 'none';
    }
    
    var profileContainer = $(this.mainProfileTrID);
    var includeMemberDirectoryContainer = $(this.trIncludeInMemberDirectoryID);
    var fieldsContainer = $(this.trDetailsToShowID);
    var subscriptionsContainer = $(this.divEnableNotificationsID);

    if (profileContainer) profileContainer.style.display = 'block';
    if (includeMemberDirectoryContainer) includeMemberDirectoryContainer.style.display = 'none';
    if (fieldsContainer) fieldsContainer.style.display = 'none';
    if (subscriptionsContainer) subscriptionsContainer.style.display = 'none';

    this.setTabHidden(this.tabModeNameProfile);
    return false;
  }

  memberProfileHelper.showFieldSettings = function showFieldSettings()
  {
    var mandatoryLink = $(this.editMandatoryFieldTopMessageID);
    if (mandatoryLink)
    {
      mandatoryLink.style.display = 'none';
    }
    var profileLink = $(this.profileTabLinkID);
    var profileLabel = $(this.profileTabLabelID);
    var fieldsLink = $(this.accessTabLinkID);
    var fieldsLabel = $(this.accessTabLabelID);
    var subscriptionsLink = $(this.subscriptionsTabLinkID);
    var subscriptionsLabel = $(this.subscriptionsTabLabelID);

    profileLink.style.display = 'inline';
    profileLabel.style.display = 'none';
    subscriptionsLink.style.display = 'inline';
    subscriptionsLabel.style.display = 'none';

    if (fieldsLink)
    {
      fieldsLink.style.display = 'none';
      fieldsLabel.style.display = 'inline';
    }

    var profileContainer = $(this.mainProfileTrID);
    var includeMemberDirectoryContainer = $(this.trIncludeInMemberDirectoryID);
    var fieldsContainer = $(this.trDetailsToShowID);
    var subscriptionsContainer = $(this.divEnableNotificationsID);

    if (profileContainer) profileContainer.style.display = 'none';
    if (includeMemberDirectoryContainer) includeMemberDirectoryContainer.style.display = 'block';
    if (fieldsContainer) fieldsContainer.style.display = 'block';
    if (subscriptionsContainer) subscriptionsContainer.style.display = 'none';

    this.setTabHidden(this.tabModeNameAccess);
    return false;
  }

  memberProfileHelper.showSubscriptions = function showSubscriptions()
  {
    var mandatoryLink = $(this.editMandatoryFieldTopMessageID);
    
    if (mandatoryLink)
    {
      mandatoryLink.style.display = 'none';
    }

    var profileLink = $(this.profileTabLinkID);
    var profileLabel = $(this.profileTabLabelID);
    var fieldsLink = $(this.accessTabLinkID);
    var fieldsLabel = $(this.accessTabLabelID);
    var subscriptionsLink = $(this.subscriptionsTabLinkID);
    var subscriptionsLabel = $(this.subscriptionsTabLabelID);
 
    profileLink.style.display = 'inline';
    profileLabel.style.display = 'none';
    subscriptionsLink.style.display = 'none';
    subscriptionsLabel.style.display = 'inline';

    if (fieldsLink)
    {
      fieldsLink.style.display = 'inline';
      fieldsLabel.style.display = 'none';
    }
    
    var profileContainer = $(this.mainProfileTrID);
    var includeMemberDirectoryContainer = $(this.trIncludeInMemberDirectoryID);
    var fieldsContainer = $(this.trDetailsToShowID);
    var subscriptionsContainer = $(this.divEnableNotificationsID);

    if (profileContainer) profileContainer.style.display = 'none';
    if (includeMemberDirectoryContainer) includeMemberDirectoryContainer.style.display = 'none';
    if (fieldsContainer) fieldsContainer.style.display = 'none';
    if (subscriptionsContainer) subscriptionsContainer.style.display = 'block';

    this.setTabHidden(this.tabModeNameSubscriptions);
    
    return false;
  }


  memberProfileHelper.displayMemberAllDataTable = function()
  {
    var memberAllDataTable = $('memberAllDataTable');
    memberAllDataTable.style.display = 'block';
  }
})();


