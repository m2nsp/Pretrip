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
