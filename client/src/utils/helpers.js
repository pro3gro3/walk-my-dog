export function pluralize(name, count) {
  if (count === 1) {
    return name;
  }
  return name + 's';
}

export function getDateFromUnix(timeInStamp){
  const timestamp = timeInStamp*1000;
  const date = new Date(timestamp);
  // console.log('helper:', date);
  return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
}
export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('walkmydog', 1);
    let db, tx, store;
    request.onupgradeneeded = function(e) {
      const db = request.result;
      db.createObjectStore('jobs', { keyPath: '_id' });
      db.createObjectStore('users', { keyPath: '_id' });
      db.createObjectStore('walkerjobs', { keyPath: '_id'});
      db.createObjectStore('cart', { keyPath: '_id' });
    };

    request.onerror = function(e) {
      console.log('There was an error');
    };

    request.onsuccess = function(e) {
      db = request.result;
      tx = db.transaction(storeName, 'readwrite');
      store = tx.objectStore(storeName);

      db.onerror = function(e) {
        console.log('error', e);
      };

      switch (method) {
        case 'put':
          store.put(object);
          resolve(object);
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('No valid method');
          break;
      }

      tx.oncomplete = function() {
        db.close();
      };
    };
  });
}

