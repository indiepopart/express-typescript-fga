import { Request, Response, NextFunction } from "express";

import mongoose from "mongoose";

export const errorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log(error);

  if (error instanceof mongoose.Error.ValidationError) {
    const message = "Bad Request";

    response.status(400).json({ message });

    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    console.log("handle ValidationError");
    const message = "Bad Request";

    response.status(400).json({ message });

    return;
  }

  const status = 500;
  const message = "Internal Server Error";

  response.status(status).json({ message });
};
