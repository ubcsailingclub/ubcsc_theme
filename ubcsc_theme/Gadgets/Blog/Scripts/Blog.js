(function(window)
{
  if (window.BlogHelper)
  {
    return;
  }

  window.BlogHelper = new Object();

  var hiddenFormFormCommentExists = null;
  var commentBottom = null;
  var formDisabled = false;
  var commentLengthValidator = null;
  var oldValidatorMessage;

  window.BlogHelper.previousReplyLink = null;
  
  function setUrlFragment(value, w)
  {
    var wnd = w || window;
	
	if (!wnd.location) { return ''; }
	
	var match = (/#([^#]*)$/gi).exec(wnd.location.toString()),
	    activeUrl = wnd.location.toString(),
		newUrl = match ? activeUrl.replace(/#([^#]+)$/gi, "#" + value) : activeUrl + "#" + value;
		
    wnd.location.replace(newUrl);
  }

  BlogHelper.replyToComment = function(replyLink)
  {
    var comment = BlogHelper.getCommentContainer(replyLink);

    if (!comment)
    {
      return;
    }

    var messageId = comment.getAttribute('messageId');

    if (!messageId)
    {
      return false;
    }

    var addNewCommentFormContainer = WA.$('idAddNewCommentFormContainer', window);
    var replyToCommentHidden = WA.$(BlogHelper.idReplyToCommentId, window);

    if (formDisabled)
    {
      return;
    }

    if (DataChangeWatcher)
    {
      var checkResult = DataChangeWatcher.confirmIfDataChanged();
      DataChangeWatcher.resumeWatching();

      if (!checkResult)
      {
        return;
      }
    }

    if (commentBottom)
    {
      commentBottom.style.display = '';
    }

    var commentBottom = BlogHelper.getCommentBottomBlock(comment);
    var replyFormContainer = comment;

    do
    {
      replyFormContainer = replyFormContainer.nextSibling;
    }
    while (replyFormContainer && replyFormContainer.nodeType != 1)

    if (commentBottom)
    {
      commentBottom.style.display = 'none';
    }

    if (window.BlogHelper.previousReplyLink)
    {
      window.BlogHelper.previousReplyLink.style.display = 'inline';
    }

    //addNewCommentFormContainer.style.display = '';
    window.BlogHelper.previousReplyLink = replyLink;
    //replyLink.style.display = 'none';
    window.BlogHelper.replyingOnCommentId = getReplyId();

    //replyFormContainer.appendChild(addNewCommentFormContainer);

    if (!replyToCommentHidden)
    {
      replyToCommentHidden = WA.$(BlogHelper.idReplyToCommentId, window);
    }

    replyToCommentHidden.value = messageId;
    commentLengthValidator = window.setTimeout('BlogHelper.validateCommentLength()', 300);
  }

  BlogHelper.showReplyIfAwailable = function(replyLink)
  {
    var comment = BlogHelper.getCommentContainer(replyLink);

    if (!comment)
    {
      return true;
    }

    var messageId = comment.getAttribute('messageId');

    if (!messageId)
    {
      return true;
    }

    if (window.BlogHelper.replyingOnCommentId != messageId)
    {
      return true;
    }

    WA.$('idAddNewCommentFormContainer', window).style.display = '';
    return false;
  }

  BlogHelper.hideButtonsIfJsEnabled = function()
  {
    var commentsContainer = WA.$('idBlogCommentsListContainer', window);
    var buttons = commentsContainer.getElementsByTagName('INPUT');
    var links = commentsContainer.getElementsByTagName('A');

    for (var i = 0; i < buttons.length; i++)
    {
      if (buttons[i].attributes['HideIfJsEnabled'])
      {
        buttons[i].style.display = 'none';
      }
    }

    for (var i = 0; i < links.length; i++)
    {
      if (links[i].attributes['ShowIfJsEnabled'])
      {
        links[i].style.display = '';
      }
    }

  }

  BlogHelper.hideCommentForm = function()
  {
    var addNewCommentFormContainer = WA.$('idAddNewCommentFormContainer', window);
    var commentText = WA.$(BlogHelper.idCommentText, window);

    if (WA.String.gtrim(commentText.value).length > 0)
    {
      DataChangeWatcher.setChanged();
    }
    else
    {
      DataChangeWatcher.setNotChanged();
    }

    if (DataChangeWatcher && DataChangeWatcher.confirmIfDataChanged())
    {
      addNewCommentFormContainer.style.display = 'none';
      commentText.value = '';

      if (commentLengthValidator)
      {
        window.clearTimeout(commentLengthValidator);
      }

      if (commentBottom)
      {
        commentBottom.style.display = '';
      }

      if (window.BlogHelper.previousReplyLink)
      {
        window.BlogHelper.previousReplyLink.style.display = '';
      }

      return true;
    }

    return true;
  }

  BlogHelper.validateComment = function()
  {
    var commentText, commentLength, message, captchaCode;

    commentText = WA.$(BlogHelper.idCommentText, window);
    commentLength = BlogHelper.getCommentLength();
    message = '';

    if (commentText.value.trim().length == 0)
    {
      message = BlogHelper.strCommentIsEmpty;
    }

    if (commentLength > BlogHelper.intMaxCommentLength)
    {
      message = BlogHelper.strCommentLengthExeededAlertMessage;
    }

    captchaCode = WA.$(BlogHelper.idCaptchaCodeId, window);

    if (captchaCode && captchaCode.value.trim().length == 0)
    {
      if (message != '')
      {
        message += '\r\n';
      }

      message += BlogHelper.strCaptchaCodeIsEmpty;
    }

    if (message != '')
    {
      alert(message);
      return false;
    }

    Page_IsValid = true;
    Page_BlockSubmit = false;

    return true;
  }

  BlogHelper.validateCommentLength = function()
  {
    var commentText, commentLength, errorContainer, errorText, newValidatorMessage;

    if (!(commentText = WA.$(BlogHelper.idCommentText, window)))
    {
      return;
    }

    commentLength = BlogHelper.getCommentLength();
    errorText = WA.$('errorMessage', window);
    errorContainer = WA.$(BlogHelper.idErrorMessageContainer, window);
    newValidatorMessage = commentLength > BlogHelper.intMaxCommentLength ? BlogHelper.strCommentLengthExeededValidatorMessage.toString().replace(/\[0\]/, commentLength) : '';

    if (oldValidatorMessage != newValidatorMessage)
    {
      oldValidatorMessage = errorText.innerHTML = newValidatorMessage;
    }

    errorContainer.style.display = errorText.innerHTML != '' ? 'block' : 'none';

    commentLengthValidator = window.setTimeout('BlogHelper.validateCommentLength()', 300);
  }

  BlogHelper.getCommentLength = function()
  {
    return WA.$(BlogHelper.idCommentText, window).value.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n').length;
  }

  BlogHelper.disableCommentForm = function()
  {
    if (DataChangeWatcher)
    {
      DataChangeWatcher.pauseWatching();
    }

    window.setTimeout(
      function()
      {
        WA.$(BlogHelper.idPostCommentButton, window).disabled = true;
        WA.$(BlogHelper.idCommentText, window).disabled = true;

        var captchaCode = WA.$(BlogHelper.idCaptchaCodeId, window);
        var captchaReload = WA.$(BlogHelper.idCaptchaReloadId, window);
        var anonimousAuthorTextBox = WA.$(BlogHelper.idAnonimousAuthorTextBoxId, window);

        if (captchaCode)
        {
          captchaCode.disabled = true;
        }

        if (captchaReload)
        {
          captchaReload.style.display = 'none';
        }

        if (anonimousAuthorTextBox)
        {
          anonimousAuthorTextBox.disabled = true;
        }

        formDisabled = true;
      },
      10);
  }

  BlogHelper.disablePostForm = function()
  {
    if (DataChangeWatcher)
    {
      DataChangeWatcher.pauseWatching();
    }

    window.setTimeout(
      function()
      {
        if (Page_IsValid)
        {
          formDisabled = true;
        }
      },
      100);
  }

  BlogHelper.deleteComment = function()
  {
  }

  BlogHelper.stokeComment = function(anyCommentInnerObject, enabled)
  {
    var comment;

    if (comment = BlogHelper.getCommentContainer(anyCommentInnerObject))
    {
      comment.className = enabled ? 'commentViewContainer Stoked' : 'commentViewContainer';
    }
  }

  BlogHelper.getCommentContainer = function(innerObject)
  {
    var comment = innerObject;

    if (!comment)
    {
      return null;
    }

    while (!comment.getAttribute('messageId') && comment.tagName != 'BODY')
    {
      comment = comment.parentNode;
    }

    return (comment.tagName != 'BODY') ? comment : null;
  }

  BlogHelper.getCommentBottomBlock = function(comment)
  {
    var elements, i;

    if (comment.className == 'commentBottom' || comment.className == 'postBottom')
    {
      return comment;
    }

    elements = comment.getElementsByTagName('DIV');

    for (i = 0; i < elements.length; i++)
    {
      if (elements[i].className == 'commentBottom' || elements[i].className == 'postBottom')
      {
        return elements[i];
      }
    }
  }


  BlogHelper.AutoexpandReplyFormIfNeeded = function()
  {
    var replyId = getReplyId();
    var commentOnPost = isAddingCommentToPost();
    var replyOnMessage;

    if (replyId)
    {
      replyOnMessage = findMessageByMessageId(replyId);
      setUrlFragment(replyId, window);
      BlogHelper.replyToComment(replyOnMessage);
    }
    else if (commentOnPost)
    {
      replyOnMessage = WA.$(BlogHelper.postContainerId, window);
      BlogHelper.replyToComment(replyOnMessage);
    }
  }

  BlogHelper.AutoScrollToAnchor = function(anchorParamName)
  {
    var searchPattern = new RegExp(anchorParamName + '=([0-9a-zA-Z]+)');
    var match = searchPattern.exec(window.location);

    if (match != null)
    {
      setUrlFragment(match[1], window);
    }
  }

  BlogHelper.getTwoDigitsNumber = function(number)
  {
    return number < 10 ? '0' + number : number;
  }

  // min length
  BlogHelper.ValidateBody = function(sender, args)
  {
    var box, value;

    if (WidgetMode == 1)
    {
      if (box = WA.$(BodyTextBoxId, window))
      {
        args.IsValid = (box.value.replace(/^\s*|\s*$/g, '') != '');
      }

      return;
    }

    if (!top || !WA.BonaEditor.EditorsManager)
    {
      return;
    }

    box = WA.BonaEditor.EditorsManager.getEditorById(BlogHelper.idEditor);

    if (box == null)
    {
      return;
    }

    value = box.getHtmlData().replace(/&nbsp;|\s|<br>|<p>|<\/p>/ig, "");
    args.IsValid = value.length > 0;
  }

  // max length
  BlogHelper.ValidateBodyLength = function(sender, args)
  {
    var box, value, valueLength;

    if (WidgetMode == 1)
    {
      if (box = WA.$(BodyTextBoxId, window))
      {
        args.IsValid = (box.value.replace(/^\s*|\s*$/g, "").length <= BlogHelper.intMaxPostLength);
      }

      return;
    }

    if (!top || !WA.BonaEditor.EditorsManager)
    {
      return;
    }

    box = WA.BonaEditor.EditorsManager.getEditorById(BlogHelper.idEditor);

    if (box == null)
    {
      return;
    }

    valueLength = box.getHtmlDataLength();
    args.IsValid = (valueLength <= BlogHelper.intMaxPostLength);
  }

  BlogHelper.OnLoad = function()
  {
    BlogHelper.AutoScrollToAnchor('anchor');
    BlogHelper.AutoexpandReplyFormIfNeeded();
  }


  function getReplyId()
  {
    var url = window.location ? window.location.toString() : '';
    var searchRegExs = [
            /replyTo\=(\d+)/i,
            /#replyTo(\d+)$/i
        ];

    for (var i = 0; i < searchRegExs.length; i++)
    {
      var match = searchRegExs[i].exec(url);

      if (match)
      {
        return match[1];
      }
    }

    return 0;
  }

  function isAddingCommentToPost()
  {
    var url = window.location ? window.location.toString() : '';
    var searchRegEx = /#addComment$/i;
    var match = searchRegEx.exec(url);

    return match ? true : false;
  }


  function findMessageByMessageId(messageId)
  {
    var elements = document.getElementsByTagName('DIV');

    for (var i = 0; i < elements.length; i++)
    {
      var element = elements[i];
      var attribute = element.getAttribute('messageId');

      if (attribute == messageId)
      {
        return element;
      }
    }

    return null;
  }


})(window);

if (window.BonaPage) { BonaPage.addPageStateHandler(BonaPage.PAGE_PARSED, BlogHelper.OnLoad); }