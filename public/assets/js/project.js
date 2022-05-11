let projects = []

function addProject() {
    let title = document.getElementById('title').value;
    let sdate = document.getElementById('start-date').value;
    let edate = document.getElementById('end-date').value;
    let content = document.getElementById('content').value;
    let image = document.getElementById('upload-image').files[0];
    let nodejs = document.getElementById('nodejs').checked
    let nextjs = document.getElementById('nextjs').checked
    let reactjs = document.getElementById('reactjs').checked
    let typescript = document.getElementById('typescript').checked

    if (nodejs) {
        nodejs = document.getElementById('nodejs').value

    } else {

        nodejs = ''
    }

    if (nextjs) {
        nextjs = document.getElementById('nextjs').value

    } else {

        nextjs = ''
    }

    if (reactjs) {
        reactjs = document.getElementById('reactjs').value

    } else {

        reactjs = ''
    }

    if (typescript) {
        typescript = document.getElementById('typescript').value

    } else {

        typescript = ''
    }
   
    image = URL.createObjectURL(image)

    let project = {
        
    title: title,
    content: content,
    image: image,
    author: 'Muhammad Rizzki',
    postedAt: new Date(),
    sdate: sdate,
    edate: edate,
    nodejs: nodejs,
    nextjs: nextjs,
    reactjs: reactjs,
    typescript: typescript
    
    }

    //console.log(projects);

    projects.push(project)

    renderProject()
}

function renderProject() {
    
    let projectContainer = document.getElementById('kartu')

    projectContainer.innerHTML = ` <div class="card" style="width: 18rem; border: solid 1px rgb(221, 218, 218); height: fit-content; padding: 5px;">
    <img src="public/assets/image/profil.jpg" class="card-img-top" alt="..." style="
        height: 250px;
        width: 95%; 
        border: 8px solid white;
        border-radius: 20px;">
    <div class="card-body">
        <Span class="card-title" style="font-size: 18px; font-weight: 700;">title</span>
        <p style="color: gray;">durasi : 1 BulAN</p>
        <p class="card-text" id="content">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        <div class="card-icon">
            <i class="fa-brands fa-google-play"></i>
            <i class="fa-brands fa-android"></i>
            <i class="fa-brands fa-java"></i>
        </div>
        <div class="card-button" style="text-align: center;">
        <a href="#" class="btn btn-left">Edit</a>
        <a href="#" class="btn btn-right">Delete</a>
        </div>
    </div>
</div>`

    for (let i = 0; i < projects.length; i++) {
        projectContainer.innerHTML += `<div class="card" style="width: 18rem; border: solid 1px rgb(221, 218, 218); height: 485px;; padding: 5px;"">
        <img src=${projects[i].image} class="card-img-top" alt="..." style="
            height: 250px; 
            width: 95%;
            border: 8px solid white;
            border-radius: 20px;">
        <div class="card-body">
            <a href="project-detail.html" class="card-title" style="font-size: 18px; font-weight: 700; text-decoration: none; color: black;">${projects[i].title}</a>
            <p style="color: gray;">durasi: ${getDistanceTime(projects[i])} | ${projects[i].author} </p>
            <p class="card-text" id="content">${projects[i].content}</p>
            <div class="card-icon">
                <i class="${projects[i].nodejs}"></i>
                <i class="${projects[i].nextjs}"></i>
                <i class="${projects[i].reactjs}"></i>
                <i class="${projects[i].typescript}"></i>
            </div>
            <div class="card-button" style="text-align: center;">
            <a href="#" class="btn btn-left">Edit</a>
            <a href="#" class="btn btn-right">Delete</a>
            </div>
        </div>
    </div> `
        
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

function getDistanceTime() {

    let sdates = document.getElementById('start-date').value
    //console.log(sdates);

    let edates = document.getElementById('end-date').value
    //console.log(edates);

    let starts = new Date(sdates)

    let ends = new Date(edates)


    let distance = ends - starts //milisecond

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


