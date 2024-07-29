import express from 'express';
import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();
const location = express.Router();
location.use(express.json());

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

// 리뷰 생성
location.post('/locationsByName/:id/reviews', async (req, res) => {
    assert(req.body, CreateReview);
    const { id } = req.params;
    const review = await prisma.review.create({
        data: {
            ...req.body,
            locationId: id, // 해당 location의 리뷰로 연결
        },
    });
    res.status(201).send(review);
});

// 리뷰 수정
location.patch('/reviews/:reviewId', async (req, res) => {
    assert(req.body, UpdateReview);
    const { reviewId } = req.params;
    const user = await prisma.review.update({
        where: { id: Number(reviewId) },
        data: req.body,
    });
    res.send(user);
});

// 리뷰 삭제
location.delete('/reviews/:reviewId', async (req, res) => {
    const { reviewId } = req.params;
    await prisma.review.delete({
        where: { id: Number(reviewId) },
    });
    res.sendStatus(204);
});

export default location;
