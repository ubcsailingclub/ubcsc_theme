(function ()
{
  if (!window.PhotoAlbumSummaryGadget)
  {
    window.PhotoAlbumSummaryGadget = {};
  }

  PhotoAlbumSummaryGadget.Thumbnail = Thumbnail;

  function Thumbnail(renderGallery, parentContainer, item, ind)
  {
    var borderSize = 3, container, image, isVisible = false, pThis = this;

    pThis.imageUrl = item.origin;

    pThis.init = function(parentContainer)
    {
      container = parentContainer.querySelector('DIV[data-indeximg="' + ind + '"]');
      image = parentContainer.querySelector('IMG[data-indeximg="' + ind + '"]');
    };


    pThis.render = function(thumbnailSize, marginHorizontal, marginVertical)
    {
      return '<a href="/' + item.albumId + '">' + (item.name ?
        '<div class="img_invisible" style="height:' + thumbnailSize + 'px;width:' + thumbnailSize + 'px;margin:0 ' + marginHorizontal + 'px ' + marginVertical + 'px 0;" data-indeximg="' + ind + '">' +
          '<img data-src="' + item.thumbnail + '" data-indeximg="' + ind + '" alt="" src="" />' +
          '<div class="img_caption" id="img_caption' + ind + '" style="max-width:' + (thumbnailSize - borderSize * 2) + 'px;">' +
            '<span class="caption_text" id="caption_text' + ind + '">' + item.name + '</span>' +
            '<span class="caption_count"> (' + item.count + ')</span>' +
          '</div>' +
        '</div>' :
        '<div class="img_invisible" style="height:' + thumbnailSize + 'px;width:' + thumbnailSize + 'px;margin: 0 ' + marginHorizontal + 'px ' + marginVertical + 'px 0;" data-indeximg="' + ind + '">' +
          '<img data-src="' + item.thumbnail + '" data-indeximg="' + ind + '" alt="" src="" />' +
        '</div>') + '</a>';
    };


    pThis.renderFullPhoto = function()
    {
      return item.origin
    };


    pThis.resizeThumbnail = function(size, marginHorizontal, marginVertical)
    {
      var caption = document.getElementById("img_caption" + ind),
          captionHeight = 0, captionText = document.getElementById("caption_text" + ind);

      if (caption)
      {
        var margins = (marginVertical * 2);
        
        if (caption.clientHeight > margins)
        {
          captionHeight = caption.clientHeight - margins + 30;
        }
        else
        {
          captionHeight = caption.clientHeight + 30;
        }
        
        var allowedChars = measureTextInALine(captionText.innerText, caption.clientWidth - marginHorizontal) * 2;

        if (captionText.innerText.length > allowedChars)
        {
          captionText.innerText = captionText.innerText.substr(0, allowedChars - 8) + "...";
        }

        caption.style.width = (size - borderSize * 2) + 'px';
        image.style.height = (size - borderSize * 2) + 'px';
      }

      var containerHeight = size + captionHeight;

      container.style.width = size + 'px';
      container.style.height = containerHeight + 'px';
      container.style.margin = 0 + 'px ' + marginHorizontal + 'px ' + marginVertical + 'px ' + 0 + 'px';

      return containerHeight;
    };


    pThis.checkVisibility = function() {
      if (!isVisible && getIsVisible(false)) {
        isVisible = true;

        if (item.count > 0) {
          image.setAttribute('src', image.getAttribute('data-src'));
          image.removeAttribute('data-src');
          setClasses();
        } else {
          image.removeAttribute('data-src');
        }      
      }
    };


    pThis.setViewState = function(isActive, isRightDirection)
    {
      container.style.border = (isActive ? borderSize + 'px ridge rgba(255, 255, 255, 1)' : '');

      if (isActive && !getIsVisible(isRightDirection))
      {
        if (isRightDirection)
        {
          renderGallery.scrollGallery(true, 1, true)
        }
        else
        {
          renderGallery.scrollGallery(false, 1, true)
        }
      }
    };


    function getIsVisible(isRightCorner)
    {
      var parentRect = parentContainer.getBoundingClientRect(), rect = container.getBoundingClientRect();

      return (isRightCorner ? rect.right : rect.left) < (parentRect.left + parentRect.width) && (isRightCorner ? rect.right : rect.left - parentRect.left) - container.scrollLeft >= 0;
    }


    function measureTextInALine(text, targetWidth)
    {
      var fit = text.length, i, span = document.createElement('span');

      document.body.appendChild(span);
      span.style.whiteSpace = 'nowrap';

      for (i = 0; i < fit; ++i) {
        span.innerHTML += text[i];

        if (span.offsetWidth > targetWidth) {
          fit = i - 1;
          break;
        }
      }

      document.body.removeChild(span);
      return i;
    }


    function setClasses()
    {
      if (image.naturalWidth && image.naturalHeight)
      {
        container.setAttribute('class', ((image.naturalHeight > image.naturalWidth) ? 'img_vertical' : 'img_horizontal'));
      }
      else
      {
        setTimeout(setClasses, 100);
      }
    }
  }
})();