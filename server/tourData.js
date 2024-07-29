import axios from "axios";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function fetchTourData() {
    const serviceKey = process.env.TOUR_API_KEY;
    const numOfRows = 10;
    const pageNo = 1;
    const url = `http://apis.data.go.kr/B551011/KorService1/areaCode1?serviceKey=${serviceKey}&numOfRows=${numOfRows}&pageNo=${pageNo}&MobileOS=ETC&MobileApp=TestApp&_type=json`;

    try {
        const res = await axios.get(url);
        console.log("API Response: ", res.data); // 응답 전체를 출력

        // 응답 구조에 따라 수정
        const data = res.data.response?.body?.items?.item;

        if (!data) {
            console.log("No data found in API response");
            return;
        }

        for (const item of data) {
            const locationData = {
                id: item.contentid,
                name: item.title,
                category: item.cat1,
                region: item.addr1,
                longitude: parseFloat(item.mapx),
                latitude: parseFloat(item.mapy),
                averageRating: 0
            };

            await prisma.location.create({
                data: locationData
            });
            console.log(`Location ${item.title} saved`);
        }
    } catch (error) {
        console.log("error: ", error.response?.data || error.message); // 에러 메시지 출력
    }
}

fetchTourData();
