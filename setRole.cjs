const admin = require("firebase-admin");
const serviceAccount = require("./mki-vocabulary-firebase-adminsdk-fbsvc-d60bf6b2cf.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function setUserRole(uid, claims) {
  try {
    await admin.auth().setCustomUserClaims(uid, claims);
    console.log(`✅ Роли ${JSON.stringify(claims)} назначены пользователю ${uid}`);
  } catch (err) {
    console.error("Ошибка при назначении ролей:", err);
  }
}

// 👉 назначаем роли
// ADMIN
setUserRole("B1zjDq9TxPW672Fvm0m8p5auAC02", { admin: true });

// MISS ZIYODA
setUserRole("8JzCOUUzd8PMlDrLLCcWGxHKvGj1", { teacher: true });

// BEXZOD
setUserRole("YXSg2CFaNlhKDTEo3KtC7VkBmAm1", { teacher: true });

// MISS OZODA
setUserRole("eEG1gthmNRQ22J5gBd7ttlLH36V2", { teacher: true });


// Ольга Рудольфовна