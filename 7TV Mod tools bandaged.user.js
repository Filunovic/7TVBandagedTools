// ==UserScript==
// @name         7TV Mod tools bandaged
// @namespace    https://7tv.app/
// @version      2.0.1
// @description  Janky version of mod tools.
// @author       FilunovicU
// @match        https://7tv.app/users/*
// @match        https://7tv.app/admin/reports/*
// @match        https://7tv.app/emotes/*
// @icon         https://cdn.7tv.app/emote/62f9936414f7d01379c00164/1x.webp
// @grant        none
// ==/UserScript==


let styleSheet = `
.banBtn {
background-color: #29b6f6;
border: 0.1rem solid #27b5f6;
font-size: 1rem;
color: #fff;
padding: 0.5rem;
border-radius: 0.25rem;
text-align: center;
}

.banBtn:before {
content: url(https://static-cdn.jtvnw.net/emoticons/v2/301428702/default/dark/1.0);
}

.banBtn:hover {
background-color: #54c0f1;
cursor: pointer;
}

.tranBtn {
    height: 100%;
    transform: skew(-30deg);
    display: flex;
    justify-content: center;
    padding-left: 1em;
    padding-right: 1em;
    cursor: pointer;
    transition: background-color .15s ease;
background-color: #1f2528;
color: #e6e6e6;
}

.tranBtn {
text-align: center;
    align-items: center;
    font-size: .88rem;
    font-weight: 600;
}

.tranBtn:hover {
background-color: #2c3539;
}

.tranBtntext {
transform: skew(30deg);
}

.tranBtn:before {
content: url(https://i.imgur.com/Sj98Adc.png);
transform: skew(30deg);
margin-right: 3px;
}

`;


let s = document.createElement('style');
s.type = "text/css";
s.innerHTML = styleSheet;
(document.head || document.documentElement).appendChild(s);

if (window.location.href.indexOf("users") > -1) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            // get the div element by its selector
            const divElement = document.querySelector('div[selector="tag"]');

            // check if the div element exists
            if (divElement) {
                // create a new button element
                const buttonElement = document.createElement('button');
                buttonElement.className = "banBtn";
                // set the button's text content
                buttonElement.textContent = '';
                buttonElement.title = 'Send on vacation';
                // insert the button element after the div element
                divElement.parentNode.insertBefore(buttonElement, divElement.nextSibling);

                // add a click event listener to the button
                buttonElement.addEventListener('click', function() {
                    let victim, reason, days;

                    if (window.location.pathname.startsWith("/users/")) {
                        victim = window.location.pathname.split("/")[2];
                    } else {
                        victim = prompt("Enter the user ID of the user you want to ban");
                    }
                    reason = prompt("Enter the reason for the ban");
                    days = prompt("Enter the number of days to ban the user for");

                    // if empty strings or null, cancel
                    if (!victim || !reason || !days) {
                        alert("Ban not created, invalid");
                    } else {
                        const data = JSON.stringify({
                            query: `mutation {
        createBan(victim_id:\"${victim}\", reason:\"${reason}\", effects: 11, expire_at: \"${new Date(Date.now() + 864E5 * days).toISOString()}\") {
            id
            expire_at
        }
    }`,
                        });

                        const xhr = new XMLHttpRequest();

                        xhr.addEventListener("readystatechange", function () {
                            if (this.readyState === this.DONE) {
                                console.log(this.responseText);
                            }
                        });

                        xhr.open("POST", "https://7tv.io/v3/gql");
                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.setRequestHeader("Authorization", "Bearer " + window.localStorage.getItem("7tv-token"));

                        xhr.send(data);
                    }
                });
            }
        }, 2000); // delay the execution of the function by 2000 milliseconds (2 seconds)
    });

}else if (window.location.href.indexOf("emotes") > -1) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            // get the div element by its selector
            const divElement = document.querySelector('div[name="more"]');

            // check if the div element exists
            if (divElement) {
                // create a new button element
                const buttonElement = document.createElement('action-button');
                buttonElement.className = "tranBtn";

                // create a separate span element for the button text
                const textElement = document.createElement('span');
                textElement.className = "tranBtntext";
                textElement.textContent = 'TRANSFER OWNERSHIP';

                // insert the button and text elements after the div element
                divElement.parentNode.insertBefore(buttonElement, divElement.nextSibling);
                buttonElement.appendChild(textElement);

                // add a click event listener to the button
                buttonElement.addEventListener('click', function() {
                    // transfer prompt
                    let emoteID, userID, reason;

                    // if on an emote page use the emote ID, otherwise prompt for it
                    if (window.location.pathname.startsWith("/emotes/")) {
                        emoteID = window.location.pathname.split("/")[2];
                    } else {
                        emoteID = prompt("Enter emote ID");
                    }

                    // if on a user page use the user ID, otherwise prompt for it
                    if (window.location.pathname.startsWith("/users/")) {
                        userID = window.location.pathname.split("/")[2];
                    } else {
                        userID = prompt("Enter new user ID");
                    }

                    // prompt for reason
                    reason = prompt("Enter reason");


                    // if empty strings or null, cancel
                    if (!emoteID || !userID || !reason) {
                        alert("Emote not modified, invalid parameters");
                    } else {
                        const data = JSON.stringify({
                            query: `mutation {
            emote(id:\"${emoteID}\") {
              update(params:{owner_id:\"${userID}\"}, reason:\"${reason}\") {
                id,
                owner_id
              }
            }
          }`,
    });

    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            console.log(this.responseText);
        }
    });

    xhr.open("POST", "https://7tv.io/v3/gql");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + window.localStorage.getItem("7tv-token"));

    xhr.send(data);
}
      });
    }
  }, 2000); // delay the execution of the function by 1000 milliseconds (2 seconds)
      });
}

