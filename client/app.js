var $picture;

var apiUrl = 'http://localhost:3000/api/';

$(document).ready(function() {
    $('#addImageForm').on('submit', handleForm);
    $picture = $('#picture');
    // getCats()
});

// function getCats() {
//     var list = '';
//     $.get(apiUrl + 'cats').then(function(res) {
//         res.forEach(function(cat) {
//             list += `<h2>${cat.name}</h2>`;
//             if(cat.picture) {
//                 list += `<img src='/api/attachments/picture/download/${cat.picture}'>`;
//             }
//             list += `
//             <p>
//             ${cat.name} is a ${cat.breed} and is ${cat.age} year(s) old.
//             </p>`;
//         });
//         $catList.html(list);
//     });
// }

function handleForm(e) {
    e.preventDefault();

    var promises = [];
    if($picture.val() != '') {
        sendFile($picture.get(0).files[0], apiUrl + 'ClassifiedImages/mnist/upload')
            .then(value => {
                var label = value.labels;
                alert("The number uploaded is " + label.indexOf(Math.max.apply(this, label)))
            }, reason => {
                console.log(reason);
            });
    }
}

//Stolen from: https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications
function sendFile(file, url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        var fd = new FormData();

        xhr.open("POST", url, true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200) {
                resolve(JSON.parse(xhr.responseText));
            }
        };
        fd.append('file', file);
        xhr.send(fd);
    });
}