const sqlite3 = require('sqlite3').verbose();

// Connect to your SQLite3 database
const db = new sqlite3.Database('./pcoins.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Started userRegistration.js and Connected to pcoins database.');
    }
});

// Create the database table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS pcoins (
    user_id TEXT PRIMARY KEY,
    balance INTEGER DEFAULT 0
)`);

module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (message.author.bot) return; // Ignore bot messages

        // Check if the user is registered, and if not, register them
        db.get("SELECT * FROM pcoins WHERE user_id = ?", [message.author.id], (err, row) => {
            if (err) {
                console.error("Error checking user registration:", err);
            } else if (!row) {
                // User not found, register them
                db.run("INSERT INTO pcoins (user_id, balance) VALUES (?, ?)", [message.author.id, 0], (err) => {
                    if (err) {
                        console.error("Error registering user:", err);
                    } else {
                        console.log("User registered successfully:", message.author.id);
                    }
                });
            }
        });
    }
};
