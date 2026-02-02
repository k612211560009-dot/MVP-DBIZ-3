CREATE DATABASE  IF NOT EXISTS `milkbank_dev` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `milkbank_dev`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: milkbank_dev
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `DONATION_VISIT`
--

DROP TABLE IF EXISTS `DONATION_VISIT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DONATION_VISIT` (
  `visit_id` varchar(36) NOT NULL,
  `donor_id` varchar(36) NOT NULL,
  `bank_id` varchar(36) NOT NULL,
  `scheduled_start` timestamp NULL DEFAULT NULL,
  `scheduled_end` timestamp NULL DEFAULT NULL,
  `origin` varchar(255) DEFAULT NULL COMMENT 'system|user|staff',
  `status` varchar(255) NOT NULL DEFAULT 'proposed' COMMENT 'proposed|scheduled|confirmed|skipped|cancelled|completed',
  `health_status` varchar(255) DEFAULT NULL COMMENT 'good|bad|n/a',
  `health_note` text,
  `volume_ml` decimal(10,0) DEFAULT NULL,
  `container_count` int DEFAULT NULL,
  `quality_note` text,
  `points_awarded` int DEFAULT '0',
  `recorded_by` varchar(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`visit_id`),
  KEY `donor_id` (`donor_id`),
  KEY `bank_id` (`bank_id`),
  KEY `recorded_by` (`recorded_by`),
  CONSTRAINT `DONATION_VISIT_ibfk_1` FOREIGN KEY (`donor_id`) REFERENCES `DONOR` (`donor_id`),
  CONSTRAINT `DONATION_VISIT_ibfk_2` FOREIGN KEY (`bank_id`) REFERENCES `MILK_BANK` (`bank_id`),
  CONSTRAINT `DONATION_VISIT_ibfk_3` FOREIGN KEY (`recorded_by`) REFERENCES `USER` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DONATION_VISIT`
--

LOCK TABLES `DONATION_VISIT` WRITE;
/*!40000 ALTER TABLE `DONATION_VISIT` DISABLE KEYS */;
/*!40000 ALTER TABLE `DONATION_VISIT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DONOR`
--

DROP TABLE IF EXISTS `DONOR`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DONOR` (
  `donor_id` varchar(36) NOT NULL COMMENT '1â€“1 with USER (shared PK)',
  `home_bank_id` varchar(36) DEFAULT NULL COMMENT 'current affiliation',
  `donor_status` varchar(255) NOT NULL DEFAULT 'in_progress' COMMENT 'in_progress|active|suspended|removed|rejected|failed_positive|abandoned',
  `screening_status` varchar(255) NOT NULL DEFAULT 'pending' COMMENT 'pending|approved|rejected',
  `director_status` varchar(255) NOT NULL DEFAULT 'pending' COMMENT 'pending|approved|rejected',
  `consent_signed_at` timestamp NULL DEFAULT NULL,
  `consent_method` varchar(255) DEFAULT NULL,
  `weekly_days` int DEFAULT NULL COMMENT 'bitmask 1=Mon,2=Tue,4=Wed,8=Thu,16=Fri,32=Sat,64=Sun',
  `preferred_start` time DEFAULT NULL,
  `preferred_end` time DEFAULT NULL,
  `max_visits_per_week` int DEFAULT '2',
  `points_total` int DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`donor_id`),
  KEY `home_bank_id` (`home_bank_id`),
  CONSTRAINT `DONOR_ibfk_1` FOREIGN KEY (`donor_id`) REFERENCES `USER` (`user_id`),
  CONSTRAINT `DONOR_ibfk_2` FOREIGN KEY (`home_bank_id`) REFERENCES `MILK_BANK` (`bank_id`),
  CONSTRAINT `fk_donor_user` FOREIGN KEY (`donor_id`) REFERENCES `USER` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DONOR`
--

LOCK TABLES `DONOR` WRITE;
/*!40000 ALTER TABLE `DONOR` DISABLE KEYS */;
INSERT INTO `DONOR` VALUES ('283c4c3a-29c7-4d39-a4e6-2ca44e8322a7',NULL,'in_progress','pending','pending',NULL,NULL,NULL,NULL,NULL,2,0,'2025-11-12 19:33:49','2025-11-12 19:33:49'),('37d737d2-6b43-4f39-a4a6-46914fe0b000',NULL,'in_progress','pending','pending',NULL,NULL,NULL,NULL,NULL,2,0,'2025-11-12 00:35:20','2025-11-12 00:35:20'),('70b75d36-3f6d-4bbc-92cd-1865b039ee2e',NULL,'in_progress','pending','pending',NULL,NULL,NULL,NULL,NULL,2,0,'2025-11-11 21:33:12','2025-11-11 21:33:12'),('a54834e5-b2e0-4665-b34d-cd8e71404593',NULL,'in_progress','pending','pending','2025-11-25 18:24:07','online_form',NULL,NULL,NULL,2,0,'2025-11-24 14:05:15','2025-11-25 18:24:07'),('b2bdf00d-d133-46fb-9d8f-2f62d9936fb7',NULL,'in_progress','pending','pending',NULL,NULL,NULL,NULL,NULL,2,0,'2025-11-11 21:37:26','2025-11-11 21:37:26'),('badf24ba-d8fe-4c80-9f65-b29807e0a829',NULL,'in_progress','pending','pending',NULL,NULL,NULL,NULL,NULL,2,0,'2026-02-02 10:01:41','2026-02-02 10:01:41'),('donor-user-001',NULL,'active','approved','approved',NULL,NULL,NULL,NULL,NULL,2,0,'2025-12-27 08:50:59','2025-12-27 08:50:59'),('e79cbb3d-2cd3-4257-be45-2e2a7b33f77b',NULL,'in_progress','pending','pending',NULL,NULL,NULL,NULL,NULL,2,0,'2025-11-12 19:34:06','2025-11-12 19:34:06'),('ea0139f8-bd57-4d6e-9680-4ddd24a7563b',NULL,'in_progress','pending','pending',NULL,NULL,NULL,NULL,NULL,2,0,'2025-11-12 01:11:54','2025-11-12 01:11:54');
/*!40000 ALTER TABLE `DONOR` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EHR_DONOR`
--

DROP TABLE IF EXISTS `EHR_DONOR`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EHR_DONOR` (
  `donor_id` varchar(36) NOT NULL COMMENT '1â€“1 with DONOR (shared PK)',
  `national_id` varchar(255) NOT NULL COMMENT 'copied from USER for audit',
  `full_name` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text,
  `province` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `ward` varchar(100) DEFAULT NULL,
  `source_system` varchar(255) DEFAULT 'national_ehr',
  `last_fetched_at` timestamp NOT NULL DEFAULT (now()),
  `hiv_result` varchar(255) DEFAULT NULL COMMENT 'negative|positive|indeterminate|unknown',
  `hiv_sample_date` date DEFAULT NULL,
  `hiv_valid_until` date DEFAULT NULL,
  `hbv_result` varchar(255) DEFAULT NULL,
  `hbv_sample_date` date DEFAULT NULL,
  `hbv_valid_until` date DEFAULT NULL,
  `hcv_result` varchar(255) DEFAULT NULL,
  `hcv_sample_date` date DEFAULT NULL,
  `hcv_valid_until` date DEFAULT NULL,
  `syphilis_result` varchar(255) DEFAULT NULL,
  `syphilis_sample_date` date DEFAULT NULL,
  `syphilis_valid_until` date DEFAULT NULL,
  `htlv_result` varchar(255) DEFAULT NULL,
  `htlv_sample_date` date DEFAULT NULL,
  `htlv_valid_until` date DEFAULT NULL,
  `is_clear` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'all required tests negative & valid',
  `raw_json` json DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`donor_id`),
  CONSTRAINT `EHR_DONOR_ibfk_1` FOREIGN KEY (`donor_id`) REFERENCES `DONOR` (`donor_id`),
  CONSTRAINT `fk_ehr_donor_donor` FOREIGN KEY (`donor_id`) REFERENCES `DONOR` (`donor_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EHR_DONOR`
--

LOCK TABLES `EHR_DONOR` WRITE;
/*!40000 ALTER TABLE `EHR_DONOR` DISABLE KEYS */;
/*!40000 ALTER TABLE `EHR_DONOR` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MILK_BANK`
--

DROP TABLE IF EXISTS `MILK_BANK`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MILK_BANK` (
  `bank_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `province` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`bank_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MILK_BANK`
--

LOCK TABLES `MILK_BANK` WRITE;
/*!40000 ALTER TABLE `MILK_BANK` DISABLE KEYS */;
/*!40000 ALTER TABLE `MILK_BANK` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER`
--

DROP TABLE IF EXISTS `USER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER` (
  `user_id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email_verified` tinyint(1) DEFAULT '0',
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `national_id` varchar(255) DEFAULT NULL COMMENT 'Citizen ID',
  `role` varchar(255) NOT NULL COMMENT 'donor|medical_staff|director|admin',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()),
  `failed_login_attempts` int DEFAULT '0',
  `account_locked_until` timestamp NULL DEFAULT NULL,
  `last_password_change` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `national_id` (`national_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER`
--

LOCK TABLES `USER` WRITE;
/*!40000 ALTER TABLE `USER` DISABLE KEYS */;
INSERT INTO `USER` VALUES ('0206790a-09fe-43a5-939c-e6f8931d54c0','staff.test@milkbank.com','$2a$10$6zzye7D6dkJuAlxh9acMfO8ORjfnmersbC1.SDcXVw.glgI.nKSxu',0,'Test Staff',NULL,NULL,'medical_staff',1,'2025-11-24 14:03:43','2026-02-02 09:59:29',0,NULL,'2025-11-24 14:03:43','2026-02-02 09:59:29'),('283c4c3a-29c7-4d39-a4e6-2ca44e8322a7','donor.test@example.com','$2a$10$qv9MfjL6aiQWBaudv2LDd.PiY1ExyIB0fs3s9174.HnYsLRIa5Mru',0,'Test Donor',NULL,NULL,'donor',1,'2025-11-12 19:33:49','2025-11-12 19:33:49',0,NULL,'2025-11-12 19:33:49',NULL),('37d737d2-6b43-4f39-a4a6-46914fe0b000','donor888@example.com','$2a$10$SHtNN34ggkrkwTMFonx5J.ScbsfofpkHW9JlCoWCsbcgN1.zbREhK',0,'Test Donor 888',NULL,NULL,'donor',1,'2025-11-12 00:35:20','2025-11-12 00:35:30',0,NULL,'2025-11-12 00:35:20','2025-11-12 00:35:30'),('684b5fad-5a1a-4b25-b47a-edf4cf80b189','staff.admin@milkbank.com','$2a$10$g7r9bHNTdMAtawRL2ORg2OcnpChj8n.ua5/0gZu9Su10c2.le35si',0,'Tran Thi Admin Staff',NULL,NULL,'admin_staff',1,'2025-11-12 01:25:09','2025-11-12 01:25:09',0,NULL,'2025-11-12 01:25:09',NULL),('70b75d36-3f6d-4bbc-92cd-1865b039ee2e','testcham02@gmail.com','$2a$10$3esLgzMu5D.PU/4BXoBYKOOfh95NNKGO4zqYavHrNjkcaDW.Ala.2',0,'Test Cham 02',NULL,NULL,'donor',1,'2025-11-11 21:33:12','2025-11-11 21:33:20',0,NULL,'2025-11-11 21:33:12','2025-11-11 21:33:20'),('9801f7c5-ce1a-4ea1-bed9-24c14bd70393','staff.medical@milkbank.com','$2a$10$M13SLig4AyvHLJhj1lwQf.zKHubFwaj4ljxqpVGanc8R8A6ujyH1y',0,'Nguyen Van Medical Staff',NULL,NULL,'medical_staff',1,'2025-11-12 01:24:56','2025-11-12 19:41:34',0,NULL,'2025-11-12 01:24:56','2025-11-12 19:41:34'),('a54834e5-b2e0-4665-b34d-cd8e71404593','donor.test@milkbank.com','$2a$10$H8NHYBU625fKxSag1lsF5.qaKs3jts/sSm8op16UDPiQmmdxJbqNK',0,'Vi Thuy Cham','0382183813','13151651561','donor',1,'2025-11-24 14:05:15','2026-02-02 09:58:22',0,NULL,'2025-11-24 14:05:15','2026-02-02 09:58:22'),('b2bdf00d-d133-46fb-9d8f-2f62d9936fb7','chamvi04@gmail.com','$2a$10$wfOJC0zTdxuE/.AHC2wHZeQXyrTQIO3RXY3.Xg3oS7X8O0IK81we2',0,'Vi Thuy Cham',NULL,NULL,'donor',1,'2025-11-11 21:37:26','2025-11-12 17:15:55',0,NULL,'2025-11-11 21:37:26','2025-11-12 17:15:55'),('badf24ba-d8fe-4c80-9f65-b29807e0a829','vjcc2026@ftu.edu.vn','$2a$10$HmElJlS9DRK.IY/xeGaYiO6U3/iW50IOGQtIm65hq.yh3/hE9b2Fm',0,'VJCC 61DB',NULL,NULL,'donor',1,'2026-02-02 10:01:41','2026-02-02 10:01:46',0,NULL,'2026-02-02 10:01:41','2026-02-02 10:01:46'),('d44936e2-bf63-11f0-880c-8a20ec0c1ce1','chamcho@milkbank.com','abc12345678ABC',1,'Vi Thuy Lo','0901234567','001234567890','staff',1,'2025-11-12 01:06:33','2025-11-12 01:06:33',0,NULL,'2025-11-12 01:06:33',NULL),('donor-user-001','donor001@example.com','$2a$10$JyeZnhzh85PvAxS44pRyb.1mJFPjJhgXNkn.DG5qT32TcH9xntp5e',1,'Le Thi Huong - Donor','0923456789','002234567890','donor',1,'2025-12-27 08:50:59','2025-12-27 09:55:28',0,NULL,'2025-12-27 08:50:59','2025-12-27 09:55:28'),('e79cbb3d-2cd3-4257-be45-2e2a7b33f77b','newdonor@example.com','$2a$10$J51DR5VgJx78eJxYGj1wI.dk/i.tXkKGDB.36EdxQSRP1YHOULzi6',0,'New Donor Test',NULL,NULL,'donor',1,'2025-11-12 19:34:06','2025-11-12 19:34:06',0,NULL,'2025-11-12 19:34:06',NULL),('ea0139f8-bd57-4d6e-9680-4ddd24a7563b','chamlovuong@milkbank.com','$2a$10$vW5opyPw4fiQrzyeOqoqYeX1PkXjyPTEqJHZ7Me4S9Vsic8.wGOvC',0,'Vi Thuy Lo',NULL,NULL,'donor',1,'2025-11-12 01:11:54','2025-11-12 02:41:35',0,NULL,'2025-11-12 01:11:54','2025-11-12 02:41:35'),('staff-001','staff001@milkbank.com','$2a$10$G38pfkduAS9iC7Y11hkWLuoVGfR0qNGkIDG67V/Hm0WlooLJSNMme',1,'Nguyen Van Minh - Staff','0901234567','011234567890','staff',1,'2025-12-27 08:50:59','2025-12-27 09:16:56',0,NULL,'2025-12-27 08:50:59','2025-12-27 09:16:56');
/*!40000 ALTER TABLE `USER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VISIT_SCHEDULE`
--

DROP TABLE IF EXISTS `VISIT_SCHEDULE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VISIT_SCHEDULE` (
  `visit_id` varchar(36) NOT NULL COMMENT '1â€“1 with DONATION_VISIT (shared PK)',
  `plan_month` varchar(255) NOT NULL COMMENT 'YYYY-MM planning cycle',
  `plan_type` varchar(255) NOT NULL COMMENT 'monthly_day|monthly_nth_weekday|ad_hoc',
  `day_of_month` int DEFAULT NULL COMMENT '1â€“31; use last valid day if month shorter',
  `week_of_month` int DEFAULT NULL COMMENT '1â€“5 (1=first week)',
  `weekday` int DEFAULT NULL COMMENT '1=Mon..7=Sun',
  `window_start` time DEFAULT NULL,
  `window_end` time DEFAULT NULL,
  `proposed_on` timestamp NOT NULL DEFAULT (now()),
  `proposed_by` varchar(36) DEFAULT NULL,
  `reschedule_count` int DEFAULT '0',
  `rule_snapshot` json DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`visit_id`),
  KEY `proposed_by` (`proposed_by`),
  CONSTRAINT `VISIT_SCHEDULE_ibfk_1` FOREIGN KEY (`visit_id`) REFERENCES `DONATION_VISIT` (`visit_id`),
  CONSTRAINT `VISIT_SCHEDULE_ibfk_2` FOREIGN KEY (`proposed_by`) REFERENCES `USER` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VISIT_SCHEDULE`
--

LOCK TABLES `VISIT_SCHEDULE` WRITE;
/*!40000 ALTER TABLE `VISIT_SCHEDULE` DISABLE KEYS */;
/*!40000 ALTER TABLE `VISIT_SCHEDULE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `log_id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `resource_type` varchar(100) DEFAULT NULL,
  `resource_id` varchar(36) DEFAULT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `status` enum('success','failure') DEFAULT 'success',
  `error_message` text,
  `metadata` json DEFAULT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES ('00b85a58-0ae4-4804-89d4-e7c56756dbbb',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36','success',NULL,NULL,'2025-11-12 18:56:53'),('0ae7feac-4da7-4f8c-8292-8f45d6eb8fa9',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-11-24 14:05:31'),('0e0bed1f-fac6-4955-8d3d-5ed2788a9502',NULL,'auth_register','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-11-12 19:34:06'),('0f3ee193-2fd8-4671-805a-ac2718dd8cf1',NULL,'auth_register','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-11-12 19:33:49'),('12a98444-1502-4bff-a863-03c3da2a8199',NULL,'auth_register','authentication',NULL,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','success',NULL,NULL,'2026-02-02 10:01:41'),('168305ee-9971-4ec2-bf26-5ec5700171f1',NULL,'auth_register','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-11-24 14:03:43'),('1ca6ed31-ee38-401b-9b73-a801092b8e46',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36','success',NULL,NULL,'2025-11-12 19:41:34'),('1f285f1b-f78e-41a9-8027-fa1b93964ffa',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-11-24 14:03:52'),('1f2b7eb8-a20c-4f65-bbb5-c0907c6ad1a6',NULL,'auth_register','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-11-12 19:34:06'),('249dc2df-8a8c-48ae-96ae-5b0c4b2583ed',NULL,'auth_login','authentication',NULL,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','success',NULL,NULL,'2026-02-02 09:58:22'),('24f784ea-d49a-4742-868a-bb2e34d2432c',NULL,'auth_register','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-11-24 14:03:43'),('2bdcd82a-5ed4-4602-85ed-e849048849ac',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-12-27 08:38:17'),('2def1c4a-f314-4a26-88c8-a64f9ca0ea84',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','success',NULL,NULL,'2025-12-27 09:16:56'),('31e87a05-c48c-4941-a3f6-ccbc6bcb17e3',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-11-24 14:00:31'),('3277ca4c-efb6-4860-b7bd-21622e77ae1e',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-12-27 09:15:49'),('335aa8b7-fd42-46cd-a9c3-67d1f8e5d280',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','success',NULL,NULL,'2025-11-25 18:08:30'),('39478824-fda6-44e6-8ab5-f306ca977cd6',NULL,'auth_register','authentication',NULL,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','success',NULL,NULL,'2026-02-02 10:01:41'),('3c25a90b-e4ba-41c5-a0cd-b80f71158c8e',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-12-27 08:55:30'),('3c5b9f05-ac77-4423-b3b7-855fc266d21b',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36','success',NULL,NULL,'2025-11-12 18:56:53'),('3cbfb550-5c69-44db-ba04-84e4ea876a56',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-11-12 18:50:35'),('3e9007f7-7441-4d99-a21a-ceada5345f69',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-12-27 08:38:36'),('3f2d5b74-7d2f-429d-82b5-8e72c168885f',NULL,'auth_login','authentication',NULL,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','success',NULL,NULL,'2026-02-02 10:01:46'),('48597f29-0380-4713-9280-cdb4848db976',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','success',NULL,NULL,'2025-12-27 09:11:55'),('4bc0b2b1-a003-4ea1-afe9-5606d059ff3e',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-11-24 14:00:41'),('4ce4e85c-001f-428e-b00e-9898aba33aaa',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-11-12 18:50:35'),('4d8f205d-524d-459d-a904-a238d32d55ec',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-12-27 08:38:17'),('4e94ba2b-da82-4053-a807-097c60ee2358',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-12-27 09:15:49'),('505ae6b0-7cb7-4612-8108-5ea171a6b5f1',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-12-27 09:15:49'),('572d80ae-776f-46d5-8c87-54f955e23cdc',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','success',NULL,NULL,'2025-11-25 18:08:30'),('5e1c0457-d6f4-4a90-abd5-5abfacc8fb6a',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-11-24 14:00:41'),('5ec040a8-8a5d-4eb3-ab06-ccfd887c4c18',NULL,'auth_login','authentication',NULL,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','success',NULL,NULL,'2026-02-02 10:01:46'),('61b47b3e-f1b2-4f31-ad61-a0d65b8e3fc1',NULL,'auth_register','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-11-24 14:05:16'),('6994a910-b03f-4761-97ed-d9283f3c4744',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','success',NULL,NULL,'2025-12-27 09:16:56'),('70e004dc-19c1-4f21-a1d9-a7aa49fa4895',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-11-24 14:00:17'),('75acae33-35d3-4ba0-ac72-f16ba63dd69f',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-12-27 08:38:17'),('77a3a48c-8342-4ffa-9b49-852f21ec70c3',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-11-24 14:00:17'),('77f6d48d-5f1f-4893-ac07-11c673564408',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-12-27 08:35:18'),('79dc3322-46d5-437a-8536-da2bb0381232',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-12-27 08:55:30'),('7c789b62-b8ac-4025-8d6b-f147c676981c',NULL,'auth_login','authentication',NULL,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','success',NULL,NULL,'2026-02-02 09:59:29'),('7cfba32c-8071-46d5-981a-866333229b85',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-12-27 08:38:17'),('7d83f4f5-c50c-4137-b6d0-f40ac2ccb3a8',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-12-27 09:15:49'),('8a733b85-c768-4441-ab6d-c2ee32de4086',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','success',NULL,NULL,'2025-12-27 09:11:55'),('8d3faba8-5b1b-47f7-af20-c8ff3f049493',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-11-24 14:02:12'),('91ce22d0-b98b-4edd-b4f2-fad1afd8f355',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36','success',NULL,NULL,'2025-11-12 18:59:19'),('93f91373-bee7-4cc0-8489-f20a37a3161f',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-11-24 14:00:17'),('9682832f-7816-4554-916a-24b71944ef76',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','success',NULL,NULL,'2025-11-25 18:20:02'),('9c1c77e1-a72b-49d5-897e-a65b1c4da3fc',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','success',NULL,NULL,'2025-12-27 09:55:28'),('a5017c43-e63e-4787-9290-653563217122',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-12-27 08:55:30'),('a7a68a45-d8d2-40b7-808a-46979a1b3570',NULL,'auth_register','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-11-12 19:33:49'),('a7c444ef-ce97-4599-9af4-fccee3255dee',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-12-27 08:35:18'),('ae57b5e3-65b1-43e7-9b24-c5ab5eba0270',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-12-27 08:35:18'),('b103ba87-6e86-4b8e-95b3-ddccca8ffabe',NULL,'auth_register','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-11-24 14:05:16'),('b35b80f3-f29e-4a67-98a5-aec07981d699',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-12-27 08:38:36'),('b82fdaca-0353-4ca1-95fb-f5860b8abdc2',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-11-24 14:00:31'),('bc3571f4-5ade-4ce0-9918-4873c166af37',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-12-27 08:35:18'),('bdcab6d4-7d98-435a-a4b7-571b36369011',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-12-27 08:38:36'),('c21b80cb-0aef-4593-b1b0-3bcab1ed3adf',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-12-27 08:38:36'),('ce29c87c-3c54-421c-8d96-0b89e19fd8ec',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-12-27 08:37:49'),('d42b9231-fd0b-4c4f-b5e2-6e1471cd884d',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-11-24 14:03:52'),('dab69c8a-bc22-4f78-8096-998de4d1fbaf',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','success',NULL,NULL,'2025-12-27 09:55:28'),('dd815ea2-3b89-4e06-a5c3-66f32c4c22cc',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-12-27 08:37:49'),('df1fd338-b113-4e73-9e9d-07a6d7e29658',NULL,'auth_login','authentication',NULL,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','success',NULL,NULL,'2026-02-02 09:58:22'),('e8d6eefc-0214-43a1-bd0b-8270ac3672a9',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','success',NULL,NULL,'2025-11-25 18:20:02'),('e955a7c9-61f8-4276-869a-842e4358c614',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36','success',NULL,NULL,'2025-11-12 18:59:19'),('ec774d20-18df-490c-a7d2-56cf7106b904',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-11-24 14:05:31'),('f46c9056-6b8f-4a20-bccc-e0b52273080c',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-12-27 08:37:49'),('f548b4c1-1be9-4c55-8db5-8d994968365d',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36','success',NULL,NULL,'2025-11-12 19:41:34'),('f7ac482e-3a72-453a-9fde-e4e2b49cd744',NULL,'auth_login','authentication',NULL,NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','success',NULL,NULL,'2026-02-02 09:59:29'),('f7d80ab8-063b-494b-9f74-aca53350927d',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','success',NULL,NULL,'2025-12-27 08:55:30'),('f922763b-41e7-4e52-b0e9-0b9dea5b6891',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-12-27 08:37:49'),('fd615ce2-62f2-43c2-84ee-1e896d816074',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-11-24 14:00:17'),('ff3ae3e8-66c6-4fdd-b6e3-0acf899a9718',NULL,'auth_login','authentication',NULL,NULL,NULL,'::ffff:172.19.0.1','curl/8.7.1','failure','Invalid email or password',NULL,'2025-11-24 14:02:12');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-02 18:51:13
