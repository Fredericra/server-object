import { response, type Request, type Response } from "express";
import database from "../Database/sanity.client";
import Utility from "../Utility";
import bookMail from "../Mail/book";
import type { auth } from "../Type";
import uploader from "../Cloud/Uploader.single";
import cloudinary from "../Cloud/Cloudinary";

const createMessage = async (email: string, message: string, id: string) => {
  await database.admin.create({
    _type: "message",
    emailId: {
      _type: "reference",
      _ref: id,
    },
    message: message,
  });
};

const newletter = async (req: Request, res: Response) => {
  const { email, message } = req.body;
  try {
    const query =
      "*[_type == 'newsletter' && email == $email]{...,'set':*[_type == 'message' && emailId._ref == ^._id]}";
    const finduser = await database.admin.fetch(query, { email: email });
    if (finduser !== null) {
      await createMessage(email, message, finduser[0]._id);
    } else {
      const createnewsletter = await database.admin.create({
        _type: "newsletter",
        email: email,
        abonne: true,
      });
      await createMessage(email, message, createnewsletter._id);
    }
    const queryLetter = `*[_type == "letter" && type == $type][0]`;
    const findLetter = await database.admin.fetch(queryLetter, {
      type: "messageletter",
    });
    const messageLetter = findLetter.message.replace(
      "$name",
      email.split("@")[0],
    );
    await bookMail.sendCode(email, message, "News Letters");
    return res.json(
      await Utility.resParams({
        status: true,
        message: "Message envoyée avec reussite et abonnement reussie",
      }),
    );
  } catch (error) {
    return res.json(
      await Utility.resParams({
        status: false,
        message: "Erreur du serveur" + error,
      }),
    );
  }
};

const getnewletter = async (req: Request, res: Response) => {
  try {
    const query =
      "*[_type == 'newsletter']{...,'set':*[_type == 'message' && emailId._ref == ^._id]}";
    const letter = await database.admin.fetch(query);
    return res.json(
      await Utility.resParams({
        status: true,
        message: "Abonnes recuperees avec reussite",
        data: letter,
      }),
    );
  } catch (error) {
    return res.json(
      await Utility.resParams({
        status: false,
        message: "Erreur du serveur" + error,
      }),
    );
  }
};

const getAllUser = async (req: Request, res: Response) => {
  try {
    const query =
      "*[_type == 'User']{...,'set':*[_type == 'userParams' && userId._ref == ^._id]}";
    const alluser = await database.admin.fetch(query);
    return res.json(
      await Utility.resParams({
        status: true,
        message: "Abonnes recuperees avec reussite",
        data: alluser,
      }),
    );
  } catch (error) {
    return res.json(
      await Utility.resParams({
        status: false,
        message: "Erreur du serveur" + error,
      }),
    );
  }
};

const userdelete = async (req: Request, res: Response) => {
  const { data } = req.body;

  try {
    const queryUser =
      "*[_type == 'user'][{...,'set':*[_type == 'userParams' && userId._ref == ^._id][0]}";
    const query = "*[_type == 'userParams' && userId._ref == $id][0]";
    const queryPro = "*[_type == 'pro' && userId._ref == $id][0]";
    for (let x in data) {
      const trasaction = database.admin.transaction();
      const queryparams = await database.admin.fetch(query, { id: data[x] });
      const pro = await database.admin.fetch(queryPro, { id: data[x] });
      trasaction.delete(queryparams._id);
      if (pro) trasaction.delete(pro._id);
      trasaction.delete(data[x]);
      await trasaction.commit();
    }
    const allUser = await database.admin.fetch(queryUser);
    return res.json(
      await Utility.resParams({
        status: true,
        data: allUser,
        message: "ok",
      }),
    );
  } catch (error) {
    return res.json(
      await Utility.resParams({
        status: false,
        message: "Erreur du serveur" + error,
      }),
    );
  }
};

const addImageCarouselle = async (req: Request, res: Response) => {
  const user = req.user as auth;
  const files = req.files as Express.Multer.File[];
  const { titre, soustitre, description } = req.body;
  try {
    if (files) {
      let Buffres: Buffer[] = [];
      for (let x of files) {
        Buffres.push(x.buffer);
      }
      const urls = await uploader.uploadeMultiple(Buffres, "carouselle");
      for (let value of urls) {
        await database.admin.create({
          _type: "caroussel",
          UserId: {
            _ref: user.id,
            _type: "reference",
          },
          image: value,
          titre: titre,
          sous: soustitre,
          description: description,
        });
      }
    }
    return res.json(
      await Utility.resParams({
        status: true,
        message: "field",
      }),
    );
  } catch (error) {
    return res.json(
      await Utility.resParams({
        status: false,
        message: "Erreur du serveur" + error,
      }),
    );
  }
};

const getImageCarousel = async (req: Request, res: Response) => {
  try {
    const query = '*[_type == "caroussel"]';
    const find = await database.admin.fetch(query);
    return res.json(
      await Utility.resParams({
        status: true,
        message: "success",
        data: find,
        field: "yes",
      }),
    );
  } catch (error) {
    return res.json(
      await Utility.resParams({
        status: false,
        message: "Erreur du serveur" + error,
        data: null,
      }),
    );
  }
};

const deleteImageCarousel = async (req: Request, res: Response) => {
  const query = "*[_type == 'caroussel']";
  const requete = async () => {
    const find = await database.admin.fetch(query);
    const { data } = req.body;
    for (let x of data) {
      const publicId = uploader.getPublicId(x.image, "carouselle");
      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
      });
      const trasaction = database.admin.transaction();
      trasaction.delete(x.id);
      await trasaction.commit();
    }
    return res.json(await Utility.resParams({
      status:true,
      field:'yes'
    }))
  };
  await Utility.Requete(req, res, requete);
};
const admincontroller = {
  newletter,
  getnewletter,
  getAllUser,
  userdelete,
  addImageCarouselle,
  getImageCarousel,
  deleteImageCarousel,
};

export default admincontroller;
