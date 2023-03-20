<div>
	<span class="OnlineStoreCatalog_list_price">
		<$if(it.Members && Context.User.IsActiveMember)$><$it.Members:Price()$><$else$><$it.Regular:Price()$><$endif$>
	</span>
</div>
<div>
	<$if(it.Members)$>
		<span class="OnlineStoreCatalog_list_price_alt">
			<$if(Context.User.IsActiveMember)$>
				<span class="OnlineStoreCatalog_list_price_strike"><$it.Regular:Price()$></span> - Regular price
			<$else$>
				<$it.Members:Price()$> - Member price
			<$endif$>
		</span>
	<$endif$>
</div>