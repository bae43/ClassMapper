<!DOCTYPE HTML>
<html>
	<head>

	</head>

	<body>

		<script>
  // Additional JS functions here
  window.fbAsyncInit = function() {
    FB.init({
      appId      : 'YOUR_APP_ID', // App ID
      channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });

    // Additional init code here

  };

  // Load the SDK asynchronously
  (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
   }(document));
</script>

<script>
  window.fbAsyncInit = function() {
  FB.init({
    appId      : 'YOUR_APP_ID', // App ID
    channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });

  // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
  // for any authentication related change, such as login, logout or session refresh. This means that
  // whenever someone who was previously logged out tries to log in again, the correct case below 
  // will be handled. 
  FB.Event.subscribe('auth.authResponseChange', function(response) {
    // Here we specify what we do with the response anytime this event occurs. 
    if (response.status === 'connected') {
      // The response object is returned with a status field that lets the app know the current
      // login status of the person. In this case, we're handling the situation where they 
      // have logged in to the app.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // In this case, the person is logged into Facebook, but not into the app, so we call
      // FB.login() to prompt them to do so. 
      // In real-life usage, you wouldn't want to immediately prompt someone to login 
      // like this, for two reasons:
      // (1) JavaScript created popup windows are blocked by most browsers unless they 
      // result from direct interaction from people using the app (such as a mouse click)
      // (2) it is a bad experience to be continually prompted to login upon page load.
      FB.login();
    } else {
      // In this case, the person is not logged into Facebook, so we call the login() 
      // function to prompt them to do so. Note that at this stage there is no indication
      // of whether they are logged into the app. If they aren't then they'll see the Login
      // dialog right after they log in to Facebook. 
      // The same caveats as above apply to the FB.login() call here.
      FB.login();
    }
  });
  };

  // Load the SDK asynchronously
  (function(d){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all.js";
   ref.parentNode.insertBefore(js, ref);
  }(document));

  // Here we run a very simple test of the Graph API after login is successful. 
  // This testAPI() function is only called in those cases. 
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Good to see you, ' + response.name + '.');
    });
  }
</script>

<!--
  Below we include the Login Button social plugin. This button uses the JavaScript SDK to
  present a graphical Login button that triggers the FB.login() function when clicked.

  Learn more about options for the login button plugin:
  /docs/reference/plugins/login/ -->

<fb:login-button show-faces="true" width="200" max-rows="1"></fb:login-button>
	
		<?php
		ini_set('max_execution_time', 1200);

		$myId = "1378942911";

		$baseUrl = "https://graph.facebook.com/";

		$token = "CAACEdEose0cBAF28hQrfOPNfSU4Wk1WMGXUzrDJzMNIZCiv3ZCDRT923FjdYdhYzeYlsKTbkP9ZA61HnYqFZATOvJi8cKhcsx16j9GXQaKZCgfIYy6BauM01ZBNI4Ae35SyBExhAt5Rk1AqXAhWJxAM79ZAbz9v5kZCZCpKCLx9XIjgZDZD";
		$auth = "&access_token=".$token;
		$url = "https://graph.facebook.com/1378942911?fields=id,address,education,gender,age_range,photos&access_token=" . $token;



		function getLocOfUser($id){
			global $baseUrl, $auth;
			$url = $baseUrl.$id."?fields=id,name,address,education,hometown".$auth;
			
			
			$data = json_decode(file_get_contents($url),true);
			$loc = "";
			if(array_key_exists("address", $data)){
				$loc = $data["address"];
			}else if(array_key_exists("education", $data)){
				foreach ($data["education"] as $edu) {
					if($edu["type"] == "High School"){
						$loc = $edu["school"]["name"];
					}
				}
			}

			if($loc == "" && array_key_exists("hometown", $data) ){
				$loc = $data["hometown"]["name"];
			}

			return $loc;

		}

		function getLatLongOfLoc($loc){

			$url = "http://maps.googleapis.com/maps/api/geocode/json?address=".urlencode($loc)."&sensor=false";
	
			$results = json_decode(file_get_contents($url),true)["results"];
      if(array_key_exists(0, $results))
        $data = $results[0]["geometry"]["location"];
      else{
        $data = array("lat" => "0", "lng" => 0);
      }
			$data["name"] = $loc;
			return $data;
		}

		function getStaticMap($data){
	
			return str_replace(" ","+","http://maps.googleapis.com/maps/api/staticmap?center=".$data["name"]."&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7Ccolor:red%7Clabel:%7C".$data["lat"].",".$data["lng"]."&sensor=false");
			
		}

    // ================================

    $baseUrl = "https://graph.facebook.com/";
    $mysqli = new mysqli("localhost", "root", "", "co2017");

    function insert($mysqli, $id, $address, $lat, $lng){

      /* check connection */
      if ($mysqli -> connect_errno) {
        printf("Connect failed: %s\n", $mysqli -> connect_error);
        exit();
      }

      $q = "UPDATE  members SET address='".$address."',lat='".$lat."',lng='".$lng."' WHERE id='".$id."';";
      if($lat != "0"){
        echo $q."<br>";
      } else{
        echo "pass- <br>";
      }
      $mysqli -> query($q);     
    }


    function updateAddresses($mysqli){

      /* check connection */
      if ($mysqli -> connect_errno) {
        printf("Connect failed: %s\n", $mysqli -> connect_error);
        exit();
      }

      $q = "SELECT id FROM  members WHERE 1 LIMIT 1000, 1500;";

      $result = mysqli_query($mysqli,$q);


      while($row = mysqli_fetch_array($result)) {
       
        
        $d = getLocOfUser($row["id"]);
        $data = getLatLongOfLoc($d);
        insert($mysqli, $row["id"], $data["name"], $data["lat"], $data["lng"]);
      }

    }

    updateAddresses($mysqli);

    mysqli_close($mysqli);
		echo "Done";

		?>

	</body>
</html>

