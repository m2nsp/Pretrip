import express from 'express';
import axios from 'axios';
import qs from 'qs';
import prisma from '../prismaClient.js'; // Prisma 클라이언트 import
import generateToken from '../utils/token.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const router = express.Router();

const kakao = {
  CLIENT_ID: process.env.REST_API_KEY,
  REDIRECT_URI: process.env.REDIRECT_URI,
};

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

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { email, password, nickname } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).send({ message: '이미 사용중인 이메일입니다.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
      },
    });

    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true });
    res.send({ message: '회원가입 성공', user });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const pwMatch = await bcrypt.compare(password, user.password);
    if (!pwMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true });
    res.json({ message: 'Login Success', user });
  })
);

router.get(
  '/kakao',
  asyncHandler(async (req, res) => {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.CLIENT_ID}&redirect_uri=${kakao.REDIRECT_URI}&response_type=code`;
    res.redirect(KAKAO_AUTH_URL);
  })
);

router.get(
  '/kakao/callback',
  asyncHandler(async (req, res) => {
    const tokenResponse = await axios({
      method: 'POST',
      url: 'https://kauth.kakao.com/oauth/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        grant_type: 'authorization_code',
        client_id: kakao.CLIENT_ID,
        redirect_uri: kakao.REDIRECT_URI,
        code: req.query.code,
      }),
    });

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const kakaoId = userResponse.data.id.toString(); // Kakao ID를 문자열로 변환
    const nickname = userResponse.data.properties?.nickname || userResponse.data.properties?.profile_nickname;
    const email = userResponse.data.kakao_account?.email || userResponse.data.properties?.account_email;

    console.log('User Response:', userResponse.data);
    console.log('User Info:', { kakaoId, nickname, email });

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          kakaoId,
          email,
          nickname,
          password: '', // 비밀번호는 카카오 로그인 시 빈 문자열로 설정
        },
      });
    }


    // user 객체의 kakaoId를 문자열로 변환
  //  const serializedUser = {
  //    ...user,
  //    kakaoId: user.kakaoId.toString(),
  //  };

    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true });
    res.json({ message: 'Login Success', user });
  })
);

router.get(
  '/logout',
  asyncHandler(async (req, res) => {
    res.clearCookie('token');
    res.send('Logged out');
  })
);

export default router;