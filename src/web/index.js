const get = function _get(url, callback) {
  let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  xhr.open('GET', url);
  xhr.onreadystatechange = () => {
    if (xhr.readyState > 3 && xhr.status === 200) {
        callback(xhr.responseText);
    }
  };
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.send();

  return xhr;
};

document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.querySelector('button.send');
  const zipInput = document.querySelector('input.zip');
  sendButton.addEventListener('click', () => {
    const zip = zipInput.value;
    if (zip && zip.length === 5) {
      get('demo?zip=98685', (err, res) => {
        if (err) console.error(err);
        if (res) {
          console.log(res);  
        }
      });
    }
  });
});
