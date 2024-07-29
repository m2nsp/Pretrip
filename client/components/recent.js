// 사용자 이름 설정
window.addEventListener('load', function() {
  var params = new URLSearchParams(window.location.search);
  var userName = params.get('userName');
  
  if (userName) {
    document.getElementById('user').textContent = `${userName} 님`;
  }
});

let page = 1;
const limit = 10;
const historyContainer = document.getElementById('history-container');
const loading = document.getElementById('loading');


function loadHistory(page) {
  fetch(`api/history?page=${page}&limit=${limit}`)
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
        loading.style.display = 'none'; 
        return;
      }
      data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.textContent = item; 
        historyContainer.appendChild(div);
      });
    })
    .catch(error => {
      console.error('Error fetching history:', error);
    });
}

// 스크롤
function handleScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    page++;
    loadHistory(page);
  }
}

window.addEventListener('scroll', handleScroll);


loadHistory(page);

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
  },
  {
    name: "한림 공원",
    imageUrl: "https://img1.kakaocdn.net/cthumb/local/R0x420.q50/?fname=http%3A%2F%2Ft1.kakaocdn.net%2Fmystore%2FDDB8938CBE7E423F8DA37717CEFE2BF2",
    address: "제주 특별자치도 제주시 한림읍",
    link: "https://place.map.kakao.com/10941032",
    rating: 3
  },
  {
    name: "산방산",
    imageUrl: "https://img1.kakaocdn.net/cthumb/local/R0x420.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Fplace%2F3CE01C8836A748D89F07D6B532102242",
    address: "제주특별자치도 서귀포시 안덕면",
    link: "https://place.map.kakao.com/8386141",
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

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('history-container').innerHTML += places.map(createPlacePreview).join('');
});
