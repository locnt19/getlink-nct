document.addEventListener('DOMContentLoaded', function () {
  // console.log('DOM is fully loaded');
  const $input = document.querySelector('#input');
  const $submit = document.querySelector('#get-input');
  const $output = document.querySelector('#output');
  const $fakeForm = document.querySelector('#fake-form');
  const $play = document.querySelector('#play');

  const xhttp = new XMLHttpRequest();

  $submit.addEventListener('click', function () {
    // console.log('click');
    xhttp.open('POST', '/api/get-link', true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`linkNCT=${$input.value}`);
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // $input.value = '';
        // $submit.setAttribute('disabled', true);
        $fakeForm.style.display = 'none';
        $play.style.display = 'block';
        $play.style.width = '100%';
        $output.style.display = 'inline-block';
        $play.setAttribute('src', this.responseText);
        $output.setAttribute('href', this.responseText);
      }
    }
  });
});