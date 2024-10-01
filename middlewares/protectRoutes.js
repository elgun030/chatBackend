import jwt from 'jsonwebtoken';

export const protectRoutes = (request, response, next) => {
    const { token } = request.body;

    if (!token) {
        response.status(401).send("No token provided");
        return;
    };

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        request.userId = id;
        next();
        
    } catch (error) {
        response.status(401).send("Invalid token");
        return;
    }
};