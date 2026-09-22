const DB_NAME = "VKUFieldSurveyDB";
const DB_VERSION = 1;
const STORE_NAME = "surveys";


// ===============================
// MỞ DATABASE
// ===============================

function openDatabase() {

    return new Promise((resolve, reject) => {

        const request = indexedDB.open(
            DB_NAME,
            DB_VERSION
        );

        request.onupgradeneeded = (event) => {

            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {

                db.createObjectStore(STORE_NAME, {
                    keyPath: "id"
                });

            }

        };

        request.onsuccess = () => {

            resolve(request.result);

        };

        request.onerror = () => {

            reject(request.error);

        };

    });

}


// ===============================
// LƯU PHIÊN
// ===============================

function saveSurvey(survey) {

    return openDatabase().then((db) => {

        return new Promise((resolve, reject) => {

            const transaction =
                db.transaction(
                    STORE_NAME,
                    "readwrite"
                );

            const store =
                transaction.objectStore(STORE_NAME);

            const request =
                store.put(survey);

            request.onsuccess = () => {

                resolve();

            };

            request.onerror = () => {

                reject(request.error);

            };

        });

    });

}


// ===============================
// LẤY TẤT CẢ PHIÊN
// ===============================

function getAllSurveys() {

    return openDatabase().then((db) => {

        return new Promise((resolve, reject) => {

            const transaction =
                db.transaction(
                    STORE_NAME,
                    "readonly"
                );

            const store =
                transaction.objectStore(STORE_NAME);

            const request =
                store.getAll();

            request.onsuccess = () => {

                resolve(request.result);

            };

            request.onerror = () => {

                reject(request.error);

            };

        });

    });

}