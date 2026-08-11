ALTER TABLE `orders` ADD `paymentProvider` varchar(32) DEFAULT 'wallid' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentId` varchar(64);--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentStatus` varchar(32) DEFAULT 'NEW' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentReturnToken` varchar(64);--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_paymentId_unique` UNIQUE(`paymentId`);--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_paymentReturnToken_unique` UNIQUE(`paymentReturnToken`);
