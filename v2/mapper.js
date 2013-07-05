Function.prototype.bind = function(scope) {
        var _function = this;
        return function() {
                return _function.apply(scope, arguments);
        }
}

		ui = function() {
			this.accessToken = "";
		}
		ui.prototype = {
			updateFBLoginStatus : function(status) {
				alert(status);
			},
			fb_change_login : function() {

				var fbLoggedIn = ($('#fb_button span').text() === 'Log Out');
				if (fbLoggedIn) {
					FB.logout( function(response) {
						this.updateFBLoginStatus('not_logged_in');

					alert("logging out");

					}.bind(this));
				} else {
					FB.login( function(response) {
						if (response.authResponse) {
							this.accessToken = response.authResponse.accessToken;

							this.updateFBLoginStatus('connected');
						
alert("logging in");

						}
					}.bind(this), {
						scope : 'user_about_me,user_photos,friends_photos'
					});
				}
			}
		}

		FB.getLoginStatus(function(response) {
			var fbLoginStatus = 'not_logged_in';
			if (response.status === 'connected') {
				fbLoginStatus = 'connected';
			} else if (response.status === 'not_authorized') {
				fbLoginStatus = 'not_authorized';
			} else {
				fbLoginStatus = 'not_logged_in';
			}

			ui.updateFBLoginStatus(fbLoginStatus);
			if (response.authResponse) {
				ui.accessToken = response.authResponse.accessToken;
				if (response.status == 'connected') {
					ui.populateFriendList();
				}
			}

		});
		
		ui.fb_change_login();