-- Create databases for each service
CREATE DATABASE catalog;
CREATE DATABASE orders;
CREATE DATABASE payments;
CREATE DATABASE emails;
CREATE DATABASE users;
CREATE DATABASE reviews;
CREATE DATABASE loyalty;
CREATE DATABASE search;
CREATE DATABASE analytics;

-- Create users for each service
CREATE USER catalog_user WITH ENCRYPTED PASSWORD 'catalog_pass';
CREATE USER orders_user WITH ENCRYPTED PASSWORD 'orders_pass';
CREATE USER payments_user WITH ENCRYPTED PASSWORD 'payments_pass';
CREATE USER emails_user WITH ENCRYPTED PASSWORD 'emails_pass';
CREATE USER users_user WITH ENCRYPTED PASSWORD 'users_pass';
CREATE USER reviews_user WITH ENCRYPTED PASSWORD 'reviews_pass';
CREATE USER loyalty_user WITH ENCRYPTED PASSWORD 'loyalty_pass';
CREATE USER search_user WITH ENCRYPTED PASSWORD 'search_pass';
CREATE USER analytics_user WITH ENCRYPTED PASSWORD 'analytics_pass';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE catalog TO catalog_user;
GRANT ALL PRIVILEGES ON DATABASE orders TO orders_user;
GRANT ALL PRIVILEGES ON DATABASE payments TO payments_user;
GRANT ALL PRIVILEGES ON DATABASE emails TO emails_user;
GRANT ALL PRIVILEGES ON DATABASE users TO users_user;
GRANT ALL PRIVILEGES ON DATABASE reviews TO reviews_user;
GRANT ALL PRIVILEGES ON DATABASE loyalty TO loyalty_user;
GRANT ALL PRIVILEGES ON DATABASE search TO search_user;
GRANT ALL PRIVILEGES ON DATABASE analytics TO analytics_user;