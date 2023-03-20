<div class="OnlineStoreProduct__variants OnlineStoreProduct__detail">
	<div class="OnlineStoreProduct__detailTitle"><$it.Title$>:</div>
		<div class="OnlineStoreProduct__detailField OnlineStoreProduct__variants">
		    <select name="product_option<$i$>"  id="OnlineStoreProduct_optionSelect<$i$>" option-id="<$i$>" option-title="<$it.Title$>" class="OnlineStoreProduct_optionsSelect">
		        <option value="" selected>&lt; Select &gt;</option>
		            <$it.Values:OptionValueItem()$>
		    </select>
		<div class="OnlineStoreProduct__variantsError" id="idOnlineStoreProduct_Option<$i$>_ErrorLabel">Please select options</div>
	</div>
</div>