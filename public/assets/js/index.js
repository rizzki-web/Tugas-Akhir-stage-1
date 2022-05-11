const emailReceiver = 'mu.rizzki2000@gmail.com'

function submitForm() {

    let name = document.getElementById('name').value
    let email = document.getElementById('email').value
    let nohp = document.getElementById('nohp').value
    let subject = document.getElementById('subject').value
    let message = document.getElementById('message').value

    if (name == '') {
        alert("Nama kamu harus diisi!")
    }if (email == '') {
        alert("Email kamu harus diisi!")
    }if (nohp == '') {
        alert("No Handphone kamu harus diisi!")
    }if (subject == '') {
        alert("Subject kamu harus diisi!")
    }if (message == '') {
        alert("Pesan kamu harus diisi!")
    }

    let a = document.createElement('a')
    a.href = `mailto:${emailReceiver}?subject=${subject}&body=Halo namaku ${name}, ${subject}, ${message}`
    a.click()
}