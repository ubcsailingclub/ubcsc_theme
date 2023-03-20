<div class="delivery-methods__delivery-option">
    <div class="delivery-methods__radio-button">
        <input type="radio" id="shipping-option-<$it.Id$>" name="delivery-options" value="<$it.Id$>" class="delivery-method-radio-button delivery-method-radio-button_shipping-option" />
    </div>
    <div class="delivery-methods__label">
        <label for="shipping-option-<$it.Id$>" class="delivery-method-label">
            <$it.Price:Price()$> | <$it.Title$><br/>
            <span class="delivery-option_description"><$it.Description$></span>
        </label>
    </div>
</div>