
const tap = document.querySelector('.play')
const tracks = ['https://virt-landing-tracks.s3.amazonaws.com/big+city.mp3', 'https://virt-landing-tracks.s3.amazonaws.com/credits.mp3', 'https://virt-landing-tracks.s3.amazonaws.com/sometimes+proto.mp3']

const trackPicker = Math.floor(Math.random() * tracks.length);

const random = (trackPicker, tracks[trackPicker])

const audio = new Audio(random)

console.log(audio)

tap.addEventListener("click", (e) => {
    console.log('playing')
    if(audio.paused){
    audio.play()
    tap.classList.add('playing')
    }else{
        audio.pause()
        tap.classList.remove('playing')
    }
})