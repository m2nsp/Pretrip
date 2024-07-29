import { define, assert } from 'superstruct';

// 리뷰 스키마 정의
const ReviewStruct = define({
  id: 'string', // VARCHAR(191)
  location_id: 'string', // VARCHAR(191)
  user_name: 'string', // VARCHAR(191)
  rating: 'number', // TINYINT
  comment: 'string',
  created_at: 'string?', // TIMESTAMP (optional for validation)
});

// 리뷰 검증
const validateReview = (data) => {
  try {
    assert(data, ReviewStruct);

    if (data.rating < 1 || data.rating > 5) {
      throw new Error('평점은 1과 5 사이의 정수여야 합니다.');
    }
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

  // userId 검증을 추가하고 싶다면 여기에 작성
};

export { validateReview, validateReviewUpdate };
