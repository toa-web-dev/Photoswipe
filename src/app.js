import { Item } from "./components/Item.js";
const URL = import.meta.env.VITE_URL;
const RENDER_CARD_NUM = 5;
const THROTTLE_MS = 200;

function app() {
    let $cardContainer = document.querySelector("#card_container"); // RENDER_CARD_NUM의 수 만큼의 카드를 보관
    let $currentCard; // $cardContainer에서 사용자가 조작하는 맨 앞에 위치한 카드
    let cardId = 0; // 이미지를 요청하는 외부 API에서 사용되는 id값
    let startPoint = {}, // 카드의 움직임에 사용되는 좌표 x와 y값이 할당되는 변수
        distance = {};

    const InitBtn = () => {
        let throttleTimer = null;
        const $btnLike = document.querySelector('[data-btn-preference="like"]');
        const $btnDislike = document.querySelector('[data-btn-preference="dislike"]');
        $btnLike.classList.add("active");
        $btnDislike.classList.add("active");

        $btnLike.onclick = (e) => {
            btnHandler(e);
        };
        $btnDislike.onclick = (e) => {
            btnHandler(e);
        };

        const btnHandler = (e) => {
            const preference = e.target.dataset.btnPreference;
            const $figcap = $currentCard.querySelector("figcaption");
            btnThorttle(() => {
                $figcap.classList.add(preference);
                $figcap.style.opacity = 1;
                swipe(preference);
            });
        };

        const btnThorttle = (func) => {
            if (!throttleTimer) {
                func();
                $btnLike.classList.replace("active", "deactive");
                $btnDislike.classList.replace("active", "deactive");
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
        for (let i = 0; i < RENDER_CARD_NUM; i++) {
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
            const direction = preference === "like" ? 1 : -1;
            if (Object.keys(distance).length === 0) {
                // 버튼을 눌러서 포인터 이벤트에서 할당되는 distance의 값이 없는 경우
                flyX = direction * (innerWidth / 2 + $currentCard.offsetWidth);
                flyY = 0;
                deg = direction * 30;
            } else {
                const slope = distance.y / distance.x;
                flyX = (Math.abs(distance.x) / distance.x) * (innerWidth / 2 + $currentCard.offsetWidth);
                flyY = slope * flyX;
                deg = (distance.x / innerWidth) * 100;
            }
            set$currentCardTransform(flyX, flyY, deg, innerWidth * 0.5);
        } catch (e) {
            console.log("카드 제거 중 오류 발생", e);
        }
    };

    const swipe = (preference) => {
        InsertCard();
        RemoveCard(preference);

        // 다음 카드를 $currentCard에 할당
        const $prevCard = $currentCard;
        $currentCard = $currentCard.previousElementSibling;
        const RemoveSwipedCard = () => {
            $cardContainer.removeChild($prevCard);
            $prevCard.removeEventListener("transitionend", RemoveSwipedCard);
        };
        $prevCard.addEventListener("transitionend", RemoveSwipedCard);
        startPoint = {};
        distance = {};

        initPointerEvent();
    };

    const set$currentCardTransform = (x = 0, y = 0, deg = 0, duration = null) => {
        $currentCard.style.transform = `translate(${x}px,${y}px) rotate(${deg}deg)`;
        if (duration) {
            $currentCard.style.transition = `transform ${duration}ms ease-in`;
            setTimeout(() => {
                $currentCard.style.transition = ``;
            }, duration);
        }
    };

    // ===포인터 이벤트 관련 코드 시작===
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
        const $figcap = $currentCard.querySelector("figcaption");
        if (distance.x !== 0) {
            if (distance.x > 0) {
                $figcap.className = "like";
            } else {
                $figcap.className = "dislike";
            }
            $figcap.style.opacity = (Math.abs(distance.x) / ($currentCard.offsetWidth / 2)) * 0.4;
        } else {
            $figcap.className = "";
        }
        set$currentCardTransform(distance.x, distance.y, (distance.x / innerWidth) * 100);
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
            $currentCard.querySelector("figcaption").className = "";
            set$currentCardTransform(0, 0, 0, 100);
        }
    };
    // ===포인터 이벤트 관련 코드 끝===

    InitBtn();
    InitCard();
    initPointerEvent();
}
app();
