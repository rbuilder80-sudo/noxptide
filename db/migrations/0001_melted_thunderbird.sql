CREATE TABLE `product_statuses` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`productSlug` varchar(128) NOT NULL,
	`status` enum('active','hidden') NOT NULL DEFAULT 'active',
	`updatedBy` varchar(255),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product_statuses_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_statuses_productSlug_unique` UNIQUE(`productSlug`)
);
--> statement-breakpoint
CREATE TABLE `product_variants` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`productSlug` varchar(128) NOT NULL,
	`sizeLabel` varchar(32) NOT NULL,
	`pricePence` int NOT NULL,
	`stock` int NOT NULL DEFAULT 0,
	`updatedBy` varchar(255),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product_variants_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_variants_slug_size` UNIQUE(`productSlug`,`sizeLabel`)
);
