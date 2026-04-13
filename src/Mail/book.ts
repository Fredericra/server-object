import nodemailer from 'nodemailer'
import type { mail } from '../Type'

const transporter = nodemailer.createTransport({
    service:"gmail",
    secure:false,
    auth:{
        user:process.env.BOOK_USER,
        pass:process.env.BOOK_MAIL_API
    }
})


const sendEmail =async(data:mail):Promise<void>=>{
    try {
        const info = await transporter.sendMail(data)
    } catch (error) {
        console.error(error);
    }
}


const sendCode = async(mail:string,html:string,subject:string):Promise<void>=>{

    await sendEmail(
        {
        from:process.env.BOOK_USER as string,
        to:mail,
        subject:subject,
        html:html
      }
    )
}

const sendLetter = async(mail:string):Promise<void>=>{
    await sendEmail({
        from:process.env.BOOK_USER as string,
        to:mail,
        subject:'Vous etes abonne dans notre newsletter',
        text:'Bonjour, nous avons bien recu votre abonnement et message',
        html:`<div>
            <p class="margin:4px">
                Merci de vous etre abonne dans notre newsletter, vous recevrez des nouvelles de nos nouveautes et articles.
            </p>
        </div>`
      }
    )
}
const bookMail = { transporter,sendEmail,sendCode,sendLetter }


export default bookMail