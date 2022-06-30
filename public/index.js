let input = document.getElementById('input');
input.addEventListener('change', handleFiles);

function handleFiles(e) {
    let ctx = document.getElementById('canvas').getContext('2d');
    let img = new Image;
    img.src = URL.createObjectURL(e.target.files[0]);
    img.onload = () => {
        ctx.drawImage(img, 0, 0, document.getElementById('canvas').width, document.getElementById('canvas').height);

        document.querySelector('.hidden').getContext('2d').drawImage(img, 0, 0, 64, 64);
        let imageData = document.querySelector('.hidden').getContext('2d').getImageData(0, 0, 64, 64)
        let data = imageData.data
        for(let i = 15; i<30; i++){
            for(let j = 15; j<30; j++){
                data[i*64*4 + (j*4)] = (0.75*255)
                data[i*64*4 + (j*4) + 1] = (0.2*255)
                data[i*64*4 + (j*4) + 2] = (0.2*255)
                data[i*64*4 + (j*4) + 3] = 255
            }
        }
        document.querySelector('.hidden').getContext('2d').putImageData(imageData, 0, 0)
    }
}

document.querySelector("#magic").addEventListener('click', () => {
    let p = document.querySelector('.hidden').getContext('2d').getImageData(0, 0, 64, 64).data
    let pixels = p.filter((pixel, idx) => (idx+1)%4!==0)
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    let urlencoded = new URLSearchParams();
    urlencoded.append("data", JSON.stringify(pixels));

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch("/magic", requestOptions)
    .then(response => response.text())
    .then(result => document.querySelector('p').innerText = `The AI predicted the image to be ${result}`)
    .catch(error => console.log('error', error));
})

let images = document.querySelectorAll('img')
images.forEach(im => {
    im.addEventListener('click', () => {
        let ctx = document.getElementById('canvas').getContext('2d');
        let img = new Image;
        img.src = im.src
        img.onload = () => {
            ctx.drawImage(img, 0, 0, document.getElementById('canvas').width, document.getElementById('canvas').height);

            document.querySelector('.hidden').getContext('2d').drawImage(img, 0, 0, 64, 64);
            let imageData = document.querySelector('.hidden').getContext('2d').getImageData(0, 0, 64, 64)
            let data = imageData.data
            for(let i = 15; i<30; i++){
                for(let j = 15; j<30; j++){
                    data[i*64*4 + (j*4)] = (0.75*255)
                    data[i*64*4 + (j*4) + 1] = (0.2*255)
                    data[i*64*4 + (j*4) + 2] = (0.2*255)
                    data[i*64*4 + (j*4) + 3] = 255
                }
            }
            document.querySelector('.hidden').getContext('2d').putImageData(imageData, 0, 0)
        }
    })
})