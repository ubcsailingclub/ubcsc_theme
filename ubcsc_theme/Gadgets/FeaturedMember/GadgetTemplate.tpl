<$control.StyledWrappers(GadgetBegin = "true", GadgetTitleBegin = "true", GadgetTitleText = Model.Appearance.Title, GadgetTitleEnd = "true",  GadgetBodyBegin = "true")$>
	<div class="loadingCap"></div>
	<div class="loadingError"></div>
	<script>
		jq$(function()
		{
			var writeErrorMessageTM,
				isPageUnloading = false;

			BonaPage.addPageStateHandler(BonaPage.PAGE_UNLOADED, clearWaitWriteErrorMessage);
			BonaPage.addPageStateHandler(BonaPage.PAGE_UNLOADING, clearWaitWriteErrorMessage);
		
			function featuredMemberResize()
			{
				var self = jq$('#<$Model.Id$>'),
					fistBlock = jq$(self).find('li:first-child'),
					availableWidth = jq$(self).find('ul').width(),
					blockMinWidth,
					blocksOnRow,
					deficitSpaceFlag,
					overSpaceFlag;

				if( !(blockMinWidth = fistBlock.attr('min-width')) )
				{
					blockMinWidth = parseInt( fistBlock.css('min-width'), 10 );
					fistBlock.attr('min-width', blockMinWidth );
				}

				blocksOnRow = ( blockMinWidth > 1 ) ? Math.floor( availableWidth / blockMinWidth ) : 1;
				blocksOnRow = ( blocksOnRow < 1 ) ? 1 : blocksOnRow;
				overSpaceFlag = ( blockMinWidth > 0 && jq$(self).find('li').size() * blockMinWidth < availableWidth );
				deficitSpaceFlag = ( blockMinWidth > availableWidth );

				if( deficitSpaceFlag )
					jq$(self).find('li').css({ 'min-width':'0' });
				else
					jq$(self).find('li').css({ 'min-width':'' });

				if( overSpaceFlag )
					blocksOnRow = jq$(self).find('li').size();

				jq$(self).find('li').width( ( 100 / blocksOnRow ) + '%' );
			}

			function onLoadFeatureMemberGadget()
			{
				var self = jq$('#<$Model.Id$>'),
					asyncUrl = "<$Model.AsyncUrl$>",
					jsTpl = '',
					errorHtml = 'Server error while loading data.<br>Please contact us at <a href="mailto:support@wildapricot.com">support@wildapricot.com</a> and let us know what led to this error.<br><br>Sorry for any inconvenience.',
					noDataHtml = 'No members found',
					viewDetailsHtml = '<$Model.DefaultMemberLinkTitle$>',
					jsonData;

				isPageUnloading = false;
				
				jq$.ajax(
				{
					url: asyncUrl,
					dataType: 'text',
					cache: false
				})
				.done(function( data )
				{
					jsonData = JSON.parse( data.replace("while(1); ","","i").trim() );

					if( jsonData && jsonData.members && typeof jsonData.members === "object" && jsonData.members.length )
					{
						for( var i=0; i < jsonData.members.length; i++)
						{
							if( jsonData.pictureFieldSelected || jsonData.members[i].title || jsonData.members[i].subTitle || jsonData.members[i].description )
							{
							jsTpl += ''
								+'<li>'
									+ '<div class="img">' + ( jsonData.members[i].picture ? '<img src="'+ jsonData.members[i].picture +'" alt="">' : '<img src="<$PageModel.BaseUrl$>/Gadgets/FeaturedMember/Images/no-image.png" alt="">' ) + '</div>'
									+ '<div class="rightPart">'
										+ ( jsonData.members[i].title ? '<h4><a href="'+ jsonData.members[i].link +'" title="'+ jsonData.members[i].title +'">'+ jsonData.members[i].title +'</a></h4>' : '' )
										+ ( jsonData.members[i].subTitle ? '<div class="subtitle"><strong>'+ jsonData.members[i].subTitle +'</strong></div>' : '' )
										+ ( jsonData.members[i].description ? '<div class="description">'+ jsonData.members[i].description +'</div>' : '' )
										+ ( jsonData.members[i].title ? '' : '<div class="viewDetails"><a href="'+ jsonData.members[i].link + '">'+ viewDetailsHtml +'</a></div>' )
									+ '</div>'
								+ '</li>';
							}
						}
						jsTpl = '<ul class="layout<$Model.Settings.memberLayout$>">'+ jsTpl +'</ul>';
					}
					else
					{
						jsTpl += noDataHtml;
					}

					jsTpl += ( jsonData.directoryLink ) ? '<div class="action"><a href="'+ jsonData.directoryLink +'" title="<$Model.Settings.directoryLinkTitle$>"><$Model.Settings.directoryLinkTitle$></a></div>' : '';

					jq$( self ).find('.loadingCap').after( jsTpl).remove();

					if( jsonData.pictureFieldSelected && jq$( self ).find('ul').size() && !jq$( self ).find('ul').hasClass('showPic') )
						jq$( self ).find('ul').addClass('showPic');

					featuredMemberResize();
					featuredMemberGadgetId.linkify();
					WA.Gadgets.notifyGadgetChanged();
				})
				.fail(function( jqXHR, textStatus )
				{
					if( !isPageUnloading )
					{
						writeErrorMessageTM = setTimeout( function()
						{
							jq$( self ).find('.loadingError').html(errorHtml).show();
							jq$( self ).find('.loadingCap').remove();
						}, 1000 );
					}
				});
			}
			
			function clearWaitWriteErrorMessage()
			{
				isPageUnloading = true;

				if( writeErrorMessageTM )
					clearTimeout( writeErrorMessageTM );
			}

			var featuredMemberGadgetId = jq$('#<$Model.Id$>'),
				placeHolder = featuredMemberGadgetId.parents('.WaLayoutPlaceHolder'),
				placeHolderId = placeHolder && placeHolder.attr('data-componentId');

			onLoadFeatureMemberGadget();

			function onLayoutColumnResized(sender, args)
			{
				args = args || {};

				if (placeHolderId && (placeHolderId == args.leftColPlaceHolderId || placeHolderId == args.rightColPlaceHolderId))
				{
					featuredMemberResize();
				}
			}

			BonaPage.addPageStateHandler(BonaPage.PAGE_PARSED, function() { WA.Gadgets.LayoutColumnResized.addHandler(onLayoutColumnResized); });
			BonaPage.addPageStateHandler(BonaPage.PAGE_UNLOADED, function() { WA.Gadgets.LayoutColumnResized.removeHandler(onLayoutColumnResized); });

			jq$(window).resize(featuredMemberResize);
		});
	</script>
<$control.StyledWrappers(GadgetBodyEnd = "true", GadgetEnd = "true")$>
