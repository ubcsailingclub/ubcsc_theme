<div class="mLayout layoutMain state1" id="mLayout">
	<$if (!PageModel.IsWidgetMode)$>

		<div class="mobilePanelContainer">
			<$Gadget Name="MobilePanel"$>
		</div>

		<!-- header zone -->
		<div class="zoneHeaderOuter">
			<div class="zoneHeader container_12">
				<div class="zoneHeaderInner s1_grid_12 s2_grid_12 s3_grid_12">
					<$Area Name="Header"$>
				</div>
			</div>
		</div>

		<div class="zoneHeader1Outer">
			<div class="zoneHeader1 container_12">
				<div class="zoneHeader1Inner s1_grid_12 s2_grid_12 s3_grid_12">
					<div class="color"></div>
						<$Area Name="Header1"$>
				</div>
			</div>
		</div>

		<div class="zoneHeader2Outer">
			<div class="zoneHeader2 container_12">
				<div class="zoneHeader2Inner s1_grid_12 s2_grid_12 s3_grid_12">
					<$Area Name="Header2"$>
				</div>
			</div>
		</div>
		<!-- /header zone -->

	<$endif$>

	<!-- content zone -->
	<div class="zoneContentOuter">
		<div class="zoneContent container_12">
			<div class="zoneContentInner s1_grid_12 s2_grid_12 s3_grid_12">
				<$Area Name="Content"$>
			</div>
		</div>
	</div>
	<!-- /content zone -->

	<$if (!PageModel.IsWidgetMode)$>

		<!-- footer zone -->
		<div class="zoneFooterOuter">
			<div class="zoneFooter container_12">
				<div class="zoneFooterInner s1_grid_12 s2_grid_12 s3_grid_12">
					<$Area Name="Footer"$>
				</div>
			</div>
		</div>

        <div class="zoneFooter1Outer">
            <div class="zoneFooter1 container_12">
                <div class="zoneFooter1Inner s1_grid_12 s2_grid_12 s3_grid_12">
                    <$Area Name="Footer1"$>
                </div>
            </div>
        </div>
		<!-- /footer zone -->

		<!-- branding zone -->
		<$if (!PageModel.ShowFreeAccountAds)$>
		<div class="zoneBrandingOuter">
			<div class="zoneBranding container_12">
				<div class="zoneBrandingInner s1_grid_12 s2_grid_12 s3_grid_12">
					<$MasterLayouts/WAbranding()$>
				</div>
			</div>
		</div>
		<$endif$>
		<!-- /branding zone -->
	<$endif$>

	<$if (PageModel.ShowFreeAccountAds)$>
	<div class="WABannerStickyBottomSpacer"></div>
	<div class="WABannerStickyBottom">
		<div class="container_12">
			<div class="s1_grid_12 s2_grid_12 s3_grid_12">

				<div class="WABannerTable">
					<div class="WABannerTh">Powered by <a class="WABannerLink" href="http://www.wildapricot.com?from=footer_banner_mvp_1&utm_campaign=free-account-footer" target="_blank">Wild Apricot</a>. Try our all-in-one platform for easy membership management</div>
					<div class="WABannerTd"><a class="WABannerButton" href="http://www.wildapricot.com?from=footer_banner_mvp_1&utm_campaign=free-account-footer" target="_blank">Try it FREE</a></div>
				</div>

			</div>
		</div>
	</div>
	<script>
		var WABannerStickyBottom = true;
	</script>
	<$endif$>

	<$if (PageModel.GlobalUserJavaScript)$>
		<div id="idCustomJsContainer" class="cnCustomJsContainer">
			<$PageModel.GlobalUserJavaScript$>
		</div>
	<$endif$>

	<$if (PageModel.ShowFreeAccountAds)$>
		<$MasterLayouts/FreeAccountTracker()$>
	<$endif$>
</div>