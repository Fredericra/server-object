import type { Request, Response } from "express";
import Utility from "../Utility";
import database from "../Database/sanity.client";
import type { auth } from "../Type";
import bookMail from "../Mail/book";

const functionJuste = async (
  req: Request,
  res: Response,
  type: string,
) => {
    const user = req.user as auth;
    const { message } = req.body;
    const query = `*[_type == "letter" && type == $type][0]`;
    const test = `*[_type == "letter"]`
    const find = await database.admin.fetch(query,{type:type});

  try {
    if (find!==null) {
      const update = await database.admin
        .patch(find._id)
        .set({
          message: message,
          UserId: {
            _type: "reference",
            _ref: user.id,
          },
        })
        .commit();
      return res.json(
        await Utility.resParams({
          status: true,
          message: "error",
          field: message,
          data: update,
        }),
      );
    } else {
      const letter = await database.admin.create({
        _type: "letter",
        type: type,
        message: message,
        userId: {
          _type: "reference",
          _ref: user.id,
        },
      });
      return res.json(
        await Utility.resParams({
          status: true,
          message: "message",
          field: message,
          data: letter,
        }),
      );
    }
  } catch (error) {
    return res.json(
      await Utility.resParams({
        status: false,
        message: "error" + error,
        field: "none",
        data: null,
      }),
    );
  }
};

const messageConfirm = async (req: Request, res: Response) => {
    await functionJuste(req,res,'messageconfirm')
};
const messageLetters = async (req: Request, res: Response) => {
  await functionJuste(req,res,'messageletter')
};
const messageClient = async (req: Request, res: Response) => {};
const messageAssitance = async (req: Request, res: Response) => {};
const getAllMessage = async (req: Request, res: Response) => {
    const { type }  = req.body
    const query = "*[_type == 'letter' && type == $type][0]"
    try {
        const find = await database.admin.fetch(query,{type:type});
        return res.json(
            await Utility.resParams({
                status:true,
                data:find,
                message:'letter',
                field:'message'
            })
        )
    } catch (error) {
        return res.json(
            await Utility.resParams({
                status:false,
                field:'error',
                message:'error'+error
            })
        )
    }
};

const sendLetter = async(req:Request,res:Response)=>{
  const user = req.user as auth;
  const { data } = req.body;
  try {
    const query = '*[_type == "letter" && type == $type][0]';
    const find = await database.admin.fetch(query,{type:'messageletter'});
    if(find!==null){
      for(let x of data){
        const { email } = x
        const message = find.message.replace('$name',email.split('@')[0]);
        await bookMail.sendCode(email,message,'News Letters')
      }
    } 
      return res.json(
      await Utility.resParams({
        status:true,
        message:'letter',
        field:'error'
      })
    )
  } catch (error) {
    return res.json(
      await Utility.resParams({
        status:false,
        message:'error'+error,
        field:'error'
      })
    )
  }
}

const message = {
  messageClient,
  messageConfirm,
  messageLetters,
  messageAssitance,
  getAllMessage,
  sendLetter
};

export default message;
