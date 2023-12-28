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

INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `added`) VALUES (1, 'Michael', 'Messina', 'monia89@example.org', '2011-10-09 10:34:11');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `added`) VALUES (2, 'Joannes', 'Russo', 'sorrentino.akira@example.net', '1982-02-11 20:39:12');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `added`) VALUES (3, 'Deborah', 'Vitale', 'ibattaglia@example.net', '1976-05-31 13:35:36');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `added`) VALUES (4, 'Quasimodo', 'Galli', 'marcella.vitali@example.net', '1975-09-26 12:12:17');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `added`) VALUES (5, 'Giulio', 'Gallo', 'rorlando@example.com', '1985-08-15 09:50:17');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `added`) VALUES (6, 'Loredana', 'De Santis', 'Angelo.cesidia@example.net', '1988-09-19 00:20:43');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `added`) VALUES (7, 'Nunzia', 'Galli', 'pcarbone@example.org', '1981-08-30 03:46:33');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `added`) VALUES (8, 'Gabriele', 'Longo', 'leone.bibiana@example.org', '1972-09-20 05:16:22');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (9, 'Ludovico', 'Vitale', 'eriberto19@example.net', 0, '2004-02-19 04:16:27');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (10, 'Mariagiulia', 'Martini', 'pmarini@example.net', 0, '2020-03-29 09:25:06');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (11, 'Quasimodo', 'De Angelis', 'jole.ferraro@example.com', 1, '1993-11-17 08:27:01');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (12, 'Claudia', 'Guerra', 'smontanari@example.net', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (13, 'Ninfa', 'Conte', 'marino.carmela@example.org', 1, '2022-03-11 19:14:54');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (14, 'Fortunata', 'Vitale', 'rosalba70@example.com', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (15, 'Lucrezia', 'Gatti', 'dcaruso@example.com', 0, '2015-03-23 12:16:43');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (16, 'Umberto', 'Mariani', 'rosita65@example.net', 0, '2013-09-06 03:29:13');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (17, 'Silvano', 'Pellegrino', 'jmontanari@example.net', 0, '1974-08-27 23:09:25');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (18, 'Nicoletta', 'Negri', 'bsartori@example.com', 1, '2023-04-13 05:22:19');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (19, 'Raoul', 'Gallo', 'marini.max@example.net', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (20, 'Ciro', 'Villa', 'tcattaneo@example.net', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (21, 'Audenico', 'Colombo', 'mguerra@example.org', 0, '2018-03-22 15:43:56');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (22, 'Mirko', 'Monti', 'negri.deborah@example.org', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (23, 'Nicoletta', 'Moretti', 'vania.ricci@example.com', 0, '1982-03-27 20:12:08');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (24, 'Eufemia', 'Fabbri', 'nabil.caruso@example.com', 1, '1974-12-19 12:16:59');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (25, 'Lauro', 'Rizzi', 'hector31@example.com', 1, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (26, 'Clodovea', 'Riva', 'loretta.morelli@example.org', 0, '1993-06-23 06:10:05');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (27, 'Antimo', 'Grassi', 'desantis.guendalina@example.net', 1, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (28, 'Ariel', 'Riva', 'xavier.damico@example.net', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (29, 'Carmela', 'Martino', 'marino02@example.net', 1, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (30, 'Pierfrancesco', 'Conte', 'fdonati@example.org', 0, '1975-04-29 23:13:01');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (31, 'Giorgio', 'Morelli', 'cristyn.amico@example.com', 1, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (32, 'Gavino', 'Barbieri', 'hgiuliani@example.org', 1, '1977-06-09 11:35:10');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (33, 'Giovanna', 'Giordano', 'alessio33@example.org', 1, '1986-12-07 03:23:29');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (34, 'Odone', 'Bianchi', 'jelena43@example.net', 0, '1997-03-17 16:45:16');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (35, 'Cesidia', 'Parisi', 'soriana12@example.org', 0, '1976-11-03 19:29:10');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (36, 'Gastone', 'Costantini', 'leonardo.fiore@example.net', 0, '1977-01-01 18:28:17');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (37, 'Maria', 'Gatti', 'karim.barone@example.org', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (38, 'Rebecca', 'Russo', 'fernando.farina@example.com', 1, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (39, 'Irene', 'Monti', 'donati.erminio@example.org', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (40, 'Genziana', 'Ferrari', 'mariagiulia81@example.com', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (41, 'Fabio', 'Ferraro', 'damico.doriana@example.org', 0, '1995-01-31 19:48:41');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (42, 'Ione', 'Vitale', 'derosa.domingo@example.org', 0, '1987-05-21 10:23:47');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (43, 'Ettore', 'Rizzi', 'damico.caligola@example.org', 1, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (44, 'Genziana', 'Marchetti', 'cpalumbo@example.org', 1, '1998-10-31 03:22:06');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (45, 'Fiorenzo', 'De luca', 'ruggiero.damiana@example.org', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (46, 'Laura', 'Pellegrino', 'carbone.fatima@example.com', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (47, 'Carmelo', 'Serra', 'cattaneo.sirio@example.com', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (48, 'Gavino', 'Santoro', 'longo.emanuel@example.net', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (49, 'Doriana', 'Sartori', 'renato58@example.org', 0, '1976-03-19 00:32:25');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (50, 'Thea', 'Sanna', 'nabil.bruno@example.org', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (51, 'Ileana', 'Neri', 'bortolo.vitali@example.net', 0, '1980-04-23 13:04:41');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (52, 'Gaetano', 'Palumbo', 'gallo.eufemia@example.com', 1, '2012-08-11 20:45:54');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (53, 'Loredana', 'Ferrara', 'damico.amerigo@example.net', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (54, 'Manuele', 'Coppola', 'doriana35@example.net', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (55, 'Nunzia', 'Silvestri', 'riva.armando@example.org', 0, '1995-08-02 19:27:10');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (56, 'Emidio', 'Costantini', 'genziana.fabbri@example.net', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (57, 'Deborah', 'Giordano', 'ruggiero.prisca@example.net', 0, '1973-02-12 23:03:54');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (58, 'Ingrid', 'Pellegrini', 'igallo@example.org', 0, '1987-01-13 16:10:10');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (59, 'Emilia', 'Pellegrini', 'emilia62@example.net', 0, '2018-10-04 12:07:13');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (60, 'Jole', 'Marini', 'montanari.samira@example.net', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (61, 'Romeo', 'Mariani', 'lucrezia97@example.net', 1, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (62, 'Raoul', 'Lombardo', 'gferrari@example.net', 1, '1986-11-26 17:16:59');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (63, 'Marina', 'Mazza', 'vmartini@example.org', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (64, 'Battista', 'Pagano', 'yferretti@example.net', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (65, 'Fiorenzo', 'Gatti', 'orlando.vera@example.com', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (66, 'Carmela', 'Testa', 'neri84@example.org', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (67, 'Alessio', 'Russo', 'sasha94@example.com', 0, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (68, 'Diamante', 'Amico', 'milani.prisca@example.net', 1, '2010-05-08 15:22:07');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (69, 'Damiano', 'Esposito', 'giacinta.milani@example.org', 1, '0000-00-00 00:00:00');
INSERT INTO `authors` (`id`, `first_name`, `last_name`, `email`, `active`, `added`) VALUES (70, 'Fortunata', 'Farina', 'augusto74@example.com', 1, '0000-00-00 00:00:00');

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


