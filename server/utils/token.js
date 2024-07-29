/* 원래 코드
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export default generateToken;
*/
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (user) => {
    return jwt.sign(
        {
            kakaoId: user.kakaoId, // Prisma 모델에서 사용되는 Kakao ID
            email: user.email,     // 사용자 이메일
        },
        process.env.JWT_SECRET,  // JWT 비밀 키
        { expiresIn: '1h' }      // 토큰 유효 시간
    );
};

export default generateToken;
