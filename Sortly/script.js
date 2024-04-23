function addBlogPost(title, content, link) {
    const blogEntries = document.querySelector('.blog-entries');

    // Create a new anchor element for the blog entry
    const newEntry = document.createElement('a');
    newEntry.classList.add('blog-entry');
    newEntry.href = link; // Set the href attribute to the specified link

    // Set the inner HTML of the new anchor element to include title and content
    newEntry.innerHTML = `
        <h3>${title}</h3>
        <p>${content}</p>
        <p class="read-more">Read More</p>
    `;

    // Append the new anchor element to the blog entries section
    blogEntries.prepend(newEntry); // Prepend to ensure newest entries appear first
}


// Example usage
addBlogPost("2: Buying a car", "Exploring the East Coast", "blog/02_first_days_NYC.html");
addBlogPost("1: The first days NYC", "Flying over the Atlantic in an A380", "blog/02_first_days_NYC.html");
addBlogPost("0: Preparations", "Preparations been stressful, but is it all worth it?", "blog/01_preparation.html");

// Function to scroll to the blog section when the hero button is clicked
function scrollToBlog() {
    const blogSection = document.getElementById('blog');
    blogSection.scrollIntoView({ behavior: 'smooth' });
}


document.addEventListener("DOMContentLoaded", () => {
    // Set the number of columns desired
    const columns = 3;
    const blogSections = document.querySelectorAll('#blog section');

    // Distribute the blog entries evenly among the columns
    for (let i = 0; i < blogSections.length; i += columns) {
        const columnContent = Array.from(blogSections).slice(i, i + columns);
        const column = document.createElement('div');
        column.classList.add('column');
        columnContent.forEach(section => column.appendChild(section));
        blog.appendChild(column);
    }
});

let slideIndex = 1;
showSlides(slideIndex);

function nextSlide() {
    showSlides(slideIndex += 1);
}

function prevSlide() {
    showSlides(slideIndex -= 1);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");
    
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}
