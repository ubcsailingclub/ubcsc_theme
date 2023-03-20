<$if (Model.CanAcceptDonations)$>
	<div class="donationGoalButton">
		<input type="button" class="typeButton" value="<$Model.Text.DonateButtonText$>" onclick="window.location.href='<$Model.Urls.Donate$>'" />
	</div>
<$endif$>