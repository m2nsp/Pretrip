import express from 'express';
import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client';
import { validateReview, validateReviewUpdate } from '../struct.js';
import { protect } from '../middleware/authMiddleware.js'; 

dotenv.config();

const prisma = new PrismaClient();
const location = express.Router();
location.use(express.json());

function asyncHandler(handler) {
    return async function (req, res) {
      try {
        await handler(req, res);
      } catch (e) {
        if (e.name === 'ValidationError') {
          res.status(400).send({ message: e.message }); // bad request
        } else if (e.name === 'CastError') {
          res.status(404).send({ message: e.message });
        } else {
          res.status(500).send({ message: e.message }); // server error
        }
      }
    };
  }


// id에 해당하는 장소 조회
location.get('/locationsByName/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.headers['user-id'];  // 요청 헤더에서 가져온다고 가정

    if (!userId) {
        return res.status(400).send({ message: 'User ID is required' });
    }

    try {
        // 장소 검색
        const locationData = await prisma.location.findUnique({
            where: { id: id },
            include: { reviews: true },
        });

        if (locationData) {
            // 검색된 장소를 History 테이블에 추가한다
            await prisma.history.create({
                data: {
                    userId: userId,
                    locationId: locationData.id,
                    // searchedAt은 기본값으로 현재 시간입니다.
                },
            });

            // 장소 정보 반환
            res.send(locationData);
        } else {
            res.status(404).send({ message: 'Location not found.' });
        }
    } catch (error) {
        console.error('Error while searching location or adding to history:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});


/*
// id에 해당하는 장소 조회
location.get('/detail/:id/', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const location = await prisma.location.findUnique({
      where: { id: Number(id) },
      include: {reviews: true},
    });
    if (location){
        res.send(location);
    }
    else{
        res.status(404).send({message:"Location not found."});
    }
  }));
*/


// 리뷰 생성
location.post('/detail/:id/reviews',  /*protect, */ asyncHandler(async (req, res) => {
// 리퀘스트 바디 내용으로 리뷰 생성
//assert(req.body, CreateReview);
    validateReview(req.body);
    const { id } = req.params;
    const { email, rating, comment } = req.body;

    const user=await prisma.user.findUnique({
      where: { email: email }
    })
    if(!user){
      return res.status(400).send({message: 'User not found'});
    }
    const review = await prisma.review.create({
      data: {
        locationId: id,
        userId: email,
        userName: user.nickname,
        rating,
        comment
      },
    });
    await updateAverageRating(id);

    res.status(201).send(review);
}));

  //리뷰 평균 점수 계산 
  const updateAverageRating = async (locationId) => {
    const reviews = await prisma.review.findMany({
      where: { locationId: locationId },
    });
  
    const averageRating = reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;
  
    await prisma.location.update({
      where: { id: locationId },
      data: { averageRating },
    });
  };


  //리뷰 수정 
  location.patch('/detail/:id/reviews/:reviewId', /*protect, */ asyncHandler(async (req, res) => {
    validateReviewUpdate(req.body);
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const updateData = {};
    if(rating !== undefined) updateData.rating = rating;
    if(comment !== undefined) updateData.comment = comment;
    try {
      const updatedReview = await prisma.review.update({
        where: { id: Number(reviewId) },
        data: updateData,
      });
      res.send(updatedReview);
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
  }));

// 리뷰 삭제
location.delete('/detail/:id/reviews/:reviewId', /*protect, */asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
      await prisma.review.delete({
          where: {id: Number(reviewId)},
      });
    res.sendStatus(204);
}));
export default location;
