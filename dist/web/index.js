'use strict';

var get = function _get(url, callback) {
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  xhr.open('GET', url);
  xhr.onreadystatechange = function () {
    if (xhr.readyState > 3 && xhr.status === 200) {
      callback(xhr.responseText);
    }
  };
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.send();

  return xhr;
};

document.addEventListener('DOMContentLoaded', function () {
  var sendButton = document.querySelector('button.send');
  var zipInput = document.querySelector('input.zip');
  sendButton.addEventListener('click', function () {
    var zip = zipInput.value;
    if (zip && zip.length === 5) {
      get('demo?zip=98685', function (err, res) {
        if (err) console.error(err);
        if (res) {
          console.log(res);
        }
      });
    }
  });
});