var mono = require("mongoose");
const {v4: uuid} = require("uuid");

//set the url of the database 
mono.connect("mongodb://localhost:27017/banque_peuple",{useNewUrlParser:true});

//===================== Administrator ======================
var schema_administrateur = new mono.Schema({
    name:String,
    prenom:String,
    adresse:String,
    telephone:String,
    email:String,
    login:String,
    password:String,
    date_debut:String,
    dateFin:String,
    postes:Array
});

//instantiate the admin to manipulate 
var administrateur = mono.model("administrateur",schema_administrateur);



//======================= CAISSIERE =======================
var caissiere = new mono.Schema({
    nom:String,
    prenom:String,
    localisation:String,
    matricule:String,
    password:String,
    login:String,
    telephone:String,
    email:String,
    dateDebut:String,
    dateFin:String,
    poste:Array
});

//instantiate 
var caissiere = mono.model("Caissieres",caissiere);

//==================== REsponsable Compte 
var respo_compte = new mono.Schema({
    nom:String,
    prenom:String,
    localisation:String,
    matricule:String,
    password:String,
    login:String,
    telephone:String,
    email:String,
    dateDebut:String,
    dateFin:String,
    poste:Array
});

//=============== instantiate the responsable ============ 
let responsable = mono.model("responsables",respo_compte);



module.exports= (app, urlencodedParser)=>{
    //the home page 
    app.get("/",(req,res)=>{
        res.render("home");
    });

    //the admin page 
    app.get("/admin",(req,res)=>{
        res.render("admin",{data:"administrateur"});
    });

    //for the deconnexion
    app.get("/deconnex",(req,res)=>{
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate');
        res.statusCode=307;
        res.redirect("/");
    });

    // the view for the form for adding admin entity in the database
    app.get("/admin/createAdmin",(req,res)=>{
        res.render("../views/admin/createAdmin");
    });

    //for adding a administrator in the database
    app.post("/addAdmin",urlencodedParser,(req,res)=>{
        //establish the date 
        var today = new Date();
        var time = today.getDay() + "/" + today.getMonth() + "/" + today.getFullYear();

        //insert in the database
        administrateur({
            name:req.body.name,
            prenom:req.body.prenom,
            adresse:req.body.adresse,
            telephone:req.body.telephone,
            email:req.body.email,
            login:req.body.login,
            password:req.body.password,
            date_debut:time,
            dateFin:"vide",
            postes:"administrateur"
        }).save((err)=>{
            if(err) throw err;
            res.redirect("/");
        })
    });

    //================================ start Caissiere ===============
    //for the list of caissiere 
    app.get("/listC",(req,res)=>{
        caissiere.find({},(err,data)=>{
            var donnee = data
            res.render("caissier/liste",{donnees:donnee});
        });
    });

    //post to insert a caissiere 
    app.post("/formCaissier",urlencodedParser,(req,res)=>{
        //establish the date 
        var today = new Date();
        var time = today.getFullYear() + "/" + today.getMonth() + "/" + today.getDay();
        caissiere({
            nom:req.body.nom,
            prenom:req.body.prenom,
            localisation:req.body.adresse,
            matricule:uuid(),
            password:req.body.password,
            login:req.body.login,
            telephone:req.body.telephone,
            email:req.body.email,
            dateDebut:time,
            dateFin:null,
            poste:"caissiere"
        }).save((err)=>{
            res.redirect("/listC");
        });
    });


    //view for insert a caissiere
    app.get("/addCaissier",(req,res)=>{
        res.render("caissier/formCaissier");
    });
    //====================== end Caissiere ======================================



    //============================= start for Responsable =========================

    //view page for insert an admin
    app.get("/view_respo_form",(req,res)=>{
        res.render("respo/addRespo");
    });

    //page for the list of responsable 
    app.get("/view_list_respo",(req,res)=>{
        responsable.find({},(err,data)=>{
            
            res.render("respo/listRespo",{dataRespo:data});                
           
        });
    });

    //for insert in the database
    app.post("/add_respo",urlencodedParser,(req,res)=>{
        //set the date 
        var today = new Date();
        var time = today.getFullYear() + "/" + today.getMonth() + "/" + today.getDay();
        //insert the resoonsable 
        responsable({
            nom:req.body.nom,
            prenom:req.body.prenom,
            localisation:req.body.adresse,
            matricule:"RESPO"+uuid(),
            password:req.body.password,
            login:req.body.login,
            telephone:req.body.telephone,
            email:req.body.email,
            dateDebut:time,
            dateFin:null,
            poste:"responsable"
        }).save((err)=>{
            try{
                res.redirect("/view_list_respo");
            }catch{
                throw err;
            }
        })
    });


    //============================= end Respo =========================


    //page login
    app.post("/login",urlencodedParser,(req,res)=>{
        var login = req.body.login;
        var password = req.body.password;
        var personne = req.body.personne;
        switch(personne){
            case "admin": 
            administrateur.find({"login":login.toString(),"password":password.toString()}
            ,"prenom adresse",(err,data)=>{
                if(err){res.redirect("/")}
                if(data){
                    if(data[0].prenom){
                        res.redirect("/admin");
                    }else{
                        res.redirect("/");
                    }
                }else{
                    res.redirect("/");
                }
            });
            break;
        }
    });










}