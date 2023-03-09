import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import userModel from '../models/User.js';

export const registration = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new userModel({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret',
      {
        expiresIn: '30d',
      },
    );
    res.json({
      ...user._doc,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: 'can not be register',
      err,
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return req.status(404).json({
        message: 'user not found',
      });
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPassword) {
      return res.status(400).json({
        message: 'wrong login or password',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret',
      {
        expiresIn: '1d',
      },
    );

    res.json({
      ...user._doc,
      token,
    });
  } catch (err) {
    res.status(400).json({
      message: 'authorization faild',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'user not found',
      });
    }
    res.json({
      ...user._doc,
    });
  } catch (err) {
    res.status(500).json({
      message: 'something went wrong =(',
      err,
    });
  }
};
