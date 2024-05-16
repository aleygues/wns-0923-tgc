import Mailjet from "node-mailjet";

const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE,
});

export async function sendResetPassword(email: string, token: string) {
  try {
    // use email templates to generate the HTML content based on some templates
    const result = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MJ_EXP_EMAIL,
            Name: process.env.MJ_EXP_NAME,
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: "Réinitialise ton MDP !",
          TextPart: `Utilise le token : ${token} !`,
          HTMLPart: `Clique sur le lien suivant http://localhost:8000/set-password?token=${token} !`,
        },
      ],
    });
    console.log(result.body);
  } catch (err: any) {
    console.log(err.statusCode);
  }
}
