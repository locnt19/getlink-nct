document.addEventListener('DOMContentLoaded', function () {
  console.log('Pure Javascript');
  console.log('DOM is fully loaded');
  const $input = document.querySelector('#input');
  const $submit = document.querySelector('#get-input');
  const $output = document.querySelector('#output');
  const $fakeForm = document.querySelector('#fake-form');
  const $title = document.querySelector('#title');
  const $coverImage = document.querySelector('#coverImage');
  const $play = document.querySelector('#play');

  const xhttp = new XMLHttpRequest();

  $input.addEventListener('blur', function () {
    console.log($input.value);
    if ($input.value !== '') {
      console.log('true');
      $submit.removeAttribute('disabled');
    } else {
      $submit.setAttribute('disabled', true);
    }
  });
  
  $submit.addEventListener('click', function () {
    $submit.setAttribute('disabled', true);
    xhttp.open('POST', '/api/get-link', true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`linkNCT=${$input.value}`);
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const data = JSON.parse(this.response);
        $play.classList.remove('d-none');
        $fakeForm.classList.add('d-none');
        $output.classList.add('d-inline-block');
        $title.classList.remove('d-none');
        $title.innerHTML = data.title;
        document.title = data.title + ' | Loc Thanh Nguyen';
        $play.setAttribute('src', data.link);
        $output.setAttribute('href', data.link);
        if (data.coverImage !== '') {
          $coverImage.classList.remove('d-none');
          $coverImage.setAttribute('alt', data.title);
          $coverImage.setAttribute('src', data.coverImage);
        }
      } else {
        alert('Error something!')
      }
    }
  });
});