import { readUsersDB } from "../../../backendLibs/dbLib";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default function login(req, res)
{
  if (req.method === "POST")
  {
    const { username, password } = req.body;

    if (
      typeof username !== "string" ||
      username.length === 0 ||
      typeof password !== "string" ||
      password.length === 0
    )
      return res.status(400).json({
        ok: false,
        message: "Username or password cannot be empty"
      });

    const users = readUsersDB();

    const foundUser = users.find(
      (x) => x.username === username && bcrypt.compareSync(password, x.password)
    );

    if (!foundUser)
      return res.status(400).json({
        ok: false,
        message: "Invalid Username or Password"
      });

    const secret = process.env.JWT_SECRET;

    const token = jwt.sign(
      {
        username: foundUser.username,
        isAdmin: foundUser.isAdmin,
      },
      secret,
      {
        expiresIn: "1800s",
      }
    );

    return res.json({
      ok: true,
      username: foundUser.username ,
      isAdmin: foundUser.isAdmin ,
      token,
    });
  }
}