import type { Request, Response } from "express";
import Utility from "../Utility";
import uploader from "../Cloud/Uploader.single";
import database from "../Database/sanity.client";
import type { auth } from "../Type";
import cloudinary from "../Cloud/Cloudinary";
import type { get } from "node:http";

const professional = async (req: Request, res: Response) => {
  const { nom, phone,phonecode,country,city,currency,place } = req.body;
  const user = req.user as auth;
  const file = req.file as Express.Multer.File;
  try {
    const query = "*[_type == 'pro' && nom == $nom][0]";
    const Dbquery = await database.admin.fetch(query, { nom: nom });
    if (Dbquery) {
      return res.json(
        await Utility.resParams({
          message: "le nom est deja existe",
          status: false,
          field: "douoble",
        })
      );
    } else {
      const url_name = await uploader.uploadeSigle(file.buffer, "web");
      const pro = await database.admin.create({
        _type: "pro",
        userId: {
          _type: "reference",
          _ref: user.id,
        },
        nom: nom,
        phone: phone,
        place: place,
        city: city,
        code:phonecode,
        country: country,
        web: "",
        fb: "",
        waths: "",
        device: currency,
        type: "",
        article: "",
      });
      await database.admin.create({
        _type: "ImgPro",
        proId: {
          _type: "reference",
          _ref: pro._id,
        },
        link: url_name,
      });
      const newQuery =
        "*[_type == 'pro' && userId._ref == $userId][0]{...,[_type == 'ImgPro' && proId._ref == ^._id][0]}";
      const findNewQuery = await database.admin.fetch(newQuery, {
        userId: user.id,
      });
      return res.json(
        await Utility.resParams({
          message: "access",
          status: true,
          field: "activate",
          data: findNewQuery,
        })
      );
    }
  } catch (error) {
    return res.json(
      await Utility.resParams({ message: "error", status: false })
    );
  }
};

const autPro = async (req: Request, res: Response) => {
  const user = req.user as auth;
  try {
    const query =
      "*[_type == 'pro' && userId._ref == $userId ][0]{...,'set':*[_type == 'ImgPro' && proId._ref == ^._id ][0]}";
    const findPro = await database.admin.fetch(query, { userId: user.id });
    if (findPro!==null) {
      return res
        .json(
          await Utility.resParams({
            message: "compte pro",
            status: true,
            field: "pro",
            data: findPro,
          })
        )
        .status(201);
    }
    return res
      .json(
        await Utility.resParams({
          message: "compte pro",
          status: false,
          field: "pro",
          data: null,
        })
      )
      .status(201);
  } catch (error) {
    res.json(
      await Utility.resParams({
        message: "notfound",
        field: "error",
        status: false,
        data: null,
      })
    );
  }
};

const addArticle = async (req: Request, res: Response) => {
  const user = req.user as auth;
  const files = req.files as Express.Multer.File[];
  const {
    title,
    code,
    description,
    price,
    category,
    quantity,
    model,
    size,
    marque,
    heigth,
    width,
    length,
    device,
    priceInitial
  } = req.body;
  try {
    const article = await database.admin.create({
      _type: "article",
      userId: {
        _type: "reference",
        _ref: user.id,
      },
      title: title,
      code: code,
      description: description,
      priceI:priceInitial,
      price: Number(price),
      device: device,
      quantity: Number(quantity),
      category: category,
      model: model,
      size: size,
      marque: marque,
      heigth: heigth,
      width: width,
      length: length,
    });
    const buffers: Buffer[] = [];
    for (const file of files) {
      buffers.push(file.buffer);
    }
    const urls = await uploader.uploadeMultiple(buffers, "article");
    for (let url of urls) {
      await database.admin.create({
        _type: "imgAr",
        articleId: {
          _type: "reference",
          _ref: article._id,
        },
        links: url,
      });
    }
    res.json(
      await Utility.resParams({
        message: "article ajouter",
        field: "article",
        status: true,
        data: article,
      })
    );
  } catch (error) {
    res.json(
      await Utility.resParams({
        message: `erreur survenue${error}`,
        status: false,
        field: "error",
      })
    );
  }
};
const getAllArticle = async(req:Request,res:Response)=>{
  await Utility.Requete(req,res,async()=>{
    const query = "*[_type == 'article' ]{...,'user':*[_type == 'User' && _id == ^.userId._ref][0],'pro':*[_type == 'pro' && userId._ref == ^.userId._ref]{...,'set':*[_type == 'ImgPro' && proId._ref == ^._id][0]}[0],'set':*[_type == 'imgAr' && articleId._ref == ^._id]}";
    const findArticle = await database.admin.fetch(query);
    return res.json(
      await Utility.resParams({
        message: "article trouve",
        status: true,
        field: "article",
        data: findArticle,
      })
    ).status(201);
  })

}
const getArticle = async (req: Request, res: Response) => {
  const user = req.user as auth;
  try {
    const query =
      "*[_type == 'article' && userId._ref == $userId ]{...,'set':*[_type == 'imgAr' && articleId._ref == ^._id]}";
    const findArticle = await database.admin.fetch(query, { userId: user.id });

    if (findArticle) {
      return res
        .json(
          await Utility.resParams({
            message: "article trouve",
            status: true,
            field: "article",
            data: findArticle,
          })
        )
        .status(201);
    }
    return res
      .json(
        await Utility.resParams({
          message: "article non trouve",
          status: false,
          field: "article",
          data: null,
        })
      )
      .status(201);
  } catch (error) {
    res.json(
      await Utility.resParams({
        message: "notfound",
        field: "error",
        status: false,
        data: null,
      })
    );
  }
};

const deleteArticle = async (req: Request, res: Response) => {
  const { data } = req.body;
  const user = req.user as auth;
  try {
    let findImg = [];
    const queryArticle =
      "*[_type == 'article' && userId._ref == $userId ]{...,'set':*[_type == 'imgAr' && articleId._ref == ^._id]}";
    const query = "*[_type == 'imgAr' && articleId._ref == $id]";
    for (const id of data) {
      const img = await database.admin.fetch(query, { id: id });
      for (const i of img) {
        const publicId = uploader.getPublicId(i.links, "article");
        const trasaction = database.admin.transaction();
        trasaction.delete(i._id);
        await trasaction.commit();
        const result = await cloudinary.uploader.destroy(publicId, {
          resource_type: "image",
        });
      }

      const articleTrasaction = database.admin.transaction();
      articleTrasaction.delete(id);
      await articleTrasaction.commit();
    }

    const findArticle = await database.admin.fetch(queryArticle, {
      userId: user.id,
    });
    res.json(
      await Utility.resParams({
        message: "article supprimer",
        field: "article",
        status: true,
        data: findArticle,
      })
    );
  } catch (error) {
    res.json(
      await Utility.resParams({
        message: `erreur survenue${error}`,
        status: false,
        field: "error",
      })
    );
  }
};

const addPub = async (req: Request, res: Response) => {
  const { title, pays, code, ville, street, description } = req.body;
  const user = req.user as auth;
  const files = req.files as Express.Multer.File[];
  try {
    const query ="*[_type == 'pub' && userId._ref == $userId]{...,'set':*[_type == 'imgPub' && pubId._ref == ^._id]}";
    const pub = await database.admin.create({
      _type: "pub",
      userId: {
        _ref: user.id,
        _type: "reference",
      },
      title: title,
      pays: pays,
      code: code,
      ville: ville,
      street: street,
      description: description,
      other: [{}],
    });
    if (files) {
      let Buffers: Buffer[] = [];
      for (let x of files) {
        Buffers.push(x.buffer);
      }
      const urls = await uploader.uploadeMultiple(Buffers, "publication");
      for(let value of urls)
      {
        await database.admin.create({
          _type: "imgPub",
          pubId: {
            _ref: pub._id,
            _type: "reference",
          },
          url:value
        });
      }
    }
    const pubs = await database.admin.fetch(query, { userId: user.id });
     res.json(
      await Utility.resParams({
        message: "pub",
        status: true,
        field: "data",
        data:pubs
      })
    );
  } catch (error) {
    res.json(
      await Utility.resParams({
        message: `erreur survenue${error}`,
        status: false,
        field: "error",
      })
    );
  }
};

const getPub = async (req: Request, res: Response) => {
  const user = req.user as auth;
  try {
    const query =
      "*[_type == 'pub' && userId._ref == $userId]{...,'set':*[_type == 'imgPub' && pubId._ref == ^._id]}";
    const pub = await database.admin.fetch(query, { userId: user.id });
    if (pub) {
      return res.json(
        await Utility.resParams({
          message: "pub",
          status: true,
          field: "pub",
          data:pub
        })
      );
    }
    return res.json(
      await Utility.resParams({
        message: "empty",
        status: false,
        field: "empty",
        data:null
      })
    );
  } catch (error) {
    return res.json(
      await Utility.resParams({
        message: `erreur survenue${error}`,
        status: false,
        field: "error",
        data:null
      })
    );
  }
};
const deletePub = async (req: Request, res: Response) => {
  const { data } = req.body;
  const user = req.user as auth;

  try{
    const queryArticle = "*[_type == 'pub' && userId._ref == $userId]{...,'set':*[_type == 'imgPub' && pubId._ref == ^._id]}";
    const queryImg = "*[_type == 'imgPub' && pubId._ref == $id]";
    const pub = await database.admin.fetch(queryArticle, { userId: user.id });

    for(const id of data){
      const img = await database.admin.fetch(queryImg, { id: id });
      for(const i of img){
        const publicId = uploader.getPublicId(i.url, "publication");
        const trasaction = database.admin.transaction();
        trasaction.delete(i._id);
        await trasaction.commit();
        const result = await cloudinary.uploader.destroy(publicId, {
          resource_type: "image",
        });
      }
      const pubTrasaction = database.admin.transaction();
      pubTrasaction.delete(id);
      await pubTrasaction.commit();
    }

    const findnewPub = await database.admin.fetch(queryArticle, { userId: user.id });
    res.json(
      await Utility.resParams({
        message: "publication supprimer",
        field: "publication",
        status: true,
        data: findnewPub,
      })
    );


  }catch(error){
    res.json(
      await Utility.resParams({
        message: `erreur survenue${error}`,
        status: false,
        field: "error",
        data:null
      })
    );
  }

};

const authControlleur = {
  professional,
  autPro,
  addArticle,
  getArticle,
  getAllArticle,
  deleteArticle,
  addPub,
  getPub,
  deletePub,
};

export default authControlleur;
