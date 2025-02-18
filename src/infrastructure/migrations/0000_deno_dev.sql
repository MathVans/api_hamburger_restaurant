CREATE TABLE `deno_addresses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`street` varchar(255) NOT NULL,
	`city` varchar(100) NOT NULL,
	`state` varchar(100) NOT NULL,
	`zip_code` varchar(20) NOT NULL,
	`country` varchar(100) NOT NULL,
	CONSTRAINT `deno_addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deno_customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`first_name` varchar(100) NOT NULL,
	`middle_name` varchar(100),
	`last_name` varchar(100) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(20),
	`address` varchar(255),
	`credit_limit` decimal(10,2) DEFAULT '0.00',
	`role_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deno_customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `deno_customers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `deno_customer_order` (
	`customer_id` int NOT NULL,
	`order_id` int NOT NULL
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
	CONSTRAINT `deno_order_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deno_order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`product_name` varchar(255) NOT NULL,
	`quantity` int NOT NULL,
	`price` decimal(10,2) NOT NULL,
	CONSTRAINT `deno_order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deno_roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` enum('VIP','Common') NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deno_roles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `deno_addresses` ADD CONSTRAINT `deno_addresses_customer_id_deno_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `deno_customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deno_customers` ADD CONSTRAINT `deno_customers_role_id_deno_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `deno_roles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deno_customer_order` ADD CONSTRAINT `deno_customer_order_customer_id_deno_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `deno_customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deno_customer_order` ADD CONSTRAINT `deno_customer_order_order_id_deno_order_id_fk` FOREIGN KEY (`order_id`) REFERENCES `deno_order`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deno_order_items` ADD CONSTRAINT `deno_order_items_order_id_deno_order_id_fk` FOREIGN KEY (`order_id`) REFERENCES `deno_order`(`id`) ON DELETE no action ON UPDATE no action;