import { Item } from "./components/Item.js";
const URL = import.meta.env.VITE_URL;
const RENDER_CARD_NUM = 5;
const THROTTLE_MS = 200;

function app() {
    let $cardContainer = document.querySelector("#card_container");
    let $currentCard;
    let cardId = 0;

    const InitBtn = () => {
        let throttleTimer = null;
        const $btnLike = document.querySelector('[data-btn-preference="like"]');
        const $btnDislike = document.querySelector('[data-btn-preference="dislike"]');
        $btnLike.classList.add("active");
        $btnDislike.classList.add("active");
        $btnLike.onclick = (e) => {
            const preference = e.target.dataset.btnPreference;
            thorttle(() => swipe(preference));
        };
        $btnDislike.onclick = (e) => {
            const preference = e.target.dataset.btnPreference;
            thorttle(() => swipe(preference));
        };
        const thorttle = (func) => {
            if (!throttleTimer) {
                func();
                $btnLike.classList.replace("active", "deactive");
                $btnDislike.classList.replace("active", "deactive");

                //시간이 지나서 버튼이 활성화되는 것이아니라
                // currentCard의 다음 카드(previousSibling)이 이미지 렌더가 완료 되었을때 활성화하기
                throttleTimer = setTimeout(() => {
                    throttleTimer = null;
                    $btnLike.classList.replace("deactive", "active");
                    $btnDislike.classList.replace("deactive", "active");
                }, THROTTLE_MS);
            }
        };
    };

    const createNewCard = () => {
        const $item = Item(cardId);
        $item.style.backgroundImage = `url("${URL}?random=${cardId}")`;
        cardId++;
        return $item;
    };

    const InitCard = () => {
        for (let i = 0; i <= RENDER_CARD_NUM; i++) {
            $cardContainer.insertBefore(createNewCard(), $cardContainer.firstElementChild);
        }
        $currentCard = $cardContainer.lastElementChild;
    };
    const InsertCard = () => {
        try {
            $cardContainer.insertBefore(createNewCard(), $cardContainer.firstElementChild);
        } catch (e) {
            console.log("카드 추가 실패, 카드 추가 재시도...", e);
            setTimeout(() => {
                InsertCard();
            }, 500);
        }
    };

    const RemoveCard = (preference) => {
        try {
            let flyX, flyY;
            let deg;
            if (Object.keys(distance).length === 0) {
                const direction = preference === "like" ? 1 : -1;
                flyX = direction * innerWidth;
                flyY = Math.random() * 1200 - 600;
                deg = direction * 30;
            } else {
                const slope = distance.y / distance.x;
                flyX = (Math.abs(distance.x) / distance.x) * innerWidth;
                flyY = slope * flyX;
                deg = (distance.x / innerWidth) * 100;
            }
            set$currentCardTransform(flyX, flyY, deg, innerWidth * 0.5);

            const $prevCard = $currentCard;
            $currentCard = $currentCard.previousElementSibling;
            const RemoveSwipedCard = () => {
                $cardContainer.removeChild($prevCard);
                $prevCard.removeEventListener("transitionend", RemoveSwipedCard);
            };
            $prevCard.addEventListener("transitionend", RemoveSwipedCard);
        } catch (e) {
            console.log("카드 제거 중 오류 발생", e);
        }
        startPoint = {};
        distance = {};
    };

    const swipe = (preference) => {
        InsertCard();
        RemoveCard(preference);
        initPointerEvent();
    };

    // 카드 인터랙션 코드
    const set$currentCardTransform = (x = 0, y = 0, deg = 0, duration = null) => {
        $currentCard.style.transform = `translate(${x}px,${y}px) rotate(${deg}deg)`;
        if (duration) {
            $currentCard.style.transition = `transform ${duration}ms`;
            setTimeout(() => {
                $currentCard.style.transition = ``;
            }, duration);
        }
    };
    let startPoint = {},
        distance = {};
    const initPointerEvent = () => {
        $currentCard.addEventListener("pointerdown", pointerDown);
        $currentCard.removeEventListener("pointermove", pointerMove);
        $currentCard.removeEventListener("pointerup", pointerUp);
        $currentCard.removeEventListener("pointerleave", pointerLeave);
    };
    const pointerDown = (e) => {
        startPoint = { x: parseInt(e.clientX), y: parseInt(e.clientY) };
        $currentCard.addEventListener("pointermove", pointerMove);
        $currentCard.addEventListener("pointerup", pointerUp);
        $currentCard.addEventListener("pointerleave", pointerLeave);
    };
    const pointerMove = (e) => {
        distance = {
            x: parseInt(e.clientX) - startPoint.x,
            y: parseInt(e.clientY) - startPoint.y,
        };
        const deg = (distance.x / innerWidth) * 100;
        set$currentCardTransform(distance.x, distance.y, deg);
    };
    const pointerLeave = () => {
        pointerUp();
    };
    const pointerUp = () => {
        initPointerEvent();
        if ($cardContainer.clientWidth / 2 < Math.abs(distance.x)) {
            const preference = distance.x > 0 ? "like" : "dislike";
            swipe(preference);
        } else {
            set$currentCardTransform(0, 0, 0, 100);
        }
    };

    InitBtn();
    InitCard();
    initPointerEvent();
}
app();
