import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = (req.headers as any).authorization?.split(" ")[1];

  if (!token) {
    return res.json({
      status: "fail",
      message: "no token provided",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.decoded = decoded as any;
    return next();
  } catch {
    return res.json({
      status: "fail",
      message: "token verification failed",
    });
  }
};
