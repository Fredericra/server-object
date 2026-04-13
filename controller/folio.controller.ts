import uploader from "../Cloud/Uploader.single";
import database from "../Database/sanity.client";
import type { auth } from "../Type";
import Utility from "../Utility";
import type { Response, Request } from "express";

const addprofile = async (req: Request, res: Response) => {

  try {
    const { nom, prenom, age, profil, pays, adress, telephone, description } =
    req.body;
    const file = req.file as Express.Multer.File;
    const  user = req.user as auth
    const requete =
      '*[_type == "folio" && nom == $nom && prenom == $prenom]{...,"profile":*[_type == "profile" && folioId == ^._id][0]}[0]';
    const profile = '*[_type == "folio" && folioId == $folioId][0]';
    const fetchRequete = await database.admin.fetch(requete, { nom: nom, prenom: prenom });
    const url = await uploader.uploadeSigle(file.buffer, "profile");
    if (requete == null) {
      const createFolio = await database.admin.create({
        _type: "folio",
        userId:{
            _type: "reference",
            _ref: user.id,
        },
        nom: nom,
        prenom: prenom,
      });

      const createProfile = await database.admin.create({
        _type: "profile",
        folioId: 
        {
            _type: "reference",
            _ref: createFolio._id,
        },
        age: age,
        profil: profil,
        pays: pays,
        adress: adress,
        telephone: telephone,
        description: description,
        image: url,
      });
      const viewReque = await database.admin.fetch(requete, { nom: nom });
      res.send(
        await Utility.resParams({
          status: true,
          message: 'profile ajoute avec success',
          data: viewReque,
        }),
      );
    } else {
      const fetchProfile = await database.admin.fetch(profile, {
        folioId: fetchRequete._id,
      });
      if (fetchProfile == null) {
        const createProfile = await database.admin.create({
          _type: "profile",
          folioId: 
          {
            _type: "reference",
            _ref: fetchRequete._id,
          },
          age: age,
          profil: profil,
          pays: pays,
          adress: adress,
          telephone: telephone,
          description: description,
          image:url,
        });
      }
      res.send(
        await Utility.resParams({
          status: true,
          message: 'profile ajoute avec success',
          data: fetchRequete,
        }),
      );
    }
  } catch (error) {
    res.send(
      await Utility.resParams({
        status: false,
        message: `error:${error}`,
        data: null,
      }),
    );
  }

  const call = async () => {};
  await Utility.Requete(req, res, call);
};


const getProfiles = async (req: Request, res: Response) => {
    const find = async()=>{
        const requete = '*[_type == "folio"]{...,"profile":*[_type == "profile" && folioId == ^._id][0]}';
        const fetchRequete = await database.admin.fetch(requete);
        res.send(
            await Utility.resParams({
                status: true,
                message: 'profile trouve avec success',
                data: fetchRequete,
            }),
        );
    }
    await Utility.Requete(req, res, find);
}

const upateProfile = async(req: Request, res: Response) => {
    const update = async()=>{
        const { nom, prenom, age, profil, pays, adress, telephone, description } = req.body;
        const file = req.file as Express.Multer.File;
        
        
       
    }
    await Utility.Requete(req, res, update);
}

const folio = {
  addprofile,
  getProfiles
};

export default folio;
