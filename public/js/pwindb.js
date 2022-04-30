let db
const request = indexedDB.open('Pwudget', 1);


function uploadPwudge() {
    const transaction = db.transaction(['new_pwudge'], 'readwrite');
    const pwudgeObjStore = transaction.objectStore('new_pwudge');
    const getAll = pwudgeObjStore.getAll();
    getAll.onsuccess = ()=> {

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
                alert('Transactions Uploaded!')
                
                    location.reload();
            })
            .catch(err => {
            console.log(err);
            });
        }
        };
}
function saveRecord(record) {
    const transaction = db.transaction(['new_pwudge'], 'readwrite');
    const pwudgeObjStore = transaction.objectStore('new_pwudge');
    pwudgeObjStore.add(record);
}


request.onsuccess = function(evt) {
    db = evt.target.result;
    if (navigator.onLine) {
        uploadPwudge();
    }
};

request.onupgradeneeded = function(evt) {
    db = evt.target.result;
    db.createObjectStore('new_pwudge', { 
        autoIncrement: true 
    });
};


request.onerror = function(evt) {
    console.log(evt.target.errorCode);
};





// listen for app coming back online
window.addEventListener("online", uploadPwudge);