-- createTables.sql
USE dinomarker_rds;

CREATE TABLE ticket_purchases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_address VARCHAR(42) NOT NULL,
    ticket_type INT NOT NULL,
    ticket_num INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ticket_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_type INT UNIQUE NOT NULL,
    ticket_price DECIMAL(18, 2) NOT NULL,
    is_ticket_range BOOLEAN NOT NULL,
    ticket_max_num INT NOT NULL ,
    ticket_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
