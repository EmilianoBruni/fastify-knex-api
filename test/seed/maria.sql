SET @@time_zone := '+00:00';

#
# TABLE STRUCTURE FOR: authors
#

DROP TABLE IF EXISTS `authors`;

CREATE TABLE `authors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `added` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `added`) VALUES (1, 'Michael', 'Messina', 'monia89@example.org', FROM_UNIXTIME(1318149251));
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`) VALUES (2, 'Joannes', 'Russo', 'sorrentino.akira@example.net');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`) VALUES (3, 'Deborah', 'Vitale', 'ibattaglia@example.net');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`) VALUES (4, 'Quasimodo', 'Galli', 'marcella.vitali@example.net');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`) VALUES (5, 'Giulio', 'Gallo', 'rorlando@example.com');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`) VALUES (6, 'Loredana', 'De Santis', 'Angelo.cesidia@example.net');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`) VALUES (7, 'Nunzia', 'Galli', 'pcarbone@example.org');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`) VALUES (8, 'Gabriele', 'Longo', 'leone.bibiana@example.org');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (9, 'Ludovico', 'Vitale', 'eriberto19@example.net', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (10, 'Mariagiulia', 'Martini', 'pmarini@example.net', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (11, 'Quasimodo', 'De Angelis', 'jole.ferraro@example.com', 1);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (12, 'Claudia', 'Guerra', 'smontanari@example.net', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (13, 'Ninfa', 'Conte', 'marino.carmela@example.org', 1);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (14, 'Fortunata', 'Vitale', 'rosalba70@example.com', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (15, 'Lucrezia', 'Gatti', 'dcaruso@example.com', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (16, 'Umberto', 'Mariani', 'rosita65@example.net', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (17, 'Silvano', 'Pellegrino', 'jmontanari@example.net', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (18, 'Nicoletta', 'Negri', 'bsartori@example.com', 1);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (19, 'Raoul', 'Gallo', 'marini.max@example.net', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (20, 'Ciro', 'Villa', 'tcattaneo@example.net', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (21, 'Audenico', 'Colombo', 'mguerra@example.org', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (22, 'Mirko', 'Monti', 'negri.deborah@example.org', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (23, 'Nicoletta', 'Moretti', 'vania.ricci@example.com', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (24, 'Eufemia', 'Fabbri', 'nabil.caruso@example.com', 1);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (25, 'Lauro', 'Rizzi', 'hector31@example.com', 1);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (26, 'Clodovea', 'Riva', 'loretta.morelli@example.org', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (27, 'Antimo', 'Grassi', 'desantis.guendalina@example.net', 1);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (28, 'Ariel', 'Riva', 'xavier.damico@example.net', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (29, 'Carmela', 'Martino', 'marino02@example.net', 1);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (30, 'Pierfrancesco', 'Conte', 'fdonati@example.org', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (31, 'Giorgio', 'Morelli', 'cristyn.amico@example.com', 1);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (32, 'Gavino', 'Barbieri', 'hgiuliani@example.org', 1);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (33, 'Giovanna', 'Giordano', 'alessio33@example.org', 1);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (34, 'Odone', 'Bianchi', 'jelena43@example.net', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (35, 'Cesidia', 'Parisi', 'soriana12@example.org', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (36, 'Gastone', 'Costantini', 'leonardo.fiore@example.net', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (37, 'Maria', 'Gatti', 'karim.barone@example.org', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (38, 'Rebecca', 'Russo', 'fernando.farina@example.com', 1);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (39, 'Irene', 'Monti', 'donati.erminio@example.org', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (40, 'Genziana', 'Ferrari', 'mariagiulia81@example.com', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (41, 'Fabio', 'Ferraro', 'damico.doriana@example.org', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (42, 'Ione', 'Vitale', 'derosa.domingo@example.org', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (43, 'Ettore', 'Rizzi', 'damico.caligola@example.org', 1);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (44, 'Genziana', 'Marchetti', 'cpalumbo@example.org', 1);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (45, 'Fiorenzo', 'De luca', 'ruggiero.damiana@example.org', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (46, 'Laura', 'Pellegrino', 'carbone.fatima@example.com', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (47, 'Carmelo', 'Serra', 'cattaneo.sirio@example.com', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (48, 'Gavino', 'Santoro', 'longo.emanuel@example.net', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (49, 'Doriana', 'Sartori', 'renato58@example.org', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (50, 'Thea', 'Sanna', 'nabil.bruno@example.org', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (51, 'Ileana', 'Neri', 'bortolo.vitali@example.net', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (52, 'Gaetano', 'Palumbo', 'gallo.eufemia@example.com', 1);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (53, 'Loredana', 'Ferrara', 'damico.amerigo@example.net', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (54, 'Manuele', 'Coppola', 'doriana35@example.net', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (55, 'Nunzia', 'Silvestri', 'riva.armando@example.org', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (56, 'Emidio', 'Costantini', 'genziana.fabbri@example.net', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (57, 'Deborah', 'Giordano', 'ruggiero.prisca@example.net', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (58, 'Ingrid', 'Pellegrini', 'igallo@example.org', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (59, 'Emilia', 'Pellegrini', 'emilia62@example.net', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (60, 'Jole', 'Marini', 'montanari.samira@example.net', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (61, 'Romeo', 'Mariani', 'lucrezia97@example.net', 1);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (62, 'Raoul', 'Lombardo', 'gferrari@example.net', 1);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (63, 'Marina', 'Mazza', 'vmartini@example.org', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (64, 'Battista', 'Pagano', 'yferretti@example.net', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (65, 'Fiorenzo', 'Gatti', 'orlando.vera@example.com', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (66, 'Carmela', 'Testa', 'neri84@example.org', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (67, 'Alessio', 'Russo', 'sasha94@example.com', 0);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (68, 'Diamante', 'Amico', 'milani.prisca@example.net', 1);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (69, 'Damiano', 'Esposito', 'giacinta.milani@example.org', 1);
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`) VALUES (70, 'Fortunata', 'Farina', 'augusto74@example.com', 1);
#
# TABLE STRUCTURE FOR: posts
#

DROP TABLE IF EXISTS `posts`;

CREATE TABLE `posts` (
  `post_id` int(11) NOT NULL AUTO_INCREMENT,
  `author_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(500) NOT NULL,
  `content` text NOT NULL,
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

INSERT INTO `posts` (`post_id`, `author_id`, `title`, `description`, `content`) VALUES (1, 1, 'Eveniet a aut labore numquam unde quo.', 'Illum et quibusdam consequatur dicta. Magni est minus sunt dicta et nam libero. Dignissimos illo voluptatum quod facilis consequatur aliquam tempora.', 'Aspernatur sit magnam reiciendis non. Officiis aut est est odio. Aut et nesciunt labore similique molestiae voluptatem.');
INSERT INTO `posts` (`post_id`, `author_id`, `title`, `description`, `content`) VALUES (2, 2, 'Et corrupti iure ut est quia quo.', 'Amet reprehenderit quo id impedit. Quia cum sed non et fugit. Vero id non aperiam doloribus cumque.', 'Velit enim et eum occaecati est et ex. Deserunt recusandae molestiae reprehenderit illum occaecati eos nihil quidem.');
INSERT INTO `posts` (`post_id`, `author_id`, `title`, `description`, `content`) VALUES (3, 3, 'Unde corrupti cum dolorem iure.', 'Nam numquam dolor iste qui voluptatem ea molestiae harum. Eaque temporibus expedita ut eaque minus itaque occaecati. Placeat molestiae vel aspernatur aut autem nemo ut.', 'Neque nesciunt sunt molestiae doloribus et architecto placeat. Praesentium non et omnis non nemo eos incidunt. Eum voluptatum qui eaque nulla fugiat occaecati.');
INSERT INTO `posts` (`post_id`, `author_id`, `title`, `description`, `content`) VALUES (4, 4, 'Modi inventore cumque blanditiis unde culpa excepturi non.', 'Consequatur rem error aliquid magnam illum qui fugiat. Sequi ut est impedit est. Maiores consequuntur est nam expedita qui.', 'Nihil dolorem modi in. Asperiores doloribus modi iure optio beatae. Quia amet rem eius repellat eum cumque. Ratione placeat facilis non enim laborum. Harum consequuntur dolores nostrum voluptas vel.');
INSERT INTO `posts` (`post_id`, `author_id`, `title`, `description`, `content`) VALUES (5, 5, 'Voluptas minima omnis doloribus temporibus.', 'Omnis non non necessitatibus aut. Doloremque rem iste rem ex accusantium ducimus laudantium. Ut sed dolor recusandae tenetur mollitia.', 'Et nihil sed est aperiam ipsa fuga. Non maxime reprehenderit ea sed aperiam nesciunt. Labore non est aut est dolore. Consequatur laudantium reiciendis nam iste earum quo.');
INSERT INTO `posts` (`post_id`, `author_id`, `title`, `description`, `content`) VALUES (6, 6, 'Mollitia esse recusandae debitis nulla dolores labore voluptates.', 'Corrupti aut sed ipsam cupiditate dolor maiores. Enim quibusdam delectus ea nemo at minima aliquam.', 'Tempora dolor officia quod est nihil velit mollitia. Ab maxime sit omnis ut nesciunt eum. Ratione debitis qui et id cum sint. Occaecati repellat assumenda eum dicta.');
INSERT INTO `posts` (`post_id`, `author_id`, `title`, `description`, `content`) VALUES (7, 7, 'Eos quae voluptate ullam accusamus.', 'Molestiae reprehenderit sunt molestias quasi quia qui qui. Aut asperiores maxime iure quidem et in. Sit numquam maxime quia et saepe.', 'At deleniti recusandae delectus rem est aut incidunt consequatur. Dolores labore soluta perspiciatis atque exercitationem. Rerum officia ea ratione rerum sed.');
INSERT INTO `posts` (`post_id`, `author_id`, `title`, `description`, `content`) VALUES (8, 8, 'Molestias dolorum voluptate corporis in.', 'Et quis sapiente mollitia. Ea repudiandae eum laudantium eaque. Aut veritatis facilis itaque ut.', 'Expedita voluptas et quaerat amet tempora voluptatum cumque dolor. Quia consequatur enim esse vitae neque sit voluptatem velit. Est rerum sed odio iste hic.');
INSERT INTO `posts` (`post_id`, `author_id`, `title`, `description`, `content`) VALUES (9, 9, 'Omnis sit beatae autem consequatur eum.', 'Vero quaerat doloremque non voluptatem. Quibusdam atque corporis enim culpa explicabo accusantium a. Occaecati quam quibusdam occaecati. Esse exercitationem ut aut hic sunt.', 'Quisquam hic eos quaerat illo. Cumque consectetur odio sequi. Repellat et enim porro sapiente expedita quis amet. Sed facilis nemo consequatur tempore aut aperiam rerum.');
INSERT INTO `posts` (`post_id`, `author_id`, `title`, `description`, `content`) VALUES (10, 10, 'Voluptatum rerum odit ipsam ratione beatae nihil quaerat.', 'Earum saepe nobis provident consequatur tempore. Blanditiis nesciunt maxime ea. Ipsa est inventore dolor laboriosam aut consequatur id. Repellat nemo autem quis natus odio consectetur quae quibusdam.', 'Aliquid consectetur eos veniam. Necessitatibus alias dolor debitis veniam iure. Id molestias aut tempore sit earum commodi est. Earum et voluptas quia veritatis error.');

#
# TABLE STRUCTURE FOR: all_std_types
#

DROP TABLE IF EXISTS `all_std_types`;

CREATE TABLE `all_std_types` (
  `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
  `fld01` decimal(10,2) unsigned NOT NULL,
  `fld02` float(10,4) NOT NULL,
  `fld03` tinyint(3) NOT NULL,
  `fld04` bigint(20) NOT NULL,
  `fld05` bit(8) NOT NULL,
  `fld06` char(10) NOT NULL,
  `fld07` varchar(255) NOT NULL,
  `fld08` text NOT NULL,
  `fld09` enum('item1','item2','item3') NOT NULL,
  `fld10` set('item1','item2','item3') NOT NULL,
  `fld11` date NOT NULL,
  `fld12` datetime NOT NULL,
  `fld13` timestamp NOT NULL DEFAULT current_timestamp(),
  `fld14` time NOT NULL,
  `fld15` year(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

INSERT INTO `all_std_types` (`id`, `fld01`, `fld02`, `fld03`, `fld04`, `fld05`, `fld06`, `fld07`, `fld08`, `fld09`, `fld10`, `fld11`, `fld12`, `fld13`, `fld14`, `fld15`) VALUES (1, '0.00', '6187.8999', 1, '2', b'01010000', 'ut', 'Aut necessitatibus necessitatibus incidunt consequatur voluptas commodi dolores.', 'Fugiat vel aliquid minus.', 'item3', 'item1,item2', '1974-10-01', '2003-11-26 13:05:06', '1976-01-26 20:28:58', '18:13:15', '2019');
INSERT INTO `all_std_types` (`id`, `fld01`, `fld02`, `fld03`, `fld04`, `fld05`, `fld06`, `fld07`, `fld08`, `fld09`, `fld10`, `fld11`, `fld12`, `fld13`, `fld14`, `fld15`) VALUES (2, '423.00', '0.6784', 7, '1', b'00000000', 'qui', 'Est magni est minima id eligendi consequatur.', 'Dolorem facere aliquid error enim qui totam officiis.', 'item1', 'item1', '1997-02-15', '1992-06-27 03:34:40', '1985-01-29 16:53:36', '17:10:59', '2006');
INSERT INTO `all_std_types` (`id`, `fld01`, `fld02`, `fld03`, `fld04`, `fld05`, `fld06`, `fld07`, `fld08`, `fld09`, `fld10`, `fld11`, `fld12`, `fld13`, `fld14`, `fld15`) VALUES (3, '1618.11', '1000.0000', 8, '2', b'11111100', 'natus', 'Omnis ipsam odio dignissimos neque nobis.', 'Ipsum illo quo sequi minima alias.', 'item1', 'item2', '1973-09-11', '2007-02-01 18:24:51', '2001-04-03 23:42:35', '16:30:30', '2003');
INSERT INTO `all_std_types` (`id`, `fld01`, `fld02`, `fld03`, `fld04`, `fld05`, `fld06`, `fld07`, `fld08`, `fld09`, `fld10`, `fld11`, `fld12`, `fld13`, `fld14`, `fld15`) VALUES (4, '0.00', '0.0000', 8, '8', b'01010101', 'dicta', 'Omnis ab voluptatem et et aut inventore officia maxime.', 'Iure alias consequatur voluptatum repellat odio omnis aut.', 'item1', 'item3', '2015-03-04', '2014-01-03 01:35:36', '2003-06-20 21:22:49', '13:20:37', '1990');
INSERT INTO `all_std_types` (`id`, `fld01`, `fld02`, `fld03`, `fld04`, `fld05`, `fld06`, `fld07`, `fld08`, `fld09`, `fld10`, `fld11`, `fld12`, `fld13`, `fld14`, `fld15`) VALUES (5, '99999999.99', '29.8700', 9, '4', b'10111010', 'et', 'Minima autem numquam expedita itaque modi nostrum odit eum.', 'Doloremque esse sunt id et dignissimos vero sapiente.', 'item3', 'item2', '1981-03-07', '1990-06-14 12:52:09', '2020-05-30 13:41:26', '10:45:35', '2011');
INSERT INTO `all_std_types` (`id`, `fld01`, `fld02`, `fld03`, `fld04`, `fld05`, `fld06`, `fld07`, `fld08`, `fld09`, `fld10`, `fld11`, `fld12`, `fld13`, `fld14`, `fld15`) VALUES (6, '6847.07', '0.0000', 5, '4', b'11000011', 'nesciunt', 'Autem molestiae enim facilis voluptas molestiae sit.', 'Laborum cum dolorum sunt assumenda.', 'item1', 'item2', '1985-02-09', '2017-10-05 17:53:16', '1992-09-24 09:12:33', '16:01:44', '2017');
INSERT INTO `all_std_types` (`id`, `fld01`, `fld02`, `fld03`, `fld04`, `fld05`, `fld06`, `fld07`, `fld08`, `fld09`, `fld10`, `fld11`, `fld12`, `fld13`, `fld14`, `fld15`) VALUES (7, '12733.29', '0.0000', 5, '0', b'10101101', 'enim', 'Quia at vero optio et impedit.', 'Quasi quia optio aut sit.', 'item1', 'item1', '2010-05-23', '1999-08-25 01:28:11', '1978-03-26 08:47:30', '20:05:26', '2008');
INSERT INTO `all_std_types` (`id`, `fld01`, `fld02`, `fld03`, `fld04`, `fld05`, `fld06`, `fld07`, `fld08`, `fld09`, `fld10`, `fld11`, `fld12`, `fld13`, `fld14`, `fld15`) VALUES (8, '11858.18', '1.1300', 0, '6', b'01110011', 'repudianda', 'Et dolorum in placeat quo.', 'Totam a consequuntur ipsa provident error.', 'item2', 'item2', '1978-10-14', '2016-09-05 12:57:56', '1992-01-11 18:54:58', '23:28:26', '2014');
INSERT INTO `all_std_types` (`id`, `fld01`, `fld02`, `fld03`, `fld04`, `fld05`, `fld06`, `fld07`, `fld08`, `fld09`, `fld10`, `fld11`, `fld12`, `fld13`, `fld14`, `fld15`) VALUES (9, '341120.90', '4228.9502', 1, '5', b'00001101', 'sit', 'Quasi omnis debitis saepe voluptatum rerum recusandae ipsa.', 'Deserunt sapiente distinctio hic qui qui in fuga.', 'item3', 'item2', '1993-05-30', '2005-09-02 02:32:55', '2005-12-28 15:39:22', '21:09:12', '1974');
INSERT INTO `all_std_types` (`id`, `fld01`, `fld02`, `fld03`, `fld04`, `fld05`, `fld06`, `fld07`, `fld08`, `fld09`, `fld10`, `fld11`, `fld12`, `fld13`, `fld14`, `fld15`) VALUES (10, '200.77', '0.0000', 9, '7', b'10101000', 'quia', 'Et labore nihil in nobis voluptate dolorum quo.', 'Est cumque voluptas dolorum voluptas minima autem.', 'item1', 'item3', '2006-12-07', '1996-01-22 12:42:57', '1981-08-22 14:32:24', '16:33:35', '2022');

#
# TABLE STRUCTURE FOR: all_other_types
#

DROP TABLE IF EXISTS `all_other_types`;

CREATE TABLE `all_other_types` (
  `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
  `fld01` INET4,
  `fld02` INET6,
  `fld03` JSON,
  `fld04` UUID,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

INSERT INTO `all_other_types` (`id`, `fld01`, `fld02`, `fld03`, `fld04`) VALUES (1, '192.168.0.10', '2001:db8::ff00:42:8329', '[{"_id":"659566b88fa74fa916479f75","index":0,"guid":"ea725f9f-c257-4001-85a1-b297c7d82556"},{"_id":"659566b8dcd2a4a0f288d66b","index":1,"guid":"eec29ab8-df9f-43dd-89cc-0064c7dd646d"}]','123e4567-e89b-12d3-a456-426655440000');
INSERT INTO `all_other_types` (`id`, `fld01`, `fld02`, `fld03`, `fld04`) VALUES (2, 0xA0000012, x'20010DB8000000000000FF0000428329','[{"_id":"659566b88fa74fa916479f75","index":0,"guid":"ea725f9f-c257-4001-85a1-b297c7d82556"},{"_id":"659566b8dcd2a4a0f288d66b","index":1,"guid":"eec29ab8-df9f-43dd-89cc-0064c7dd646d"}]',x'fffffffffffffffffffffffffffffffe');
