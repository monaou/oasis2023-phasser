CREATE DATABASE dinomarker_rds;
CREATE USER 'dinomarker_admin'@'localhost' IDENTIFIED BY 'mypassword';
GRANT ALL PRIVILEGES ON dinomarker_rds.* TO 'dinomarker_admin'@'localhost';
FLUSH PRIVILEGES;
