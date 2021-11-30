let socket = io.connect('http://localhost:3000');

function displayPost(post)
{
    if(!post._id)return 0;
    postHTML = `<a href = "${window.location.origin + '?id='+post._id}">
    <div class = "post">
        <h1>${post.title}</h1>
        <h6>${post.timestamp}</h6>
        <p>${post.text}</p>
    </div></a>`;
    document.querySelector("#postContainer").innerHTML += postHTML;
}

function makeDbRequest(id = 0, category = "")
{
    restrictions={
        id:+id,
        category:category
    };
    socket.emit("getPosts", restrictions);
    socket.on("dbResult", data =>{
        data.forEach(post =>{
                displayPost(post);
        });
    });
}

window.onload = () => {
const form  = document.getElementById('addPost');

form.addEventListener('submit', (event) => {
    //event.preventDefault();
    let post = {
        title: form.elements['formTitle'].value,
        text: form.elements['formText'].value,
            category: form.elements['formCategory'].value,
        timestamp: new Date()
    }
    socket.emit("addPost", post);
});
};