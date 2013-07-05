Function.prototype.bind = function(scope) {
	var _function = this;
	return function() {
		return _function.apply(scope, arguments);
	}
}
var mapper = {};

mapper.ui = function() {
	this.accessToken = "";

	$('#fb_button').click( function() {

		console.log("fb clicked");
		this.prototype.fb_change_login();
	}.bind(this));

}

mapper.ui.prototype = {
	updateFBLoginStatus : function(status) {
		alert(status);
	},
	fb_change_login : function() {

		var fbLoggedIn = false;
		if (fbLoggedIn) {
			FB.logout( function(response) {
				//this.updateFBLoginStatus('not_logged_in');

				alert("logging out");

			}.bind(this));
		} else {
			FB.login( function(response) {
				alert("attemping login");
				if (response.authResponse) {
					this.accessToken = response.authResponse.accessToken;

					//	this.updateFBLoginStatus('connected');

					alert("logging in");

				}
			}.bind(this), {
				scope : 'user_about_me,user_photos,friends_photos'
			});
		}
	}
}

