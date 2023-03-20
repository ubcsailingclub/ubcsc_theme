(function() {

  if (!window.memberSubscriptionsHelper)
  {
    window.memberSubscriptionsHelper = {};
  }
    
  memberSubscriptionsHelper.editEnableEmailsClick = function()
  {
    this.setSubscriptionsEnabling();
  }
  
  memberSubscriptionsHelper.setSubscriptionsEnabling = function()
  {
    var allowDisplayCheckBox = WA.$(this.AllowDisplayCheckBoxId, window);
    var contentControl = WA.$(this.ContentControlId, window);
    
    if (!contentControl || !allowDisplayCheckBox) 
    {
      return;
    }
    
    contentControl.style.display = allowDisplayCheckBox.checked ? "block" : "none";
  }
  
  memberSubscriptionsHelper.enableSubscription = function(checkBoxID, dropDownID)
  {
    var enableCheckBox = WA.$(checkBoxID, window);
    var typeDropDown = WA.$(dropDownID, window);
    
    if (!enableCheckBox || !typeDropDown) 
    {
      return;
    }
    
    typeDropDown.disabled = !enableCheckBox.checked;
  }
    
}) ();


