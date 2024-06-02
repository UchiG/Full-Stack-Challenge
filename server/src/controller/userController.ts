import { Request, Response } from 'express';
import User from '../model/userModel';

export const create = async (req: Request, res: Response): Promise<Response> => {
  try {
    const newUser = new User(req.body);
    const { email } = newUser;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists." });
    }
    const savedData = await newUser.save();
    return res.status(200).json({ message: "User created successfully." });
  } catch (error: any) {
    return res.status(500).json({ errorMessage: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  const page = parseInt(req.params.page, 10) || 1;
  const limit = 5;
  const options = {
    page,
    limit,
  };

  try {
    const users = await User.paginate({}, options);
    if (!users || users.docs.length === 0) {
      return res.status(404).json({ message: "User data not found." });
    }
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(500).json({ errorMessage: error.message });
  }
};


export const getUserById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json(userExist);
  } catch (error: any) {
    return res.status(500).json({ errorMessage: error.message });
  }
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }
    const updatedData = await User.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({ message: "User Updated successfully." });
  } catch (error: any) {
    return res.status(500).json({ errorMessage: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }
    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error: any) {
    return res.status(500).json({ errorMessage: error.message });
  }
};
