let selectScript = document.querySelectorAll('.selectScript');
let script_id = document.querySelectorAll('.script_id');
let script_show = document.querySelectorAll('#script_show');
let shower_script = document.querySelector('#shower_script')

script_show.forEach((val, idx) => {
    
    val.addEventListener('click', (e) => {
        e.preventDefault()
        shower_script.textContent = val.value
    })
}) 

// selectScript.forEach((val, idx) => {
//     val.addEventListener('click', ()=> {
//         $.ajax({
//             method: 'POST',
//             url: 'http://localhost:3000/commentscript',
//             dataType: 'json',
//             contentType: 'application/json',
//             data: JSON.stringify([
//                 {value: val.value}
//             ])
//         });
//     })
// })

script_id.forEach((val, idx) => {
    val.textContent = idx + 1;
})

