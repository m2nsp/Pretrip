window.addEventListener('load', function() {
  var params = new URLSearchParams(window.location.search);
  var userName = params.get('userName');
  
 document.getElementById('user').textContent = `${userName} 님`;
});



document.querySelectorAll('.accordion-toggle').forEach(button => {
  button.addEventListener('click', () => {
      const content = button.nextElementSibling;
      
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        content.style.padding = '0 15px';
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.padding = '15px';
    }

  });
});

document.addEventListener('DOMContentLoaded', function() {
  const link = document.querySelector('.preview-link');
  const previewImage = document.querySelector('.preview-image');

  link.addEventListener('mouseenter', function() {
      previewImage.classList.add('preview-image-large');
      previewImage.style.display = 'block';
  });
});


loadPlace(page);
// 장소 데이터 로드
const places = [
  {
    name: "협재해수욕장",
    imageUrl: "https://img1.kakaocdn.net/cthumb/local/R0x420.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2F645a3c0e3233f93fe0743b44b0cccd45e84b5cf9%3Foriginal",
    address: "제주 제주시 한림읍 협재리",
    link: "https://place.map.kakao.com/8159415",
    rating: 4
  },
  {
    name: "곽지해수욕장",
    imageUrl: "https://img1.kakaocdn.net/cthumb/local/R0x420.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fa468467953bae27bf739d315c1d3ac3bb7a6db59%3Foriginal",
    address: "제주 제주시 애월읍 곽지리",
    link: "https://place.map.kakao.com/25022153",
    rating: 3
  },
  {
    name: "화순 곶자왈",
    imageUrl: "https://img1.kakaocdn.net/cthumb/local/R0x420.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fa468467953bae27bf739d315c1d3ac3bb7a6db59%3Foriginal",
    address: "제주 서귀포시 안덕면 화순리",
    link: "https://place.map.kakao.com/26972307",
    rating: 3
  }
];

// 장소 미리보기 
function createPlacePreview(place) {
  return `
    <div class="place-preview">
      <a href="${place.link}" target="_blank" class="preview-link">
        <img src="${place.imageUrl}" width="200px" height="100px" class="preview-image">
      </a>
      <span class="place-info">
        <div class="place-bookmarked">
          <p class="place-name">${place.name}</p>
          <div class="star-rating">
            ${[...Array(5)].map((_, i) => `
              <img src="../static/recent_images/${i < place.rating ? 'filled_star' : 'empty_star'}.png" class="star" data-value="${i + 1}">
            `).join('')}
          </div>
        </div>
        <p class="address">${place.address} 
          <img src="../static/recent_images/bookmark_filled.png" width="24px" height="24px"> 
        </p>
      </span>
    </div>
  `;
}
