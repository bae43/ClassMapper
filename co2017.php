<!DOCTYPE HTML>
<html>
	<head>

	</head>
	<body>
	
		<?php
		ini_set('max_execution_time', 3500);

		$baseUrl = "https://graph.facebook.com/";
		$mysqli = new mysqli("localhost", "root", "", "co2017");
		function insert($mysqli, $id, $name){
			

			/* check connection */
			if ($mysqli -> connect_errno) {
				printf("Connect failed: %s\n", $mysqli -> connect_error);
				exit();
			}
			$q = "INSERT INTO `members`(`id`, `name`) VALUES ('".$id."','".$name."')";
	

			$mysqli -> query($q);
			

			
		}


		function getMembers($group_id){
			global $baseUrl, $auth;
			$url = $baseUrl.$group_id."?fields=members".$auth;
			$mems = json_decode(file_get_contents($url),true)["members"]["data"];
			return $mems;
		}

		function getLocationOfMember($id){
			
		}


		$myId = "1378942911";
		$token = "CAACEdEose0cBABoXqTF0K7ZCwJeIoQyzTOi35VYsFxWEeJzc2YpSaTTyZBUWDrmM875Sb1iZBqVIh68kzu1gFuyeZCTvTIJTmqujm0sUZCRrgRLFzZA4fIFWkd04CdQjNrSQOPqj6Ljvgwtz09LkJYtd6OkDjp11Tw15vUqBVltQZDZD";
		$auth = "&access_token=".$token;
		$url = "https://graph.facebook.com/1378942911?fields=id,address,education,gender,age_range,photos&access_token=" . $token;
	    //echo($url);
	   // $url = "https://graph.facebook.com/1378942911?fields=id,address,education,gender,age_range,photos&access_token=CAACEdEose0cBAE3nNZCsBF1DrhUCHThZCYPSHiOI3koVITGIJMNxCwqmPynGOe1bJHbjSVpp7azfMSAiYrp5FZA8TIIGmmZC2K71QOK1isbwwwt3ssx7rubjKICcipmTWy73VGmNyjGRD9qepO9rfziG9EHORfaoXJcKSv05JwZDZD";
	    //$data = file_get_contents($url);
	    
	    //getFriendList($myId,$token);
		$mems = getMembers("110437245792178");
		$keys = array_keys($mems);
		echo(count($keys));

		$myFile = "co2017members.txt";
		$fh = fopen($myFile, 'w') or die("can't open file");
		

		
		foreach($keys as $key){
			$stringData = $mems[$key]["name"]."\n";
			fwrite($fh, $stringData);
		
			//insert($mysqli,$mems[$key]["id"], $mems[$key]["name"]);

		}

		fclose($fh);
		$mysqli -> close();
		?>

	</body>
</html>

