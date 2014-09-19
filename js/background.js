checkForNewVideos();
setInterval(checkForNewVideos, "100000");

chrome.browserAction.onClicked.addListener(function () {
	checkForNewVideos();
});

function checkForNewVideos() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://www.youtube.com/feed/subscriptions", true);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) 
		{	
			if (xhr.responseText) 
			{
				chrome.browserAction.setIcon({ path: "../images/icon.png" });
				chrome.browserAction.setBadgeText({ text: "" });
				chrome.browserAction.setBadgeBackgroundColor({ color: "#ff0000" });

				var data = xhr.responseText;
				var feed_item = $('#browse-items-primary', data);
				var num_videos = feed_item.children('.feed-item-container').size();
				var viewed_videos =  $('.feed-item-container .watched-badge', data).size();
				var new_videos = num_videos - viewed_videos;
				
				$('.feed-item-container', data).each(function(){
					if($('.watched-badge', this).length) return true;
					var author = $(this).find('.branded-page-module-title-text').html();
					var time = $(this).find('ul.yt-lockup-meta-info li:eq(1)').html();
					var view_count = $(this).find('ul.yt-lockup-meta-info li:eq(2)').html();
					var thumbnail_image = $(this).find('span.yt-thumb-default img').attr("data-thumb");
					$('div#wrapper').append('<div class="video-box"><img src="https:' + thumbnail_image + '" hspace="10"></br><b>Author:</b>' + author + '</br><b>Time added: </b>' + time + '</br><b>View count: </b>' + view_count + '</br></div>');
				});
				if (new_videos != 0)
					chrome.browserAction.setBadgeText({ text: new_videos.toString() });
			}
			else {
				chrome.browserAction.setIcon({ path: "../images/lock-icon.png" });
				chrome.browserAction.setBadgeText({ text: "?" });
				chrome.browserAction.setBadgeBackgroundColor({ color: "#ccc" });
			}
		}
	}
}