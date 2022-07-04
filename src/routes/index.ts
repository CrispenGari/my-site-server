import { Request, Response, Router } from "express";
import { sendEmail } from "../utils";
const router: Router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
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

    ${fullName}
    `;

    // sending an email
    await sendEmail(html, subject, from, fullName);
    // automatic reply
    return res.status(200).json({
      code: 200,
      message: "The email was sent successfully.",
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      code: 500,
      message: "Failed to send the email.",
    });
  }
});

export default router;