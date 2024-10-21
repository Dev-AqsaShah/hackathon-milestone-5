// Get the form element
const resumeForm = document.getElementById("resumeform") as HTMLFormElement | null;

// Listen for the form submit event
resumeForm?.addEventListener('submit', function (event: Event) {
    event.preventDefault();

    // Get the form input elements
    const nameElement = document.getElementById("name") as HTMLInputElement | null;
    const emailElement = document.getElementById("email") as HTMLInputElement | null;
    const phoneElement = document.getElementById("phone") as HTMLInputElement | null;
    const educationElement = document.getElementById("education") as HTMLTextAreaElement | null;
    const experienceElement = document.getElementById("experience") as HTMLTextAreaElement | null;
    const skillsElement = document.getElementById("skills") as HTMLTextAreaElement | null;
    const usernameElement = document.getElementById("username") as HTMLInputElement | null;

    // Check if all elements exist
    if (nameElement && emailElement && phoneElement && educationElement && experienceElement && skillsElement && usernameElement) {
        // Get the values from the input elements
        const name = nameElement.value;
        const email = emailElement.value;
        const phone = phoneElement.value;
        const education = educationElement.value;
        const experience = experienceElement.value;
        const skills = skillsElement.value;
        const username = usernameElement.value;

        // Store the values in localStorage
        localStorage.setItem('name', name);
        localStorage.setItem('email', email);
        localStorage.setItem('phone', phone);
        localStorage.setItem('education', education);
        localStorage.setItem('experience', experience);
        localStorage.setItem('skills', skills);
        localStorage.setItem('username', username);

        const uniquePath = `resume/${username.replace(/\s+/g, '_')}_cv.html`;

        // Update the resume output
        updateResumeOutput(uniquePath);
    }
});

// Function to update the resume output based on localStorage values
function updateResumeOutput(uniquePath: string): void {
    const name = localStorage.getItem('name') || '';
    const email = localStorage.getItem('email') || '';
    const phone = localStorage.getItem('phone') || '';
    const education = localStorage.getItem('education') || '';
    const experience = localStorage.getItem('experience') || '';
    const skills = localStorage.getItem('skills') || '';

    // Create the HTML for the resume output
    const resumeOutput = `
        <h2>Resume</h2>
        <p><strong>Name:</strong> <span id="edit-name" class="editable">${name}</span></p>
        <p><strong>Email:</strong> <span id="edit-email" class="editable">${email}</span></p>
        <p><strong>Phone:</strong> <span id="edit-phone" class="editable">${phone}</span></p>
        <h3>Education</h3>
        <p><span id="edit-education" class="editable">${education}</span></p>
        <h3>Experience</h3>
        <p><span id="edit-experience" class="editable">${experience}</span></p>
        <h3>Skills</h3>
        <p><span id="edit-skills" class="editable">${skills}</span></p>
    `;

    // Create the download link
    const downloadLink = document.createElement('a');
    downloadLink.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(resumeOutput);
    downloadLink.download = uniquePath;
    downloadLink.textContent = "Download your Resume";

    // Update the resume output on the page
    const resumeOutputElement = document.getElementById("resumeOutput");
    if (resumeOutputElement) {
        resumeOutputElement.innerHTML = resumeOutput;
        resumeOutputElement.appendChild(downloadLink);

        // Make the fields editable
        makeEditable();
    }
}

// Function to make fields editable and save changes to localStorage
function makeEditable(): void {
    const editableElements = document.querySelectorAll('.editable');
    editableElements.forEach(element => {
        element.addEventListener("click", function () {
            const currentElement = element as HTMLSpanElement;
            const currentValue = currentElement.textContent || "";

            if (currentElement.tagName === "SPAN") {
                const inputElement = document.createElement("input");
                inputElement.type = "text";
                inputElement.classList.add('editing-input');
                inputElement.value = currentValue;

                // Save changes on blur
                inputElement.addEventListener('blur', function () {
                    currentElement.textContent = inputElement.value;
                    currentElement.style.display = 'inline';
                    inputElement.remove();

                    // Update localStorage with the new value
                    const key = currentElement.id.replace('edit-', ''); // Extract key from the id
                    localStorage.setItem(key, inputElement.value); // Save the updated value in localStorage
                });

                currentElement.style.display = 'none';
                currentElement.parentNode?.insertBefore(inputElement, currentElement);
                inputElement.focus();
            }
        });
    });
}

// Load the resume output when the page loads
window.addEventListener('load', function () {
    updateResumeOutput(localStorage.getItem('username')?.replace(/\s+/g, '_') + '_cv.html' || 'resume/default_cv.html'); // Load the stored data when the page is refreshed
});
