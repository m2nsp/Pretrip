import axios from "axios";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

const prisma = new PrismaClient();
dotenv.config();

async function fetchTourData() {
    const serviceKey = process.env.TOUR_API_KEY;
    const numOfRows = 10;
    const pageNo = 1;
    const mobileOS = 'WIN';
    const mobileApp = 'PreTrip';
    const _type = 'json';
    const areaCode = '31'; // 강원 
    const url = `http://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=${serviceKey}&numOfRows=${numOfRows}&pageNo=${pageNo}&MobileOS=${mobileOS}&MobileApp=${mobileApp}&_type=${_type}&areaCode=${areaCode}`;
    
    try {
        const response = await axios.get(url);
        const responseData = response.data;

        console.log("전체 API 응답:", responseData); // 전체 응답 데이터 로깅

        if (responseData && responseData.response && responseData.response.body && responseData.response.body.items) {
            const data = responseData.response.body.items.item;

            if (data && Array.isArray(data)) {
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
                    console.log(`위치 ${item.title} 저장 완료`);
                }
            } else {
                console.log("아이템이 없거나 아이템이 배열이 아닙니다.");
            }
        } else {
            console.log("예상치 못한 API 응답 구조:", responseData);
        }
    } catch (error) {
        console.error("투어 데이터 가져오기 오류:", error);
    }
}

fetchTourData();
