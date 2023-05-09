// ==UserScript==
// @name         7TV Mod tools bandaged
// @namespace    https://7tv.app/
// @version      1.0
// @description  Janky version of mod tools.
// @author       FilunovicU
// @match        https://7tv.app/users/*
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


`;


let s = document.createElement('style');
s.type = "text/css";
s.innerHTML = styleSheet;
(document.head || document.documentElement).appendChild(s);



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
