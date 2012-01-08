			var thumblr = {
				imageIndex: 0,
				maxZIndex: 1,
				tumblrData: null,
				
				init: function () {
					
					var body = document.body || document.documentElement;
					var bodyStyle = body.style;
					var animationSupport = bodyStyle.WebkitAnimation !== undefined || bodyStyle.MozAnimation !== undefined;

					if (!animationSupport) {
						$("#optionsButton").hide();
						$("#error").show();
						return -1;
					}
					
					$("#account").change( function() {
						var username = $("#account").val();
						location.hash = username;
						thumblr.fetchData(username);
					});
					
					$("#optionsButton").click( function() {
						$("#options").toggle();
						$("#account").focus();
					});
					
					var username = "scottgarner";
					if (location.hash) {
						username = location.hash.substr(1);
						$('#account').val(username);
					}
					
					thumblr.fetchData(username);

				},
				
				fetchData: function(username) {
					
					var tumblrURL = username;
					
					if (tumblrURL.indexOf(".") == -1) var tumblrURL = tumblrURL + ".tumblr.com";
					
					$.ajax( {
						url: "http://"+ tumblrURL + "/api/read/json?num=50&type=photo&callback=?",
						dataType: "jsonp",
						timeout : 2000,
						success: function( data ) {
							
							if (data.posts.length) {
								thumblr.tumblrData = data;
																
								$('#stage').fadeOut('slow', function() {
									$('.photo').remove();
									 
									$('#stage').show();
								});							
								
								thumblr.maxZIndex = 0;
								thumblr.imageIndex = 0;
								
								$("#accountLabel").html('tumblr account');
								$("#accountLabel").removeClass("error");
								$('#options').fadeOut();
								
								thumblr.preloadImage();
								
								clearTimeout (thumblr.interval);
								thumblr.interval = setInterval ( "thumblr.addImage()", 4000 );	
							} else {
								$("#accountLabel").html('no photos here');
								$("#accountLabel").addClass("error");
								$('#options').fadeIn();
								$('#account').focus();
							}
							
						},	
						error: function() {
							$("#accountLabel").html('not found');
							$("#accountLabel").addClass("error");
							$('#options').fadeIn();							
						}						
					});
				},
				
				//
				
				preloadImage: function() {
					if (thumblr.imageIndex >= thumblr.tumblrData.posts.length) {
						clearTimeout (thumblr.interval);
						return -1;
					}

					var curImage = thumblr.tumblrData.posts[thumblr.imageIndex]["photo-url-500"];						
					$('<img />').attr('src',curImage)
				},
				
				//
				
				addImage: function() {
					if (thumblr.imageIndex >= thumblr.tumblrData.posts.length) {
						clearTimeout (thumblr.interval);
						return -1;
					}
				
					var curUrl = thumblr.tumblrData.posts[thumblr.imageIndex]["url"];
					var curImage = thumblr.tumblrData.posts[thumblr.imageIndex]["photo-url-500"];
					var curWidth = thumblr.tumblrData.posts[thumblr.imageIndex]["width"];
					var curHeight = thumblr.tumblrData.posts[thumblr.imageIndex]["height"];
					var curSlug =  thumblr.tumblrData.posts[thumblr.imageIndex]["slug"];
					
					curHeight = (curHeight / curWidth) * 500 * .75;
					curWidth = 500 * .75;
									
					photo = $('<img>', { 
						src : curImage, 
						width : curWidth, 
						height : curHeight, 
						alt : curSlug, 
						title : curSlug,
						class: "photo animated",
						'data-url': curUrl
					});				
					
					$(photo).css('left', (Math.random() * window.innerWidth) - (curWidth / 2));
					$(photo).css('top', (Math.random() * window.innerHeight) - (curHeight / 2));
					$(photo).css('zIndex', thumblr.maxZIndex);
					$(photo).toggleClass("appear");
					
					$(photo).mousedown(function () {
						$(this).css('zIndex', ++thumblr.maxZIndex);
					});		
					
					$(photo).dblclick(function () {
						window.open($(this).attr('data-url'));
					});
					
					$('#stage').append(photo);
					$(photo).draggable({ containment: 'parent' });

					thumblr.imageIndex++;
					thumblr.preloadImage();
				},
			
			};			