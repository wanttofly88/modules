define(function() {
	var vkAppId;
	var fbAppId;

	// <div class="social-container"  data-vk-app-id="4864536" data-fb-app-id="264001140452773>
	//	<div class="vk-like" data-url="#" id="vk_like-1"></div>
	//	<div class="fb-like" data-href="http://digital-raid.ru/" data-layout="button_count" data-action="like" data-show-faces="false" data-share="false"></div>
	//	<a href="https://twitter.com/share" class="twitter-share-button" data-url="http://digital-raid.ru/" data-lang="ru">Твитнуть</a>
	// </div>


	function vk() {
		var btns = document.querySelectorAll('.vk-like');
		var _add = function(btn) {
			var id = btn.id;
			var url = btn.getAttribute('data-url');

			if (!url) {
				console.warn('data-url attribute is missing');
				return;
			}

			if (!id) return;

			VK.Widgets.Like(id, {
				type: "mini", 
				height: 20,
				pageUrl: url
			});
		}

		if (typeof VK === 'undefined') {
			console.warn('VK was not initialized');
			return;
		}

		VK.init({apiId: vkAppId, onlyWidgets: true});
		for (var i = btns.length - 1; i >= 0; i--) {
			_add(btns[i]);
		}

	}

	function fb() {
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = "http://connect.facebook.net/ru_RU/sdk.js#xfbml=1&appId="+fbAppId+"&version=v2.0";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	}

	function tw() {
		!function(d,s,id){
			var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
			if(!d.getElementById(id)){
				js=d.createElement(s);js.id=id;
				js.src=p+'://platform.twitter.com/widgets.js';
				fjs.parentNode.insertBefore(js,fjs);
			}}(document, 'script', 'twitter-wjs');
	}

	var init = function() {
		var container = document.querySelector('.social-container');
		if (!container) return;
		vkAppId = container.getAttribute('data-vk-app-id');
		if (!vkAppId) return;
		vkAppId = parseInt(vkAppId);
		fbAppId = container.getAttribute('data-fb-app-id');
		if (!fbAppId) return;
		fbAppId = parseInt(fbAppId);

		vk();
		fb();
		tw();
	}

	return {
		init: init
	}
});