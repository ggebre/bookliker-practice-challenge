document.addEventListener("DOMContentLoaded", function() {
    const bookList = document.querySelector("#list")
    const showPanel = document.querySelector("#show-panel")
    const currentuser = {id: 10, username: "macejkovic"}
    let likeButtonToggle = true 


    fetch("http://localhost:3000/books")
    .then(resp => resp.json())
    .then(bookObjs => {
        bookObjs.forEach(bookObj => {
            bookList.innerHTML += `<li data-id=${bookObj.id}> ${bookObj.title}</li>` 
        }) 

        bookList.addEventListener('click', event => {
            
            if (event.target.tagName == "LI"){
                const id = event.target.dataset.id 
                fetchBookById(id)
                .then(bookObj => {
                    
                    renderShowPanel(bookObj)

                    // if like is pressed do something 

                    // showPanel.addEventListener('click', (event)=> {
                    //     if (event.target.tagName == "BUTTON"){
                    //         // update book's users and update interface
                    //         // let bookUsers = [...bookObj.users] 
                    //         if (likeButtonToggle) {

                    //             // bookUsers.push(currentuser)
                    //             const bookUsers = [...bookObj.users, currentuser]
                    //             console.log(bookUsers)
                    //             let id = event.target.dataset.id 
                                
                    //             updateBookById(id, bookUsers)
                    //             .then(bookObj => {
                    //                 renderShowPanel(bookObj)
                    //             })
                    //         } else {
                    //             console.log("HELLO")
                    //         }
                    //         likeButtonToggle = !likeButtonToggle
                            
                    //     }
                    // })
                })

            }

        })

        showPanel.addEventListener('click', (event)=> {
            if (event.target.tagName == "BUTTON"){
                // update book's users and update interface
                // let bookUsers = [...bookObj.users] 
                const id = event.target.dataset.id 
                fetchBookById(id)
                     .then(bookObj => {
                        let bookUsers = [...bookObj.users] 
                        if (likeButtonToggle){
                            bookUsers.push(currentuser);
                        } else {
                            bookUsers.pop();
                        }
                        
                        updateBookById(id, bookUsers)
                        .then(bookObj => {
                            renderShowPanel(bookObj)
                        }) 

                        likeButtonToggle = !likeButtonToggle
                        
                     })
                
                
            }
        })


    })

    function fetchBookById(id) {
        return fetch(`http://localhost:3000/books/${id}`)
                .then(resp => resp.json())
    }

    function updateBookById(id, bookUsers){
        return fetch(`http://localhost:3000/books/${id}`, {
            method: "PATCH", 
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json"
              },
              body: JSON.stringify({
                  users: bookUsers
              })
        })
        .then(resp => resp.json())
    }

    function renderShowPanel({title, img_url, subtitle, description, users, id}) {
        let showPanelHTML = `<img src=${img_url}>
                            <h1> ${title} </h1>
                            <h2> ${subtitle || ""} </h2>
                            <p> ${description}</p> 
                          `
        showPanelHTML += "<ul>"
        users.forEach(user =>  {
            showPanelHTML += `<li data-id=${user.id}>` + user.username + "</li>"
        } )
        showPanelHTML += `</ul><br><button data-id=${id}> LIKE </button>`

        showPanel.innerHTML = showPanelHTML
        
    }
});
