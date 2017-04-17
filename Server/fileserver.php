<?php
header('Access-Control-Allow-Origin: *');
$target_path = "uploads/";

$target_path = $target_path . basename( $_FILES['file']['name']);

if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
    echo "Upload and move success";

    imagejpeg('uploads/8.jpeg', 'testing.jpeg', 75);
} else{
    echo $target_path;
    echo "There was an error uploading the file, please try again!";
}
?>