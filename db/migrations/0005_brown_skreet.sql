CREATE TABLE `discounts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`code` varchar(32) NOT NULL,
	`description` varchar(255),
	`type` enum('percent','fixed') NOT NULL,
	`value` int NOT NULL,
	`minSubtotalPence` int NOT NULL DEFAULT 0,
	`maxUses` int,
	`usedCount` int NOT NULL DEFAULT 0,
	`startsAt` timestamp,
	`expiresAt` timestamp,
	`active` boolean NOT NULL DEFAULT true,
	`createdBy` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `discounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `discounts_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `product_overrides` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`productSlug` varchar(128) NOT NULL,
	`name` varchar(255),
	`tagline` varchar(255),
	`description` text,
	`categorySlug` varchar(128),
	`imageUrl` text,
	`detailsJson` text,
	`updatedBy` varchar(255),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product_overrides_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_overrides_productSlug_unique` UNIQUE(`productSlug`)
);
--> statement-breakpoint
CREATE TABLE `refunds` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`orderId` bigint unsigned NOT NULL,
	`amountPence` int NOT NULL,
	`reason` text,
	`createdBy` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `refunds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentProvider` varchar(32) DEFAULT 'wallid' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentId` varchar(64);--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentStatus` varchar(32) DEFAULT 'NEW' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentReturnToken` varchar(64);--> statement-breakpoint
ALTER TABLE `orders` ADD `hubspotContactId` varchar(64);--> statement-breakpoint
ALTER TABLE `orders` ADD `hubspotCompanyId` varchar(64);--> statement-breakpoint
ALTER TABLE `orders` ADD `hubspotDealId` varchar(64);--> statement-breakpoint
ALTER TABLE `orders` ADD `hubspotSyncedAt` timestamp;--> statement-breakpoint
ALTER TABLE `orders` ADD `hubspotSyncError` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `discountCode` varchar(32);--> statement-breakpoint
ALTER TABLE `orders` ADD `promoDiscountPence` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `refundedPence` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `courier` varchar(64);--> statement-breakpoint
ALTER TABLE `orders` ADD `trackingNumber` varchar(64);--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_paymentId_unique` UNIQUE(`paymentId`);--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_paymentReturnToken_unique` UNIQUE(`paymentReturnToken`);