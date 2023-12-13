// import { getData } from "./util/fetch.js";
import { Item } from "./components/Item.js";
function app() {
    let timer = null;
    const btnLike = document.querySelector('[data-btn-preference="like"]');
    const btnDislike = document.querySelector('[data-btn-preference="dislike"]');
    btnLike.classList.add("active");
    btnDislike.classList.add("active");
    const toggleStyle = () => {
        btnLike.classList.toggle("active");
        btnDislike.classList.toggle("active");
        btnLike.classList.toggle("deactive");
        btnDislike.classList.toggle("deactive");
    };
    const thorttle = (func) => {
        if (!timer) {
            func();
            toggleStyle();
            timer = setTimeout(() => {
                timer = null;
                toggleStyle();
            }, 500);
        }
    };
    btnLike.onclick = (e) => {
        thorttle(() => swipe(e.target.dataset.btnPreference));
    };
    btnDislike.onclick = (e) => {
        thorttle(() => swipe(e.target.dataset.btnPreference));
    };

    let $cardContainer = document.querySelector("#card_container");
    let current;
    $cardContainer.append(Item(), Item());

    current = $cardContainer.querySelector(".card:last-child");
    const swipe = (preference) => {
        current.classList.add(`action_${preference}`);
        const prev = current;
        const next = current.previousElementSibling;
        current = next;
        $cardContainer.insertBefore(Item({ id: 10 }), $cardContainer.children[0]);

        const RemoveSwipedCard = () => {
            $cardContainer.removeChild(prev);
            prev.removeEventListener("animationend", RemoveSwipedCard);
        };
        prev.addEventListener("animationend", RemoveSwipedCard);
    };
}
app();
