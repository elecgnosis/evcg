'use strict';

var get = function _get(url, callback) {
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  xhr.open('GET', url);
  xhr.onreadystatechange = function () {
    if (xhr.readyState > 3 && xhr.status === 200) {
      callback(null, xhr.responseText);
    }
  };
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.send();
  return xhr;
};

var submitZip = function _submitZip(zip) {
  var result = document.querySelector('.result');
  var city = document.querySelector('.city');
  var temp = document.querySelector('.temp');
  var timezone = document.querySelector('.timezone');
  var elevation = document.querySelector('.elevation');

  if (result.classList.contains('show')) {
    result.classList.remove('show');
    setTimeout(function () {
      city.innerText = '';
      temp.innerText = '';
      timezone.innerText = '';
      elevation.innerText = '';
    }, 250);
  }

  if (zip && zip.length === 5) {
    get('demo?zip=' + zip, function (xhr, res) {
      if (res) {
        var resParsed = JSON.parse(res);
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
};

var run = function _run() {
  var sendButton = document.querySelector('button.send');
  var zipInput = document.querySelector('input.zip');

  zipInput.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode == 13) {
      submitZip(zipInput.value);
    }
  });
  sendButton.addEventListener('click', function () {
    submitZip(zipInput.value);
  });
};

document.addEventListener('DOMContentLoaded', run);