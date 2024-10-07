-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `UUID` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `Email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `dob` TIMESTAMP NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Users_id_key`(`id`),
    UNIQUE INDEX `Users_UUID_key`(`UUID`),
    UNIQUE INDEX `Users_Email_key`(`Email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Activation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userID` INTEGER UNSIGNED NOT NULL,
    `activationCode` VARCHAR(191) NOT NULL,
    `expiresOn` DATETIME(3) NOT NULL,
    `isUsed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Activation_id_key`(`id`),
    UNIQUE INDEX `Activation_userID_key`(`userID`),
    UNIQUE INDEX `Activation_activationCode_key`(`activationCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ForgotPassword` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userID` INTEGER UNSIGNED NOT NULL,
    `code` VARCHAR(6) NOT NULL,
    `expiresOn` DATETIME(3) NOT NULL,
    `isUsed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ForgotPassword_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tokens` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `Token` VARCHAR(255) NOT NULL,
    `expiresOn` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `UUID` VARCHAR(191) NOT NULL,
    `userID` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `Tokens_Token_key`(`Token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categories` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `categoryName` VARCHAR(191) NOT NULL,
    `userID` INTEGER UNSIGNED NOT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Categories_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transactions` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `amount` DECIMAL(15, 3) NOT NULL,
    `type` ENUM('INCOME', 'EXPENSES') NOT NULL DEFAULT 'EXPENSES',
    `categoryID` INTEGER UNSIGNED NOT NULL,
    `userID` INTEGER UNSIGNED NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Transactions_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyTransactions` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `amount` DECIMAL(15, 3) NOT NULL,
    `type` ENUM('INCOME', 'EXPENSES') NOT NULL DEFAULT 'EXPENSES',
    `categoryID` INTEGER UNSIGNED NOT NULL,
    `userID` INTEGER UNSIGNED NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DailyTransactions_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MonthlyTransactions` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `amount` DECIMAL(15, 3) NOT NULL,
    `type` ENUM('INCOME', 'EXPENSES') NOT NULL DEFAULT 'EXPENSES',
    `categoryID` INTEGER UNSIGNED NOT NULL,
    `userID` INTEGER UNSIGNED NOT NULL,
    `monthYear` DATETIME(3) NOT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modifiedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MonthlyTransactions_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Activation` ADD CONSTRAINT `Activation_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ForgotPassword` ADD CONSTRAINT `ForgotPassword_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tokens` ADD CONSTRAINT `Tokens_UUID_fkey` FOREIGN KEY (`UUID`) REFERENCES `Users`(`UUID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tokens` ADD CONSTRAINT `Tokens_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Categories` ADD CONSTRAINT `Categories_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_categoryID_fkey` FOREIGN KEY (`categoryID`) REFERENCES `Categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyTransactions` ADD CONSTRAINT `DailyTransactions_categoryID_fkey` FOREIGN KEY (`categoryID`) REFERENCES `Categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyTransactions` ADD CONSTRAINT `DailyTransactions_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MonthlyTransactions` ADD CONSTRAINT `MonthlyTransactions_categoryID_fkey` FOREIGN KEY (`categoryID`) REFERENCES `Categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MonthlyTransactions` ADD CONSTRAINT `MonthlyTransactions_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
