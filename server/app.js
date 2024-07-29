import express from 'express';
import router from "./Router/kakaoRoutes.js";
import locationRouter from './Router/locationRoutes.js';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();


const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/auth', router);
app.use('/locations', locationRouter);

app.get('/locations', async(req, res) => {
    //장소 목록 조회
    const locations = await prisma.location.findMany();
    res.send(locations);
})

app.get('/locationsByName', async (req, res) => {
    //이름으로 장소 검색
    const { name } = req.query;

    if (!name) {
        return res.status(400).send({ error: 'Name query parameter is required' });
    }

    try {
        const locations = await prisma.location.findMany({
            where: {
                name: {
                    contains: name,
                },
            },
        });

        if (locations.length > 0) {
            res.send(locations);
        } else {
            res.status(404).send({ message: 'No locations found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while retrieving the locations' });
    }
});


//사용자의 찜목록 조회
app.get('/scraps/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const scraps = await prisma.scrap.findMany({
            where: { scrapperId: email },
            include: { scrapPlace: true }, // 장소 정보 포함
        });

        res.send(scraps);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while retrieving scraps' });
    }
});


//특정 사용자 찜추가
app.post('/scraps/:email', async (req, res) => {
    const { email } = req.params;
    const { locationId } = req.body;

    try {
        // 해당 사용자가 이미 이 장소를 찜했는지 확인
        const existingScrap = await prisma.scrap.findUnique({
            where: {
                scrapperId_scrapPlaceId: {
                    scrapperId: email,
                    scrapPlaceId: locationId,
                },
            },
        });

        if (existingScrap) {
            // 이미 찜한 장소라면 해당 사실을 반환
            return res.status(200).send({ message: 'This location is already in your scrap list.' });
        }

        // 찜하지 않은 장소라면 새로 추가
        const newScrap = await prisma.scrap.create({
            data: {
                scrapper: { connect: { email } },
                scrapPlace: { connect: { id: locationId } },
            },
        });

        res.status(201).send(newScrap);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while adding the scrap' });
    }
});


//사용자의 찜목록에서 특정 장소 삭제
app.delete('/scraps/:email', async (req, res) => {
    const { email } = req.params;
    const { locationId } = req.body;

    try{
        //해당 장소가 찜목록에 존재하는 지 확인
        const existingScrap = await prisma.scrap.findUnique({
            where: {
                scrapperId_scrapPlaceId: {
                    scrapperId: email,
                    scrapPlaceId: locationId,
                },
            },
        });

        if(!existingScrap){
            //이미 찜목록에 존재하지 않는다면 해당 사실 반환
            return res.status(200).send({ message: 'This location is already not in the scrap' });
        }
        //존재한다면 삭제 수행
        await prisma.scrap.delete({
            where: {
                scrapperId_scrapPlaceId: {
                    scrapperId: email,
                    scrapPlaceId: locationId,
                },
            },
        });

        res.status(200).send({ message: 'Location removed from scrap successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while deleting the scrap' });
    }
});


//사용자의 일정 조회
app.get('/events/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const events = await prisma.event.findMany({
            where: { eventCreatorId: email },
            include: { locations: { include: { location: true } } },
        });

        res.send(events);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while retrieving events' });
    }
});


//일정 생성하기
// 기존 날짜에 이벤트가 없으면 생성하고, 있으면 장소 추가 API  -- 이메일을 통해서 사용자 아이디 가져오는 함수 필요
app.post('/events', async (req, res) => {
    const { eventCreatorId, eventDate, locationId } = req.body;

    try {
        // 해당 날짜에 이벤트가 있는지 확인
        const existingEvent = await prisma.event.findFirst({
            where: {
                eventCreatorId,
                eventDate: new Date(eventDate)
            }
        });

        if (existingEvent) {
            // 기존 이벤트에 장소 추가
            const updatedEvent = await prisma.event.update({
                where: { id: existingEvent.id },
                data: {
                    locations: {
                        create: {
                            location: {
                                connect: { id: locationId }
                            }
                        }
                    }
                },
                include: {
                    locations: {
                        include: { location: true }
                    }
                }
            });

            res.status(200).send(updatedEvent);
        } else {
            // 새로운 이벤트 생성
            const newEvent = await prisma.event.create({
                data: {
                    eventCreatorId: eventCreatorId,
                    eventDate: new Date(eventDate),
                    locations: {
                        create: {
                            location: {
                                connect: { id: locationId }
                            }
                        }
                    }
                },
                include: {
                    locations: {
                        include: { location: true }
                    }
                }
            });

            res.status(201).send(newEvent);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while processing the event' });
    }
});


//특정사용자가 일정에서 한개의 장소만 삭제하는 경우
app.delete('/events/:eventId/location/:locationId', async (req, res) => {
    const { eventId, locationId } = req.params;

    try {
        // 해당 이벤트와 장소 관계를 찾기
        const eventLocation = await prisma.eventLocation.findFirst({
            where: {
                eventId: eventId,
                locationId: locationId,
            },
        });

        if (!eventLocation) {
            return res.status(404).send({ message: 'Event location not found' });
        }

        // 해당 관계의 ID를 사용하여 삭제
        await prisma.eventLocation.delete({
            where: {
                id: eventLocation.id,  // ID를 사용하여 삭제
            },
        });

        res.status(200).send({ message: 'Location removed from event successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while removing the location from the event' });
    }
});


//해당날짜의 일정 자체를 삭제
app.delete('/events/date/:eventDate', async (req, res) => {
    const { eventDate } = req.params;

    try {
        // 날짜 형식을 처리하기 위해 파싱 (예: '2024-08-15')
        const date = new Date(eventDate);

        // 날짜 범위를 설정 (해당 날짜의 시작과 끝)
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        // 해당 날짜의 모든 일정을 삭제
        await prisma.event.deleteMany({
            where: {
                eventDate: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });

        res.status(200).send({ message: 'All events on the specified date have been deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while deleting events' });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
