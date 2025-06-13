import User from '../models/user.model';
import { Request, Response ,NextFunction, RequestHandler} from 'express';
import { generateTokens } from '../services/jwt.service';
import { temporalClient } from '../temporal/client';
import { updateUserProfileWorkflow } from '../temporal/workflows/profile.workflow';

export const handleGoogleCallback = async (req: Request, res: Response) => {
  const { id, name, emails } = req.user as any;
  const email = emails[0].value;
  let user = await User.findOne({ googleId: id });

  if (!user) {
    user = await User.create({
      googleId: id,
      email,
      firstName: name.givenName,
      lastName:'',
      pincode:'',
      phoneNumber:''
    });
  }

  const tokens = generateTokens(user);
  // res.json({ user, ...tokens });
  const encodedData = encodeURIComponent(JSON.stringify({user,...tokens}));
  res.redirect(`${process.env.FRONTEND_URL}?auth=success&data=${encodedData}
`);
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user as any;
  const { firstName, lastName, phoneNumber, pincode, city } = req.body;

  try {
    await temporalClient.workflow.start(updateUserProfileWorkflow, {
      args: [{ id, firstName, lastName, phoneNumber, pincode, city }],
      taskQueue: 'profile-update',
      workflowId: `update-profile-${id}-${Date.now()}`,
    });

    res.status(201).json({ message: 'Update scheduled via Temporal' });
  } catch (error) {
    console.error('Error scheduling workflow:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(404).send("User data not found");
        return;
      }
  
      const { id } = req.user as any;
      const user = await User.findOne({ googleId: id });
  
      if (!user) {
        res.status(404).send("User not found");
        return;
      }
  
      res.status(200).send(user);
    } catch (err) {
      res.status(500).send("Internal server error");
    }
  };
  

    
 

