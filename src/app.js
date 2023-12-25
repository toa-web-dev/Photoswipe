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
            thorttle(() => Swipe(preference));
        };
        $btnDislike.onclick = (e) => {
            const preference = e.target.dataset.btnPreference;
            thorttle(() => Swipe(preference));
        };
        const thorttle = (func) => {
            if (!throttleTimer) {
                func();
                $btnLike.classList.replace("active", "deactive");
                $btnDislike.classList.replace("active", "deactive");
                throttleTimer = setTimeout(() => {
                    throttleTimer = null;
                    $btnLike.classList.replace("deactive", "active");
                    $btnDislike.classList.replace("deactive", "active");
                }, 500);
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
    const InsertCard = async () => {
        try {
            let curCardId = parseInt($currentCard.id);
            const renderItem = bufferArr.filter((el) => el.id === curCardId + RENDER_CARD_NUM)[0];
            $cardContainer.insertBefore(Item(renderItem), $cardContainer.firstElementChild);
            if (curCardId === targetArr.at(-1).id) {
                targetArr = bufferArr;
                cardIdArr = cardIdArr.map((el) => el + RENDER_CARD_NUM);
                bufferArr = await getCardDataFromId(cardIdArr);
            }
        } catch (e) {
            console.log("카드 추가 중 오류 발생", e);
        }
    };
    const RemoveCard = (preference) => {
        try {
            // 아래 트랜스폼 값을 화면 밖으로 날아가게 바꾸면 됨
            set$currentCardTransform(0, 0, 10, 0.5);
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
    };
    const Swipe = (preference) => {
        InsertCard();
        RemoveCard(preference);
        initPointerEvent();
    };
    InitBtn();
    InitData();

    const set$currentCardTransform = (x = 0, y = 0, deg = 0, duration = null) => {
        $currentCard.style.transform = `translate(${x}px,${y}px) rotate(${deg}deg)`;
        if (duration) $currentCard.style.transition = `transform ${duration}s`;
    };

    let startPoint = {},
        movePoint = {},
        distance = {};
    const initPointerEvent = () => {
        console.log("init pointer event");
        $currentCard.addEventListener("pointerdown", pointerDown);
        $currentCard.removeEventListener("pointermove", pointerMove);
        $currentCard.removeEventListener("pointerup", pointerUp);
        $currentCard.removeEventListener("pointerleave", pointerLeave);
    };

    const pointerDown = (e) => {
        console.log("pointer down");
        startPoint = { x: parseInt(e.clientX), y: parseInt(e.clientY) };
        $currentCard.addEventListener("pointermove", pointerMove);
        $currentCard.addEventListener("pointerup", pointerUp);
        $currentCard.addEventListener("pointerleave", pointerLeave);
    };

    const pointerMove = (e) => {
        console.log("pointer move");
        movePoint = { x: parseInt(e.clientX), y: parseInt(e.clientY) };
        distance = {
            x: movePoint.x - startPoint.x,
            y: movePoint.y - startPoint.y,
        };
        //일차방정식의 기울기 slope
        // const slope = distance.y / distance.x ? distance.y / distance.x : 0;
        // console.log(`기울기는 ${distance.y} / ${distance.x}`, distance.y / distance.x);
        // console.log(`절편은 ${startPoint.y} - ${slope} * ${startPoint.x}`, startPoint.y - slope * startPoint.x);
        const rotateDeg = (distance.x / window.innerWidth) * 30;
        set$currentCardTransform(distance.x, distance.y, rotateDeg);
    };
    const pointerLeave = () => {
        console.log("pointer leave");
        initPointerEvent();
        // 스와이프 범위 미만에서 발동될 경우 원점으로 돌아감
        set$currentCardTransform(0, 0);
        // 스와이프 범위 이상일 경우 OX 처리 함수 실행
    };
    const pointerUp = () => {
        console.log("pointer up");
        initPointerEvent();
        if ($cardContainer.clientWidth / 2 < Math.abs(distance.x)) {
            const preference = distance.x > 0 ? "like" : "dislike";
            Swipe(preference);
        } else set$currentCardTransform(0, 0);

        // 스와이프 범위 미만에서 발동될 경우 원점으로 돌아감

        // 스와이프 범위 이상일 경우 OX 처리 함수 실행
    };
}
app();
