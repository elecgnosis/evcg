const get = function _get(url, callback) {
  let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  xhr.open('GET', url);
  xhr.onreadystatechange = () => {
    if (xhr.readyState > 3 && xhr.status === 200) {
        callback(null, xhr.responseText);
    }
  };
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.send();
  return xhr;
};

const submitZip = function _submitZip(zip) {
  const result = document.querySelector('.result');
  const city = document.querySelector('.city');
  const temp = document.querySelector('.temp');
  const timezone = document.querySelector('.timezone');
  const elevation = document.querySelector('.elevation');

  if (result.classList.contains('show')) {
    result.classList.remove('show');
    setTimeout(() => {
      city.innerText = '';
      temp.innerText = '';
      timezone.innerText = '';
      elevation.innerText = '';
    }, 250);
  }

  if (zip && zip.length === 5) {
    get(`demo?zip=${zip}`, (xhr, res) => {
      if (res) {
        const resParsed = JSON.parse(res);
        city.innerText = resParsed.city;
        temp.innerText = resParsed.temp;
        timezone.innerText = resParsed.timezone;
        elevation.innerText = resParsed.elevation;
        result.classList.add('show');
        return true;
      }
      return false;
    });
  }
}

const run = function _run() {
  const sendButton = document.querySelector('button.send');
  const zipInput = document.querySelector('input.zip');

  zipInput.addEventListener("keyup", (event) => {
    event.preventDefault();
    if (event.keyCode == 13) {
        submitZip(zipInput.value);
    }
  });
  sendButton.addEventListener('click', () => {
    submitZip(zipInput.value);
  });
};

document.addEventListener('DOMContentLoaded', run);
