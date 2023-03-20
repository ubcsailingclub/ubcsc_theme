(function (window, WA, undefined)
{
    'use strict';

    if (!window.InventoryIssuesStepTableRenderer)
    {
        window.InventoryIssuesStepTableRenderer = InventoryIssuesStepTableRenderer;
    }

    function InventoryIssuesStepTableRenderer()
    {
		this.render = render;

		function render(model)
        {
    		return confirmationRenderTable(model);
        }

         function confirmationRenderTable(model)
	      {
	        var html = [];

	        html.push('<table class="storeCartTable">');
	        html.push(confirmationRenderItems(model.items, model.issues));
	        html.push('</table>');

	        return html.join('');
	      }

	      function confirmationRenderItems(items, issues)
	      {
	        var html = [], i, length = items.length;

	        for (i = 0; i < length; i++) {
        	  if (InventoryIssuesHelper.hasInventoryIssues(items[i], issues))
        	  {
	          	html.push(confirmationRenderItem(items[i], issues));
	      	  }
	        }

	        return html.join('');
	      }

	      function confirmationRenderItem(item, issues)
	      {
	        var html = [];

	        html.push('<tr class="storeCartTable_row', item.isDeleted ? ' storeCartTable_rowDeleted' : '', '">');
	        html.push('<td class="storeCartTable_tdImage">', renderImage(item), '</td>');
	        html.push('<td class="storeCartTable_tdTitle">');
	        	html.push('<div class="storeCartTable_itemTitle">', item.title, '</div>');
	        	html.push(renderOptions(item));
	        html.push('</td>');
        	html.push('<td class="storeCartTable_tdInventoryIssue" align="right">', renderInventoryIssues(item, issues), '</td>');


        	html.push('<td class="storeCartTable_tdDelete">');
        	if (!item.isDeleted)
        	{
            	html.push('<button title="Remove item" class="storeCartTable_deleteButton" item-productId="', item.productId, '" item-variantId="', item.variantId,'"></button>');
        	}
            html.push('</td>');
            
	        html.push('</tr>');

	        return html.join('');
	      }

	      function renderOptions(item)
	      {
	        if (!item.options)
	        {
	          return '';
	        }

	        return jq$.map(item.options, function(option, i) {
	          return renderOption(option);
	        }).join('');
	      }

	      function renderOption(option)
	      {
	        return '<div class="storeCartTable_itemOption">' + BonaPage.encodeHtml(option.title) + ': ' + BonaPage.encodeHtml(option.value) + '</div>';
	      }

	      function renderImage(item)
	      {
	        var html = [];

	        if (item.pictureUrl)
	        {
	          html.push('<img src="', item.pictureUrl, '" width="100"/>');
	        } else
	        {
	          html.push('<div class="storeCartTable_img storeCartTable_no_img" title="No photo"></div>');
	        }

	        return html.join('');
	      }

	      function renderInventoryIssues(item, issues)
	      {
	      	if (item.isDeleted)
	      	{
      			return '<div>Deleted</div>';
	      	}

	      	var html = [];
	      	var issue = $.grep(issues, function(obj){
	      		return (obj.productId === item.productId  && obj.variantId === item.variantId);
	      	})[0]; // business: has only 1 issue

	      	switch(issue.type)
	      	{
	      		case 'NOTENOUGH':
	      		{
      				html.push('<div class="storeCartTable_itemInventoryIssue_notEnough">' + issue.quantity + ' -> only ' + issue.stock + ' left</div>');
	      			break;
	      		}
	      		case 'OUTOFSTOCK':
	      		{
	      			html.push('<div class="storeCartTable_itemInventoryIssue_outOfStock">Out of stock</div>');
	      			break;
	      		}
	      		default:{
	      			throw ({
	      				'message':'Invalid issue type',
	      				'productId': item.productId,
	      				'variantId': item.variantId
	      			});
	      		}
	      	}

	        
	        return html.join('');
	      }
    }


})(window, window.WA);