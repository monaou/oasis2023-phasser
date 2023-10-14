-- createTables.sql
USE dinomarker_rds;

CREATE TABLE action_record (
    id INT PRIMARY KEY AUTO_INCREMENT,
    stage_id INT NOT NULL,
    game_instance_id INT NOT NULL,
    action_type INT NOT NULL,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

