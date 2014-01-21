SimpleTaskList
==============

A simple task list that I built using MySQL / jQuery / JavaScript / PHP.


Use these commands from SQL Table Creation.txt to create the MySQL tables.


//Create DB SCHEMA
CREATE SCHEMA `task_list` ;

CREATE TABLE `task_list`.`tasktable` (
  `task_id` INT NOT NULL AUTO_INCREMENT,
  `task_name` VARCHAR(300) NOT NULL,
  `task_details` VARCHAR(500) NOT NULL,
  `task_time` DATETIME NOT NULL,
  `originator` INT NOT NULL,
  `task_ip` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`task_id`),
  UNIQUE INDEX `task_id_UNIQUE` (`task_id` ASC));


CREATE TABLE `task_list`.`usertable` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC),
  UNIQUE INDEX `user_name_UNIQUE` (`user_name` ASC));

ALTER TABLE `task_list`.`tasktable`
ADD INDEX `user_task_idx` (`originator` ASC);
ALTER TABLE `task_list`.`tasktable`
ADD CONSTRAINT `user_task`
  FOREIGN KEY (`originator`)
  REFERENCES `task_list`.`usertable` (`user_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

CREATE TABLE `task_list`.`workertable` (
  `task_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `task_priority` DATETIME NOT NULL,
  PRIMARY KEY (`task_id`, `user_id`),
  INDEX `user_worker_idx` (`user_id` ASC),
  CONSTRAINT `user_worker`
    FOREIGN KEY (`user_id`)
    REFERENCES `task_list`.`usertable` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `task_worker`
    FOREIGN KEY (`task_id`)
    REFERENCES `task_list`.`tasktable` (`task_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);



//IF NEEDED
ALTER TABLE `task_list`.`tasktable` CHANGE COLUMN `task_priority` `task_priority` VARCHAR(20) NOT NULL  ;
ALTER TABLE `task_list`.`tasktable` CHANGE COLUMN `task_priority` `task_priority` DATETIME NOT NULL  ;

ALTER TABLE `task_list`.`workertable`
ADD COLUMN `task_priority` DATETIME NOT NULL AFTER `user_id`;
