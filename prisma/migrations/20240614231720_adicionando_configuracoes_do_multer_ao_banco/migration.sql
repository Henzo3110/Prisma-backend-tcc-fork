/*
  Warnings:

  - A unique constraint covering the columns `[id_foto]` on the table `UserCandidato` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_foto]` on the table `UserEmpresa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_foto` to the `UserCandidato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_foto` to the `UserEmpresa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usercandidato` ADD COLUMN `id_foto` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `userempresa` ADD COLUMN `id_foto` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `FotoPerfil` (
    `id_foto` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `caminho` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_foto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `UserCandidato_id_foto_key` ON `UserCandidato`(`id_foto`);

-- CreateIndex
CREATE UNIQUE INDEX `UserEmpresa_id_foto_key` ON `UserEmpresa`(`id_foto`);

-- AddForeignKey
ALTER TABLE `UserEmpresa` ADD CONSTRAINT `UserEmpresa_id_foto_fkey` FOREIGN KEY (`id_foto`) REFERENCES `FotoPerfil`(`id_foto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCandidato` ADD CONSTRAINT `UserCandidato_id_foto_fkey` FOREIGN KEY (`id_foto`) REFERENCES `FotoPerfil`(`id_foto`) ON DELETE RESTRICT ON UPDATE CASCADE;
