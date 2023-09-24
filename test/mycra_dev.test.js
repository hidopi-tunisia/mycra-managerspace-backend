const chai = require("chai");
const expect = chai.expect;
const should = chai.should;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const fs = require("fs");

// Recupération des clients

const data = fs.readFileSync("test/clients.json", "utf8");
const clients = JSON.parse(data);

// Recupération des projets
const pr = fs.readFileSync("test/projets.json", "utf8");
const projects = JSON.parse(pr);

// Recupération des consultants
const cnslt = fs.readFileSync("test/consultants.json", "utf8");
const consultants = JSON.parse(cnslt);

let clientId0;
let clientId;
let client2Id;
let projectId;
let projectId1;
let projectId2;
let projectId3;
let projectId4;
let projectId5;
let consultantId;
let consultantId1;
let Id_cra;
let indispid;
const serveur = require("../app");
let Id_manager;
// Avant de commencer les tests, attendez que la connexion à la base de données soit établie
before(async function () {
  this.timeout(10000); // Augmentez le délai d'attente au besoin
  await new Promise((resolve) => setTimeout(resolve, 5000)); // Attendez un moment pour la connexion à la base de données
});
describe("/test de création de clients, projets, consultants", () => {
  //Create clients
  it(" Create Client testing", (done) => {
    chai
      .request(serveur)
      .post("/client/clients")
      .send(clients[0])
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an("object");
        console.log(res.body.message);
        clientId0 = res.body.client._id;
        console.log(clientId0);
        done();
      });
  });
  it(" Create Client testing", (done) => {
    chai
      .request(serveur)
      .post("/client/clients")
      .send(clients[1])
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an("object");
        console.log(res.body.message);
        clientId = res.body.client._id;
        //projects[0].client = clientId;
        console.log(clientId);
        done();
      });
  });
  //Create d'un autre client
  //Create
  it(" Create another Client testing", (done) => {
    chai
      .request(serveur)
      .post("/client/clients")
      .send(clients[2])
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an("object");
        console.log(res.body.message);
        client2Id = res.body.client._id;
        //projects[1].client = client2Id;
        console.log(client2Id);
        done();
      });
  });
  //Create projects
  it(" Create project testing", (done) => {
    chai
      .request(serveur)
      .post("/projet/create-projet")
      .send(projects[0])
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        projectId = res.body._id;
        console.log(projectId);
        done();
      });
  });

  it(" Create another project testing", (done) => {
    chai
      .request(serveur)
      .post("/projet/create-projet")
      .send(projects[1])
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        projectId1 = res.body._id;
        console.log(projectId1);
        done();
      });
  });
  it(" Create another project testing", (done) => {
    chai
      .request(serveur)
      .post("/projet/create-projet")
      .send(projects[2])
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        projectId2 = res.body._id;
        console.log(projectId1);
        done();
      });
  });
  it(" Create another project testing", (done) => {
    chai
      .request(serveur)
      .post("/projet/create-projet")
      .send(projects[3])
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        projectId3 = res.body._id;
        console.log(projectId1);
        done();
      });
  });
  it(" Create another project testing", (done) => {
    chai
      .request(serveur)
      .post("/projet/create-projet")
      .send(projects[4])
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        projectId4 = res.body._id;
        console.log(projectId1);
        done();
      });
  });
  it(" Create another project testing", (done) => {
    chai
      .request(serveur)
      .post("/projet/create-projet")
      .send(projects[5])
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        projectId5 = res.body._id;
        console.log(projectId1);
        done();
      });
  });
  //Create consultants
  it(" Create consultant testing", (done) => {
    chai
      .request(serveur)
      .post("/consultant/create-consultant")
      .send(consultants[0])
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        consultantId = res.body.consultant._id;
        console.log(consultantId);
        done();
      });
  });
  it(" Create another consultant testing", (done) => {
    chai
      .request(serveur)
      .post("/consultant/create-consultant")
      .send(consultants[1])
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        consultantId1 = res.body.consultant._id;
        console.log(consultantId1);
        done();
      });
  });
  //Update
  it(" Update Client testing", (done) => {
    chai
      .request(serveur)
      .put(`/client/update-client/${clientId}`)
      .send({ email: "a@gmail.com", numeroTelephone: "78459621145" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body.message);
        done();
      });
  });
  //récupération de tous les clients
  it("Get clients", (done) => {
    chai
      .request(serveur)
      .get("/client/clients")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log("liste des clients", res.body.clients);
        console.log("nombre total de clients", res.body.totalClients);
        console.log("nombre total de pages", res.body.totalPages);
        done();
      });
  });

  //afficher les détails d'un client spécifique
  it("Get Specific client", (done) => {
    chai
      .request(serveur)
      .get(`/client/client-byid/${clientId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body);
        done();
      });
  });

  //Suppression d'un client spécifique
  it("Suppression d'un client spécifique", (done) => {
    chai
      .request(serveur)
      .delete(`/client/supp-client/${clientId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body.message);
        done();
      });
  });
  //affecter des projets à un client à un client et le client au projet
  it("project to client and client to project", (done) => {
    chai
      .request(serveur)
      .put(`/projet/affecter-projet/${client2Id}/${projectId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body.message);
        done();
      });
  });
  it("project to client and client to project", (done) => {
    chai
      .request(serveur)
      .put(`/projet/affecter-projet/${client2Id}/${projectId1}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body.message);
        done();
      });
  });
  it("project to client and client to project", (done) => {
    chai
      .request(serveur)
      .put(`/projet/affecter-projet/${client2Id}/${projectId2}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body.message);
        done();
      });
  });
  //Afficher la liste des projets d'un client
  it("La liste des projets du client ....", (done) => {
    chai
      .request(serveur)
      .get(`/client/projets-client/${client2Id}/projets`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        console.log("liste des projets du client .. :", res.body);
        done();
      });
  });
  //nombre total de clients
  it("Nombre total de clients", (done) => {
    chai
      .request(serveur)
      .get(`/client/nombre-clients`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log("nombre de clients : ", res.body.count);
        done();
      });
  });
  //nombre de projets d'un client
  it("Nombre total de projets d'un client", (done) => {
    chai
      .request(serveur)
      .get(`/client/nb-projects-client/${client2Id}/nombre-projets`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(
          `nombre de projets du client ${client2Id} :`,
          res.body.nombreProjets
        );
        done();
      });
  });
  //Affecter un consultant à un client
  it("Affecter un consultant au client", (done) => {
    chai
      .request(serveur)
      .put(
        `/consultant/affecter-consultant-client/${consultantId}/${client2Id}`
      )
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body.message);
        done();
      });
  });
  //Affecter un autre consultant à un client
  it("Affecter un autre consultant au client", (done) => {
    chai
      .request(serveur)
      .put(
        `/consultant/affecter-consultant-client/${consultantId1}/${client2Id}`
      )
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body.message);
        done();
      });
  });
  //obtenir le nombre de consultants travaillant chez un client précis
  it("Nombre total de consultants d'un client", (done) => {
    chai
      .request(serveur)
      .get(`/client/clients/${client2Id}/nombre-consultants`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(
          `Nombre de consultants pour le client ${client2Id} :`,
          res.body.nombreConsultants
        );
        done();
      });
  });
  //obtenir la liste de consultants travaillant chez un client précis
  it("liste de consultants d'un client", (done) => {
    chai
      .request(serveur)
      .get(`/client/liste-consultants/${client2Id}/consultants`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(
          `liste de consultants du client ${client2Id} :`,
          res.body.consultants
        );
        done();
      });
  });
  // Supprimer un consultant d'un client
  it("Delete d'un consultant d'un client", (done) => {
    chai
      .request(serveur)
      .delete(
        `/client/supp-consultant/${client2Id}/supprimer-consultant/${consultantId}`
      )
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body.message);
        done();
      });
  });
  //Modification d'un consultant
  it("Modifier un consultant", (done) => {
    chai
      .request(serveur)
      .put(`/consultant/modifier-consultant/${consultantId}`)
      .send({ anneesExperience: 7, numeroTelephone: "58987681" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body.message);
        console.log(res.body.consultant);
        done();
      });
  });
  // Affichage de Tous les Consultants
  it("afficher tous les consultants", (done) => {
    chai
      .request(serveur)
      .get(`/consultant/getall-consultants`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log("lise des consultants : ", res.body.consultants);
        console.log("nombre de consultants", res.body.totalConsultants);
        console.log("nombre de pages", res.body.totalPages);
        done();
      });
  });
  //Affecter un projet à un consultant
  it("Affectation d'un projet à un consultant", (done) => {
    chai
      .request(serveur)
      .put(
        `/consultant/affecter-consultant-projet/${consultantId1}/${projectId1}`
      )
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body.message);
        console.log("Le consultant affecté :", res.body.consultant);
        done();
      });
  });
  //Get le consultant auquel on a attribué un projet
  it("Get a conultant by id", (done) => {
    chai
      .request(serveur)
      .get(`/consultant/consultant/${consultantId1}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body.consultant);
        done();
      });
  });
  //Archiver un consultant
  it("Archiver un consultant", (done) => {
    chai
      .request(serveur)
      .put(`/consultant/archiver-consultant/${consultantId1}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body.message);
        done();
      });
  });

  //Modification d'un projet
  it("UPDATE a project", (done) => {
    chai
      .request(serveur)
      .put(`/projet/modifier-projet/${projectId}`)
      .send({
        nom: "Site web magasin",
        description: " développement d'un site web pour la Vente de vetements",
        dateDebut: "2023-08-30",
        dateFin: "2023-10-15",
        client: client2Id,
        categorie: "Info",
        codeProjet: "01478963",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body);
        done();
      });
  });
  //Obtenir un projet par son id
  it("Get project by id", (done) => {
    chai
      .request(serveur)
      .get(`/projet/projet/${projectId2}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body);
        done();
      });
  });
  //Obtenir la liste des projets
  it("Get all projects", (done) => {
    chai
      .request(serveur)
      .get(`/projet/projets/`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        console.log("liste de tous les projets ", res.body);
        done();
      });
  });
  //Supprimer un projet par son id
  it("Delete a project by ID", (done) => {
    chai
      .request(serveur)
      .delete(`/projet/supp-projet/${projectId5}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body.message);
        done();
      });
  });
  //Obtenir le nombre de projets
  it("Nombre de projets", (done) => {
    chai
      .request(serveur)
      .get(`/projet/nombre-projets`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log("nombre de projets ", res.body.count);
        done();
      });
  });

  //Afficher les projets d'un client
  it("Liste des projets d'un client", (done) => {
    chai
      .request(serveur)
      .get(`/projet/projets-client/${client2Id}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.projets).to.be.an("array");
        console.log(
          `liste de projets du client : ${client2Id} `,
          res.body.projets
        );
        done();
      });
  });
  //Test des indisponibilités:
  //Create indisponibilités
  it("CREATE indisp", (done) => {
    const indisp = {
      date_debut: "2023-09-01",
      date_fin: "2023-09-10",
      type_indisponibilite: "Vacances",
    };
    chai
      .request(serveur)
      .post(`/indisp/create_Indis`)
      .send(indisp)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        indispid = res.body._id;
        console.log("indisp : ", res.body);
        done();
      });
  });

  it("Get all indisp", (done) => {
    chai
      .request(serveur)
      .get(`/indisp/getall`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log("liste d'indisponibilités: ", res.body);
        done();
      });
  });
  it("Get indisp by id", (done) => {
    chai
      .request(serveur)
      .get(`/indisp/getbyid/${indispid}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log("indisponibilité: ", res.body);
        done();
      });
  });
  /*it("UPDATE indisp", (done) => {
    const indispup = {
      type_indisponibilite: "Absence",
    };
    chai
      .request(serveur)
      .put(`/indisp/update/${indispid}`)
      .send(indispup)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log("indisp updated: ", res.body);
        done();
      });
  });
  it("delete indisp", (done) => {
    chai
      .request(serveur)
      .delete(`/indisp/delete/${indispid}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log("indisponibilité supprimé: ", res.body);
        done();
      });
  });*/

  //POST CRA by month
  it("CREATE CRA", (done) => {
    const cra = {
      consultant: consultantId,
      nbJoursTravailles: "",
      mois: "Janvier",
      date_debut: "",
      date_fin: "",
      annee: "2023",
      craType: "",
      date_saisiCra: "2023-07-08",
      joursOuvresTravailles: [
        {
          jour: "Lundi",
        },
        {
          jour: "Mardi",
        },
        {
          jour: "Mardi",
        },
      ],
    };
    chai
      .request(serveur)
      .post(`/cra/postCra`)
      .send(cra)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        Id_cra = res.body._id;
        console.log(res.body);
        done();
      });
  });

  //Historique cra d'un consultant
  it("Historique CRA d'un consultant", (done) => {
    chai
      .request(serveur)
      .get(`/consultant/historique-cra/${consultantId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(
          `consultant : `,
          res.body.consultant,
          " ses cras :",
          res.body.cras
        );
        done();
      });
  });
  //Avoir les statistiques d'un consultant
  it("Statistiques d'un consultant", (done) => {
    chai
      .request(serveur)
      .get(`/consultant/statistiques/${consultantId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log("statistiques du consultant :", res.body);
        done();
      });
  });
  it("CREATE CRA with dates off", (done) => {
    const cra = {
      datesNonTravaillees: [
        {
          date: "2023-07-03",
          raison: "Absence",
        },
        {
          date: "2023-07-05",
          raison: "CP",
        },
      ],

      nb_tt_du_mois: 10,
    };
    chai
      .request(serveur)
      .post(`/cra/postCra`)
      .send(cra)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body);
        done();
      });
  });

  //Saisir des indisponibilités
  it("Saisir indisponibilité", (done) => {
    const indisp = {
      dateDebut: "2023-07-27",
      dateFin: "2023-07-28",
      raison: "CP",
    };
    chai
      .request(serveur)
      .put(`/cra/saisirIndisponibilite/${Id_cra}`)
      .send(indisp)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body.message);
        done();
      });
  });
  //Refuser un CRA
  it("Refuser CRA", (done) => {
    const reason = {
      raison: "CRA non validé",
    };
    chai
      .request(serveur)
      .put(`/cra/refuser-cra/${Id_cra}`)
      .send(reason)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body.message);
        done();
      });
  });
  //Valider CRA
  it("Valider CRA", (done) => {
    const reason = {
      raison: "CRA validé",
    };
    chai
      .request(serveur)
      .put(`/cra/valider-cra/${Id_cra}`)
      .send(reason)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body.message);
        done();
      });
  });
  //Nombre de cra validés du mois courant
  it("Get nb CRA validés du mois", (done) => {
    chai
      .request(serveur)
      .get(`/cra/nombre-cra-mois-validee`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log("nb de cra validés du mois", res.body.count);
        done();
      });
  });

  it("Get nb CRA en attente du mois", (done) => {
    chai
      .request(serveur)
      .get(`/cra/nombre-cra-mois-attente`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log("nb de cra du mois en attente", res.body.count);
        done();
      });
  });
  it("Get nb CRA refusés du mois", (done) => {
    chai
      .request(serveur)
      .get(`/cra/nombre-cra-mois-refusee`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log("nb de cra du mois réfusés", res.body.count);
        done();
      });
  });

  it("pourcentage cra saisi du mois courant", (done) => {
    chai
      .request(serveur)
      .get(`/cra/pourcentage-cra-mois`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log("Pourcentage cra", res.body.pourcentageCRA);
        done();
      });
  });
  //GET ALL CRA
  it("Get All CRA", (done) => {
    chai
      .request(serveur)
      .get(`/cra/getall-cra`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        console.log(res.body);
        done();
      });
  });

  //GET CRA
  it("Get CRA by Id", (done) => {
    chai
      .request(serveur)
      .get(`/cra/get_cra_by_id/${Id_cra}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body);
        done();
      });
  });
  //UPDATE CRA
  it("Update CRA", (done) => {
    const data = {
      nbJoursTravailles: "",
      mois: "Aout",

      annee: "2023",

      joursOuvresTravailles: [
        {
          jour: "Lundi",
        },
        {
          jour: "Mardi",
        },
        {
          jour: "Mercredi",
        },
      ],
    };
    chai
      .request(serveur)
      .put(`/cra/update-cra/${Id_cra}`)
      .send(data)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body.message);
        done();
      });
  });
  //Filtrer CRA par date
  it("Filtrer CRA par date", (done) => {
    chai
      .request(serveur)
      .get(`/cra/filtrer-cra-par-date?dateDebut=2023-07-01&dateFin=2023-07-31`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.cras).to.be.an("array");
        console.log(res.body.cras);
        done();
      });
  });

  //Manager
  //Création de manager
  it("CREATE Manager", (done) => {
    const manager = {
      nom: "Rouine",
      prenom: "Marwa",
      email: "marwa.rouine55@gmail.com",
      motDePasse: "MotDePasse123",
      entreprise: {
        nomSocial: "Ma Entreprise",
        siret: "12345678901234",
        adresse: {
          rue: "123 Rue de l'Entreprise",
          codePostal: "75001",
          ville: "Paris",
        },
        numeroTelephone: "0123456789",
      },
      periodeDessai: {
        debut: "2023-06-01",
        fin: "2023-06-15",
      },
      offre: "ID_de_loffre",
      aAccepteCGU: true,
      cguVersionAcceptee: "Version 1.0",
      statutCompte: "active",
    };

    chai
      .request(serveur)
      .post(`/manager/create-manager`)
      .send(manager)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        Id_manager = res.body.manager._id;
        console.log(res.body.message, "manager : ", res.body.manager);
        done();
      });
  });
  //Get all managers
  it("Get All managers", (done) => {
    chai
      .request(serveur)
      .get(`/manager/managers`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(
          "les différents managers : ",
          res.body.managers,
          "/n pagination:",
          res.body.pagination
        );
        done();
      });
  });
  //Update manager
  it("UPDATE Manager", (done) => {
    const updt_manager = {
      nom: "Rouine",
      prenom: "Marwa",
      email: "marwa.rouine55@gmail.com",
      motDePasse: "MotDePasse123",
      entreprise: {
        nomSocial: "Marwa Entreprise",
        siret: "10045678901234",
        adresse: {
          rue: "123 Rue de Zorda",
          codePostal: "75001",
          ville: "Paris",
        },
        numeroTelephone: "0123456789",
      },
    };
    chai
      .request(serveur)
      .put(`/manager/update-manager/${Id_manager}`)
      .send(updt_manager)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log(res.body.message, "manager : ", res.body.manager);
        done();
      });
  });
  it("Get manager by id", (done) => {
    chai
      .request(serveur)
      .get(`/manager/manager/${Id_manager}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        console.log("manager : ", res.body.manager);
        done();
      });
  });
});
