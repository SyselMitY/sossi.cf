const SCROLL_TRANSITION = "transform 1s cubic-bezier(.59,.23,.36,1)";

let currentPage = 0;

const pages = []

function loaded() {
    addPage("page0", "Hey Ho");
    addPage("page1", "Krasse Sachen");
    addPage("page2", "Websites");
    addPage("page3", "Persönlichkeiten");
    addPage("page4", "Peppi Gradinger");
    addPage("page5", "Jenklas Enk");
    addPage("page6", "Tschau");
    initHeader();

    document.addEventListener("wheel", scrollHandler);
    pages[0].elem.classList.add("active");

    window.scrollTo(0, 0);

    let targetPage = window.location.hash.substring(1);
    if (targetPage === undefined || targetPage.length === 0)
        return;

    let targetDiv = document.getElementById(targetPage);
    if (targetDiv === undefined)
        return;

    navigateToPage(targetDiv);
}

function addPage(newId, newTitle) {
    let newElem = document.getElementById(newId);
    let links = document.getElementsByClassName(newId + "-link");
    for (let link of links) {
        console.log(link);
        link.addEventListener("click", () => navigateToPage(newElem));
    }
    pages.push({
        elem: newElem,
        title: newTitle
    });

}

function initHeader() {
    const header = document.getElementById("header");
    for (let page of pages) {
        let span = document.createElement("span");
        span.className = "headerLink";
        span.innerText = page.title;
        span.addEventListener("click", () => navigateToPage(page.elem))
        header.appendChild(span);
    }
}

function navigateToPage(target) {
    const children = [...document.getElementById("content").children];
    currentPage = children.indexOf(target);
    scrollPage();
}

function scrollHandler(event) {
    if (event.ctrlKey)
        return;
    if (event.deltaY > 0 && currentPage < pages.length - 1) {
        currentPage++;
        scrollPage();
    } else if (event.deltaY < 0 && currentPage > 0) {
        currentPage--;
        scrollPage();
    }
}

function scrollPage() {
    const content = document.getElementById("content");
    document.removeEventListener("wheel", scrollHandler)
    content.style.transition = SCROLL_TRANSITION
    content.style.transform = `translate(0,${currentPage * -100}vh)`;
    content.addEventListener("transitionend", scrollPageEnd);
}

function scrollPageEnd() {
    const content = document.getElementById("content");
    content.removeEventListener("transitionend", scrollPageEnd);
    content.style.transition = "";
    document.addEventListener("wheel", scrollHandler);
    pages.forEach(page => page.elem.classList.remove("active"));
    console.log(currentPage);
    pages[currentPage].elem.classList.add("active")
}

//Touchscreen stuff
let touchStartY = null;
let deltaY = 0;

function touchStart(event) {
    touchStartY = event.touches[0].clientY;
}

function touchMove(event) {
    let newY = event.touches[0].clientY;
    deltaY = newY - touchStartY;
    console.log(deltaY);
}

function touchEnd() {
    if (deltaY < -150 && currentPage < pages.length - 1) {
        currentPage++;
        scrollPage();
    } else if (deltaY > 150 && currentPage > 0) {
        currentPage--;
        scrollPage();
    }
    deltaY = 0;
}

document.addEventListener("touchstart", touchStart);
document.addEventListener("touchmove", touchMove);
document.addEventListener("touchend", touchEnd);