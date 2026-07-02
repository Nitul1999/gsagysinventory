CREATE DATABASE  IF NOT EXISTS `sologuridata` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sologuridata`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: sologuridata
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `booked_details`
--

DROP TABLE IF EXISTS `booked_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booked_details` (
  `booking_id` varchar(50) NOT NULL,
  `user_phone` varchar(10) NOT NULL,
  `item_id` varchar(10) NOT NULL,
  `item_quantity` int NOT NULL,
  `booked_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `return_date` date DEFAULT NULL,
  `status` enum('booked','returned','cancelled') DEFAULT 'booked',
  `reason` text,
  `verify` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`booking_id`),
  KEY `fk_user` (`user_phone`),
  KEY `fk_item` (`item_id`),
  CONSTRAINT `fk_item` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user` FOREIGN KEY (`user_phone`) REFERENCES `users` (`phone`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `booked_details_chk_1` CHECK ((`item_quantity` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booked_details`
--

LOCK TABLES `booked_details` WRITE;
/*!40000 ALTER TABLE `booked_details` DISABLE KEYS */;
INSERT INTO `booked_details` VALUES ('bookingagsitem1','9876543211','agitem001',2,'2025-11-13 08:38:32','2025-11-14','returned','personal work',1),('bookingagsitem10','9876543211','agitem001',4,'2025-11-15 16:56:49','2025-11-29','returned','biya',1),('bookingagsitem11','9876543211','agitem001',1,'2025-11-15 16:56:49','2025-11-27','returned','biya',1),('bookingagsitem12','9876543211','agitem001',1,'2025-11-15 16:56:49','2025-11-28','returned','biya',1),('bookingagsitem13','9876543211','agitem001',4,'2025-11-15 16:56:49',NULL,'cancelled','biya',1),('bookingagsitem14','9876543211','agitem004',2,'2025-11-28 07:07:39',NULL,'booked','dd',1),('bookingagsitem15','9876543211','agitem003',1,'2025-11-28 07:07:39',NULL,'booked','dd',1),('bookingagsitem16','9876543211','agitem004',10,'2025-12-15 06:45:33',NULL,'booked','ll',1),('bookingagsitem17','8133820227','agitem001',1,'2026-07-02 09:37:45',NULL,'booked','dfs',1),('bookingagsitem18','8133820227','agitem005',1,'2026-07-02 09:37:45',NULL,'booked','dfs',1),('bookingagsitem2','9876543211','agitem001',1,'2025-11-13 08:45:59','2025-11-29','returned','poo',1),('bookingagsitem3','9876543211','agitem001',33,'2025-11-13 08:45:59','2025-11-15','returned','uyt',1),('bookingagsitem4','9876543211','agitem001',1,'2025-11-13 08:45:59','2025-11-15','returned','hgfhgf',1),('bookingagsitem5','9876543211','agitem001',2,'2025-11-14 09:46:45','2025-11-19','returned','asvdj',1),('bookingagsitem6','9876543211','agitem001',4,'2025-11-14 09:46:45','2025-11-29','returned','rddytfhgvnbvnbvnyfjh',1),('bookingagsitem7','9876543211','agitem001',33,'2025-11-15 16:56:49',NULL,'cancelled','biya',1),('bookingagsitem8','9876543211','agitem001',12,'2025-11-15 16:56:49',NULL,'cancelled','biya',1),('bookingagsitem9','9876543211','agitem001',34,'2025-11-15 16:56:49',NULL,'cancelled','biya',1);
/*!40000 ALTER TABLE `booked_details` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_booking_insert` BEFORE INSERT ON `booked_details` FOR EACH ROW BEGIN
    DECLARE next_number INT;
    DECLARE formatted_id VARCHAR(50);

    
    INSERT INTO booking_sequence VALUES (NULL);
    SET next_number = LAST_INSERT_ID();

    
    SET formatted_id = CONCAT('bookingagsitem', next_number);
    SET NEW.booking_id = formatted_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `booking_sequence`
--

DROP TABLE IF EXISTS `booking_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_sequence` (
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_sequence`
--

LOCK TABLES `booking_sequence` WRITE;
/*!40000 ALTER TABLE `booking_sequence` DISABLE KEYS */;
INSERT INTO `booking_sequence` VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15),(16),(17),(18);
/*!40000 ALTER TABLE `booking_sequence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_sequence`
--

DROP TABLE IF EXISTS `item_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_sequence` (
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_sequence`
--

LOCK TABLES `item_sequence` WRITE;
/*!40000 ALTER TABLE `item_sequence` DISABLE KEYS */;
INSERT INTO `item_sequence` VALUES (1),(2),(3),(4),(5);
/*!40000 ALTER TABLE `item_sequence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `item_id` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `total_quantity` int NOT NULL,
  `available_quantity` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `color` varchar(50) DEFAULT NULL,
  `item_condition` varchar(255) DEFAULT 'good',
  `item_price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  CONSTRAINT `chk_quantity` CHECK (((`available_quantity` >= 0) and (`available_quantity` <= `total_quantity`))),
  CONSTRAINT `items_chk_1` CHECK ((`item_price` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES ('agitem001','Juggg','etttfgdfg',43,43,'2025-11-04 10:39:42','red, blue and green','good usefull condition',210.40),('agitem003','mug','we',10,10,'2025-11-27 09:56:12','blue,black,yellow','good',70.00),('agitem004','cup','sdf',120,100,'2025-11-27 10:00:58','white','good',40.00),('agitem005','hh','sdfs',10,10,'2025-11-27 10:02:31','trgt','good',300.00);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_item_insert` BEFORE INSERT ON `items` FOR EACH ROW BEGIN
    DECLARE next_number INT;
    DECLARE next_id VARCHAR(10);

    INSERT INTO item_sequence VALUES (NULL);
    SET next_number = LAST_INSERT_ID();

    SET next_id = CONCAT('agitem', LPAD(next_number, 3, '0'));
    SET NEW.item_id = next_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `notice`
--

DROP TABLE IF EXISTS `notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notice` (
  `notice_id` varchar(15) NOT NULL,
  `notice_text` text NOT NULL,
  `forpdf_remark` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notice`
--

LOCK TABLES `notice` WRITE;
/*!40000 ALTER TABLE `notice` DISABLE KEYS */;
/*!40000 ALTER TABLE `notice` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_notice_insert` BEFORE INSERT ON `notice` FOR EACH ROW BEGIN
    DECLARE next_number INT;
    DECLARE formatted_id VARCHAR(20);

    
    INSERT INTO notice_sequence VALUES (NULL);
    SET next_number = LAST_INSERT_ID();

    
    SET formatted_id = CONCAT('agsnotice', next_number);

    SET NEW.notice_id = formatted_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `notice_sequence`
--

DROP TABLE IF EXISTS `notice_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notice_sequence` (
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notice_sequence`
--

LOCK TABLES `notice_sequence` WRITE;
/*!40000 ALTER TABLE `notice_sequence` DISABLE KEYS */;
/*!40000 ALTER TABLE `notice_sequence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `name` varchar(100) NOT NULL,
  `father_name` varchar(100) DEFAULT NULL,
  `phone` varchar(10) NOT NULL,
  `email` varchar(150) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `designation` varchar(255) DEFAULT 'member',
  PRIMARY KEY (`phone`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `chk_phone_length` CHECK (((char_length(`phone`) = 10) and regexp_like(`phone`,_utf8mb4'^[0-9]+$')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('abc','cdef','1234567898','abc@gmail.com','user','12345678','2025-11-15 15:01:35','president'),('GSAGYS Inventory Managment System','Sologuri Agragam Yuvai Sangha','8133820226','nitulsonowal@gmail.com','admin','$2b$10$AP8gg/etfhwqA0x7g5LCdew7ubsmKKwZfznQIbVwplr4d7wmepv7O','2025-11-04 10:56:43','member'),('Nitul sonowal','oo','8133820227','nitulsonowal8133@gmail.com','user','$2b$10$kGZIm4RWK01WRRXpYDXHS.XNY6egZCUMqcFWtYgmWJNtec/CzvKga','2025-11-07 08:40:00','secretary'),('abcd','abceddddd','9876543211','abcd@gmail.com','user','$2b$10$.reBnKu/qIedQ7gTTq8KP.l/0WlapmmgI/QfjgYG7LAHFvCjTmXWe','2025-11-07 06:07:16','advisor');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'sologuridata'
--

--
-- Dumping routines for database 'sologuridata'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-02 15:22:49
