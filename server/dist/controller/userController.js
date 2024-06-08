import User from '../model/userModel.js';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema.js';
import { querySchema } from '../schemas/query.schema.js';
import { z } from 'zod';
export const create = async (req, res) => {
    try {
        const { body } = createUserSchema.parse(req);
        const newUser = new User(body);
        const { email } = newUser;
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists." });
        }
        await newUser.save();
        return res.status(200).json({ message: "User created successfully." });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        return res.status(500).json({ errorMessage: error.message });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const validatedQuery = querySchema.parse(req.query);
        const { page = '1', name = '', email = '' } = validatedQuery;
        const limit = 5;
        const options = {
            page: parseInt(page, 10),
            limit: limit,
        };
        const filterQuery = {};
        if (name) {
            filterQuery.name = { $regex: name, $options: 'i' };
        }
        if (email) {
            filterQuery.email = { $regex: email, $options: 'i' };
        }
        const users = await User.paginate(filterQuery, options);
        if (!users || users.docs.length === 0) {
            return res.status(404).json({ message: "User data not found." });
        }
        return res.status(200).json(users);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        return res.status(500).json({ errorMessage: error.message });
    }
};
export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if (!userExist) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json(userExist);
    }
    catch (error) {
        return res.status(500).json({ errorMessage: error.message });
    }
};
export const update = async (req, res) => {
    try {
        const id = req.params.id;
        const { body } = updateUserSchema.parse(req);
        const userExist = await User.findById(id);
        if (!userExist) {
            return res.status(404).json({ message: "User not found." });
        }
        await User.findByIdAndUpdate(id, body, { new: true });
        return res.status(200).json({ message: "User updated successfully." });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        return res.status(500).json({ errorMessage: error.message });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if (!userExist) {
            return res.status(404).json({ message: "User not found." });
        }
        await User.findByIdAndDelete(id);
        return res.status(200).json({ message: "User deleted successfully." });
    }
    catch (error) {
        return res.status(500).json({ errorMessage: error.message });
    }
};
export const filterUsers = async (req, res) => {
    try {
        const validatedQuery = querySchema.parse(req.query);
        const { name, email } = validatedQuery;
        const filters = {};
        if (name) {
            filters.name = { $regex: name, $options: "i" };
        }
        if (email) {
            filters.email = { $regex: email, $options: "i" };
        }
        const options = {
            page: parseInt(req.params.page) || 1,
            limit: 10,
            sort: { _id: -1 },
        };
        const users = await User.paginate(filters, options);
        res.json(users);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        return res.status(500).json({ errorMessage: error.message });
    }
};
