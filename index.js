const express = require('express')

const bcrypt = require('bcrypt');

const app = express()

const port = 5000;

let blogs = [];

//import package express-flash dan express-session
const flash = require('express-flash')
const session = require('express-session')

const db = require('./connection/db');
const { MemoryStore } = require('express-session');

app.set('view engine', 'hbs') //set view engine hbs

app.use('/public', express.static(__dirname + '/public')) // set public path/folder 

app.use(express.urlencoded({extended:false}))

//use express-flash
app.use(flash())

//setup session middleware
app.use(
    session({
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 2 * 60 * 60 * 1000, // 2 jam
        },
        store: new session.MemoryStore(),
        saveUninitialized: true,
        resave: false,
        secret: 'secretValue'
    })
)


app.get('/', (req, res) => {

    db.connect(function (err, client, done) {
        if (err) throw err;
    
        client.query(`SELECT * FROM tb_project ORDER BY id DESC`, function (err, result) {
          if (err) throw err;
          let data = result.rows;
    
          data = data.map(function (item) {
            return {
              ...item,
              isLogin: req.session.isLogin,
              title: item.name,
              description: item.description,
              start_date: item.start_date,
              end_date: item.end_date,
              duration: getDistanceTime(item.start_date, item.end_date),
              
            };
          });
          res.render("index", { 
              isLogin: req.session.isLogin,
              user: req.session.user,
              projects: data });
          console.log(req.session);
        });
      });
})

app.get('/add-project', (req, res) => {
    res.render('add-project')
})

app.post('/add-project', (req, res) => {

    let data = req.body

        db.connect(function (err, client, done) {
            if (err) throw err //kondisi untuk menampilkan error konkesi

            const query = `INSERT INTO tb_project(
                name, start_date, end_date, description, technologies, image)
                VALUES ( '${data.name}', '${data.mulai_tanggal}', '${data.akhir_tanggal}', '${data.description}', '{${data.nodejs}, ${data.reactjs}, ${data.nextjs}, ${data.typescript}}', '${data.upload_image}');`
    
            client.query(query, function(err, result){
                if(err) throw err //kondisi untuk menampilkan error query
    
                done()
    
                //let data = result.rows
    
            })
        })
        res.redirect('/')

}) 

app.get('/contact', (req, res) => {
    res.render('contact')
})

app.get("/edit-project/:id", function (req, res) {
    let id = req.params.id;
    db.connect((err, client, done) => {
      if (err) throw err;
  
      client.query(`SELECT * FROM tb_project WHERE id = ${id}`, (err, result) => {
        if (err) throw err;
        done();
        let data = result.rows[0];
  
        (data.start_date = getFullTime(data.start_date)),
          (data.end_date = getFullTime(data.end_date)),
          res.render("edit-project", { update: data, id});
      });
    });
  });

  app.post("/edit-project/:id", function (req, res) {
    let data = req.body;
    let id = req.params.id;
  
    db.connect(function (err, client, done) {
      if (err) throw err;
      done();
  
      client.query(
        `UPDATE public.tb_project SET  name='${data.name}', "start_date"='${data.mulai_tanggal}', "end_date"='${data.akhir_tanggal}',
         description='${data.description}', technologies='{${data.nodejs}, ${data.reactjs}, ${data.nextjs}, ${data.typescript}}', image='${data.upload_image}'
        WHERE id=${id}`,
        function (err, result) {
          if (err) throw err;
  
          res.redirect("/"); // berpindah halaman ke route /home
        }
      );
    });
  });

app.get('/delete-project/:id', (req, res) => {

    const id = req.params.id


    db.connect(function (err, client, done) {
        if (err) throw err //kondisi untuk menampilkan error konkesi

        const query = `DELETE FROM tb_project
	    WHERE id=${id};`

        client.query(query, function(err, result){
            if(err) throw err //kondisi untuk menampilkan error query

            done()

            //let data = result.rows
 
        })
    })

    res.redirect('/') 

})

app.get("/project-detail/:id", function (req, res) {
    const id = req.params.id;
  
    db.connect(function (err, client, done) {
      if (err) throw err;
  
      client.query(`SELECT * FROM tb_project WHERE id=${id}`, function (err, result) {
        if (err) throw err;
        done();

        console.log(result)
  
        let data = result.rows[0];
  
        (data.start_date = getFullTime(data.start_date)),
          (data.end_date = getFullTime(data.end_date)),
          (data.duration = getDistanceTime(data.start_date, data.end_date)),
         
          res.render("project-detail", {projects: data});
        console.log(data);
      });
    });
  });


app.get('/register', function(req, res) {
    res.render('register')
})

app.post('/register', function(req, res) {

    let data = req.body

    console.log(data);

    //const { inputName, inputEmail, inputPassword } = req.body

    const hash = bcrypt.hashSync(data.inputPassword, 10)
     
    const query = `INSERT INTO tb_user(
        name, email, password)
        VALUES ('${data.inputName}', '${data.inputEmail}', '${hash}');`

    console.log(data.inputPassword, hash);

    db.connect( (err, client, done) => {
        if (err) throw err 

        client.query(query, function(err, result){
            if(err) throw err //kondisi untuk menampilkan error query

            done()

            res.redirect('/login')

        })
    })
})

app.get('/login', function(req, res) {
    res.render('login')
})

app.post("/login",  (req, res) => {
    let data = req.body;
  
    db.connect( (err, client, done) => {
      if (err) throw err;
  
      client.query(`SELECT * FROM public.tb_user WHERE email ='${data.inputEmail}'`, (err, result) => {
        if (err) throw err;
        done();
  
        console.log(result);
  
        if (result.rows.length == 0) {
          req.flash("danger", "Email belum terdaftar ");
          return res.redirect("/login");
        }
        let isMatch = bcrypt.compareSync(data.inputPassword, result.rows[0].password);
        console.log(isMatch);
  
        if (isMatch) {
          (req.session.isLogin = true),
            (req.session.user = {
              id: result.rows[0].id,
              name: result.rows[0].name,
              email: result.rows[0].email,
            })

          req.flash("success", "Login Succes");
          res.redirect("/");

        } else {

          req.flash("danger", "Password Salah");
          res.redirect("/login");
        }
      })
    })
  })

app.get("/logout", function (req, res) {
req.session.destroy();

res.redirect("/");
});  

function getDistanceTime(start_date, end_date) {

    let mulai = new Date(start_date)

    let akhir = new Date(end_date)

    let distance = akhir - mulai //milisecond

    //console.log(distance);

    let milisecond = 1000 // 1 detik 1000 milisecond
    let secondInHours = 3600 // 1 jam 3600 detik
    let hoursInDay = 24 // 1 hari 24 Jam
    let dayInMonth = 31 // 1 bulan 31 hari
    let dayInWeek = 7 // 1 Minggu 7 Hari

    //Bulan
    let distanceMonth = Math.floor (distance / (milisecond * secondInHours * hoursInDay * dayInMonth))
    

    //Minggu
    let distanceWeek = Math.floor (distance / (milisecond * secondInHours * hoursInDay * dayInWeek))
    

    //Hari
    let distanceDay = Math.floor (distance / (milisecond * secondInHours * hoursInDay))

    //Jam
    let distanceHour = Math.floor (distance / (milisecond * secondInHours))

    

    if (distanceMonth > 0 ) {
        return `${distanceMonth} Bulan`

    } else if (distanceWeek > 0) {
        return `${distanceWeek} Minggu`;

    } else if (distanceDay > 0) {
        return `${distanceDay} Hari`

    } else {
        return distanceHour, " Dikumpulkan hari ini";
    }
    
}

let month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'Oktober',
    'November',
    'December'
]

function getFullTime(time) {
    let date = time.getDate()
    let monthIndex = time.getMonth()
    let year = time.getFullYear()

    let hour = time.getHours()
    let minute = time.getMinutes()

    let fullTime = `${date} ${month[monthIndex] } ${year} ${hour} : ${minute} WIB`

    return   fullTime
}

app.listen(port, () => {
    console.log(`listening server on port ${port}`);
})
