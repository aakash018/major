import express from "express";

import jwt from "jsonwebtoken";
import { prisma } from "../server";
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken } from "../utils/jwtToken";
import { validateUser } from "../middleware/validateUser";

const router = express.Router();

interface SignupPayload {
  username: string;
  email: string;
  password: string;
  fullname: string;
}

interface LoginPayload {
  username: string;
  password: string;
}

router.post("/signup", async (req, res) => {
  const payload = req.body as SignupPayload;

  try {
    if (
      payload.username.trim() === "" ||
      payload.email.trim() === "" ||
      payload.password.trim() === "" ||
      payload.fullname.trim() === ""
    ) {
      return res.json({
        status: "fail",
        message: "empty fields",
      });
    }

    const hashPassword = await bcrypt.hash(payload.password, 12);

    await prisma.user.create({
      data: {
        email: payload.email,
        username: payload.username,
        password: hashPassword,
        name: payload.fullname,
      },
    });

    return res.json({
      status: "ok",
      message: "user created",
    });
  } catch (e) {
    console.log(e);

    if (e.code === "P2002") {
      return res.json({
        status: "fail",
        field: "username",
        message: "user already registered",
      });
    }

    return res.json({
      status: "fail",
      message: "error",
    });
  }
});

router.post("/login", async (req, res) => {
  const payload = req.body as LoginPayload;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: payload.username,
      },
    });

    if (!user) {
      return res.json({
        status: "fail",
        field: "username",
        message: "user doesn't exist",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      payload.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.json({
        status: "fail",
        field: "password",
        message: "password incorrect",
      });
    }

    const { password, ...userToSend } = user;

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    res.cookie("rid", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      //sameSite: "none",
      //secure: true,
    });

    return res.json({
      status: "ok",
      message: "user found",
      user: userToSend,
      accessToken,
    });
  } catch (e) {
    console.log(e);
    return res.json({
      status: "fail",
      message: "error trying to retrieve user",
    });
  }
});

router.get("/refresh-token", async (req, res) => {
  const cookie = req.cookies as { rid?: string };

  try {
    if (!cookie.rid) {
      throw "bad token";
    }
    const isValid = jwt.verify(cookie.rid, process.env.REFRESH_TOKEN_SECRET);
    if (typeof isValid !== "string") {
      const user = await prisma.user.findUnique({
        where: {
          id: isValid.userId,
        },
      });

      if (user) {
        const accessToken = createAccessToken(user);

        res.json({
          status: "ok",
          message: "new token retrieved",
          accessToken,
        });
      } else {
        throw "bad token";
      }
    } else {
      throw "bad token";
    }
  } catch {
    res.json({
      status: "fail",
      message: "bad refresh token",
    });
  }
});

router.get("/refresh-token-with-user", async (req, res) => {
  const cookie = req.cookies as { rid?: string };

  try {
    if (!cookie.rid) {
      throw "bad token";
    }
    const isValid = jwt.verify(cookie.rid, process.env.REFRESH_TOKEN_SECRET);
    if (typeof isValid !== "string") {
      const user = await prisma.user.findUnique({
        where: {
          id: isValid.userId,
        },
      });

      if (user) {
        const accessToken = createAccessToken(user);
        const { password, ...userNew } = user;
        res.json({
          status: "ok",
          message: "new token retrieved",
          accessToken,
          user: userNew,
        });
      } else {
        throw "bad token";
      }
    } else {
      throw "bad token";
    }
  } catch {
    res.json({
      status: "fail",
      message: "bad refresh token",
    });
  }
});

router.get("/logout", validateUser, (_, res) => {
  res.clearCookie("rid");
  res.json({
    status: "ok",
    message: "cookie deleted",
  });
});

export default router;
