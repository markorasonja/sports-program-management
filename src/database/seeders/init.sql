INSERT INTO Users (id, firstName, lastName, email, password, role, dateOfBirth, about, phoneNumber, createdAt, updatedAt) VALUES
('11111111-1111-1111-1111-111111111111', 'Admin', 'User', 'admin@example.com', '$2b$10$DjOvDhZQHpIxmWQvpMF6OuUVnD2vBlHXQxjUJ1jDlNEkvOT7QvILK', 'admin', '1985-05-15', 'System administrator', '+1234567890', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Trainer', 'User', 'trainer@example.com', '$2b$10$DjOvDhZQHpIxmWQvpMF6OuUVnD2vBlHXQxjUJ1jDlNEkvOT7QvILK', 'trainer', '1990-03-20', 'Professional sports trainer', '+1987654321', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'Student', 'User', 'student@example.com', '$2b$10$DjOvDhZQHpIxmWQvpMF6OuUVnD2vBlHXQxjUJ1jDlNEkvOT7QvILK', 'student', '1995-10-10', 'Sports enthusiast', '+1654321987', NOW(), NOW());

INSERT INTO Sports (id, name, description, createdAt, updatedAt) VALUES
('44444444-4444-4444-4444-444444444444', 'Football', 'A team sport played with a spherical ball between two teams of 11 players.', NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'Tennis', 'A racket sport played individually or between two teams of two players each.', NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', 'Basketball', 'A team sport in which two teams of five players each try to score points by throwing a ball through a hoop.', NOW(), NOW());

INSERT INTO Classes (id, name, description, duration, maxCapacity, sportId, trainerId, createdAt, updatedAt) VALUES
('77777777-7777-7777-7777-777777777777', 'Beginner Football Training', 'Introduction to football fundamentals including passing, dribbling, and basic game strategy.', 90, 22, '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', NOW(), NOW()),
('88888888-8888-8888-8888-888888888888', 'Tennis Technique Development', 'Focus on developing proper tennis techniques for serves, returns, and court positioning.', 60, 8, '55555555-5555-5555-5555-555555555555', NULL, NOW(), NOW()),
('99999999-9999-9999-9999-999999999999', 'Basketball Shooting Skills', 'Intensive training focused on improving shooting accuracy and technique.', 75, 15, '66666666-6666-6666-6666-666666666666', NULL, NOW(), NOW());