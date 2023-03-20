(function()
{
  if (window.ForumSummaryHelper)
  {
    return;
  }
  
  window.ForumSummaryHelper = new Object();
  
  function $(id) 
  {
    return document.getElementById(id);
  }
  
  ForumSummaryHelper.navigateToTopic = function(topicUrl)
  {
    window.location = topicUrl;
  }

  ForumSummaryHelper.highlight = function(elem)
  {
    jq$(elem).removeClass("normal").addClass("highlight");
  }

  ForumSummaryHelper.normlight = function(elem)
  {
    jq$(elem).removeClass("highlight").addClass("normal");
  }
  
  ForumSummaryHelper.allForumsRadioSelected = function ()
  {
    var selectForumsListDiv = $(ForumSummaryHelper.selectForumsListId);
    selectForumsListDiv.style.display = "none";
  }

  ForumSummaryHelper.selectedForumsRadioSelected = function ()
  {
    var selectForumsListDiv = $(ForumSummaryHelper.selectForumsListId);
    selectForumsListDiv.style.display = "";
  }

})();