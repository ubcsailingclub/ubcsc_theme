<$control.StyledWrappers(GadgetBegin = "true", GadgetTitleBegin = "true", GadgetTitleText = Model.Appearance.Title, GadgetTitleEnd = "true",  GadgetBodyBegin = "true")$>

<$if (Model.Description && Model.Description != "")$>
<div class="donationGoalNotesContainer">
    <$Model.Description$>
</div>
<$endif$>

<div class="progressBarOuterContainer">
    <div class="progressBar">
        <table cellspacing="0" cellpadding="0" border="0">
            <tr>
                <td class="donationGoalProgressBarLeftPart" width="<$Model.PercentForBar$>%"><span></span></td>
                <td class="donationGoalProgressBarRightPart" width="<$Model.PercentForBarLeft$>%"></td>
            </tr>
        </table>

        <div class="collectedPercents">
            <$Model.CollectedPercent$>%
        </div>
</div>
        <div class="buttonAndLabels">
            <$if (Model.CanAcceptDonations)$>
            <div class="donationGoalButton">
                <input type="button" class="typeButton" value="<$Model.Text.DonateButtonText$>" onclick="window.location.href='<$Model.Urls.Donate$>'" />
            </div>
            <$endif$>

            <div class="donationGoalProgressLabels">
                <div><span class="title"><$Model.Text.CollectedTitle$></span> <$Model.CollectedAmount$></div>
                <div><span class="title"><$Model.Text.GoalAmountTitle$></span> <$Model.GoalAmount$></div>
            </div>
    </div>
</div>

<$control.StyledWrappers(GadgetBodyEnd = "true", GadgetEnd = "true")$>