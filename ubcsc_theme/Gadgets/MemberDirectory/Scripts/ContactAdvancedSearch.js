(function()
{
    if (!window.ContactAdvancedSearch)
    {
        window.ContactAdvancedSearch = {};
    } 
    
    var contactAdvancedSearch = window.ContactAdvancedSearch;
    var anyConditionValue = -1;
    var textBoxConditionValue = 
    {
        Empty : 4,
        NotEmpty : 5
    };
    var dateConditionValue = 
    {
        ThisMonth : 4,
        ThisYear : 5,
        LastMonth : 7,
        LastYear : 8,
        NotDefined : 9,
        AnyDate : 10
    }; 
    var conditionSelectorState =
    {
        Empty : 0,
        NotEmpty : 1,
        Same : 2
    };
    var selectorTypeId = 
    {
        String : 0,
        RadioButtonList : 1,
        CheckBoxList : 2,
        Date : 3,
        Dropdown : 4,
        Int : 5,
        Decimal : 6
    }
    var dropdownTypeId = 4;
    var checkCriteriaChangedTimeout;

    contactAdvancedSearch.initialize = function(optionItems)
    {
        contactAdvancedSearch.optionItems = optionItems || contactAdvancedSearch.optionItems;
        contactAdvancedSearch.initialized = true;
    }
    contactAdvancedSearch.dispose = function()
	  {
		    if (!contactAdvancedSearch.initialized)
		    {
			      return;
		    }

		    contactAdvancedSearch.initialized = false;
  	}
	  contactAdvancedSearch.validateCriteriaSelected = function(source, args)
	  {
	      for (var i = 0; i < contactAdvancedSearch.optionItems.length; i++)
	      {
	          var conditionSelector = WA.$(contactAdvancedSearch.optionItems[i].csId, window);
	        
	          if (conditionSelector.value != anyConditionValue)
	          {
	              args.IsValid = true;
	              return;
	          }
	      }
	    
	      args.IsValid = false;
	  }
	  contactAdvancedSearch.prepareValidators = function()
	  {
	      for (var i = 0; i < contactAdvancedSearch.optionItems.length; i++)
	      {
	          var conditionSelector = WA.$(contactAdvancedSearch.optionItems[i].csId, window);
	        
	          if (conditionSelector.value == anyConditionValue)
	          {
	              disableValidators(contactAdvancedSearch.optionItems[i].vIds);
	              continue;
	          }
	        
	          if (contactAdvancedSearch.optionItems[i].t == selectorTypeId.String && !requiredTextBoxConditionSelected(conditionSelector))
	          {
	              disableValidators(contactAdvancedSearch.optionItems[i].vIds);
	              continue;
	          }
	        
	          if (contactAdvancedSearch.optionItems[i].t == selectorTypeId.Date && !requiredDateConditionSelected(conditionSelector))
	          {
	              disableValidators(contactAdvancedSearch.optionItems[i].vIds);
	              continue;
	          }
	        
	          enableValidators(contactAdvancedSearch.optionItems[i].vIds)
	      }
	  }
	  contactAdvancedSearch.dateConditionSelector = function (controlId, linkedControlId)
	  {	    
	    var dropDownList = WA.$(controlId, window);
	    var dateControlContainer = WA.$(linkedControlId, window).parentNode;
	    var newReadOnlyContainer = document.createElement('DIV');	    
	    var readOnlyContainerId = 'readOnlyContainer_' + linkedControlId;
	    newReadOnlyContainer.setAttribute("id", readOnlyContainerId);
	    newReadOnlyContainer.setAttribute("class", 'fieldItem');
      
	    var readOnlyContainer =  WA.$(readOnlyContainerId, window);

	    var dateTextThisMonth = MemberDirectoryAdvancedSearchCriteriaList.Labels.DateTextThisMonth;
	    var dateTextThisYear = MemberDirectoryAdvancedSearchCriteriaList.Labels.DateTextThisYear;
	    var dateTextLastMonth = MemberDirectoryAdvancedSearchCriteriaList.Labels.DateTextLastMonth;
	    var dateTextLastYear = MemberDirectoryAdvancedSearchCriteriaList.Labels.DateTextLastYear;

	    function setReadonlyContainerText(text)
	    {
	      if (!readOnlyContainer)
	      {
	        newReadOnlyContainer.innerHTML = text;
	        newReadOnlyContainer.style.display = 'block';
	        dateControlContainer.parentNode.appendChild(newReadOnlyContainer);
	      }
        else
        {
          readOnlyContainer.innerHTML = text;
          readOnlyContainer.style.display = 'block';
        }

	      dateControlContainer.style.display = 'none';
	    }

	    var selectedValue = dropDownList.options[dropDownList.selectedIndex].value;

	    if (selectedValue == anyConditionValue ||
	  selectedValue == dateConditionValue.NotDefined ||
	  selectedValue == dateConditionValue.AnyDate)
	    {
	      dateControlContainer.style.display = 'none';

	      if (readOnlyContainer)
	      {
	        readOnlyContainer.innerHTML = '';
	        readOnlyContainer.style.display = 'none';
	      }
	      return;
	    }

	    if (selectedValue == dateConditionValue.ThisMonth)
	    {
	      setReadonlyContainerText(dateTextThisMonth);
	      return;
	    }

	    if (selectedValue == dateConditionValue.LastMonth)
	    {
	      setReadonlyContainerText(dateTextLastMonth);
	      return;
	    }

	    if (selectedValue == dateConditionValue.ThisYear)
	    {
	      setReadonlyContainerText(dateTextThisYear);
	      return;
	    }

	    if (selectedValue == dateConditionValue.LastYear)
	    {
	      setReadonlyContainerText(dateTextLastYear);
	      return;
	    }

	    dateControlContainer.style.display = 'block';

      if (readOnlyContainer)
	    {
	      readOnlyContainer.innerHTML = '';
	      readOnlyContainer.style.display = 'none';
      }
	  }
    contactAdvancedSearch.textBoxConditionSelector = function (controlId, linkedControlContainerId)
	  {
	      var control = WA.$(controlId, window);
	      var linkedControlContainer = WA.$(linkedControlContainerId, window);

	      if (control.value == textBoxConditionValue.Empty ||
	          control.value == textBoxConditionValue.NotEmpty)
	      {
	          linkedControlContainer.style.display = 'none';
	      }
	      else
	      {
	          linkedControlContainer.style.display = 'block';
	      }
	  }
	  contactAdvancedSearch.disposeCriteriaChangeScript = function ()
	  {
	      checkCriteriaChangedTimeout = null;
	  }
    contactAdvancedSearch.initCriteriaChangeScript = function ()
    {
        for (var i = 0; i < optionItems.length; i++)
        {
            var valuesContainer = WA.$(optionItems[i].vsCId, window);
            
            if (optionItems[i].t == selectorTypeId.Dropdown)
            {
                optionItems[i].inputs = valuesContainer.getElementsByTagName('SELECT');
            }
            else
            {
                optionItems[i].inputs = valuesContainer.getElementsByTagName('INPUT');
            }
            
            optionItems[i].conditionSelector = WA.$(optionItems[i].csId, window);
        }

        runCriteriaChanged();
    }    
    function runCriteriaChanged()
    {
        for (var i = 0; i < optionItems.length; i++)
        {
            var changeStateTo = getChangeDirection(optionItems[i]);
            applyChangeDirection(optionItems[i], changeStateTo);
            clearValueIfConditionEmpty(optionItems[i]);
        }

        checkCriteriaChangedTimeout = setTimeout
        (
            function() 
            {
                runCriteriaChanged()
            },
            300
        );
    }
    function getChangeDirection(item)
    {
        if (!item.inputs || item.inputs.length == 0 || !item.inputs[0])
        {
            return;
        }
    
        if (item.t == selectorTypeId.Dropdown)
        {
            var change = conditionSelectorState.Same;
            
            if (item.prevSelectedIndex != item.inputs[0].selectedIndex && item.inputs[0].selectedIndex != 0)
            {
                change = conditionSelectorState.NotEmpty
            } 
            else if (item.inputs[0].selectedIndex == 0)
            {
                change = conditionSelectorState.Empty;
            }
            
            item.prevSelectedIndex = item.inputs[0].selectedIndex;
            return change;
        }
        else if (item.t == selectorTypeId.String || item.t == selectorTypeId.Int || item.t == selectorTypeId.Decimal || item.toLocaleString == selectorTypeId.Date)
        {
            return item.inputs[0].value ? conditionSelectorState.NotEmpty : conditionSelectorState.Empty;
        }
        else if (item.t == selectorTypeId.CheckBoxList)
        {
            for (var i = 0; i < item.inputs.length; i++)
            {
                if (item.inputs[i].checked)
                {
                    return conditionSelectorState.NotEmpty;
                }
            }
            
            return conditionSelectorState.Empty;
        }
        else if (item.t == selectorTypeId.RadioButtonList)
        {
            for (var i = 0; i < item.inputs.length; i++)
            {
                if (item.inputs[i].checked)
                {
                   var change = item.prevSelectedIndex != i ?  conditionSelectorState.NotEmpty : conditionSelectorState.Same;
                   item.prevSelectedIndex = i;
                   return change;
                }
            }
            
            return conditionSelectorState.Same;
        }
    }
    function applyChangeDirection(item, changeStateTo)
    {
        if (item.prevChangeStateTo != changeStateTo && changeStateTo != conditionSelectorState.Same)
        {
            if (changeStateTo == conditionSelectorState.Empty && item.conditionSelector.selectedIndex != conditionSelectorState.Empty &&
                !((item.t == selectorTypeId.String || item.t == selectorTypeId.Int || item.t == selectorTypeId.Decimal) &&
                  (item.conditionSelector.value == textBoxConditionValue.Empty || item.conditionSelector.value == textBoxConditionValue.NotEmpty)))
            {
                item.conditionSelector.selectedIndex = conditionSelectorState.Empty;
            }
            
            if (changeStateTo == conditionSelectorState.NotEmpty && item.conditionSelector.selectedIndex == conditionSelectorState.Empty)
            {
                item.conditionSelector.selectedIndex = conditionSelectorState.NotEmpty;
            }
        }
        
        item.prevChangeStateTo = changeStateTo;
    }
    function clearValueIfConditionEmpty(item)
    {
        if (!item.inputs || item.inputs.length == 0 || !item.inputs[0])
        {
            return;
        }
    
        if (item.conditionSelector.selectedIndex != 0)
        {
            return;
        }
        
        if (item.t == selectorTypeId.Dropdown)
        {
            item.prevSelectedIndex = item.inputs[0].selectedIndex;
            if (item.inputs[0].selectedIndex !== 0) item.inputs[0].selectedIndex = 0;
        }
        else if (item.t == selectorTypeId.String || item.t == selectorTypeId.Int || item.t == selectorTypeId.Decimal || item.toLocaleString == selectorTypeId.Date)
        {
            item.inputs[0].value = '';
        }
        else if (item.t == selectorTypeId.CheckBoxList)
        {
            for (var i = 0; i < item.inputs.length; i++)
            {
                item.inputs[i].checked = false;
            }
        }
        else if (item.t == selectorTypeId.RadioButtonList)
        {
            for (var i = 0; i < item.inputs.length; i++)
            {
                if (item.inputs[i].checked)
                {
                   item.prevSelectedIndex = i;
                }
                
                item.inputs[i].checked = false;
            }
        }
    }
  	function requiredDateConditionSelected(conditionSelector)
	  {
	      if (conditionSelector.value != dateConditionValue.ThisMonth &&
	          conditionSelector.value != dateConditionValue.ThisYear &&
	          conditionSelector.value != dateConditionValue.LastMonth &&
	          conditionSelector.value != dateConditionValue.LastYear &&
	          conditionSelector.value != dateConditionValue.NotDefined &&
	          conditionSelector.value != dateConditionValue.AnyDate)
        {
            return true;
        }
	        
	      return false;
	  }
	  function requiredTextBoxConditionSelected(conditionSelector)
	  {
	      if (conditionSelector.value != textBoxConditionValue.Empty &&
	          conditionSelector.value != textBoxConditionValue.NotEmpty)
	          {
	              return true;
	          }
	        
  	    return false;
	  }
  	function enableValidators(vIds)
	  {
	      for (var i = 0; i < vIds.length; i++)
	      {
	          WA.$(vIds[i], window).enabled = true;
	      }
	  }
	  function disableValidators(vIds)
	  {
	      for (var i = 0; i < vIds.length; i++)
	      {
	          WA.$(vIds[i], window).enabled = false;
	      }
	  }

}) ();


function ContactAdvancedSearch_Page_Parsed()
{
  ContactAdvancedSearch.initialize(optionItems);
}  
