var express = require('express');
var app = express();
var mongoose = require("mongoose",);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/Inventory_Management",{ useNewUrlParser: true , useUnifiedTopology: true });

var nameSchema = new mongoose.Schema({
    hospitalId:String,
    hospitalName: String,
    hospitalLocation:String,
    hospitalAddress:String,
    hospitalContact:String,
   });
var ventSchema = new mongoose.Schema({
    hospitalId: String,
    ventillatorId: String,
    ventillatorStatus: String,
    hospitalName: String,
});
var User = mongoose.model("Hospital", nameSchema);
var vent = mongoose.model("Ventillators",ventSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/Index.html");
});
app.get("/addHospital.html", (req, res) => {
    res.sendFile(__dirname + "/addHospital.html");
});


app.post("/addHospital", (req, res) => {
    var myData = new User(req.body);
    console.log(myData);
    myData.save()
        .then(item => {
            res.sendFile(__dirname + "/Success.html");  
        })
        .catch(err => {
            res.send("Unknown Error");
        });
});
app.get('/listHospitals.ejs',(req,res) => {
    User.find({},function(err,data){
        if(err)throw err;
        res.render('listHospitals.ejs',{records:data});
    });

});
app.get("/deleteHospital.html",(req,res)=>{
    res.sendFile(__dirname+"/deleteHospital.html");
});

app.post("/deleteHospital",async(req,res)=>{
    var name = req.body.hospitalId;
    var post = await User.remove({"hospitalId":name});
    res.sendFile(__dirname + "/deleteSuccessful.html");
});

app.get("/addVentillators.html",(req,res)=>{
    res.sendFile(__dirname + "/addVentillators.html");
});
app.post("/addVentillators",(req,res) => {
    var myData = new vent(req.body);
    console.log(myData);
    myData.save()
        .then(item => {
            res.sendFile(__dirname + "/Success.html");  
        })
        .catch(err => {
            res.send("Unknown Error");
        });
});
app.get("/updateVentillators.html",(req,res) =>{
    res.sendFile(__dirname + "/updateVentillators.html");
});
app.post("/updateVentillators",async (req,res) =>{
    var post = await vent.updateOne({ventillatorId:req.body.ventillatorId},{$set : {ventillatorStatus: req.body.ventillatorStatus}},function(err,res){
        if(err) throw err;
        console.log("Successful");
    });
    res.sendFile(__dirname + "/updateSuccessful.html");
    
});
app.get("/SearchVentHosp.html",(req,res) =>{
    res.sendFile(__dirname + "/SearchVentHosp.html");
});
app.post("/SearchVentHosp",(req,res) =>{
    var id = req.body.hospitalName;
    vent.find({'hospitalName':new RegExp(id,'i')},function(err,data){
        if(err)throw err;
        res.render('listVentillators.ejs',{records:data,title:req.body.hospitalId});
    });
    
});

app.get("/ListVentStatus.html",(req,res)=>{
    res.sendFile(__dirname + "/ListVentStatus.html");
});
app.post("/ListVentStatus",(req,res) =>{
    var status = req.body.ventillatorStatus;
    vent.find({ventillatorStatus:status},function(err,data){
        if(err)throw err;
        res.render('listVentStatus.ejs',{records:data});
    });

});

app.get("/deleteVentillator.html",(req,res) =>{
    res.sendFile(__dirname + "/deleteVentillator.html");
});
app.post("/deleteVentillator",async(req,res) =>{
    var Id = req.body.ventillatorId;
    var hospId = req.body.hospitalId;
    //var post = await User.remove({"hospitalId":name});
    var post = await vent.remove({'hospitalId' : hospId,'ventillatorId':Id})
    res.sendFile(__dirname + "/deleteSuccessful.html");
});
app.use("/deleteventact",(req, res)=>{
    console.log(" Deleting Ventilator !!");
    Ventilator.deleteOne({HID: req.body.HID,VID: req.body.VID},(err, results)=>{
       if (err) return console.log(err)
       res.redirect('/result');
    })
    Hospitals.updateOne({HID: req.body.HID},{$inc:{Number_Of_Ventilators:-1}},(req, res)=>{
       
    });
 });

app.get('/listAllVent.ejs',(req,res) => {
    vent.find({},function(err,data){
        if(err)throw err;
        res.render('listAllVent.ejs',{records:data});
    });

});
app.listen(3000, () => {
    console.log("Server listening on port " + 3000);
});

