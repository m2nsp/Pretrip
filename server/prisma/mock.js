import { Category } from "@prisma/client";

export const Location = [
  {
    name: 'Location 1',
    latitude: 33.450701,
    longitude: 126.570667,
    category: Category.FOOD,
    region: '서울',
  },
  {
    name: 'Location 2',
    latitude: 35.179554,
    longitude: 129.075642,
    category: Category.SLEEP,
    region: '경기',
  },
  {
    name: 'Location 4',
    latitude: 34.799941,
    longitude: 127.008942,
    category: Category.FOOD,
    region: '전남',
  },
  // 추가 데이터...
];

export const User = [
    {
        email: 'user1@example.com',
        password: 'password123',
        nickname: 'User1'
    },
    {
        email: 'user2@example.com',
        password: 'password456',
        nickname: 'User2'
    }
];