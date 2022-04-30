// const { response } = require("express");

let db
const request = indexedDB.open('Pwudget', 1);

request.onupgradeneeded = function(evt) {
    db = evt.target.result;
    db.createObjectStore('new_pwudge', { autoIncrement: true });
  };

request.onsuccess = function(evt) {
    db = evt.target.result;
    if (navigator.onLine) {
    uploadPwudge();
}
};

request.onerror = function(evt) {
console.log(evt.target.errorCode);
};


function saveRecord(record) {
    const transaction = db.transaction(['new_pwudge'], 'readwrite');
    const pwudgeObjStore = transaction.objectStore('new_pwudge');
pwudgeObjStore.add(record);
}

function uploadPwudge() {
const transaction = db.transaction(['new_pwudge'], 'readwrite');
const pwudgeObjStore = transaction.objectStore('new_pwudge');
const getAll = pwudgeObjStore.getAll();
getAll.onsuccess = function() {

    if (getAll.result.length > 0) {
    fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((mess) => {
        if (mess.message) {
            throw new Error(mess);
        }

        const transaction = db.transaction(['new_pwudge'], 'readwrite');
        const pwudgeObjStore = transaction.objectStore('new_pwudge');
            pwudgeObjStore.clear();
            location.reload();
        })
        .catch(err => {
        console.log(err);
        });
    }
};
}

// listen for app coming back online
window.addEventListener("online", uploadPwudge);