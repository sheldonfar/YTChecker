$(document).ready(function () {
	xhr = new XMLHttpRequest();
	xhr.open("GET", "http://www.youtube.com/user/ecroFeGushKa/videos/", true);
	xhr.send(null);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) 
		{
			if (xhr.responseText) 
			{
				var data = xhr.responseText;

				var last_video = $('.yt-lockup-video:first', data).children('.yt-lockup-content');

				var title = last_video.children('.yt-lockup-title').children('a').html();
				var date = last_video.children('.yt-lockup-meta').children('ul').children('li:last').html();
				date = $.trim(date) + '.';

				var href = $('a.yt-fluid-thumb-link:first', data).attr('href');

				var content = '<ul><li><b>Название видео:</b> ' + title + '</li><li>Добавлено <b>' + date + '</b></li><li><a href="http://youtube.com' + href + '" target="_blank">Ссылка на видео</a></li></ul>';
			  	$('#wrapper').html(content);
			}
		}
	}
});