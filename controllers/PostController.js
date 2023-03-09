import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
   
    const posts = await PostModel.find();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'cant find posts',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOne({ _id: postId });
    if (!doc) {
      return res.status(404).json({
        message: 'this post doesnt exist',
      });
    }
    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'cant find posts',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'cant make post =(',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const deletePost = await PostModel.findOneAndDelete({
      _id: postId,
    });

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'cant find posts',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      },
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(err);
    res.status(500).json({
      message: 'cant update post',
    });
  }
};
