<li>
	<a href="<$it.Url$>"><$it.Title$></a>

	<$if (it.IsItemWithChildren)$>
		<ul>
			<$it.Items:Item()$>
		</ul>	
	<$endif$>

</li>