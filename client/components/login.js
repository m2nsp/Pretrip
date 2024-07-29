document.addEventListener("DOMContentLoaded", function() {
  const CLIENT_ID = '496e5a8d0967be9af01b356ae4ab29ab'; //REST API 키
  const REDIRECT_URI = 'https://localhost:3000/auth/kakao/callback'; //리디렉션 URI
  
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile_nickname,account_email`;

  const kakaoLoginLink = document.getElementById('kakao-login');
  if (kakaoLoginLink) {
    kakaoLoginLink.href = KAKAO_AUTH_URL;
  }

  document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // 기본 폼 제출 방지
    
    var userName = document.getElementById('userName').value;
    
    if (userName) {
      // ID를 쿼리 문자열로 전달
      var url = 'bookmark.html?userName=' + encodeURIComponent(userName);
      window.location.href = url;
    } else {
      alert('ID를 입력하세요.');
    }

    var email = document.getElementsByName('userName')[0].value;
    var password = document.getElementsByNames('userPassword')[0].value;

    console.log('Email:', email);
    console.log('Password:', password);
  });


  

  var menuItems = document.querySelectorAll('.menu-item');

  menuItems.forEach(function(item) {
    item.addEventListener('click', function() {
      menuItems.forEach(function(innerItem) {
        innerItem.classList.remove('active');
      });
      this.classList.add('active');
    });
  });

  document.querySelector('.snsLogin').addEventListener('click', function() {
    console.log('카카오 로그인 버튼 클릭됨');
  });
});
