<!DOCTYPE HTML>
<html>
	<head>

	</head>
	<body>
	Album Statistics:
		<?php

		// max execution time: 5 minutes
		ini_set('max_execution_time', 300);

		$baseUrl = "https://graph.facebook.com/";
		$myId = "1378942911";
		$token = "CAACEdEose0cBABgcqJCevGrNZAqy6ucBpwFFAuRs08ZCjBEXk1Ulcn7pzTWCaZARJfVV7u3qlDKPXK25XiqZB7lNlv5LkwSwPCi8TpG8pdXKJB25K7YuN4GeR9Jrixbum71obppQzYcah1Sby5svdwpcUCR6qxsNXib7pfPMDQZDZD";
		$auth = "&access_token=".$token;
		$url = "https://graph.facebook.com/1378942911?fields=id,address,education,gender,age_range,photos&access_token=" . $token;
	   


		function insert(){
			$mysqli = new mysqli("localhost", "root", "", "fb_user_data");

			/* check connection */
			if ($mysqli -> connect_errno) {
				printf("Connect failed: %s\n", $mysqli -> connect_error);
				exit();
			}

			$mysqli -> query("INSERT INTO `users`(`fbid`, `gender`, `age`, `country`, `likes`) VALUES (00002,'m',15,'New Zealand',5000)");
			

			$mysqli -> close();
		}

		// id: user id
		// ret -> JSON of album data
		function getAlbums($id){
			global $baseUrl, $auth;
			$url = $baseUrl.$id."?fields=albums".$auth;
			$as = json_decode(file_get_contents($url),true);
		
			return $as["albums"]["data"];
			
		}

		// albums: list of albums
		function getAlbumByName($id, $name){
			$albums = getAlbums($id);
			foreach($albums as $a){
				if($a["name"] == $name){
					
					return $a;
				}
			}
		}

		// a: album id
		function getPhotosInAlbum($a){
			global $baseUrl, $auth;
			$url = $baseUrl.$a."?fields=photos".$auth;
			return json_decode(file_get_contents($url),true).photos;	
		}

		// a: album id
		function getNumberPicsInAlbum($a){
			return $a["count"];			
		}

		function getMorePics($url){
			global $baseUrl, $auth;
			return ( json_decode(file_get_contents($url),true));	
		}

		
		// a: album id
		function getSumLikesOfAlbum($a){
			$photos = getPhotosInAlbum($a);
			
			return getSumLikesOfAlbumHelper(0,$photos);
		}

		function getSumLikesOfAlbumHelper($v,$photos){
			$ps = $photos["data"];
			foreach($ps as $p){
		
				//print_r($p);
				if(gettype($p)=="string"){
					continue;
	
				}elseif(array_key_exists("likes", $p)){

					$likes = count($p["likes"]["data"]);
		
					$v += $likes;
			
			
				}
			}
	
			if(array_key_exists("paging", $photos) && array_key_exists("next", $photos["paging"])){
				$v = getSumLikesOfAlbumHelper($v,getMorePics($photos["paging"]["next"]));
			}
			
			return $v;
		}

		// a: album id 
		function getMostLikesOfAlbum($a){
			$ps = getPhotosInAlbum($a)["data"];
			//print_r($ps);
			$maxLikes = 0;
			foreach($ps as $p){
			

				if(gettype($p)=="string"){
					continue;
					//print_r($p);

				}elseif(array_key_exists("likes", $p)){
					//print_r($p);
					$likes = count($p["likes"]["data"]);
				
					if($likes > $maxLikes){
						$maxLikes = $likes;
			
				}
				}
			}

			return $maxLikes;
		
		}

		// id: user id
		function getMostLikedProfilePic($id){

			$profAlbum = getAlbumByName($id, "Profile Pictures");
			$likes = getMostLikesOfAlbum($profAlbum["id"]);
			return $likes;
		}


		function getGender($id){
			global $baseUrl;
			$url = $baseUrl.$id."?fields=gender";
			$gen = json_decode(file_get_contents($url),true)["gender"];
			return $gen;
		}



		function printFriendList($id, $token){
			global $baseUrl;
			$url = $baseUrl.$id."/friends?access_token=".$token;
			$arr = json_decode(file_get_contents($url),true);
			for($i = 0; $i < 25; $i++){

			$gender = getGender($arr["data"][$i]["id"]);

			if($gender == "male"){
				echo("<span style='color:blue;'>");
				echo($arr["data"][$i]["name"]);
				echo("</span> <br/>");
			}else{
				echo("<span style='color:red;'>");
				echo($arr["data"][$i]["name"]);
				echo("</span> <br/>");
			}
			
}
			
		}

		function nl(){
			echo(" <br/> ");
		}

		 //echo($url);
	   // $url = "https://graph.facebook.com/1378942911?fields=id,address,education,gender,age_range,photos&access_token=CAACEdEose0cBAE3nNZCsBF1DrhUCHThZCYPSHiOI3koVITGIJMNxCwqmPynGOe1bJHbjSVpp7azfMSAiYrp5FZA8TIIGmmZC2K71QOK1isbwwwt3ssx7rubjKICcipmTWy73VGmNyjGRD9qepO9rfziG9EHORfaoXJcKSv05JwZDZD";
	    //$data = file_get_contents($url);
	    
	    //printFriendList($myId,$token);
	   //$album_name = "Portraits ('12 - '13)";
	   //$album = getAlbumByName($myId,$album_name);

	   $as = getAlbums($myId);

	   foreach($as as $album){

	   	$album_name = $album["name"];

	   echo("Stats for Album \"".$album_name."\":"); nl();
	  
	   $numPics = getNumberPicsInAlbum($album);
	    echo(" Number of Pictures: ".$numPics); nl();

	     $mostLikes = getMostLikesOfAlbum($album["id"]);
	   echo("Most Liked: ".$mostLikes); nl();

	   $totalLikes = getSumLikesOfAlbum($album["id"]);
	   echo("Total Likes: ".$totalLikes); nl();
	 
	  $average = (float) $totalLikes/(float) $numPics;
	  echo("Average: ".$average);
	  nl(); nl();
	}
		?>

	</body>
</html>

