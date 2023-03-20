<div class="commonMessageBox"<$if(OuterContainerId)$> id="<$OuterContainerId$>"<$endif$> >
	<div class="<$if(Warning)$>confirmWindowWarning <$endif$><$if(Info)$>confirmWindowInfo <$endif$><$if(Error)$>confirmWindowError <$endif$><$if(Success)$>confirmWindowSuccess <$endif$>"<$if(StyleContainerId)$> id="<$StyleContainerId$>"<$endif$> >
		<div class="cww">
			<div class="cww1"></div>
			<div class="cww2"></div>
			<div class="cww3"></div>
			<div class="cww4"></div>
		</div>
		<div class="cww-inner">
			<div class="cww-co">
				<$if(ShowHeader)$>
					<div class="header" <$if(HeaderSpanId)$>id="<$HeaderSpanId$>"<$endif$>><$HeaderText$></div>
				<$endif$>
				<$if(Text)$>
					<$if(WrapText)$><div class="text" <$if(TextDivId)$>id="<$TextDivId$>"<$endif$>><$endif$><$Text$><$if(WrapText)$></div><$endif$>
				<$endif$>
			</div>
		</div>
		<div class="cww">
			<div class="cww4"></div>
			<div class="cww3"></div>
			<div class="cww2"></div>
			<div class="cww1"></div>
		</div>
	</div>
</div>