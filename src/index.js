const SCROLL_TRANSITION = "transform 1s cubic-bezier(.59,.23,.36,1)";

let currentPage = 0;

const pages = []

function loaded() {
    addPage("page0", "Hey");
    addPage("page1", "Ho");
    addPage("page2", "Minecraft");
    addPage("page3", "Sossi");
    initHeader();

    document.addEventListener("wheel", scrollHandler);
    pages[0].elem.classList.add("active");
}

function addPage(newId, newTitle) {
    pages.push({
        elem: document.getElementById(newId),
        title: newTitle
    });

}

function initHeader() {
    const header = document.getElementById("header");
    for (let page of pages) {
        let span = document.createElement("span");
        span.className = "headerLink";
        span.innerText = page.title;
        span.addEventListener("click",()=>navigateToPage(page.elem))
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
    pages.forEach(page=>page.elem.classList.remove("active"));
    pages[currentPage].elem.classList.add("active")
}