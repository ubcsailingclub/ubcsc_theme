<$if(length(Model.Products)>0)$>
    <ul class="OnlineStoreCatalog_list"><$Model.Products:Item()$></ul>
<$else$>
    <div>&nbsp;</div>
    <p>There are no products to display</p>
    <div>&nbsp;</div>
<$endif$>
