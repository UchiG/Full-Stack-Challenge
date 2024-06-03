import { Request, Response } from 'express';
import { QueryOptions } from 'mongoose';
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
  const { page = '1', name = '', email = '' } = req.query; // Access filter parameters from query string
  const limit = 5;
  const options = {
    page: parseInt(page as string, 10),
    limit: limit,
  };

  try {
    const filterQuery: any = {}; // Initialize an empty filter query object

    if (name) {
      filterQuery.name = { $regex: name, $options: 'i' }; // Case-insensitive name search
    }

    if (email) {
      filterQuery.email = { $regex: email, $options: 'i' }; // Case-insensitive email search
    }

    const users = await User.paginate(filterQuery, options); // Apply filter query to pagination

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
export const filterUsers = async (req: Request, res: Response) => {
  const { name, email } = req.query;

  const filters: { [key: string]: any } = {};

  if (name) {
    filters.name = { $regex: name, $options: "i" };
  }

  if (email) {
    filters.email = { $regex: email, $options: "i" };
  }

  const options: QueryOptions = {
    page: parseInt(req.params.page) || 1,
    limit: 10,
    sort: { _id: -1 },
  };

  const users = await User.paginate(filters, options);

  res.json(users);
};

