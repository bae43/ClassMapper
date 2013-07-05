<!DOCTYPE HTML>
<html>
	<head>

	</head>
	<body>
	
		<?php
		ini_set('max_execution_time', 3500);

		$myId = "1378942911";
		$userId = "li.simon";

		$baseUrl = "https://graph.facebook.com/";

		$token = "CAACEdEose0cBAPTuatnfwq8iy04x0jFwoS5XdHY7KvGl3BI4DUZAKk7UqaZCpWg6hdZAZBw1OMu6ZAxRuzbVNWYZBLutzdQyM8nZBpQuzUnQDYEa69OcBLbRb1AOLLyuog4TA2FG5d5ITktZAw41716UjsAfy2VBZAnbFLDe9iVfa6QZDZD";
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
	
			$data = json_decode(file_get_contents($url),true)["results"][0]["geometry"]["location"];
			$data["name"] = $loc;
			return $data;
		}

		function getStaticMap($data){
	
			return str_replace(" ","+","http://maps.googleapis.com/maps/api/staticmap?center=".$data["name"]."&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7Ccolor:red%7Clabel:%7C".$data["lat"].",".$data["lng"]."&sensor=false");
			
		}




		$loc = getLocOfUser($userId);
		$locData = getLatLongOfLoc($loc);
		$mapUrl = getStaticMap($locData);

		echo "<img src=".$mapUrl.">";

		?>

	</body>
</html>

