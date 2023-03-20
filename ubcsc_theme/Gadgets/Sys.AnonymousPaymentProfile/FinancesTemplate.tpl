<$if (Model.ShowAnonymousAdminModeInfoBool)$>
<$control.MessageBox(Text={<$Model.AdminInformationEmptySystemPageText$>}, WrapText="True", Info="True")$>
<$else$>
&nbsp;<div id="idMemberProfileContainer" class="functionalPageContainer">
      <div id="idMemberProfile" class="functionalPageNameContainer">
        <div class="functionalPageContentOuterContainer">
          <div class="cornersContainer">
            <$control.Divs (cornersDivsTop = "true", hideInnerDivs = "false")$>
          </div>
          <div class="functionalPageContentContainer">
            <$control.Divs (designDivsBegin = "true")$>
              <div class="pageTitleOuterContainer" id="idMemberProfileTitleMainContainer">
                <div class="pageTitleContainer" id="idMemberProfileTitleContainer">
                  <h1 class="pageTitle SystemPageTitle">
                    <$Model.Text.PageHeadingTitle$>
                  </h1>
                  <div class="subTitle">
                    <a href="<$Model.Urls.AuthenticateWithReturn$>">Login</a><$Model.Text.PageHeadingSubtitle$>
                  </div>
                </div>
              </div>
              		  
            <$if (Model.GroupAdminViewsGroupMemberProfileBool)$>
              <$if (Model.CurrentContactIsArchivedOrMembershipDisabledBool)$>
                <$control.MessageBox(Text={<$Model.Text.GroupAdminViewsGroupMemberProfileMessage$><br><a href="<$Model.Urls.ProfileMain$>"><$Model.Text.ReturnToOwnProfileText$></a>}, WrapText="True", Warning="True", ShowHeader="True", HeaderText=Model.Text.GroupAdminViewsGroupMemberProfileHeader)$>
              <$else$>
                <$control.MessageBox(Text={<$Model.Text.GroupAdminViewsGroupMemberProfileMessage$><br><a href="<$Model.Urls.ProfileMain$>"><$Model.Text.ReturnToOwnProfileText$></a>}, WrapText="True", Info="True")$>
              <$endif$>
            <$endif$>
            <$if (Model.GroupMemberProfileBool)$>
                <$control.MessageBox(Text={<$Model.Text.GroupMemberViewsOwnProfileMessage$> <strong><$Model.BundleAdministratorName$></strong>}, WrapText="True", Info="True")$>
            <$endif$>



				<div id="idTopButtonsContainer" class="topButtonsOuterContainer">
				  <div class="cornersContainer">
					<$control.Divs (cornersDivsTop = "true", hideInnerDivs = "false")$>
				  </div>
				  <div class="topButtonsContainer">
					<$control.Divs (designDivsBegin = "true")$>
					  <$if (Model.ShowLoginButtonBool)$>
						<div style="float: left;">
              <$control.Form(formBegin = "true", action = Model.Urls.ProfileInvoicesAction, id = "idProfileLoginForm")$>
                <input type="submit" class="button" value="<$Model.Text.LoginButtonLabel$>" name="profileLoginButton" id="profileLoginButton">
						  <$control.Form(formEnd = "true")$>
						</div>
					  <$endif$>
					  <div>
              <$control.Form(formBegin = "true", action = Model.Urls.ProfileInvoicesAction, id = "idProfileTopForm")$>
                <$if (Model.EditMainProfileEnabled)$>
                  <input type="submit" class="typeButton button" id="ctl00_ContentArea_editButtonTop" value="<$Model.Text.EditProfileButton$>" name="ctl00$ContentArea$editButtonTop">
                <$endif$>
                <$if (Model.PublicProfileEnabled)$>  
                  <a class="memberDirectoryDetailsLink" id="ctl00_ContentArea_memberDirectoryDetailsLink" href="<$Model.Urls.PublicProfile$>"><$Model.Text.MemberDirectoryLink$></a>
                <$endif$>
                <$if (Model.ShowArchiveButton)$>
                  <input type="submit" class="typeButton button" id="ctl00_ContentArea_archiveButtonTop" value="<$Model.Text.ArchiveButton$>" title="<$Model.Text.ArchiveButtonTooltip$>" name="ctl00$ContentArea$archiveButtonTop">
                <$endif$>
                <$if (Model.ShowRestoreButton)$>
                  <input type="submit" <$if (Model.RestoreEnabled)$><$else$>disabled="disabled"<$endif$> class="typeButton button" id="ctl00_ContentArea_restoreButtonTop" value="<$Model.Text.RestoreButton$>" title="<$Model.Text.RestoreButtonTooltip$>" name="ctl00$ContentArea$restoreButtonTop">
                <$endif$>
 						  <$control.Form(formEnd = "true")$>
					  </div>
            <span class="totalBalance" style="<$if (Model.TotalBalanceStringAlert)$>color: #FF0000;<$else$>color: #00A000;<$endif$>"><$Model.TotalBalanceString$></span>
					<$control.Divs (designDivsEnd = "true", ExtraClearEnd="true")$>
				  </div>
				  <div class="cornersContainer">
					<$control.Divs (cornersDivsBottom = "true", hideInnerDivs = "false")$>
				  </div>
				</div>
								
								
								
<$if (Model.IsUnauthenticatedModeBool)$>
<$else$>
				<div id="idMemberDetailsTabsContainer" class="memberDetailsTabsOuterContainer">
				  <div class="cornersContainer">
					<$control.Divs (cornersDivsTop = "true", hideInnerDivs = "false")$>
				  </div>
					<div class="memberDetailsTabsContainer">
						<$control.Divs (designDivsBegin = "true")$>
										<ul class="memberDetailsTabMenu">
										  <$if (Model.MainProfileEnabled)$>
											<li id="memberProfileContainerShowLink">
											  <div <$if (Model.ThereAreWarningOnProfile)$> class="warning"<$endif$>>
												<a href="<$Model.Urls.ProfileMain$>" id="ctl00_ContentArea_profileTabLink"><$Model.Text.ProfileMainLink$></a>
											  </div>
											</li>
										  <$endif$>
										  <$if (Model.PrivacySettingsEnabled)$>  
											<li id="memberFieldsContainerShowLink">
											  <a href="<$Model.Urls.ProfilePrivacy$>" id="ctl00_ContentArea_accessTabLink"><$Model.Text.ProfilePrivacyLink$></a>
											</li>
										  <$endif$>
										  <$if (Model.EmailSubscriptionsEnabled)$>  
											<li id="membeSubscriptionsShowLink">
											  <a href="<$Model.Urls.ProfileSubscriptions$>" id="ctl00_ContentArea_subscriptionsTabLink"><$Model.Text.ProfileSubscriptionsLink$></a>
											</li>
										  <$endif$>
										  <$if (Model.PhotoGalleryEnabled)$>  
											<li id="memberPhotoGalleryShowLink">
											  <a href="<$Model.Urls.ProfilePhotoAlbum$>" id="ctl00_ContentArea_photoGalleryTabLink"><$Model.Text.ProfilePhotoAlbumLink$></a>
											</li>
										  <$endif$>
										  <$if (Model.IsUnauthenticatedModeBool)$>
										  <$else$>
											<li class="selected" id="invoicesShowLink">
											  <div <$if (Model.ThereAreWarningOnInvoiceList)$> class="warning"<$endif$>>
												<span id="ctl00_ContentArea_invoicesTabLabel">
													<$Model.Text.ProfileInvoicesTab$>                                                                    
												</span>
											  </div>  
											</li>
										  <$endif$>
										</ul>
										<div class="clearEndContainer"></div>
						<$control.Divs (designDivsEnd = "true")$>
					</div>
				  <div class="cornersContainer">
					<$control.Divs (cornersDivsBottom = "true", hideInnerDivs = "false")$>
				  </div>
				</div>
<$endif$>



				<div id="idMemberProfileContainer" class="formOuterContainer">
					<div class="cornersContainer">
						<$control.Divs (cornersDivsTop = "true", hideInnerDivs = "false")$>
					</div>
					<div class="formContainer">
						<$control.Divs (designDivsBegin = "true")$>
							<div class="generalFieldsOuterContainer">
								<div class="cornersContainer">
									<$control.Divs (cornersDivsTop = "true", hideInnerDivs = "false")$>
								</div>
								<div class="generalFieldsContainer">
									<$control.Divs (designDivsBegin = "true")$>
										<$Invoices()$>
									<$control.Divs (designDivsEnd = "true", ExtraClearEnd="true")$>
									<div id="idBottomButtonsContainer" class="navigationOuterContainer">
										<div class="cornersContainer">
											<$control.Divs (cornersDivsTop = "true", hideInnerDivs = "false")$>
										</div>
										<div class="navigationContainer">
											<$control.Divs (designDivsBegin = "true")$>
												<div class="left"></div>
												<div class="right">
<$if (Model.WidgetModeBool)$>
<$if (Model.ShowChangePasswordLinkBool)$>
<a href="<$Model.Urls.ChangePassword$>" id="ctl00_ContentArea_MemberProfile1_changePasswordLink"><$Model.Text.ChangePassword$></a>
<$endif$>
<$if (Model.ShowLogoutLinkBool)$>
<a href="<$Model.Urls.Logout$>" id="ctl00_ContentArea_MemberProfile1_logout"><$Model.Text.Logout$></a>
<$endif$>
<$endif$>
												</div>
											<$control.Divs (designDivsEnd = "true", ExtraClearEnd="true")$>
										</div>
										<div class="cornersContainer">
											<$control.Divs (cornersDivsBottom = "true", hideInnerDivs = "false")$>
										</div>
									</div>
								</div>
								<div class="cornersContainer">
									<$control.Divs (cornersDivsBottom = "true", hideInnerDivs = "false")$>
								</div>
							</div>
						<$control.Divs (designDivsEnd = "true")$>
					</div>
					<div class="cornersContainer">
						<$control.Divs (cornersDivsBottom = "true", hideInnerDivs = "false")$>
					</div>
				</div>



			</div>
		  </div>
		</div>
      <$control.Divs (designDivsEnd = "true", ExtraClearEnd="true")$>
    </div>
  </div>
  <div class="cornersContainer">
    <$control.Divs (cornersDivsBottom = "true", hideInnerDivs = "false")$>




      <br />
<$endif$>