/*

import { struct, assert } from 'superstruct';

// 리뷰 스키마 
const ReviewStruct = struct({
  id: 'string', // VARCHAR(191)
  location_id: 'string', // VARCHAR(191)
  user_name: 'string', // VARCHAR(191)
  rating: 'number', // TINYINT
  comment: 'string',
  created_at: 'string?', // TIMESTAMP (optional for validation)
});

// 리뷰 validate
const validateReview = (data) => {
  try {
    ReviewStruct(data);

    if (data.rating < 1 || data.rating > 5) {
      throw new Error('평점은 1과 5 사이의 정수여야 합니다.');
    }
    
    // if (userId !== undefined) {
    //     if (typeof userId !== 'string') {
    //       throw new Error('User가 존재하지 않습니다.');
    //     }
    //   }
  } catch (error) {
    throw new Error(error.message);
  }
};

const validateReviewUpdate = (data) => {
    const { rating, userId } = data;
  
    if (rating !== undefined) {
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        throw new Error('평점은 1과 5 사이의 정수여야 합니다.');
      }
    }
  
    // if (userId !== undefined) {
    //   if (typeof userId !== 'string') {
    //     throw new Error('User가 존재하지 않습니다.');
    //   }
    // }
  };

module.exports = {
  validateReview, validateReviewUpdate
};

*/