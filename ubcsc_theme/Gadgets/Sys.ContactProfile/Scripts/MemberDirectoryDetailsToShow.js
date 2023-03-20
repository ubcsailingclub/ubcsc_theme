var memberDirectoryDetailsToShowHelper;

(function() 
{
  if (memberDirectoryDetailsToShowHelper == null)
  {
    memberDirectoryDetailsToShowHelper = {};
  }
  
  function $(id) 
  {
    return document.getElementById(id);
  }

  memberDirectoryDetailsToShowHelper.editIncludeMeInMemberDirectoryClick = function()
  {
    memberDirectoryDetailsToShowHelper.checkAllowDisplayCheckBox();
  }
  
  memberDirectoryDetailsToShowHelper.checkAllowDisplayCheckBox = function()
  {
    var allowDisplayCheckBox = $(memberDirectoryDetailsToShowHelper.AllowDisplayCheckBoxId);
    if (allowDisplayCheckBox)
    {
      memberDirectoryDetailsToShowHelper.setMemberFieldTableMode(!allowDisplayCheckBox.checked);
    }
  }
  
  memberDirectoryDetailsToShowHelper.setMemberFieldTableMode = function(disabled)
  {
    var fieldsControl = $(memberDirectoryDetailsToShowHelper.FieldsControlId);
    var inputs = memberDirectoryDetailsToShowHelper.getInputs(fieldsControl);
    
    for (var i = 0; i < inputs.length; i++)
    {
      if (inputs[i] && !inputs[i].getAttribute(memberDirectoryDetailsToShowHelper.LockedFieldHtmlAttr))
      {
        inputs[i].disabled = disabled;
      }
    }
  }
  
  memberDirectoryDetailsToShowHelper.getInputs = function(node)
  {
    var inputs = [];
    memberDirectoryDetailsToShowHelper.populateInputs(inputs, node);
    return inputs;
  }
  
  memberDirectoryDetailsToShowHelper.populateInputs = function(inputs, node)
  {
    if (!node)
      return;
    
    if (node.tagName && node.tagName.toLowerCase() == "input")
    {
      inputs[inputs.length] = node;
    }

    if (!node.childNodes || node.childNodes.length == 0)
    {
      return;
    }
  
    for (var i = 0; i < node.childNodes.length; i++)
    {
      var subNode = node.childNodes[i];
      memberDirectoryDetailsToShowHelper.populateInputs(inputs, subNode);
    }
  }
  
}) ();


