<li class="<$if (it.OutOfStock)$>OnlineStoreCatalog_list_item_outOfStock<$else$>OnlineStoreCatalog_list_item<$endif$>">
  <$if (first(it.Pictures))$>
    <a class="OnlineStoreCatalog_list_item_img" href="<$Model.ProductUrlTemplate$><$it.Id$>"><img src="<$first(it.Pictures)$>" /></a>
  <$else$>
    <a class="OnlineStoreCatalog_list_item_img" href="<$Model.ProductUrlTemplate$><$it.Id$>"><div class="OnlineStoreCatalog_list_item_img OnlineStoreCatalog_list_item_noImage">&#xf030;</div></a>
  <$endif$>
  <a class="OnlineStoreCatalog_list_item_link" href="<$Model.ProductUrlTemplate$><$it.Id$>"><$it.Title$></a>
  <$if (it.OutOfStock)$>
  	<div class="OnlineStoreCatalog_list_item_outOfStock_label">Out of stock</div>
  <$else$>
  	<$it.Price:ItemPrice()$>
  <$endif$>
</li>