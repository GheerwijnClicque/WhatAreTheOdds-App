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


   // create tables
   // $filmsTable = 'CREATE TABLE FILMS (id INTEGER PRIMARY KEY, film_name TEXT NOT NULL, iso INTEGER NOT NULL, manufacturer TEXT NOT NULL)';
   // $ctable = $db->exec($filmsTable);
   // if(!$ctable) {
   //   echo $db->lastErrorMsg();
   // }
   // else {
   //   echo "Table created successfully\n";
   // }

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


/* $stepsTable = 'CREATE TABLE STEPS (step_id INTEGER PRIMARY KEY, process_id INT NOT NULL, step_name TEXT NOT NULL, step_time INT NOT NULL, temp INT NOT NULL, interval INT NOT NULL, chemical TEXT NOT NULL, dilution TEXT, FOREIGN KEY(process_id) REFERENCES PROCESSES(processid))';
 $stable = $db->exec($stepsTable);
 if(!$stable) {
   echo $db->lastErrorMsg();
 }
 else {
   echo "Table created successfully\n";
 }

 $userTable = 'CREATE TABLE USERS (user_id INTEGER PRIMARY KEY, username TEXT NOT NULL, password TEXT NOT NULL, email TEXT NOT NULL)';
 $utable = $db->exec($userTable);
 if(!$utable) {
   echo $db->lastErrorMsg();
 }
 else {
   echo "Table created successfully\n";
 }

 // $favoTable = 'CREATE TABLE FAVORITES (favorite_id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, process_id INTEGER NOT NULL, FOREIGN KEY(process_id) REFERENCES PROCESSES(processid), FOREIGN KEY(user_id) REFERENCES USERS(user_id))';
 // $ftable = $db->exec($favoTable);
 // if(!$ftable) {
 //   echo $db->lastErrorMsg();
 // }
 // else {
 //   echo "Table created successfully\n";
 // }

// SELECT film_name as filmname, iso, manufacturer, processid, process_name as processname, step_id, step_name as step, step_time as time, temp, interval, chemical, dilution FROM FILMS INNER JOIN PROCESSES ON id = film_id INNER JOIN STEPS ON process_id = process_id where film_id = 1
*/

  ?>
