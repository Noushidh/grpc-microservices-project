import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const publicRoutes = ["/api/auth/login", "/api/auth/register"];

  const currentPath = req.originalUrl.split("?")[0];

  if (req.method === "POST" && publicRoutes.includes(currentPath)) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Token is required.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
