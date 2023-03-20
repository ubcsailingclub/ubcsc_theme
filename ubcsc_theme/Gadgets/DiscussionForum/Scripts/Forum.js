(function()
{
  if (window.ForumHelper)
  {
    return;
  }
  
  window.ForumHelper = new Object();
  

  function $(id) 
  {
    return document.getElementById(id);
  }

  ForumHelper.navigateToTopic = function(topicUrl)
  {
    window.location = topicUrl;
  };

  ForumHelper.highlight = function(elem)
  {
    jq$(elem).removeClass("normal").addClass("highlight");
  };

  ForumHelper.normlight = function(elem)
  {
    jq$(elem).removeClass("highlight").addClass("normal");
  };

  ForumHelper.subscribeForum = function(forumId)
  {
    var subscribeLink = $(ForumHelper.subscribeLinkID);
    var subscribingLabel = $(ForumHelper.subscribingLabelID);
    subscribingLabel.style.display = 'inline-block';
    subscribeLink.style.display = 'none';
    
    try
    {
      WA.Ajax({
        url: ForumModel.Urls.SubscribeForum,
        cache: false,
        global: false,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({ forumId: forumId }),
        type: 'POST',
        success: ForumHelper.subscribedSuccessfully,
        error: ForumHelper.subscriptionFailed
      });
    }
    catch(e)
    {
      return true;
    }
    return false;
  };

  ForumHelper.unsubscribeForum = function(forumId)
  {
    var unsubscribeLink = $(ForumHelper.unsubscribeLinkID);
    var unsubscribingLabel = $(ForumHelper.unsubscribingLabelID);
    unsubscribingLabel.style.display = 'inline-block';
    unsubscribeLink.style.display = 'none';
    
    try 
    {
      WA.Ajax({
        url: ForumModel.Urls.UnsubscribeForum,
        cache: false,
        global: false,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({ forumId: forumId }),
        type: 'POST',
        success: ForumHelper.unsubscribedSuccessfully,
        error: ForumHelper.unsubscriptionFailed
      });
    }
    catch(e)
    {
      return true;
    }
    
    return false;
  };

  ForumHelper.subscribedSuccessfully = function()
  {
    var unsubscribeLink = $(ForumHelper.unsubscribeLinkID);
    var subscribingLabel = $(ForumHelper.subscribingLabelID);
    var unsubscribingLabel = $(ForumHelper.unsubscribingLabelID);
    unsubscribeLink.style.display = 'inline-block';
    subscribingLabel.style.display = 'none';
    unsubscribingLabel.style.display = 'none';
  };

  ForumHelper.subscriptionFailed = function()
  {
    var subscribeLink = $(ForumHelper.subscribeLinkID);
    var subscribingLabel = $(ForumHelper.subscribingLabelID);
    var unsubscribingLabel = $(ForumHelper.unsubscribingLabelID);
    subscribeLink.style.display = 'inline-block';
    subscribingLabel.style.display = 'none';
    unsubscribingLabel.style.display = 'none';
  };
  
  ForumHelper.unsubscribedSuccessfully = function()
  {
    var subscribeLink = $(ForumHelper.subscribeLinkID);
    var subscribingLabel = $(ForumHelper.unsubscribingLabelID);
    var unsubscribingLabel = $(ForumHelper.unsubscribingLabelID);
    subscribeLink.style.display = 'inline-block';
    subscribingLabel.style.display = 'none';
    unsubscribingLabel.style.display = 'none';
  };

  ForumHelper.unsubscriptionFailed = function()
  {
    var unsubscribeLink = $(ForumHelper.unsubscribeLinkID);
    var subscribingLabel = $(ForumHelper.subscribingLabelID);
    var unsubscribingLabel = $(ForumHelper.unsubscribingLabelID);
    unsubscribeLink.style.display = 'inline-block';
    subscribingLabel.style.display = 'none';
    unsubscribingLabel.style.display = 'none';
  };

  ForumHelper.subscribeTopic = function(topicId)
  {
    var subscribeTopicLink = $(ForumHelper.subscribeTopicLinkID);
    var subscribingTopicLabel = $(ForumHelper.subscribingTopicLabelID);
    subscribingTopicLabel.style.display = 'inline-block';
    subscribeTopicLink.style.display = 'none';
    try
    {
      WA.Ajax({
          url: ForumModel.Urls.SubscribeTopic,
          cache: false,
          global: false,
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify({ topicId: topicId }),
          type: 'POST',
          success: ForumHelper.subscribedTopicSuccessfully,
          error: ForumHelper.subscriptionTopicFailed
        });
    }
    catch(e)
    {
      return true;
    }
    
    return false;
  };

  ForumHelper.unsubscribeTopic = function(topicId)
  {
    var unsubscribeTopicLink = $(ForumHelper.unsubscribeTopicLinkID);
    var unsubscribingTopicLabel = $(ForumHelper.unsubscribingTopicLabelID);
    unsubscribingTopicLabel.style.display = 'inline-block';
    unsubscribeTopicLink.style.display = 'none';
    
    WA.Ajax({
          url: ForumModel.Urls.UnsubscribeTopic,
          cache: false,
          global: false,
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify({ topicId: topicId }),
          type: 'POST',
          success: ForumHelper.unsubscribedTopicSuccessfully,
          error: ForumHelper.unsubscriptionTopicFailed
        });

    return false;
  };

  ForumHelper.subscribedTopicSuccessfully = function()
  {
    var unsubscribeTopicLink = $(ForumHelper.unsubscribeTopicLinkID);
    var subscribingTopicLabel = $(ForumHelper.subscribingTopicLabelID);
    var unsubscribingTopicLabel = $(ForumHelper.unsubscribingTopicLabelID);
    unsubscribeTopicLink.style.display = 'inline-block';
    subscribingTopicLabel.style.display = 'none';
    unsubscribingTopicLabel.style.display = 'none';
  };

  ForumHelper.subscriptionTopicFailed = function()
  {
    var subscribeTopicLink = $(ForumHelper.subscribeTopicLinkID);
    var subscribingTopicLabel = $(ForumHelper.subscribingTopicLabelID);
    var unsubscribingTopicLabel = $(ForumHelper.unsubscribingTopicLabelID);
    subscribeTopicLink.style.display = 'inline-block';
    subscribingTopicLabel.style.display = 'none';
    unsubscribingTopicLabel.style.display = 'none';
  };
  
  ForumHelper.unsubscribedTopicSuccessfully = function()
  {
    var subscribeTopicLink = $(ForumHelper.subscribeTopicLinkID);
    var subscribingTopicLabel = $(ForumHelper.unsubscribingTopicLabelID);
    var unsubscribingTopicLabel = $(ForumHelper.unsubscribingTopicLabelID);
    subscribeTopicLink.style.display = 'inline-block';
    subscribingTopicLabel.style.display = 'none';
    unsubscribingTopicLabel.style.display = 'none';
  };

  ForumHelper.unsubscriptionTopicFailed = function()
  {
    var unsubscribeTopicLink = $(ForumHelper.unsubscribeTopicLinkID);
    var subscribingTopicLabel = $(ForumHelper.subscribingTopicLabelID);
    var unsubscribingTopicLabel = $(ForumHelper.unsubscribingTopicLabelID);
    unsubscribeTopicLink.style.display = 'inline-block';
    subscribingTopicLabel.style.display = 'none';
    unsubscribingTopicLabel.style.display = 'none';
  };

  ForumHelper.existedCategorySelected = function()
  {
    var existingCategoryDiv = $(ForumHelper.idExistingCategoryDiv);
    var newCategoryDiv = $(ForumHelper.idNewCategoryDiv);
    existingCategoryDiv.style.display = "";
    newCategoryDiv.style.display = "none";
  };

  ForumHelper.newCategorySelected = function()
  {
    var existingCategoryDiv = $(ForumHelper.idExistingCategoryDiv);
    var newCategoryDiv = $(ForumHelper.idNewCategoryDiv);
    existingCategoryDiv.style.display = "none";
    newCategoryDiv.style.display = "";
  };

})();