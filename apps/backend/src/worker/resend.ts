import { Resend } from 'resend';

const resend = new Resend('re_TdcBvneT_5DbUwu19BWBNR3MJ6CEUxB7o');


export const sendSigninEmail = async () => {
  try {
    const response = await resend.emails.send({
      from: 'ultimatcourses@coursehubb.store',
      to: 'akdon9936@gmail.com',
      subject: 'Hello World',
      replyTo:"",
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};      