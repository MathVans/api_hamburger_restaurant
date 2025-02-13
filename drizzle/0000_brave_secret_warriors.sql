CREATE TABLE `deno_customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`first_name` varchar(100) NOT NULL,
	`middle_name` varchar(100),
	`last_name` varchar(100) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(20),
	`address` varchar(255),
	`credit_limit` decimal(10,2) DEFAULT '0.00',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deno_customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `deno_customers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `deno_employee` (
	`id` int AUTO_INCREMENT NOT NULL,
	`first_name` varchar(100) NOT NULL,
	`last_name` varchar(100) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(20),
	`address` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deno_employee_id` PRIMARY KEY(`id`),
	CONSTRAINT `deno_employee_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `deno_order` (
	`id` int AUTO_INCREMENT NOT NULL,
	`price` double NOT NULL,
	`quantity` double NOT NULL,
	`order_date` timestamp DEFAULT (now()),
	`required_date` timestamp DEFAULT (now()),
	`shipped_date` timestamp DEFAULT (now()),
	`status` enum('Shipped','Pending','Delivered') DEFAULT 'Pending',
	`comments` varchar(255),
	`employee_id` int NOT NULL,
	`customers_id` int NOT NULL,
	CONSTRAINT `deno_order_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `deno_order` ADD CONSTRAINT `deno_order_employee_id_deno_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `deno_employee`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deno_order` ADD CONSTRAINT `deno_order_customers_id_deno_customers_id_fk` FOREIGN KEY (`customers_id`) REFERENCES `deno_customers`(`id`) ON DELETE cascade ON UPDATE no action;