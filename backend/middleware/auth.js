import jwt from "jsonwebtoken"
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  '944161213551-ve6q3gohao3p9ju3ibofes7lef3ttfsj.apps.googleusercontent.com',
  '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',
  'https://bigbite-site-backend.onrender.com/api/user/google-login'
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://mail.google.com/']
});

console.log('Authorize this app by visiting this url:', authUrl);

const authMiddleware = (req, res, next) => {
  try {
    if ( req.headers.authorization &&req.headers.authorization.startsWith("Bearer ")) {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);   


      // Instead of nesting, set userId directly:
      req.body.userId = decodedToken.userId;

      next();
    } else {
      throw new Error("Authorization header missing or invalid");
    }
  } catch (error) {
    // Your existing error handling 
  }
};

export { authMiddleware, authUrl };