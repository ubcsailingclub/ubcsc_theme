<div class="OnlineStoreProduct_title_container">
	<h1><$Model.Product.Title$></h1>
</div>
<div class="OnlineStoreProduct_content_container">
	<$if (first(Model.Product.Pictures))$>
		<div class="OnlineStoreProduct_gallery">
			<a class="OnlineStoreProduct_gallery_cover_container" href="<$first(Model.Product.Pictures)$>" data-lightbox="cover-image">
				<div class="OnlineStoreProduct_gallery_cover">
					<div class="OnlineStoreProduct_gallery_cover_img_container">
						<img id="OnlineStoreProduct_gallery_cover_img" src="<$first(Model.Product.Pictures)$>" alt="Cover image">
					</div>
				</div>
				<div class="OnlineStoreProduct_gallery_cover_zoom_icon">&#xf00e;</div>
			</a>
			<ul id="OnlineStoreProduct_gallery_thumbs"><$Model.Product.Pictures:PictureItem()$></ul>
		</div>
	<$else$>
		<div class="OnlineStoreProduct_gallery OnlineStoreProduct_noPhoto">
			<div class="OnlineStoreProduct_noPhotoContainer">
				<div class="OnlineStoreProduct_noPhotoIconText">
					<div class="OnlineStoreProduct_noPhotoIcon">&#xf030;</div>
					<div class="OnlineStoreProduct_noPhotoText">No photo</div>
				</div>
			</div>
		</div>
	<$endif$>

	<div class="OnlineStoreProduct_aside">
	    <$Model.Product.Price:PriceItem()$>
      <$if(!Model.Product.OutOfStock)$>
          <div class="OnlineStoreProduct__details">
              <$if(length(Model.Product.ProductOptions)>0)$>
                  <$Model.Product.ProductOptions:OptionItem()$>
              <$endif$>
              <$if(!Model.IsDigital)$>
                <div class="OnlineStoreProductQty OnlineStoreProductQty__<$Model.Product.Type$> OnlineStoreProduct__detail">
                    <div class="OnlineStoreProduct__detailTitle">Qty: </div>
                    <div class="quantityContainer OnlineStoreProduct__detailField">
                        <div class="quantitySnippet">
                            <input class="typeNumber" id="idInputQuantity" min="1" size="2" type="number" value="1">
                            <div class="quantity-button quantity-down">&nbsp;</div><div class="quantity-button quantity-up">&nbsp;</div>
                        </div>
                        <div class="quantityLimit" id="idOnlineStoreCatalog_QuantityLimitContainer" style="<$if(length(Model.Product.ProductVariants)>0)$>visibility:hidden;<$endif$><$if(Model.Product.TrackInventory)$>display:block;<$else$>display:none;<$endif$>">
                            <span id="idOnlineStoreCatalog_QuantityLimit"><$Model.Product.TotalStock$></span> in stock
                        </div>
                    </div>
                </div>
              <$endif$>
          </div>
      <$endif$>

		<div class="OnlineStoreCatalog_OutOfStock_container" id="idOnlineStoreCatalog_OutOfStock_container" 
		style="display:<$if(Model.Product.OutOfStock)$>block<$else$>none<$endif$>">Out of stock</div>
		
		<div class="OnlineStoreCatalog_AlreadyInCart_container" id="idOnlineStoreCatalog_AlreadyInCart_container" 
    style="visibility:hidden">Added to cart</div>

		<div class="OnlineStoreButton">
			<div class="addToCartContainer">
				<input id="OnlineStoreProduct_addToCart" class="typeButton" title="Add to cart" type="button" <$if(Model.Product.OutOfStock)$>disabled="true"<$endif$> value="Add to cart">
				&nbsp; &nbsp;
				<a id="OnlineStoreProduct_viewCart" class="addToCart" href="#">View cart</a>
			</div>
			<script>
				window.currentProduct = <$if(Model.ProductJson)$><$Model.ProductJson$><$else$>null<$endif$>;
			</script>
		</div>
	</div>

	<div class="OnlineStoreProduct_information">
		<$if (Model.Product.Description && Model.Product.Description != "")$>
			<div class="OnlineStoreProduct_description">
				<h3>Description</h3>
				<div style="white-space: pre-wrap;"><$Model.Product.Description$></div>
			</div>
		<$endif$>
	</div>
</div>