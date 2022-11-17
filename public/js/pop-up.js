const close = document.querySelector('.close-icon')
const popUp = document.querySelector('.pop-up')
const open = document.querySelector('.open')
const feedback = document.querySelector('.message')

const emailInput = document.querySelector('.email-input')
const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
const submit = document.querySelector('.submit-email')


open.addEventListener("click", (e) => {
    console.log('hiding popUp')
    popUp.classList.remove('hide')
})

close.addEventListener("click", (e) => {
    console.log('hiding popUp')
    popUp.classList.add('hide')
    setTimeout(3000)
    console.log('closing')
})


submit.addEventListener("click", (e) => {
    const email = emailInput.value
    const validEmail = emailRegex.test(email) 
if(validEmail){
    feedback.classList.add('success-msg')
    feedback.innerText = 'email successfully saved'
    setTimeout(5000)
    popUp.classList.add('hide')
}if(!validEmail){
    feedback.classList.remove('success-msg')
    feedback.classList.add('error-msg')
    feedback.innerText = 'error! please try again'
    e.preventDefault()
    e.stopPropagation()
} 
})