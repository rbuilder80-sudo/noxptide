CREATE TABLE `order_items` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`orderId` bigint unsigned NOT NULL,
	`productSlug` varchar(128) NOT NULL,
	`productName` varchar(255) NOT NULL,
	`sizeLabel` varchar(32) NOT NULL,
	`unitPricePence` int NOT NULL,
	`qty` int NOT NULL,
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(32) NOT NULL,
	`customerName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64),
	`addressLine1` varchar(255) NOT NULL,
	`addressLine2` varchar(255),
	`city` varchar(128) NOT NULL,
	`postcode` varchar(16) NOT NULL,
	`country` varchar(64) NOT NULL DEFAULT 'United Kingdom',
	`subtotalPence` int NOT NULL,
	`discountPence` int NOT NULL DEFAULT 0,
	`shippingPence` int NOT NULL DEFAULT 0,
	`totalPence` int NOT NULL,
	`status` enum('pending','paid','processing','dispatched','completed','cancelled') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `page_contents` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`pageKey` varchar(191) NOT NULL,
	`metaTitle` varchar(255),
	`metaDescription` text,
	`content` text,
	`updatedBy` varchar(255),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `page_contents_id` PRIMARY KEY(`id`),
	CONSTRAINT `page_contents_pageKey_unique` UNIQUE(`pageKey`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`unionId` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(320),
	`avatar` text,
	`role` enum('user','support','manager','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	`lastSignInAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_unionId_unique` UNIQUE(`unionId`)
);
