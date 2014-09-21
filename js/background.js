checkForNewVideos(); // Function that checks if there are any new videos in your subscription center
setInterval(checkForNewVideos, "300000"); // Every 5 minutes

chrome.browserAction.onClicked.addListener(function () {
	checkForNewVideos();
});

function checkForNewVideos() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://www.youtube.com/feed/subscriptions", true); // Creating Cross-Domain request to YouTube
	xhr.send(null); // Dont sending anything, just getting info
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) // When transaction is complete
		{	
			if (xhr.responseText) // Getting html response from YouTube
			{
				$('div#wrapper').html(""); // Cleaning wrapper from previous check
			
				chrome.browserAction.setIcon({ path: "../images/youtube16.png" }); // Setting the icon on icon-desk
				chrome.browserAction.setBadgeText({ text: "" });  // Clearing badge text
				chrome.browserAction.setBadgeBackgroundColor({ color: "#ff0000" }); // Color of the text on badge
				
				var data = xhr.responseText; // Copying responseText to a variable
				var feed_item = $('#browse-items-primary', data);
				var num_videos = feed_item.children('.feed-item-container').size(); // Getting the amount of videos on page
				var viewed_videos =  $('.feed-item-container .watched-badge', data).size(); // Getting the amount of WATCHED videos
				var new_videos = num_videos - viewed_videos; // Very hard math skills to calculate amount of unwatched videos
				
				/* Now we will get all the info from unwatched videos */
				$('.feed-item-container', data).each(function(){
					if($('.watched-badge', this).length) return true; // If video is watched we don't need it!
					var author = $(this).find('.branded-page-module-title-text').html(); // Author of the video
					var video_title = $(this).find('a.yt-uix-tile-link').attr('title');
					var time = $(this).find('ul.yt-lockup-meta-info li:eq(1)').html(); // Time when it was added to YT
					var view_count = $(this).find('ul.yt-lockup-meta-info li:eq(2)').html(); // Number of views by this moment
					var thumbnail_image = $(this).find('span.yt-thumb-default img').attr("data-thumb"); // Thumbnail of the video
					var link_to_video = $(this).find('a.yt-uix-tile-link').attr('href'); // URL link to the video
					/* COLLECT THEM ALL into wrapper*/
					$('div#wrapper').append('<div class="video-box"><a href="http://www.youtube.com' + link_to_video + '" target="_blank"><img src="https:' + thumbnail_image + '" hspace="10"></a><a href="http://www.youtube.com' + link_to_video + '" target="_blank">' + video_title + '</a></br><b>Author:</b>' + author + '</br><b>Time added: </b>' + time + '</br><b>View count: </b>' + view_count + '</br></div>');
				});
				/* If there are unwatched videos in feed */
				if (new_videos != 0) {
					$('div#wrapper').removeClass("no-video"); //Removing no-video class
					$('div#wrapper').addClass("has-video"); // Adding has-video class
					chrome.browserAction.setBadgeText({ text: new_videos.toString() }); // Setting badge text as amount of unwatched videos
				}
				/* If there are no unwatched videos in feed */
				else {
					$('div#wrapper').removeClass("has-video"); //Removing has-video class
					$('div#wrapper').addClass("no-video").html("No unwatched videos, mate :("); 
					// Adding no-video class and a very sympathetic user-friendly message
				}
			}
			/* If we have no response from YT servers or smth went wrong (OOOOPS) */
			else {
				chrome.browserAction.setIcon({ path: "../images/lock-icon.png" }); // Changing icon to a lock-icon
				chrome.browserAction.setBadgeText({ text: "?" }); // Setting text like "WTF?"
				chrome.browserAction.setBadgeBackgroundColor({ color: "#ccc" }); // Changing color to smth very sad & depressive
			}
		}
	}
}