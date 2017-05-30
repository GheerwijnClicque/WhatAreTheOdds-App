<?php
  class MyDB extends SQLite3
   {
      function __construct()
      {
         $this->open('odds_database.db');
      }
   }

   $db = new MyDB();

   if(!$db){
      echo $db->lastErrorMsg();
   } else {
      echo "Opened database successfully\n";
   }

    $usersTable = 'CREATE TABLE USERS (user_id INTEGER PRIMARY KEY, facebook_id INT NOT NULL, name TEXT NOT NULL)';
    $uTable = $db->exec($usersTable);
    if(!$uTable) {
     echo $db->lastErrorMsg();
    }
    else {
     echo "Table created successfully\n";
    }

    $challengesTable = 'CREATE TABLE CHALLENGES (challenge_id INTEGER PRIMARY KEY, challenger_id INT NOT NULL, challengee_id INT NOT NULL, challenge TEXT NOT NULL, range INT, challenger_guess INT, challengee_guess INT, accepted NUMERIC NOT NULL, FOREIGN KEY(challenger_id) REFERENCES USERS(facebook_id), FOREIGN KEY(challengee_id) REFERENCES USERS(facebook_id))';
    $cTable = $db->exec($challengesTable);
    if(!$cTable) {
        echo $db->lastErrorMsg();
    }
    else {
        echo "Table created successfully\n";
    }

    // FOR DEV PURPOSES ONLY? or not
    $challengesTable = 'CREATE TABLE FRIENDS (friendship_id INTEGER PRIMARY KEY, user_id INT NOT NULL, friend_id INT NOT NULL, accepted NUMERIC, FOREIGN KEY(user_id) REFERENCES USERS(facebook_id), FOREIGN KEY(friend_id) REFERENCES USERS(facebook_id))';
    $cTable = $db->exec($challengesTable);
    if(!$cTable) {
        echo $db->lastErrorMsg();
    }
    else {
        echo "Table created successfully\n";
    }

    // NOT COMPLETE
