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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

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


