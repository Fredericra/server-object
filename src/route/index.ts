import { Router } from "express";
import Attemp from "../controller/user.controller";
import midelware from "../middleware";
import authControlleur from "../controller/auth.controller";
import multer from "multer";
import admincontroller from "../controller/admin.controller";
import message from "../controller/message.controller";
import folio from "../controller/folio.controller";


const router = Router();
const upload = multer({storage:multer.memoryStorage()})
//active mode pro
router.post('/pro',midelware,upload.single('file'),authControlleur.professional)

//ajouter folio profile
router.post('/addprofilefolio',midelware,upload.single('file'),folio.addprofile)
router.get('/getprofiles',midelware,folio.getProfiles)


//cree article
//
router.post('/register',Attemp.register)
router.post('/login',Attemp.Login)
router.post('/confirm',midelware,Attemp.confirm)
router.get('/getuser',midelware,Attemp.getUser)
router.get('/professionel',midelware,authControlleur.autPro)

//Article
router.post('/article',midelware,upload.array('files'),authControlleur.addArticle)
router.get('/getarticle',midelware,authControlleur.getArticle)
router.post('/deletearticle',midelware,authControlleur.deleteArticle)
router.get('/getallarticle',authControlleur.getAllArticle)

//Publication
router.post('/publication',midelware,upload.array('files'),authControlleur.addPub);
router.post('/deletepub',midelware,authControlleur.deletePub);
router.get('/getpub',midelware,authControlleur.getPub);

//newletter
router.post('/newsletter',admincontroller.newletter);
router.get('/getletter',midelware,admincontroller.getnewletter);

//admin
router.get('/getalluser',midelware,admincontroller.getAllUser);
router.post('/deleteuser',midelware,admincontroller.userdelete)

//message
router.post('/getallmessage',midelware,message.getAllMessage);
router.post('/messageClient',midelware,message.messageClient);
router.post('/messageconfirm',midelware,message.messageConfirm);
router.post('/messageletter',midelware,message.messageLetters);
router.post('/messageassitance',midelware,message.messageAssitance);
router.post('/sendMessage',midelware,message.sendLetter)


//Caroussel only admin
router.post('/addimagecarouselle',midelware,upload.array('files'),admincontroller.addImageCarouselle);
router.get('/getimagecarouselle',admincontroller.getImageCarousel);
router.post('/deleteimagecarouselle',midelware,admincontroller.deleteImageCarousel);

export default router;