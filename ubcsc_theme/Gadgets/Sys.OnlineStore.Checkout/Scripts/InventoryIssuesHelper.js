(function (window, WA, undefined)
{
    'use strict';

    if (!window.InventoryIssuesHelper)
    {
        window.InventoryIssuesHelper = new InventoryIssuesHelper();
    }

    function InventoryIssuesHelper()
    {
		this.hasInventoryIssues = hasInventoryIssues;
		this.getInventoryIssue = getInventoryIssue;

		function hasInventoryIssues(item, issues)
		{
			return getInventoryIssue(item, issues) != null;
		}

		function getInventoryIssue(item, issues)
		{
			var _issues = $.grep(issues, function(obj){
		      		return (obj.productId === item.productId  && obj.variantId === item.variantId);
		      	});

			return _issues.length > 0 ? _issues[0] : null;
		}
    }


})(window, window.WA);