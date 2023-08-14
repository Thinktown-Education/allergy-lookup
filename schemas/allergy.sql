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

 Date: 06/08/2023 21:20:36
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
  `created` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of food
-- ----------------------------
INSERT INTO `food` VALUES (5, 'Coca-Cola', 'coca-cola', 'Coca-Cola', 'coca-cola', '2023-08-03 06:35:27', '2023-08-03 06:35:27');
INSERT INTO `food` VALUES (6, 'Sprite', 'sprite', 'Coca-Cola', 'coca-cola', '2023-08-03 07:01:11', '2023-08-03 07:01:11');
INSERT INTO `food` VALUES (7, 'Fanta', 'fanta', 'Coca-Cola', 'coca-cola', '2023-08-07 03:01:29', '2023-08-07 03:01:29');
INSERT INTO `food` VALUES (8, 'Cookie', 'cookie', 'Oreo', 'oreo', '2023-08-07 03:01:44', '2023-08-07 03:01:44');
INSERT INTO `food` VALUES (9, 'Trash', 'trash', 'Garbo', 'garbo', '2023-08-07 03:01:56', '2023-08-07 03:01:56');
INSERT INTO `food` VALUES (10, 'Chicken wing', 'chicken wing', 'Random', 'random', '2023-08-07 03:02:25', '2023-08-07 03:02:25');
INSERT INTO `food` VALUES (11, 'Pepsi', 'pepsi', 'Pepsi', 'pepsi', '2023-08-07 03:02:34', '2023-08-07 03:02:34');
INSERT INTO `food` VALUES (12, '7Up', '7up', 'Pepsi', 'pepsi', '2023-08-07 03:02:53', '2023-08-07 03:02:53');
INSERT INTO `food` VALUES (13, 'Chips', 'chips', 'Lays', 'lays', '2023-08-07 03:03:10', '2023-08-07 03:03:10');
INSERT INTO `food` VALUES (14, 'Cheetos', 'cheetos', 'Cheetos', 'cheetos', '2023-08-07 03:03:29', '2023-08-07 03:03:29');
INSERT INTO `food` VALUES (15, 'Mountain Dew', 'mountain dew', 'pepsi', 'pepsi', '2023-08-07 03:03:48', '2023-08-07 03:03:48');
INSERT INTO `food` VALUES (16, 'Cat', 'cat', 'wildcat', 'wildcat', '2023-08-07 03:04:03', '2023-08-07 03:04:03');

-- ----------------------------
-- Table structure for food_ingredient
-- ----------------------------
DROP TABLE IF EXISTS `food_ingredient`;
CREATE TABLE `food_ingredient`  (
  `id_food` int NOT NULL,
  `id_ing` int NOT NULL,
  PRIMARY KEY (`id_food`, `id_ing`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of food_ingredient
-- ----------------------------
INSERT INTO `food_ingredient` VALUES (5, 1);
INSERT INTO `food_ingredient` VALUES (5, 4);
INSERT INTO `food_ingredient` VALUES (5, 5);
INSERT INTO `food_ingredient` VALUES (6, 1);
INSERT INTO `food_ingredient` VALUES (6, 4);

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
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ingredient
-- ----------------------------
INSERT INTO `ingredient` VALUES (1, 'salt', 'salt', '2023-08-03 07:33:10', '2023-08-03 07:33:10');
INSERT INTO `ingredient` VALUES (4, 'sugar', 'sugar', '2023-08-03 08:43:14', '2023-08-03 08:43:14');
INSERT INTO `ingredient` VALUES (5, 'caffine', 'caffine', '2023-08-05 04:26:46', '2023-08-05 04:26:46');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (0, 'user');
INSERT INTO `role` VALUES (1, 'editor');
INSERT INTO `role` VALUES (2, 'admin');

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
  `updated` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (14, 2, 'kolxy@qq.com', '21232f297a57a5a743894a0e4a801fc3', '2023-05-27 08:27:49', NULL);
INSERT INTO `user` VALUES (15, 0, 'aaa@qq.com', 'ee11cbb19052e40b07aac0ca060c23ee', '2023-08-07 04:08:33', NULL);

SET FOREIGN_KEY_CHECKS = 1;
