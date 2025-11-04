// src/db/sequelize.ts
import { Sequelize } from 'sequelize-typescript';
import config from 'config';
import path from 'path'; // Import the 'path' module to resolve directory paths

// Load database configuration
const dbConfig = config.get<{ host: string, port: number, username: string, password?: string, database: string }>('db');

// Create a new Sequelize instance
export const sequelize = new Sequelize({
    dialect: 'mysql',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,

    // --- THIS IS THE FIX ---
    // Instead of manually importing and listing models, provide the path to the models directory.
    // Sequelize will automatically discover and load all model files from this path.
    // This resolves circular dependency issues during initialization.
    models: [path.join(__dirname, '/../models')], // Use path.join for robust path resolution

    logging: false, // Set to true to log SQL queries to console for debugging
    define: {
        timestamps: false, // Disable createdAt and updatedAt columns by default
        underscored: true, // Use snake_case for column names
        freezeTableName: true // Prevent Sequelize from pluralizing table names
    }
});

// Function to connect to the database and synchronize models
export async function connectToDatabase() {
    try {
        await sequelize.authenticate(); // Test the connection
        console.log('Connection to the MySQL database has been established successfully.');

        // Synchronize all models with the database
        await sequelize.sync({ alter: true });
        console.log('Database synchronized.');
    } catch (error) {
        console.error('Unable to connect to the database or synchronize models:', error);
        throw error; // Rethrow to be caught by app.ts
    }
}