let model

async function loadModel(){
    model = await tf.loadLayersModel('https://raw.githubusercontent.com/Rhygon1/test/main/model.json')
    model.summary()
}

loadModel()

let input = document.getElementById('input');
input.addEventListener('change', (e) => {
    handleImageLoading(URL.createObjectURL(e.target.files[0]))
});

let images = document.querySelectorAll('img')
images.forEach(im => {
    im.addEventListener('click', () => {
        handleImageLoading(im.src)
    })
})

function handleImageLoading(src){
    let ctx = document.getElementById('canvas').getContext('2d');
    let img = new Image;
    img.src = src
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

document.querySelector("#predict").addEventListener('click', () => {
    if(model){
        document.querySelector('p').innerText = `...Loading`
        let p = document.querySelector('.hidden').getContext('2d').getImageData(0, 0, 64, 64).data
        let pixels = Array.from(p.filter((pixel, idx) => (idx+1)%4!==0))
        tf.tidy(() => {
            pixels = tf.tensor([pixels]).reshape([1, 64, 64, 3])
            pixels = tf.div(pixels, 255)
            let result = model.predict(pixels).arraySync()[0]
            if(result[0] > result[1]){
                document.querySelector('p').innerText = `The AI predicted the driver to be Attentive`
            } else {
                document.querySelector('p').innerText = `The AI predicted the driver to be Distracted`
            }
        })
    }
})
