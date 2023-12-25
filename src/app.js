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
    const InitData = async () => {
        targetArr = await getCardDataFromId(cardIdArr); //[0,1,2,3,4]
        for (let i = targetArr.length - 1; i >= 0; i--) {
            $cardContainer.appendChild(Item(targetArr[i]));
        }
        $currentCard = $cardContainer.querySelector(".card:last-child");
        InitPointerEvent();
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
            $currentCard.classList.add(`action_${preference}`);
            const $prevCard = $currentCard;
            $currentCard = $currentCard.previousElementSibling;
            const RemoveSwipedCard = () => {
                $cardContainer.removeChild($prevCard);
                $prevCard.removeEventListener("animationend", RemoveSwipedCard);
            };
            $prevCard.addEventListener("animationend", RemoveSwipedCard);
        } catch (e) {
            console.log("카드 추가 중 오류 발생", e);
        }
    };
    const Swipe = (preference) => {
        InsertCard();
        RemoveCard(preference);
    };
    InitBtn();
    InitData();

    let startPoint = {};
    const InitPointerEvent = () => {
        console.log("init pointer event");
        $currentCard.addEventListener("pointerdown", PointDown);
        $currentCard.removeEventListener("pointermove", PointMove);
        $currentCard.removeEventListener("pointerup", PointUp);
        $currentCard.removeEventListener("pointerleave", PointLeave);
    };

    const PointDown = (e) => {
        console.log("pointer down");
        startPoint = { x: parseInt(e.clientX), y: parseInt(e.clientY) };
        $currentCard.addEventListener("pointermove", PointMove);
        $currentCard.addEventListener("pointerup", PointUp);
        $currentCard.addEventListener("pointerleave", PointLeave);
    };

    const PointMove = (e) => {
        console.log("pointer move");
        const distance = {
            x: parseInt(e.clientX) - startPoint.x,
            y: parseInt(e.clientY) - startPoint.y,
        };
        //일차방정식의 기울기 slope
        const slope = distance.y / distance.x ? distance.y / distance.x : 0;
        console.log(`기울기는 ${distance.y} / ${distance.x}`, distance.y / distance.x);
        console.log(`절편은 ${startPoint.y} - ${slope} * ${startPoint.x}`, startPoint.y - slope * startPoint.x);
        const calcPosition = (x, y) => {
            const equationIntercept = startPoint.y - slope * startPoint.x;
            const result = {};
            return result;
        };
        console.log(innerWidth);
        $currentCard.style.transform = `translate(${distance.x}px, ${distance.y}px) rotate(${
            (distance.x / innerWidth) * 30
        }deg)`;
    };
    const PointLeave = () => {
        console.log("pointer leave");
        // 스와이프 범위 미만에서 발동될 경우 원점으로 돌아감
        $currentCard.style.transform = `translate(0,0)`;
        // 스와이프 범위 이상일 경우 OX 처리 함수 실행
        InitPointerEvent();
    };
    const PointUp = () => {
        console.log("pointer up");
        // 스와이프 범위 미만에서 발동될 경우 원점으로 돌아감
        $currentCard.style.transform = `translate(0,0)`;
        // 스와이프 범위 이상일 경우 OX 처리 함수 실행
        InitPointerEvent();
    };

    //카드가 넘어간 뒤 $currentCard에 다음 카드가 할당되었을 때 기존 이벤트리스너를 제거하고 새로 등록해야함

    const remove = () => {
        $currentCard.removeEventListener("pointerdown", PointDown);
        $currentCard.removeEventListener("pointermove", PointMove);
        $currentCard.removeEventListener("pointerup", PointUp);
        $currentCard.removeEventListener("pointerleave", PointLeave);
    };
}
app();
