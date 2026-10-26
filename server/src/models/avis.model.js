const { getMongoDb } = require("../config/mongo");

// Un avis ressemble à ça dans MongoDB :
// { trajetId: 3, conducteurId: 2, auteurId: 5, auteurPrenom: 'Sophie', note: 4, commentaire: '...', createdAt: Date }

function avis() {
  return getMongoDb().collection("avis");
}

async function create(unAvis) {
  await avis().insertOne(unAvis);
}

// Les 50 derniers avis reçus par un conducteur
async function findByConducteur(conducteurId) {
  return avis()
    .find(
      { conducteurId },
      {
        projection: {
          _id: 0,
          trajetId: 1,
          auteurPrenom: 1,
          note: 1,
          commentaire: 1,
          createdAt: 1,
        },
      },
    )
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();
}

// Note moyenne et nombre d'avis d'un conducteur (calculés par MongoDB)
async function statsConducteur(conducteurId) {
  const resultat = await avis()
    .aggregate([
      { $match: { conducteurId } },
      {
        $group: { _id: null, moyenne: { $avg: "$note" }, nombre: { $sum: 1 } },
      },
    ])
    .toArray();
  return resultat[0]; // undefined s'il n'y a aucun avis
}

module.exports = { create, findByConducteur, statsConducteur };
