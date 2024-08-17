import { errorHandler } from "../utils/error.js";
import Comment from '../models/comment.model.js'
import User from "../models/user.model.js";

export const createComment = async(req,res,next)=>{
    try {
        const {content, userId, postId} = req.body;
        
        if(userId!=req.user.id){
            return next(errorHandler(400,'you are not allowed to comment'));
        }

        const newComment = new Comment({
            content,
            postId,
            userId
        })
        await newComment.save();

        res.status(200).json(newComment);
    } catch (error) {
        next(error);
    }
}

export const getPostComments = async (req,res,next)=>{
    try {
        const comments = await Comment.find({postId : req.params.postId}).sort({
            createdAt:-1
        });

        res.status(200).json(comments);

    } catch (error) {
        next(error);
    }
}

export const likeComment = async (req,res, next)=>{
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(400, 'comment can be found'));
        }
        const userIndex = comment.likes.indexOf(req.user.id);

        if(userIndex===-1){
            comment.numberOfLikes+=1;
            comment.likes.push(req.user.id);
        }else{
            comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
        }
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
}

export const editComment = async (req,res,next)=>{
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler(404,'No comment found')); 
        }
        if(req.user.id!==comment.userId || !req.user.isAdmin){
            return next(errorHandler(404,'You are not authorised to  make changes'));
        }

        const editComment= await Comment.findByIdAndUpdate(req.params.commentId,{
            content : req.body.content
        },
        {new:true})

        res.status(200).json(editComment);
    } catch (error) {
            next(error);
    }   
}

