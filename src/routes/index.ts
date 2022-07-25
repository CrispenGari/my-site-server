import { Request, Response, Router } from "express";
import { sendEmail, sendAutoReply } from "../utils";
import Visitor from "../models";
const router: Router = Router();

router.get("/api/v1/visitors", async (_req: Request, res: Response) => {
  try {
    const visitors = await Visitor.find({});
    return res.status(200).json({
      visitors: visitors.length,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Internal Server error.",
    });
  }
});

router.post("/api/v1/visit", async (req: Request, res: Response) => {
  try {
    const { ip } = req.body;
    const found = await Visitor.findOne({
      ipAddress: ip,
    });

    if (found?.ipAddress) {
      await Visitor.updateOne(
        {
          ipAddress: found.ipAddress,
        },
        {
          $set: {
            lastVisit: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
          },
        }
      );
      return res.status(204).json({
        status: 204,
        message: "updated",
      });
    }
    await Visitor.create({ ipAddress: ip as string });
    return res.status(201).json({
      status: 201,
      message: "created",
    });
  } catch (e) {
    return res.status(500).json({
      code: 500,
      message: "Internal Server error.",
    });
  }
});

router.get("/", (_req: Request, res: Response) => {
  console.log(_req.session);
  return res.status(200).json({
    name: "backend",
    language: "typescript",
    message: "hello world!",
    programmer: "@programer",
    moto: "i'm a programer i have no life!",
  });
});

router.post("/api/v1/send-email", async (req: Request, res: Response) => {
  try {
    const { subject, body, from, firstName, lastName, phoneNumber } = req.body;
    const fullName: string = `${firstName} ${lastName}`;
    const html: string = `
    <h3>${from} is saying:</h3> 
    
    ${body}

    <h3>Call ${fullName} at: ${phoneNumber}</h3>

    <h5>Kind Regards</h5>
    <br/>
    ${fullName}
    `;

    // sending an email
    await sendEmail(html, subject, from, fullName);
    // automatic reply

    const autoReplyHTML: string = `
    <h2>${subject}</h2>

    <p>This email is an automatic response for your request to us on your email of the subject <b>"${subject}"</b>. We will respond to your email as soon as possible.</p><p><b>Please do not reply to this email</b></p>
  
    <h5>Kind Regards</h5>
<br/>
    Crispen
    `;
    await sendAutoReply(autoReplyHTML, subject, from);

    return res.status(200).json({
      code: 200,
      message: "The email was sent successfully.",
    });
  } catch (e) {
    return res.status(500).json({
      code: 500,
      message: "Failed to send the email.",
    });
  }
});

export default router;
