(function (window, WA, undefined)
{
  'use strict';

  if (!window.WaMappingLocationMarkersInfo.Template)
  {
    window.WaMappingLocationMarkersInfo.Template = {
      overQueryLimitMessage: overQueryLimitMessage,
      updateContainerMessage: updateContainerMessage,
      updateContainer: updateContainer,
      geocodingResult: geocodingResult
    };
  }

  function overQueryLimitMessage(title, message)
  {
    return '<h6 style="margin:0 0 8px;">' + title + '</h6>'
      + message;
  }

  function updateContainerMessage(message)
  {
    return '<span style="font-size:16px; font-weight:bold; transform:rotate(90deg); display: inline-block;">&#x21bb;</span> '
      + message;
  }

  function updateContainer(m)
  {
    return '<div class="gm-style"'
      + ' style="margin-bottom:10px;background:black;opacity:0.8;color:white;padding:15px;text-align:center;font-size:14px;cursor:pointer;white-space:nowrap;overflow:hidden;display:inline-block;border-radius:3px;"'
      + ' id="' + m.updateContainerId + '">'
      + '<div style="font-size:12px; margin-bottom:6px;" id="' + m.updateContainerInfoId + '"></div>'
      + '<div id="' + m.updateContainerMessageId + '"></div>';
  }

  function geocodingResult(m)
  {
    var headBottomSpacing = 8,
      html = m.updatingFinishedLabel
      + '<div>'
      + '<table style="border:none; border-spacing:unset; padding:0;">'
      + '<thead>'
      + '<tr>'
      + '<th class="gm-style" style="font-size:12px;color:white;text-align:left;padding-right:15px;padding-bottom:' + (m.failed ? headBottomSpacing : 0) + 'px;">' + m.markersOnTheMapLabel + ':</th>'
      + '<th class="gm-style" style="font-size:12px;color:white;text-align:right;padding-bottom:' + (m.failed ? headBottomSpacing : 0) + 'px;">' + m.shown + '</th></tr>'
      + '</thead>';

    if (m.failed)
    {
      html += '<tbody>';

      for (var status in m.failures)
      {
        if (m.failures.hasOwnProperty(status) && m.failures[status] && m.statusLabels[status])
        {
          html += '<tr>'
            + '<td class="gm-style" style="font-size:12px;color:white;text-align:left;padding-right:15px;">' + m.statusLabels[status] + ':</td>'
            + '<td class="gm-style" style="font-size:12px;color:white;text-align:right;">' + m.failures[status] + '</td>'
            + '</tr>';
        }
      }

      html += '</tbody>';
    }

    return html + '</table>'
      + '</div>';
  }

})(window, WA);