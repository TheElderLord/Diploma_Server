-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: diploma
-- ------------------------------------------------------
-- Server version	5.7.39-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accomodation_favourites`
--

DROP TABLE IF EXISTS `accomodation_favourites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accomodation_favourites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `post_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`),
  KEY `post_id_idx` (`post_id`),
  CONSTRAINT `post_id` FOREIGN KEY (`post_id`) REFERENCES `accomodation_post` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `accomodation_post` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accomodation_favourites`
--

LOCK TABLES `accomodation_favourites` WRITE;
/*!40000 ALTER TABLE `accomodation_favourites` DISABLE KEYS */;
INSERT INTO `accomodation_favourites` VALUES (1,2,3);
/*!40000 ALTER TABLE `accomodation_favourites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accomodation_post`
--

DROP TABLE IF EXISTS `accomodation_post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accomodation_post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `created_date` date DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `location` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `street` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `duration` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `image` longtext CHARACTER SET latin1,
  `coordinates` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `about_home` text CHARACTER SET latin1,
  `about_roommates` longtext COLLATE utf8_unicode_ci,
  `about_renters` longtext COLLATE utf8_unicode_ci,
  `floor` int(11) DEFAULT NULL,
  `square` int(11) DEFAULT NULL,
  `layout` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `room_nums` int(11) DEFAULT NULL,
  `amenteties` longtext CHARACTER SET latin1,
  `age` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `gender` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `accomodation_post_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accomodation_post`
--

LOCK TABLES `accomodation_post` WRITE;
/*!40000 ALTER TABLE `accomodation_post` DISABLE KEYS */;
INSERT INTO `accomodation_post` VALUES (12,1,'2023-04-11',200.00,'Almaty, Dostyk avenue 132',NULL,NULL,'IMG_3061.jpg,IMG_3062.jpg,IMG_3063.jpg,IMG_3064.jpg,IMG_3065.jpg',NULL,'I am looking for roommate of 2nd degree',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,2,'2023-04-11',40.00,'Almaty, Almaly District',NULL,NULL,'IMG_3066.jpg,IMG_3067.jpg,IMG_3068.jpg,IMG_3069.jpg,IMG_3070.jpg',NULL,'Looking for the room to live alone',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,1,'2023-04-04',200.00,'Almaty, Dostyk avenue 132',NULL,NULL,'IMG_3071.jpg,IMG_3072.jpg,IMG_3073.jpg,IMG_3074.jpg,IMG_3075.jpg',NULL,'I am looking for roommate of 2nd degree',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,3,'2023-04-04',210.00,'Almaly, Raiymbek avenue 481',NULL,NULL,'IMG_3076.jpg,IMG_3077.jpg,IMG_3078.jpg,IMG_3079.jpg,IMG_3080.jpg',NULL,'Looking for the roommate, preferably working',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,4,'2023-04-04',150.00,'Almaly, Medeu District',NULL,NULL,'IMG_3081.jpg,IMG_3082.jpg,IMG_3083.jpg,IMG_3084.jpg,IMG_3085.jpg',NULL,'Looking for the cozy, clean, separate bathroom one-room apartment',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,5,'2023-04-04',220.00,'Almaty, Rozybakieva 158',NULL,NULL,'IMG_3086.jpg,IMG_3087.jpg,IMG_3088.jpg,IMG_3089.jpg,IMG_3090.jpg',NULL,'Looking for the freshman rommate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,6,'2023-04-04',50.00,'Almaty, 8 microdistrict',NULL,NULL,'IMG_3091.jpg,IMG_3092.jpg,IMG_3093.jpg,IMG_3094.jpg,IMG_3095.jpg',NULL,'Looking for the spacious, light room',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,7,'2023-04-04',230.00,'Almaty, Gagarina 277/7',NULL,NULL,'IMG_3096.jpg,IMG_3097.jpg,IMG_3098.jpg,IMG_3099.jpg,IMG_3100.jpg',NULL,'Looking for the solvent, clean roommate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(22,1,'2023-04-04',55.00,'Almaty, Turksib District',NULL,NULL,'IMG_3111.jpg,IMG_3112.jpg,IMG_3113.jpg,IMG_3114.jpg,IMG_3115.jpg',NULL,'Looking for the repaired, isolated room',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(23,2,'2023-04-11',300.00,'Almaty, Nurmakova 150',NULL,NULL,'IMG_3106.jpg,IMG_3107.jpg,IMG_3108.jpg,IMG_3109.jpg,IMG_3110.jpg',NULL,'Looking for the sophomore roommate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24,3,'2023-04-11',210.00,'Almaty, Basenova 10',NULL,NULL,NULL,NULL,'I rent 2-room apartment with a new renovation',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(25,4,'2023-04-11',310.00,'Almaly, Tole bi 285',NULL,NULL,NULL,NULL,'Looking for the neat and fair roommate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(26,5,'2023-04-11',220.00,'Almaty, Jetysu District',NULL,NULL,NULL,NULL,'Looking for the 2-room apartment with all conveniences',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(27,6,'2023-04-11',340.00,'Almaty, Makataeva 186',NULL,NULL,NULL,NULL,'Looking for the adequate, quit roommate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(28,1,'2023-04-11',70.00,'Almaty, Auezov District',NULL,NULL,'',NULL,'Looking for the warm, decent room',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(29,2,'2023-04-04',260.00,'Almaty, Timiryazeva — Baitursynova',NULL,NULL,'',NULL,'Looking for the junior roommate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(30,3,'2023-04-04',75.00,'Almaty, Alatau District',NULL,NULL,'',NULL,'Looking for the small and tidy room',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(31,4,'2023-04-04',400.00,'Almaty, Yegizbayeva 7/9',NULL,NULL,'',NULL,'Looking for the non-smokers, non-drinker roommate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(32,5,'2023-04-09',300.00,'Almaty, Microdistrict Aksai-3',NULL,NULL,'',NULL,'Looking for the furnished, sunny three-room apartment',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(33,6,'2023-04-04',410.00,'Almaty, Zhunisova 8/9',NULL,NULL,NULL,NULL,'Looking for the senior roommate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(34,1,'2023-04-09',85.00,'Almaty, Samal-2 Microdistrict',NULL,NULL,NULL,NULL,'Looking for the medium-sized, sunny room',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(35,2,'2023-04-11',420.00,'Almaty, Timiryazeva 59a',NULL,NULL,NULL,NULL,'Looking for the clean and accurate roommate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(36,3,'2023-04-11',150.00,'Almaty, Microdistrict Taugul-2',NULL,NULL,NULL,NULL,'I rent a neat, cosy 1-room apartment with furniture',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(37,4,'2023-04-04',430.00,'Almaty, Momyshuly 25',NULL,NULL,NULL,NULL,'Looking for the non-conflict roommate',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(38,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'sdasdas',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `accomodation_post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET latin1 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Age'),(2,'Gender'),(3,'Price'),(4,'Duration'),(5,'Layout'),(6,'In the home'),(7,'On the property'),(8,'Safety'),(9,'Location');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form`
--

DROP TABLE IF EXISTS `form`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `additional` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  `fullname` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  `work` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  `study` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `description` longtext CHARACTER SET latin1,
  `tags` longtext CHARACTER SET latin1,
  `phonenumber` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  `whatsapp` varchar(25) CHARACTER SET latin1 DEFAULT NULL,
  `telegram` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `instagram` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `image` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `form_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form`
--

LOCK TABLES `form` WRITE;
/*!40000 ALTER TABLE `form` DISABLE KEYS */;
INSERT INTO `form` VALUES (1,6,'Doctor ','Alex Mercer',22,'male','Umbrella','MIT','Professor of biology science','bology,chemistry','+9099812333','link','link','link','doc.jpg');
/*!40000 ALTER TABLE `form` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rommate_favourites`
--

DROP TABLE IF EXISTS `rommate_favourites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rommate_favourites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `post_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `rommate_favourites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `rommate_favourites_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `roommate_post` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rommate_favourites`
--

LOCK TABLES `rommate_favourites` WRITE;
/*!40000 ALTER TABLE `rommate_favourites` DISABLE KEYS */;
INSERT INTO `rommate_favourites` VALUES (1,1,1);
/*!40000 ALTER TABLE `rommate_favourites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roommate_post`
--

DROP TABLE IF EXISTS `roommate_post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roommate_post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_date` date DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `firstname` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lastname` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `about` longtext COLLATE utf8_unicode_ci,
  `work` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lifestyle` longtext COLLATE utf8_unicode_ci,
  `target_date` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `duration` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `max_price` decimal(10,2) DEFAULT NULL,
  `location` varchar(65) CHARACTER SET latin1 DEFAULT NULL,
  `layout` varchar(25) CHARACTER SET latin1 DEFAULT NULL,
  `amentetiies` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `image` longtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `author_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roommate_post`
--

LOCK TABLES `roommate_post` WRITE;
/*!40000 ALTER TABLE `roommate_post` DISABLE KEYS */;
INSERT INTO `roommate_post` VALUES (1,'2023-04-11',1,'Alisher','Ruslan',22,'male','Android developer','Innoforce','reading','march to december','8 month',240000.00,'Abaya Rozibaieva','open','Camera,Wifi','person1.jpg'),(3,'2023-04-12',1,'Zhazira','Serik',34,'female','Senior lecturer','UIB','reading','march to december','8 month',200000.00,'Metro Alatau','closed','Camera,Wifi','person2.jpg'),(16,'2023-04-01',2,'Bogdan','Romanovich',36,'male','Businessman','KASE','workout','august to october','2 months',500000.00,'Al-Farabi Zharkova','open','Wifi','person4.jpg'),(17,'2023-01-14',3,'Alya ','Bektursyn',24,'female','Saleswoman','Bass Technology','discussion','from now till next year','1 year',250000.00,'Medeu district','closed','Wifi, washing machine','person3.jpg'),(18,'2022-12-12',4,'Aidar ','Baibek',30,'male','Builder','BI Group','dombyra','from now till december','7 months',200000.00,'Irgeli','open','Wifi,TV','person5.jpg');
/*!40000 ALTER TABLE `roommate_post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategory`
--

DROP TABLE IF EXISTS `subcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET latin1 NOT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `subcategory_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategory`
--

LOCK TABLES `subcategory` WRITE;
/*!40000 ALTER TABLE `subcategory` DISABLE KEYS */;
INSERT INTO `subcategory` VALUES (1,1,'Early 20s'),(2,1,'Late 20s'),(3,1,'30s'),(4,1,'40s'),(5,2,'Prefer not to say'),(6,2,'Non-binary'),(7,2,'Female'),(8,2,'Male'),(9,4,'Flexible'),(10,4,'Fixed'),(11,4,'12 months'),(12,5,'Entire place'),(13,5,'Private room'),(14,5,'Shared room'),(15,6,'In-unit laundry'),(16,6,'Wifi included'),(17,6,'Utilities included'),(18,9,'Semey'),(19,9,'Taraz'),(20,9,'Shymkent'),(21,9,'Kyzylorda'),(22,9,'Almaty'),(23,9,'Astana');
/*!40000 ALTER TABLE `subcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  `lastname` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  `username` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  `email` varchar(255) CHARACTER SET latin1 NOT NULL,
  `password` varchar(45) CHARACTER SET latin1 NOT NULL,
  `image` longtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Brian','Nickolsoin','ElderLord','dsadas','sdasjd','Not specified'),(2,'Tommy',NULL,NULL,'hhh@gmail.com','safsds',NULL),(3,'dasdas',NULL,NULL,'dasdas','dasdsad',NULL),(4,'undefined',NULL,NULL,'190103138@stu.sdu.edu.kz','a0000000',NULL),(5,'undefined',NULL,NULL,'admin@admin.ru','Rimma2001',NULL),(6,'undefined',NULL,NULL,'190103248@stu.sdu.edu.kz','Rimma2001',NULL),(7,'zhaniya',NULL,NULL,'medeuovazhani@gmail.com','111111111w',NULL),(8,'zhaniya',NULL,NULL,'190103120@stu.sdu.edu.kz','zhaniya01',NULL),(9,NULL,NULL,'EEE','dasda@gnmaiul.com','dasdasd',NULL),(10,NULL,NULL,'EEE','190103@gmail.com','dasdasd',NULL),(11,NULL,NULL,'EEE','1901@gmail.com','dasdasd',NULL),(12,NULL,NULL,'EEE','1901@dgmail.com','dasdasd',NULL),(13,NULL,NULL,'EEE','1901@ddgmail.com','dasdasd',NULL),(14,NULL,NULL,'EEE','1901dasd@ddgmail.com','dasdasd',NULL),(15,NULL,NULL,'EEE','190000@ddgmail.com','dasdasd',NULL),(16,NULL,NULL,'EEE','190000@dddsadmail.com','dasdasd',NULL),(17,NULL,NULL,'EEE','1900d00@dddsadmail.com','dasdasd',NULL),(18,NULL,NULL,'EEE','1900d0ds0@dddsadmail.com','dasdasd',NULL),(19,NULL,NULL,'Rimma','bilimovarim1@mail.ru','Rimma2001',NULL),(20,NULL,NULL,'KKKKD','batmgmail.com','dasd',NULL),(21,NULL,NULL,'KKKKD','batmil.com','dasd',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-14 22:27:05
