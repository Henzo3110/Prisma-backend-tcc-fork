-- CreateTable
CREATE TABLE `User` (
    `id_user` VARCHAR(191) NOT NULL,
    `email` CHAR(100) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_senha_key`(`senha`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserEmpresa` (
    `id_userEmpresa` VARCHAR(191) NOT NULL,
    `id_endereco` VARCHAR(191) NOT NULL,
    `id_user` VARCHAR(191) NOT NULL,
    `razaoSocial` CHAR(100) NOT NULL,
    `nome_fantasia` CHAR(100) NOT NULL,
    `cnpj` CHAR(14) NOT NULL,
    `ie` CHAR(16) NOT NULL,
    `telefone` CHAR(11) NOT NULL,

    UNIQUE INDEX `UserEmpresa_id_endereco_key`(`id_endereco`),
    UNIQUE INDEX `UserEmpresa_id_user_key`(`id_user`),
    UNIQUE INDEX `UserEmpresa_cnpj_key`(`cnpj`),
    UNIQUE INDEX `UserEmpresa_ie_key`(`ie`),
    PRIMARY KEY (`id_userEmpresa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserCandidato` (
    `id_userCandidato` VARCHAR(191) NOT NULL,
    `id_endereco` VARCHAR(191) NOT NULL,
    `id_user` VARCHAR(191) NOT NULL,
    `nome` CHAR(100) NOT NULL,
    `sobrenome` CHAR(100) NOT NULL,
    `cpf` CHAR(11) NOT NULL,
    `dataNascimento` DATETIME(3) NOT NULL,
    `telefone` CHAR(11) NOT NULL,
    `sobreMim` LONGTEXT NOT NULL,

    UNIQUE INDEX `UserCandidato_id_endereco_key`(`id_endereco`),
    UNIQUE INDEX `UserCandidato_id_user_key`(`id_user`),
    UNIQUE INDEX `UserCandidato_cpf_key`(`cpf`),
    PRIMARY KEY (`id_userCandidato`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Curriculo_form` (
    `id_curriculoForm` VARCHAR(191) NOT NULL,
    `id_userCandidato` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `nomeEmpresa` CHAR(100) NOT NULL,
    `cargo` CHAR(100) NOT NULL,
    `periodo` CHAR(100) NOT NULL,
    `realizacoes` CHAR(255) NOT NULL,
    `instituicao` CHAR(100) NOT NULL,
    `grau` CHAR(100) NOT NULL,
    `campoEstudo` CHAR(100) NOT NULL,
    `periodoEstudo` CHAR(100) NOT NULL,
    `competenciasExtracurricular` LONGTEXT NOT NULL,
    `certificacoes` LONGTEXT NOT NULL,
    `empresasAntecedentes` LONGTEXT NULL,

    UNIQUE INDEX `Curriculo_form_id_userCandidato_key`(`id_userCandidato`),
    PRIMARY KEY (`id_curriculoForm`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidatoVaga` (
    `id_inscricao` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `id_userCandidato` VARCHAR(191) NOT NULL,
    `id_vaga` VARCHAR(191) NOT NULL,
    `dataInscricao` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CandidatoVaga_id_userCandidato_key`(`id_userCandidato`),
    UNIQUE INDEX `CandidatoVaga_id_vaga_key`(`id_vaga`),
    PRIMARY KEY (`id_inscricao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vaga` (
    `id_vaga` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `titulo` CHAR(100) NOT NULL,
    `categoria` CHAR(100) NOT NULL,
    `descricao` LONGTEXT NOT NULL,
    `requisitos` LONGTEXT NOT NULL,
    `salario` CHAR(10) NOT NULL,
    `quantidade` CHAR(4) NOT NULL,
    `dataAbertura` DATETIME(3) NOT NULL,
    `dataFechamento` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_vaga`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CriarVaga` (
    `id_criaVaga` VARCHAR(191) NOT NULL,
    `id_userEmpresa` VARCHAR(191) NOT NULL,
    `id_vaga` VARCHAR(191) NOT NULL,
    `dataCriacao` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CriarVaga_id_userEmpresa_key`(`id_userEmpresa`),
    UNIQUE INDEX `CriarVaga_id_vaga_key`(`id_vaga`),
    PRIMARY KEY (`id_criaVaga`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Endereco` (
    `id_endereco` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `pais` CHAR(100) NOT NULL,
    `estado` CHAR(20) NOT NULL,
    `cidade` CHAR(100) NOT NULL,
    `bairro` CHAR(100) NOT NULL,
    `logradouro` CHAR(100) NOT NULL,
    `complemento` VARCHAR(191) NULL,
    `numero` CHAR(10) NOT NULL,
    `cep` CHAR(8) NOT NULL,

    PRIMARY KEY (`id_endereco`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserEmpresa` ADD CONSTRAINT `UserEmpresa_id_endereco_fkey` FOREIGN KEY (`id_endereco`) REFERENCES `Endereco`(`id_endereco`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserEmpresa` ADD CONSTRAINT `UserEmpresa_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCandidato` ADD CONSTRAINT `UserCandidato_id_endereco_fkey` FOREIGN KEY (`id_endereco`) REFERENCES `Endereco`(`id_endereco`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCandidato` ADD CONSTRAINT `UserCandidato_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Curriculo_form` ADD CONSTRAINT `Curriculo_form_id_userCandidato_fkey` FOREIGN KEY (`id_userCandidato`) REFERENCES `UserCandidato`(`id_userCandidato`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidatoVaga` ADD CONSTRAINT `CandidatoVaga_id_userCandidato_fkey` FOREIGN KEY (`id_userCandidato`) REFERENCES `UserCandidato`(`id_userCandidato`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidatoVaga` ADD CONSTRAINT `CandidatoVaga_id_vaga_fkey` FOREIGN KEY (`id_vaga`) REFERENCES `Vaga`(`id_vaga`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CriarVaga` ADD CONSTRAINT `CriarVaga_id_userEmpresa_fkey` FOREIGN KEY (`id_userEmpresa`) REFERENCES `UserEmpresa`(`id_userEmpresa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CriarVaga` ADD CONSTRAINT `CriarVaga_id_vaga_fkey` FOREIGN KEY (`id_vaga`) REFERENCES `Vaga`(`id_vaga`) ON DELETE RESTRICT ON UPDATE CASCADE;
