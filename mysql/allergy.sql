/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80033 (8.0.33)
 Source Host           : localhost:3306
 Source Schema         : allergy

 Target Server Type    : MySQL
 Target Server Version : 80033 (8.0.33)
 File Encoding         : 65001

 Date: 14/08/2023 01:50:42
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for food
-- ----------------------------
DROP TABLE IF EXISTS `food`;
CREATE TABLE `food`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `food_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `food_name_lower` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `brand` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `brand_lower` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `image_url` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL,
  `created` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 55 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of food
-- ----------------------------
INSERT INTO `food` VALUES (5, 'Coca-Cola', 'coca-cola', 'Coca-Cola', 'coca-cola', '', '2023-08-03 06:35:27', '2023-08-11 08:54:17');
INSERT INTO `food` VALUES (6, 'Sprite', 'sprite', 'Coca-Cola', 'coca-cola', NULL, '2023-08-03 07:01:11', '2023-08-03 07:01:11');
INSERT INTO `food` VALUES (7, 'Fanta', 'fanta', 'Coca-Cola', 'coca-cola', '', '2023-08-07 03:01:29', '2023-08-07 03:01:29');
INSERT INTO `food` VALUES (10, 'Chicken wing', 'chicken wing', 'Random', 'random', NULL, '2023-08-07 03:02:25', '2023-08-07 03:02:25');
INSERT INTO `food` VALUES (11, 'Pepsi', 'pepsi', 'Pepsi', 'pepsi', NULL, '2023-08-07 03:02:34', '2023-08-07 03:02:34');
INSERT INTO `food` VALUES (12, '7Up', '7up', 'Pepsi', 'pepsi', NULL, '2023-08-07 03:02:53', '2023-08-07 03:02:53');
INSERT INTO `food` VALUES (13, 'Chips', 'chips', 'Lays', 'lays', NULL, '2023-08-07 03:03:10', '2023-08-07 03:03:10');
INSERT INTO `food` VALUES (14, 'Cheetos', 'cheetos', 'Cheetos', 'cheetos', NULL, '2023-08-07 03:03:29', '2023-08-07 03:03:29');
INSERT INTO `food` VALUES (15, 'Mountain Dew', 'mountain dew', 'pepsi', 'pepsi', NULL, '2023-08-07 03:03:48', '2023-08-07 03:03:48');
INSERT INTO `food` VALUES (16, 'Cat', 'cat', 'wildcat', 'wildcat', NULL, '2023-08-07 03:04:03', '2023-08-07 03:04:03');
INSERT INTO `food` VALUES (40, 'Pork', 'pork', 'Brand', 'brand', '', '2023-08-08 07:14:36', '2023-08-08 07:14:36');
INSERT INTO `food` VALUES (41, 'Beef', 'beef', 'Brand', 'brand', '', '2023-08-08 07:14:56', '2023-08-08 07:14:56');
INSERT INTO `food` VALUES (42, 'Chicken', 'chicken', 'Raw', 'raw', '', '2023-08-08 07:29:35', '2023-08-08 07:29:35');
INSERT INTO `food` VALUES (45, 'Another food', 'another food', '', '', '', '2023-08-08 07:58:28', '2023-08-08 07:58:28');
INSERT INTO `food` VALUES (46, 'test', 'test', 'test', 'test', '', '2023-08-08 08:10:19', '2023-08-08 08:10:19');
INSERT INTO `food` VALUES (47, 'test 2', 'test 2', 'test', 'test', '', '2023-08-09 06:47:04', '2023-08-09 06:47:04');

-- ----------------------------
-- Table structure for food_ingredient
-- ----------------------------
DROP TABLE IF EXISTS `food_ingredient`;
CREATE TABLE `food_ingredient`  (
  `id_food` int NOT NULL,
  `id_ing` int NOT NULL,
  PRIMARY KEY (`id_food`, `id_ing`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of food_ingredient
-- ----------------------------
INSERT INTO `food_ingredient` VALUES (5, 1);
INSERT INTO `food_ingredient` VALUES (6, 1);
INSERT INTO `food_ingredient` VALUES (7, 1);
INSERT INTO `food_ingredient` VALUES (40, 1);
INSERT INTO `food_ingredient` VALUES (41, 1);
INSERT INTO `food_ingredient` VALUES (42, 1);
INSERT INTO `food_ingredient` VALUES (43, 1);
INSERT INTO `food_ingredient` VALUES (44, 1);
INSERT INTO `food_ingredient` VALUES (47, 1);

-- ----------------------------
-- Table structure for ingredient
-- ----------------------------
DROP TABLE IF EXISTS `ingredient`;
CREATE TABLE `ingredient`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `ing_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `ing_name_lower` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `created` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ingredient
-- ----------------------------
INSERT INTO `ingredient` VALUES (1, 'salt', 'salt', '2023-08-03 07:33:10', '2023-08-11 09:15:23');
INSERT INTO `ingredient` VALUES (6, 'testa', 'test', '2023-08-11 09:01:45', '2023-08-12 08:52:49');
INSERT INTO `ingredient` VALUES (7, 'suga', 'sugar', '2023-08-11 09:16:44', '2023-08-14 05:19:03');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (1, 'editor');
INSERT INTO `role` VALUES (2, 'admin');
INSERT INTO `role` VALUES (3, 'user');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role` tinyint NULL DEFAULT 0,
  `email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `created` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (14, 2, 'kolxy@qq.com', '21232f297a57a5a743894a0e4a801fc3', '2023-05-27 08:27:49', '2023-08-12 09:21:58');
INSERT INTO `user` VALUES (15, 1, 'aaa@qq.com', 'ee11cbb19052e40b07aac0ca060c23ee', '2023-08-07 04:08:33', '2023-08-13 05:49:40');
INSERT INTO `user` VALUES (16, 1, 'bbb@qq.com', 'ee11cbb19052e40b07aac0ca060c23ee', '2023-08-12 07:46:22', '2023-08-14 05:19:07');
INSERT INTO `user` VALUES (17, 0, 'bccb@qq.com', '74b87337454200d4d33f80c4663dc5e5', '2023-08-14 06:58:06', '2023-08-14 06:58:06');

SET FOREIGN_KEY_CHECKS = 1;
