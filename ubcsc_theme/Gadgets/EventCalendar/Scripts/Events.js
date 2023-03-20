function redirectToUrl(urlString)
{
  window.location.href = urlString;
  return false;
}

function changeStateAndSubmit(buttonId, state, hiddehId)
{
  var button = document.getElementById(buttonId);
  var hidden = document.getElementById(hiddehId);
  
  if (button != null && hidden != null)
  {
    hidden.value = state;
    button.click();
  }
  return false;
}

function submitClick(buttonId)
{
  var button = document.getElementById(buttonId);
  if (button != null)
  {
    button.click();
  }
  return false;
}