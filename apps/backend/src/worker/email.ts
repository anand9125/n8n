import {Resend} from "resend";
import { simpleParser } from "mailparser";
const pendingResponses: Map<string, (value: any) => void> = new Map();   //This will store promises that resolve once a reply arrives.
import Imap from 'imap'
const replaceTokens = (template: string, data: Record<string, any>) => {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const value = data[key.trim()];
    return value !== undefined ? String(value) : "";
  });
};
//input: form submission data (e.g. { name: "Anand", email: "test@example.com" })
//subject: may contain tokens (e.g. "Welcome {{name}}")
//body: may contain tokens (e.g. "Hello {{name}}, your email is {{email}}")
export const sendMail = async (resendApi:string,senderEmailId: string,input: any, subject: string, body: string) => {
    try{
        const parsedBody = replaceTokens(body, input);
        const parsedSubject = replaceTokens(subject, input);
        const parseResendApi = replaceTokens(resendApi, input);
        const parseSenderEmailId = replaceTokens(senderEmailId, input);
        const resend = new Resend(`${parseResendApi}`);   
        console.log(resendApi,senderEmailId,input,subject,body,"this is actual data this we need")   
        const response = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'akdon9936@gmail.com',
            subject: 'Hello World',
            html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
        });
        console.log(response)
    }catch(err){
        console.log(err)
    }
}

function startImapListener(input:any){
    console.log("starting imap listener")
    console.log(input)
    const imap = new Imap({
        user:`akdon9936@gmail.com`,
        password:`zrtc uvit uenj infm`,
        host:`imap.gmail.com`,
        port:993,
        tls:true,
        tlsOptions: { rejectUnauthorized: false }
    })
  function openInbox(cb: any) {
    imap.openBox("INBOX", false, cb);
  }

  imap.once("ready", () => {
    openInbox(() => {
      imap.on("mail", () => {
        // new mail arrived → fetch the latest one
        imap.search(["UNSEEN"], (err, results) => {
          if (err || !results.length) return;

          const f = imap.fetch(results, { bodies: "" });
          f.on("message", (msg) => {
            let buffer = "";
            msg.on("body", (stream) => {
              stream.on("data", (chunk) => (buffer += chunk.toString("utf8")));
              stream.once("end", async () => {
                const parsed = await simpleParser(buffer);
                const from = parsed.from?.text;
                const text = parsed.text;

                console.log("New reply from:", from, "→", text);

                // resolve pending promise if exists
                if (from && pendingResponses.has(from)) {
                  const resolver = pendingResponses.get(from)!;
                  resolver(text);
                  pendingResponses.delete(from);
                }
              });
            });
          });
        });
      });
    });
  });

  imap.connect();
}


export const sendMailAndWait = async (resendApi:string,senderEmailId: string,input: any, subject: string, body: string) => {
    console.log("sending mail",resendApi,senderEmailId,input,subject,body)
    return new Promise (async(resolve,reject)=>{
                startImapListener(input)
        await sendMail(resendApi,senderEmailId,input,subject,body)
        pendingResponses.set(input.emailId,resolve)
        console.log("waiting for response")
    })  
}