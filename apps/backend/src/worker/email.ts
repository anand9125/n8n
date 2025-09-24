import { Resend } from "resend";
import { simpleParser } from "mailparser";
import Imap from "imap";

const pendingResponses: Map<string, (value: any) => void> = new Map();

// Utility: replace tokens like {{name}} in subject/body
const replaceTokens = (template: string, data: Record<string, any>) => {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const value = data[key.trim()];
    return value !== undefined ? String(value) : "";
  });
};

// --- Send email via Resend ---
export const sendMail = async (
  resendApi: string,
  senderEmailId: string,
  input: any,
  subject: string,
  body: string
) => {
  try {
    const parsedBody = replaceTokens(body, input);
    const parsedSubject = replaceTokens(subject, input);
    const parseResendApi = replaceTokens(resendApi, input);
    const parseSenderEmailId = replaceTokens(senderEmailId, input);

    const resend = new Resend(`${parseResendApi}`);

    console.log(
      "[sendMail] Sending email with:",
      { from: parseSenderEmailId, to: input.emailId, subject: parsedSubject }
    );

    const response = await resend.emails.send({
      from: parseSenderEmailId,
      to: input.emailId,
      subject: parsedSubject,
      html: parsedBody,
    });

    console.log("[sendMail] Response:", response);
  } catch (err) {
    console.error("[sendMail] Error:", err);
  }
};

// --- Start IMAP listener ---
function startImapListener(input:any,senderEmailId:any) {
 // console.log("[IMAP] Starting listener for replies from:", expectedEmail);
  console.log("[IMAP] Starting listener for replies from:", senderEmailId,input);
const imap = new Imap({
  user: 'ultimatcourses@coursehubb.store',
  password: 'your_app_specific_password', // Use app password, not regular password
  host: 'imappro.zoho.in', // Try this alternative host
  port: 993,
  tls: true,
  tlsOptions: { 
    rejectUnauthorized: true, // More secure
    servername: 'imappro.zoho.in'
  },
  connTimeout: 60000, // 60 seconds timeout
  authTimeout: 5000
});
  let lastUid = 0;

  function openInbox(cb: any) {
    imap.openBox("INBOX", false, cb);
  }

  imap.once("ready", () => {
    openInbox((err: any, box: any) => {
      if (err) throw err;

      // Get the latest UID at connection time
      imap.search(["ALL"], (err, results) => {
        if (err) throw err;

        if (results.length) {
          lastUid = Math.max(...results);
        }

        console.log("[IMAP] Listening for new mails after UID:", lastUid);

        imap.on("mail", () => {
          const f = imap.fetch(`${lastUid + 1}:*`, {
            bodies: "",
            markSeen: true,
          });

          f.on("message", (msg, seqno) => {
            let buffer = "";
            msg.on("body", (stream) => {
              stream.on("data", (chunk) => (buffer += chunk.toString("utf8")));
              stream.once("end", async () => {
                const parsed = await simpleParser(buffer);
                console.log("[IMAP] Parsed mail:",parsed)
                const from = parsed.from?.text || "";
                const text = parsed.text?.trim() || "";

                console.log("[IMAP] New mail received from:", from);

                if (from.includes(input.emailId)) {
                  console.log("[IMAP] ✅ Matched user reply:", text);

                  if (pendingResponses.has(input.emailId)) {
                    const resolver = pendingResponses.get(input.emailId)!;
                    resolver(text);
                    pendingResponses.delete( input.emailId);
                  }
                } else {
                  console.log("[IMAP] Ignored mail (not from expected user).");
                }
              });
            });
          });

          f.on("end", () => {
            lastUid = lastUid + 1;
          });
        });
      });
    });
  });

  imap.connect();
}

// --- Send mail and wait for reply ---
export const sendMailAndWait = async (
  resendApi: string,
  senderEmailId: string,
  input: any,
  subject: string,
  body: string
) => {
  console.log("[sendMailAndWait] Sending mail and waiting for reply...");

  return new Promise(async (resolve, reject) => {
    startImapListener(input,senderEmailId); // start listener for this user
    await sendMail(resendApi, senderEmailId, input, subject, body);

    pendingResponses.set(input.emailId, resolve);
    console.log("[sendMailAndWait] Waiting for response from:", input.emailId);
  });
};





import { Router, Request, Response } from 'express';

const router = Router();


router.post("/email/inbound", (req: Request, res: Response) => {
    // TODO: Handle inbound email
    console.log(req.body)
    res.status(200).send  ({
        message: "Email received",
    })  
})


export const postmarkRouter = router;
