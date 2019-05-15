console.log('app.js');
fetch('./file/all').then((response) => {
    return response.json();
}).then ((json) => {
    console.log(json);
    json.forEach((file) => {
        // all infos from file list
        document.querySelector('#files').innerHTML += `<li class="gallery"> 
                                                                  <ul>                                                                
                                                                    <h2>${file.title}</h2>
                                                                        <form style="float: right">  
                                                                            <!--    
                                                                            <a href='/file/edit/${file._id}' style="padding-right: 45px"<button type="button">Edit</button></a>
                                                                            <a href='/file/delete/${file._id}' style="padding-right: 45px"<button type="button">Delete</button></a>
                                                                            -->
                                                                        </form>    
                                                                    <p>By ${file.username}</p>                                                                                                                            
                                                                    <img src="uploads/${file.imagename}" width="620" height="auto">  
                                                                    <p hidden id>${file._id}</p>                                                             
                                                                    <p>${file.description}</p>                                                              
                                                                  </ul>
                                                               </li>`;
    });
});