CREATE DATABASE IF NOT EXISTS insights_db;
USE insights_db;

-- USERS TABLE
CREATE TABLE user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100)
);

-- QUESTIONS TABLE
CREATE TABLE question (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    text TEXT NOT NULL,
    energy_type VARCHAR(50)
);

-- ANSWERS TABLE
CREATE TABLE answer (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    question_id BIGINT,
    value INT,
    type VARCHAR(20),

    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE
);

-- RESULT TABLE (Energy Profile)
CREATE TABLE assessment_result (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,

    fiery_red DOUBLE,
    earth_green DOUBLE,
    sunshine_yellow DOUBLE,
    cool_blue DOUBLE,

    dominant_energy VARCHAR(50),

    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- INSERT INTO question (text, energy_type) VALUES
-- ('I encourage others to embrace something new', 'SUNSHINE_YELLOW'),
-- ('I instinctively know when I hit on a great idea', 'SUNSHINE_YELLOW'),

-- ('I stay on track using what I know will work', 'COOL_BLUE'),
-- ('I reflect on past experiences to guide decisions', 'COOL_BLUE'),

-- ('I speak firmly in support of an objective', 'FIERY_RED'),
-- ('I focus strongly on achieving results', 'FIERY_RED'),

-- ('I prioritise deep personal relationships', 'EARTH_GREEN'),
-- ('I care about people’s wellbeing', 'EARTH_GREEN');


INSERT INTO question (text, energy_type) VALUES
('I energise others with my enthusiasm and optimism', 'SUNSHINE_YELLOW'),
('I enjoy being the one who gets people excited about possibilities', 'SUNSHINE_YELLOW'),
('I often come up with ideas faster than I can write them down', 'SUNSHINE_YELLOW'),
('I find it easy to strike up conversations with people I have just met', 'SUNSHINE_YELLOW'),
('I prefer brainstorming in a group over thinking alone', 'SUNSHINE_YELLOW'),
('I bring a sense of fun and playfulness to situations', 'SUNSHINE_YELLOW'),
('I naturally look for the positive angle in any challenge', 'SUNSHINE_YELLOW'),
('I trust my gut feeling when deciding if something will work', 'SUNSHINE_YELLOW'),
('I prefer to think things through thoroughly before I speak', 'COOL_BLUE'),
('I notice small details that others tend to overlook', 'COOL_BLUE'),
('I like to understand the logic behind a decision before committing', 'COOL_BLUE'),
('I keep careful records and refer back to them regularly', 'COOL_BLUE'),
('I take my time to gather all relevant information before acting', 'COOL_BLUE'),
('I prefer written communication over verbal discussions', 'COOL_BLUE'),
('I hold myself and others to high standards of accuracy', 'COOL_BLUE'),
('I am rarely satisfied until I have found the most logical solution', 'COOL_BLUE'),
('I take charge naturally when a situation requires action', 'FIERY_RED'),
('I push through obstacles rather than waiting for them to clear', 'FIERY_RED'),
('I am direct and say exactly what I mean without hesitation', 'FIERY_RED'),
('I set ambitious goals and pursue them with determination', 'FIERY_RED'),
('I find slow decision-making processes frustrating', 'FIERY_RED'),
('I value results above all else when measuring success', 'FIERY_RED'),
('I am willing to challenge others if I believe they are wrong', 'FIERY_RED'),
('I make quick decisions and move forward with confidence', 'FIERY_RED'),
('I listen carefully and make sure everyone feels heard', 'EARTH_GREEN'),
('I am deeply loyal to the people I care about', 'EARTH_GREEN'),
('I go out of my way to support others during difficult times', 'EARTH_GREEN'),
('I believe maintaining trust takes priority over winning an argument', 'EARTH_GREEN'),
('I find it hard to ignore someone who is struggling emotionally', 'EARTH_GREEN'),
('I prefer collaborative agreement over having my view imposed', 'EARTH_GREEN');










