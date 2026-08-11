ALTER TABLE `orders` ADD `hubspotContactId` varchar(64);--> statement-breakpoint
ALTER TABLE `orders` ADD `hubspotDealId` varchar(64);--> statement-breakpoint
ALTER TABLE `orders` ADD `hubspotSyncedAt` timestamp;--> statement-breakpoint
ALTER TABLE `orders` ADD `hubspotSyncError` text;
