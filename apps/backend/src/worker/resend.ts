import { Resend } from 'resend';

const resend = new Resend('re_dbRgQuoL_7jZVjHVTLvosBfzGdNKNk3Ao');


export const sendSigninEmail = async () => {
  try {
    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'akdon9936@gmail.com',
      subject: 'Hello World',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};      