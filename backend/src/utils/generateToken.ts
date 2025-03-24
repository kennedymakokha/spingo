

import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();
const generateTokens = (user: any) => {
    const accessToken = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET ? process.env.JWT_SECRET : "your_secret_key",
        { expiresIn: "1h" } // Short expiration
    );

    const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_SECRET ? process.env.REFRESH_SECRET : "my_secret_key",
        { expiresIn: "1h" } // Long expiration
    );

    return { accessToken, refreshToken };
};
export default generateTokens