// import { getData } from "./util/fetch.js";
import { Item } from "./components/Item.js";
function app() {
    //쓰로틀 적용 예정
    //쓰로틀로 이벤트 대기중일때는 버튼이 비활성화된 스타일을 보여줘야 UX 향상함
    let timer = null;
    const btnLike = document.querySelector("#btn_like");
    const btnDislike = document.querySelector("#btn_dislike");
    const thorttle = (func, el) => {
        if (!timer) {
            func();
            el.classList.add("deactive");
            timer = setTimeout(() => {
                timer = null;
                el.classList.remove("deactive");
            }, 500);
        }
    };
    btnLike.onclick = () => {
        thorttle(() => swipe("like"), btnLike);
    };
    btnDislike.onclick = () => {
        thorttle(() => swipe("dislike"), btnDislike);
    };

    let $cardContainer = document.querySelector("#card_container");
    let current;
    $cardContainer.append(Item(), Item());

    current = $cardContainer.querySelector(".card:last-child");
    const swipe = (preference) => {
        current.classList.add(preference);
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
