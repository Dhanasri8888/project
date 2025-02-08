const insertButton = document.getElementById('insert-button');
const linkInput = document.getElementById('link-input');
const descInput = document.getElementById('desc-input');
const resourceList = document.getElementById('resource-list');

// Define whether the user is an admin
const isAdmin = true; // Change to false for non-admin users

// Get the current page identifier (e.g., "page1.html")
const currentPage = window.location.pathname.split("/").pop();

// Load existing links from local storage on page load
document.addEventListener('DOMContentLoaded', loadLinksFromLocalStorage);

insertButton.addEventListener('click', () => {
    const newLink = linkInput.value.trim();
    const linkDesc = descInput.value.trim();

    if (newLink !== "" && linkDesc !== "") {
        if (isDuplicateLink(newLink)) {
            alert("This link already exists on this page!");
            return;
        }

        let firstBox = resourceList.querySelector('.main-box');

        if (!firstBox) {
            firstBox = createMainBox();
            resourceList.appendChild(firstBox);
        }

        const linkContainer = firstBox.querySelector('.link-container');
        const newLi = createLinkElement(newLink, linkDesc);

        linkContainer.appendChild(newLi);
        storeLinkInLocalStorage(newLink, linkDesc);
        showSuccessMessage('Inserted successfully! ✔️');

        // Clear input fields
        linkInput.value = ''; 
        descInput.value = ''; 
    } else {
        alert("Please enter a valid link and description!");
    }
});

// Function to check for duplicate links
function isDuplicateLink(link) {
    const key = `links_${currentPage}`;
    const links = JSON.parse(localStorage.getItem(key)) || [];
    return links.some(item => item.link === link);
}

// Function to create the main container box
function createMainBox() {
    let firstBox = document.createElement('li');
    firstBox.classList.add('main-box');
    firstBox.style.marginBottom = '15px';
    firstBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    firstBox.style.padding = '20px';
    firstBox.style.borderRadius = '10px';
    firstBox.style.boxShadow = '4px 4px 8px rgba(0,0,0,0.5)';
    firstBox.style.transition = 'transform 0.2s ease, background-color 0.2s ease';

    // Heading
    const heading = document.createElement('h3');
    heading.textContent = "Added Links";
    heading.style.color = "#E91E63";
    heading.style.textAlign = "center";
    firstBox.appendChild(heading);

    // Link container
    const linkContainer = document.createElement('ul');
    linkContainer.classList.add('link-container');
    linkContainer.style.paddingLeft = "15px";
    firstBox.appendChild(linkContainer);

    return firstBox;
}

// Function to create a link element
function createLinkElement(link, description) {
    const newLi = document.createElement('li');
    newLi.style.marginTop = '10px';

    const strongText = document.createElement('strong');
    strongText.textContent = description;
    newLi.appendChild(strongText);

    const newA = document.createElement('a');
    newA.href = link;
    newA.target = "_blank";
    newA.textContent = " Visit here";
    newA.style.display = "block";
    newA.style.color = "#FFEB3B"; 
    newA.style.textDecoration = "none";
    newA.style.marginTop = "5px";
    newLi.appendChild(newA);

    if (isAdmin) {
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-button');
        removeButton.style.marginLeft = "10px";
        removeButton.style.backgroundColor = "#FF5733";
        removeButton.style.color = "white";
        removeButton.style.padding = "5px 10px";
        removeButton.style.border = "none";
        removeButton.style.borderRadius = "5px";
        removeButton.style.cursor = "pointer";
        removeButton.style.transition = "background-color 0.3s";

        removeButton.addEventListener('click', () => {
            newLi.remove();
            removeLinkFromLocalStorage(link);
            showSuccessMessage('Removed successfully! ✔️');
        });

        removeButton.addEventListener('mouseover', () => {
            removeButton.style.backgroundColor = "#C70039";
        });

        removeButton.addEventListener('mouseout', () => {
            removeButton.style.backgroundColor = "#FF5733";
        });

        newLi.appendChild(removeButton);
    }

    return newLi;
}

// Function to show success messages
function showSuccessMessage(message) {
    const successMessage = document.createElement('div');
    successMessage.textContent = message;
    successMessage.style.backgroundColor = '#4CAF50';
    successMessage.style.color = 'white';
    successMessage.style.padding = '10px';
    successMessage.style.borderRadius = '5px';
    successMessage.style.position = 'fixed';
    successMessage.style.top = '20px';
    successMessage.style.right = '20px';
    successMessage.style.zIndex = '1000';
    successMessage.style.transition = 'opacity 0.5s ease';
    document.body.appendChild(successMessage);

    setTimeout(() => {
        successMessage.style.opacity = '0';
        setTimeout(() => {
            successMessage.remove();
        }, 500);
    }, 2000);
}

// Function to store link in local storage for the current page
function storeLinkInLocalStorage(link, description) {
    const key = `links_${currentPage}`;
    const links = JSON.parse(localStorage.getItem(key)) || [];

    links.push({ link, description });
    localStorage.setItem(key, JSON.stringify(links));
}

// Function to remove link from local storage
function removeLinkFromLocalStorage(link) {
    const key = `links_${currentPage}`;
    let links = JSON.parse(localStorage.getItem(key)) || [];
    links = links.filter(item => item.link !== link);
    localStorage.setItem(key, JSON.stringify(links));
}

// Function to load links from local storage for the current page
function loadLinksFromLocalStorage() {
    const key = `links_${currentPage}`;
    const links = JSON.parse(localStorage.getItem(key)) || [];

    if (links.length > 0) {
        let firstBox = resourceList.querySelector('.main-box');

        if (!firstBox) {
            firstBox = createMainBox();
            resourceList.appendChild(firstBox);
        }

        const linkContainer = firstBox.querySelector('.link-container');

        links.forEach(item => {
            const newLi = createLinkElement(item.link, item.description);
            linkContainer.appendChild(newLi);
        });
    }
}
