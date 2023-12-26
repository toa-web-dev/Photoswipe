import { getCardDataFromId } from "./util/fetch.js";
import { Item } from "./components/Item.js";

const RENDER_CARD_NUM = 5;

function app() {
    let $cardContainer = document.querySelector("#card_container");
    let $currentCard;
    let cardIdArr = Array.from({ length: RENDER_CARD_NUM }).map((_, index) => index);
    let targetArr = [];
    let bufferArr = [];

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
                }, 1000);
            }
        };
    };
    //카드 DOM요소를 추가하는 작업과 fetch한 배경이미지를 할당하는 작업이 분리 되어야 한다고 생각함
    const InitData = async () => {
        targetArr = await getCardDataFromId(cardIdArr); //[0,1,2,3,4]
        for (let i = targetArr.length - 1; i >= 0; i--) {
            $cardContainer.appendChild(Item(targetArr[i]));
        }
        $currentCard = $cardContainer.querySelector(".card:last-child");
        initPointerEvent();
        cardIdArr = cardIdArr.map((el) => el + RENDER_CARD_NUM);
        bufferArr = await getCardDataFromId(cardIdArr);
    };
    const InsertCard = async (curCardId) => {
        try {
            const curCardId = parseInt($currentCard.id);
            const renderItem = bufferArr.filter((el) => el.id === curCardId + RENDER_CARD_NUM)[0];
            $cardContainer.insertBefore(Item(renderItem), $cardContainer.firstElementChild);
            if (curCardId === targetArr.at(-1).id) {
                targetArr = bufferArr;
                cardIdArr = cardIdArr.map((el) => el + RENDER_CARD_NUM);
                bufferArr = await getCardDataFromId(cardIdArr);
            }
        } catch (e) {
            console.log("카드 추가 실패, 카드 추가 재시도...", e);
            setTimeout(() => {
                InsertCard(curCardId);
            }, 500);
        }
    };

    const RemoveCard = (preference) => {
        try {
            let flyX, flyY;
            let deg;
            if (Object.keys(distance).length === 0) {
                flyX = preference === "like" ? innerWidth : -innerWidth;
                flyY = 0;
                deg = 0;
            } else {
                const slope = distance.y / distance.x;
                flyX = (Math.abs(distance.x) / distance.x) * innerWidth;
                flyY = slope * flyX;
                deg = (distance.x / innerWidth) * 100;
            }

            console.log(flyX, flyY);
            console.log(preference);
            set$currentCardTransform(flyX, flyY, deg, innerWidth * 0.7);
            set$currentCardTransform(flyX, flyY, deg, innerWidth * 0.7);

            const $prevCard = $currentCard;
            $currentCard = $currentCard.previousElementSibling;

            const RemoveSwipedCard = () => {
                $cardContainer.removeChild($prevCard);
                $prevCard.removeEventListener("transitionend", RemoveSwipedCard);
            };
            $prevCard.addEventListener("transitionend", RemoveSwipedCard);

            startPoint = {};
            distance = {};
        } catch (e) {
            console.log("카드 제거 중 오류 발생", e);
        }
    };

    const swipe = (preference) => {
        InsertCard();
        RemoveCard(preference);
        initPointerEvent();
    };
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
    InitData();
}
app();
