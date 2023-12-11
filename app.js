import { getData } from "./src/util/fetch.js";
import { Item } from "./src/components/Item.js";
function app() {
    //쓰로틀 적용 예정
    document.querySelector("#btn_like").onclick = () => {
        swipe("like");
    };
    document.querySelector("#btn_dislike").onclick = () => {
        swipe("dislike");
    };

    let $cardContainer = document.querySelector("#card_container");
    let current;
    $cardContainer.append(Item(), Item());

    current = $cardContainer.querySelector(".card:last-child");
    const swipe = (action) => {
        current.classList.add(action);
        const prev = current;
        const next = current.previousElementSibling;
        // if (nextCard) initEventCard(nextCard);
        // nextCard가 없으면 다음 데이터를 fetch해서 카드를 생성해야함; 다음이 아니라 다다음 카드가 없을때부태 fetch해서 로딩을 줄일 수 있음
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
