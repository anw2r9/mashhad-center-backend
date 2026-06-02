const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Database Error: ${error.message}`);
        if (error.message?.includes('ECONNREFUSED')) {
            console.error('💡 شغّل MongoDB أولاً: pnpm run mongo:start (في نافذة منفصلة)');
        }
        process.exit(1);
    }
};

module.exports = connectDB;
