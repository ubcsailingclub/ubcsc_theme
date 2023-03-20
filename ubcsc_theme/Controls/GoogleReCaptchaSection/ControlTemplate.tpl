<$if(Model.Enabled)$>
<div id="idReCaptchaContainer" class="fieldContainer">
    <div class="fieldSubContainer singleStringContainer">
        <div class="fieldLabel">&nbsp;</div>
        <div class="fieldBody"><$control.GoogleReCaptcha(Model=Model)$></div>
    </div>
</div>
<$endif$>