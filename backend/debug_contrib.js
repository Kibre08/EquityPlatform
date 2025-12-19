const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const API_URL = "http://localhost:5000/api";

async function testApi() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB for user lookup");

        // 1. Find a startup user
        const startup = await User.findOne({ role: 'startup' });
        if (!startup) {
            console.log("No startup user found.");
            return;
        }
        console.log("Found startup user:", startup.email);

        // 2. Login to get token (simulating frontend)
        const jwt = require("jsonwebtoken");
        const token = jwt.sign({ id: startup._id, role: startup.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log("Generated test token");

        // 3. Call the API
        console.log("Calling GET /contributions/startup/contributions...");
        try {
            const res = await fetch(`${API_URL}/contributions/startup/contributions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("API Response Status:", res.status);
            const data = await res.json();
            console.log("API Response Data:", JSON.stringify(data, null, 2));
        } catch (apiErr) {
            console.error("API Error:", apiErr.message);
        }

    } catch (err) {
        console.error("Script Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

testApi();
