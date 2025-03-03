ALTER TABLE `deno_customers` ADD `hash_password` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `deno_customers` DROP COLUMN `address`;--> statement-breakpoint
ALTER TABLE `deno_customers` DROP COLUMN `credit_limit`;