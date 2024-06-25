function previewImage(input) {
    const profileImg = document.querySelector('.profile-img');
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
      profileImg.src = e.target.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
}
