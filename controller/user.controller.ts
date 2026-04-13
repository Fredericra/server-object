import type { Request, Response } from "express";
import Utility from "../Utility";
import type { sigin, confirm, login, User } from "../Type";
import bcrypt from "bcrypt";
import bookMail from "../Mail/book";
import { sign, verify } from "jsonwebtoken";
import database from "../Database/sanity.client";

const Login = async (req: Request, res: Response) => {
  const { data } = req.body;
  try {
    const users = (await Utility.decrypte(data)) as login;
    const query =
      '*[_type == "User" && email == $email][0]{...,"set":*[_type == "userParams" && userId._ref == ^._id][0]}';
    const findUser = await database.admin.fetch(query, { email: users.email });

    if (findUser) {
      const newUser = findUser as User;
      const passwordVerify = await bcrypt.compare(
        users.password,
        newUser.password,
      );
      if (passwordVerify) {
        const token = sign(
          { email: users.email, id: newUser._id },
          process.env.SECRET as string,
          { expiresIn: "2d" },
        );
        return res
          .json(
            await Utility.resParams({
              message: "access login",
              status: true,
              field: "login",
              token: token,
              verify: newUser.set?.verify,
            }),
          )
          .status(201);
      }
      return res.json(
        await Utility.resParams({
          message: "mots de pass incorect",
          status: false,
          field: "password",
          data: null,
        }),
      );
    } else {
      res.json(
        await Utility.resParams({
          message: "email n'exite pas",
          status: false,
          field: "email",
          data: null,
        }),
      );
    }
  } catch (error) {
    res
      .json(
        await Utility.resParams({
          message: `erreur de survenue ${error}`,
          status: false,
          field: "error",
          data: {},
        }),
      )
      .status(201);
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const user = (await Utility.decrypte(data)) as sigin;
    const password = await bcrypt.hash(user.password, 10);
    const code = await Utility.code(10);
    const email = user.email;
    const queryConfirm =`*[_type == "letter" && type == $type][0]`;
    const query = `*[_type == "User" && email == $email][0]`;
    const findMail = await database.admin.fetch(query, { email: email });
    const findMessage = await database.admin.fetch(queryConfirm,{type:'messageconfirm'})
    if(findMessage!==null){
      const message = findMessage.message
      .replace('$name',user.email.split('@')[0])
      .replace('$code',code);
      await bookMail.sendCode(user.email,message,'Confirmation du Compte')
    }
    else{
      await bookMail.sendCode(user.email,`<div>Bonjour, ${user.email.split('@')[0]},\n veuillez confirme votre compte \n <div>${code}</div></div>`,'Confirmation de compte');
    }

    if (findMail !== null) {
     return res.json(
        await Utility.resParams({
          field: "exist",
          status: false,
          message: "email deja inscrire",
        }),
      );
    } else {
      const newUser = await database.admin.create({
        _type: "User",
        email: user.email,
        password: password,
      });
      const token = sign(
        { email: user.email, id: newUser._id },
        process.env.SECRET as string,
        {
          expiresIn: "2d",
        },
      );
      const userParams = await database.admin.create({
        _type: "userParams",
        userId: {
          _type: "reference",
          _ref: newUser._id,
        },
        code: code,
        verify: false,
        username: user.username.toUpperCase(),
        firstname: user.firstname,
        lastname: user.lastname,
        check: true,
        bio: "",
        admin: email === "bokyshoping@gmail.com" ? true : false,
      });
      res.json(
        await Utility.resParams({
          message: "inscription reuissite",
          status: true,
          field: "inscrire",
          code: code,
          verify: true,
          token: token,
        }),
      );
    }
  } catch (error) {
    return res
      .json(
        await Utility.resParams({
          message: `erreur de survenue ${error}`,
          status: false,
          field: "error",
          data: {},
        }),
      )
      .status(201);
  }
};

const confirm = async (req: Request, res: Response): Promise<any> => {
  try {
    const { data } = req.body;
    const user = req.user;
    const decrypteData = (await Utility.decrypte(data)) as confirm;
    const query =
      '*[_type=="User" && email == $email][0]{...,"set":*[_type=="userParams" && userId._ref == ^._id][0]}';
    const findUser = await database.admin.fetch(query, { email: user.email });
    const newUser = findUser as User;
    const params = await database.admin.fetch(
      "*[_type=='userParams' && userId._ref == $userId][0]",
      { userId: newUser.set?.userId._ref },
    );
    const newParams = await database.admin
      .patch(params._id)
      .set({ verify: true })
      .commit();
      return res.json(
        await Utility.resParams({
          message: "confirm",
          field: "confirm",
          status: true,
          data: findUser,
        }),
      );

  } catch (error) {
    return res
      .json(
        await Utility.resParams({
          message: `erreur survenue${error}`,
          status: false,
          field: "error",
        }),
      )
      .status(201);
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const query =
      '*[_type == "User" && email == $email][0]{...,"set":*[_type == "userParams" && userId._ref == ^._id][0]}';
    const findUser = await database.admin.fetch(query, { email: user.email });
    if (findUser) {
      return res.json(
        await Utility.resParams({
          message: "user",
          status: true,
          data: findUser,
          field: "user",
        }),
      );
    }
    return res.json(
      await Utility.resParams({
        message: "empty",
        status: true,
        field: "empty",
        data: null,
      }),
    );
  } catch (error) {
    return res
      .json(
        await Utility.resParams({
          message: `erreur survenue${error}`,
          status: false,
          field: "error",
          data: null,
        }),
      )
      .status(201);
  }
};

const Attemp = {
  Login,
  register,
  confirm,
  getUser,
};

export default Attemp;
