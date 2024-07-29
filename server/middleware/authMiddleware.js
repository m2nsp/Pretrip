import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

function asyncHandler(handler) {
    return async function (req, res){
        try{
            await handler(req,res);
        } catch (e) {
            if(e.name === 'ValidationError'){
                res.status(400).send({message: e.message}); //bad request 
            } else if (e.name === 'CastError') {
                res.status(404).send({message: e.massage});
            } else {
                res.status(500).send({message: e.message}); //server error 
            }
        }
    }
};

const protect = asyncHandler (async (req, res, next)=>{
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await prisma.user.findUnique({
                where: { kakaoId: decoded.kakaoId },
                select: {
                    kakaoId: true,
                    email: true,
                }
            });
            if (!user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            req.user = user;
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

export { protect };
